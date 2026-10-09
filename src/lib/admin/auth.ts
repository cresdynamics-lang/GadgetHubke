/**
 * Cookie auth for /management and /api/management/* (legacy /api/admin/* still works).
 * Set ADMIN_SECRET in env (required in production).
 */
import type { AstroCookies } from "astro";

const COOKIE = "gh_admin_session";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

function secret() {
  return process.env.ADMIN_SECRET || (import.meta.env.DEV ? "gadgethub-dev-admin" : "");
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
  return Boolean(process.env.ADMIN_SECRET) || import.meta.env.DEV;
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

export async function loginWithPassword(password: string) {
  const expected = secret();
  if (!expected) throw new Error("ADMIN_SECRET is not set on the server.");
  if (!password || password !== expected) throw new Error("Wrong password.");
}
