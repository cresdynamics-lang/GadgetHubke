import type { AstroCookies } from "astro";
import { createHmac } from "node:crypto";
import { signingSecret } from "../mail/config";
import { getCustomerById, type PublicCustomer } from "./store";

const COOKIE = "gh_customer_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

function sign(payload: string) {
  return createHmac("sha256", signingSecret() || "dev").update(payload).digest("hex");
}

export function setCustomerSession(cookies: AstroCookies, customer: PublicCustomer) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `${customer.id}.${exp}`;
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: MAX_AGE_SEC,
  });
}

export function clearCustomerSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: "/" });
}

export async function readCustomerSession(cookies: AstroCookies): Promise<PublicCustomer | null> {
  const token = cookies.get(COOKIE)?.value || "";
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expStr, sig] = parts;
  const payload = `${id}.${expStr}`;
  if (sig !== sign(payload)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  return getCustomerById(id);
}
