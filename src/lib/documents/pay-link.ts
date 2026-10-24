import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "../site";
import { signingSecret } from "../mail/config";

export function payToken(orderId: string) {
  const secret = signingSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(`pay:${orderId}`).digest("hex").slice(0, 24);
}

export function verifyPayToken(orderId: string, token: string | null | undefined) {
  const expected = payToken(orderId);
  const got = String(token || "").trim();
  if (!expected || !got || expected.length !== got.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(got));
}

export function payUrl(orderId: string) {
  const url = new URL("/checkout/pay", site.url);
  url.searchParams.set("order", orderId);
  url.searchParams.set("t", payToken(orderId));
  return url.href;
}

export function documentUrl(orderId: string, kind: "invoice" | "receipt") {
  const url = new URL("/api/checkout/document", site.url);
  url.searchParams.set("order", orderId);
  url.searchParams.set("t", payToken(orderId));
  url.searchParams.set("kind", kind);
  return url.href;
}
