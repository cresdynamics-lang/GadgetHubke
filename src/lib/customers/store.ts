/**
 * Customer accounts (hashed passwords) + password-reset tokens.
 */
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { kvGetJson, kvSetJson } from "../admin/kv";
import { signingSecret } from "../mail/config";
import { trySendMail } from "../mail/smtp";
import { passwordResetEmail, welcomeEmail } from "../mail/templates";
import { site } from "../site";

const scryptAsync = promisify(scrypt);
const REDIS_KEY = "gh:customers:v1";
const RESET_TTL_MS = 2 * 60 * 60 * 1000;

export type CustomerRecord = {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
  resetTokenHash?: string;
  resetExpiresAt?: number;
};

export type PublicCustomer = {
  id: string;
  email: string;
  name: string;
  phone: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function publicCustomer(c: CustomerRecord): PublicCustomer {
  return { id: c.id, email: c.email, name: c.name, phone: c.phone };
}

async function loadAll(): Promise<CustomerRecord[]> {
  const rows = await kvGetJson<CustomerRecord[]>(REDIS_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

async function saveAll(rows: CustomerRecord[]) {
  await kvSetJson(REDIS_KEY, rows.slice(0, 5000));
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = (await scryptAsync(password, salt, 32)) as Buffer;
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const key = (await scryptAsync(password, Buffer.from(saltHex, "hex"), 32)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  if (key.length !== expected.length) return false;
  return timingSafeEqual(key, expected);
}

function hashToken(token: string) {
  return createHmac("sha256", signingSecret() || "dev").update(token).digest("hex");
}

export async function registerCustomer(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<PublicCustomer> {
  const email = normalizeEmail(input.email);
  if (!email.includes("@")) throw new Error("Enter a valid email.");
  if (input.password.length < 6) throw new Error("Password must be at least 6 characters.");
  const all = await loadAll();
  if (all.some((c) => c.email === email)) throw new Error("An account with this email already exists. Sign in or reset your password.");
  const record: CustomerRecord = {
    id: `c-${randomBytes(4).toString("hex")}`,
    email,
    name: input.name.trim(),
    phone: input.phone.trim(),
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  all.unshift(record);
  await saveAll(all);
  const welcome = welcomeEmail(record.name);
  void trySendMail({ stream: "accounts", to: record.email, ...welcome });
  return publicCustomer(record);
}

export async function loginCustomer(emailRaw: string, password: string): Promise<PublicCustomer> {
  const email = normalizeEmail(emailRaw);
  const all = await loadAll();
  const record = all.find((c) => c.email === email);
  if (!record || !(await verifyPassword(password, record.passwordHash))) {
    throw new Error("Wrong email or password.");
  }
  return publicCustomer(record);
}

export async function requestPasswordReset(emailRaw: string) {
  const email = normalizeEmail(emailRaw);
  const all = await loadAll();
  const idx = all.findIndex((c) => c.email === email);
  if (idx < 0) return { ok: true as const };
  const token = randomBytes(32).toString("hex");
  all[idx] = {
    ...all[idx],
    resetTokenHash: hashToken(token),
    resetExpiresAt: Date.now() + RESET_TTL_MS,
  };
  await saveAll(all);
  const url = new URL("/account/reset", site.url);
  url.searchParams.set("token", token);
  const msg = passwordResetEmail(all[idx].name, url.href);
  await trySendMail({ stream: "accounts", to: email, ...msg });
  return { ok: true as const };
}

export async function resetPassword(token: string, password: string): Promise<PublicCustomer> {
  if (!token || password.length < 6) throw new Error("Enter a new password of at least 6 characters.");
  const tokenHash = hashToken(token);
  const all = await loadAll();
  const idx = all.findIndex(
    (c) => c.resetTokenHash === tokenHash && c.resetExpiresAt && c.resetExpiresAt > Date.now(),
  );
  if (idx < 0) throw new Error("This reset link is invalid or has expired. Request a new one.");
  all[idx] = {
    ...all[idx],
    passwordHash: await hashPassword(password),
    resetTokenHash: undefined,
    resetExpiresAt: undefined,
  };
  await saveAll(all);
  return publicCustomer(all[idx]);
}

export async function getCustomerById(id: string) {
  const all = await loadAll();
  const record = all.find((c) => c.id === id);
  return record ? publicCustomer(record) : null;
}
