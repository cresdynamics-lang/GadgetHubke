/**
 * Cookie auth for /management and /api/management/* (legacy /api/admin/* still works).
 * Production env (set with `node scripts/set-admin-password.mjs` on the server, never in git):
 *   ADMIN_EMAIL           super-admin email
 *   ADMIN_PASSWORD_HASH   scrypt$<salt hex>$<hash hex>
 *   ADMIN_SESSION_SECRET  random key that signs session cookies
 * Legacy: ADMIN_SECRET alone acts as both password and signing key.
 */
import type { AstroCookies } from "astro";
import { scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE = "gh_admin_session";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SECRET ||
    (import.meta.env.DEV ? "gadgethub-dev-admin" : "")
  );
}

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(sig);
}

export function adminSecretConfigured() {
  return Boolean(process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SECRET) || import.meta.env.DEV;
}

export async function createAdminSessionToken() {
  if (!secret()) throw new Error("ADMIN_SECRET is not set.");
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `ok.${exp}`;
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, expStr, sig] = parts;
  if (ok !== "ok") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const payload = `${ok}.${expStr}`;
  const expected = await sign(payload);
  return sig === expected;
}

export async function isAdminAuthed(cookies: AstroCookies) {
  return verifyAdminSessionToken(cookies.get(COOKIE)?.value);
}

export async function setAdminSession(cookies: AstroCookies) {
  const token = await createAdminSessionToken();
  cookies.set(COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: MAX_AGE_SEC,
  });
}

export function clearAdminSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: "/" });
}

export async function requireAdmin(cookies: AstroCookies) {
  const ok = await isAdminAuthed(cookies);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  return null;
}

function passwordMatchesHash(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function loginWithPassword(password: string, email?: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const emailOk = !adminEmail || (email || "").trim().toLowerCase() === adminEmail;
    // Check the password even when the email is wrong, so timing does not reveal which failed.
    const passOk = Boolean(password) && passwordMatchesHash(password, hash);
    if (!emailOk || !passOk) throw new Error("Wrong email or password.");
    if (!secret()) throw new Error("ADMIN_SESSION_SECRET is not set on the server.");
    return;
  }
  const expected = process.env.ADMIN_SECRET || (import.meta.env.DEV ? "gadgethub-dev-admin" : "");
  if (!expected) throw new Error("Admin sign-in is not configured on the server.");
  if (!password || password !== expected) throw new Error("Wrong password.");
}
