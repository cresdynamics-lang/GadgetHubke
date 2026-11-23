import { recordWebsiteSettlement } from "../../../lib/ops/push-order";
import type { APIRoute } from "astro";
import { getOrder, markFailed, markPaid, publicOrder, updateOrder } from "../../../lib/checkout/orders";
import { STANBIC_WEBHOOK_URL } from "../../../lib/payments/stanbic";
import { callbackMatchesOrder, readStanbicCallback, type StanbicCallback } from "../../../lib/payments/stanbic-callback";
import { recordBankNotice, type BankNotice } from "../../../lib/payments/bank-notices";
import { timingSafeEqual } from "node:crypto";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    return Object.fromEntries(new URLSearchParams(text));
  }
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid body.");
  }
}

/** Answer Stanbic in the usual result-code form, so a received notice is never retried as an error. */
function ack(extra: Record<string, unknown> = {}) {
  return json({ ok: true, ResultCode: "0", ResultDesc: "Accepted", ...extra });
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * The ApiKey / ApiSecret Gadget Hub gave Stanbic (STANBIC_NOTIFY_API_KEY / STANBIC_NOTIFY_API_SECRET).
 * Accepted as Basic auth or as key/secret headers. How the bank sends them is not confirmed yet,
 * so the header names that arrive are logged (never their values).
 */
function senderAuthenticated(request: Request): boolean {
  const key = process.env.STANBIC_NOTIFY_API_KEY || "";
  const secret = process.env.STANBIC_NOTIFY_API_SECRET || "";
  if (!key || !secret) return false;
  const auth = request.headers.get("authorization") || "";
  if (/^basic /i.test(auth)) {
    const [k, ...rest] = Buffer.from(auth.slice(6).trim(), "base64").toString("utf8").split(":");
    if (same(k, key) && same(rest.join(":"), secret)) return true;
  }
  const hKey = request.headers.get("x-api-key") || request.headers.get("apikey") || request.headers.get("api-key") || "";
  const hSecret = request.headers.get("x-api-secret") || request.headers.get("apisecret") || request.headers.get("api-secret") || "";
  return Boolean(hKey && hSecret && same(hKey, key) && same(hSecret, secret));
}

function noticeRow(callback: StanbicCallback, result: BankNotice["result"], authed: boolean, orderId?: string): BankNotice {
  const n = callback.notice;
  return {
    at: new Date().toISOString(),
    transactionType: n?.transactionType || "",
    transId: n?.transId || "",
    billRef: n?.billRef || "",
    thirdPartyRef: n?.thirdPartyRef || "",
    transTime: n?.transTime || "",
    amountKes: callback.amountKes,
    ...(orderId ? { orderId } : {}),
    result,
    hasSecureHash: Boolean(n?.hasSecureHash),
    senderAuthenticated: authed,
  };
}

/** Bank connectivity / whitelist probe (POST is the real IPN). */
export const GET: APIRoute = async () => {
  const { paymentsReady } = await import("../../../lib/payments/stanbic");
  const ready = paymentsReady();
  return json({
    ok: true,
    endpoint: STANBIC_WEBHOOK_URL,
    method: "POST",
    website: "https://gadgethubke.com",
    product: "STK Push – M-Pesa Checkout",
    mode: ready.mode,
    waitingOn: ready.waitingOn,
    ready: ready.ready,
  });
};

/**
 * Stanbic Instant Payment Notification / STK result URL.
 * Whitelisted: https://gadgethubke.com/api/checkout/webhook
 *
 * Anyone can reach this URL, so a notice changes an order only when it proves itself: the shared
 * secret header (when STANBIC_WEBHOOK_SECRET is set), or a payment reference that was sent to Stanbic
 * for that order and is never shown publicly. The order id alone is not enough.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.STANBIC_WEBHOOK_SECRET;
  const header = request.headers.get("x-stanbic-signature") || request.headers.get("x-webhook-secret") || "";
  if (secret && header !== secret) return json({ error: "Unauthorized." }, 401);

  let body: Record<string, unknown>;
  try {
    body = await parseBody(request);
  } catch {
    return json({ error: "Invalid JSON or form body." }, 400);
  }

  const callback = readStanbicCallback(body);
  const authed = senderAuthenticated(request);
  console.log(
    "[stanbic-webhook]",
    JSON.stringify({
      outcome: callback.outcome,
      notification: callback.notification,
      orderId: callback.orderId,
      refs: callback.refs,
      fields: callback.fields,
      headers: [...request.headers.keys()],
      senderAuthenticated: authed,
    }),
  );

  let order = callback.orderId ? await getOrder(callback.orderId) : null;
  for (const ref of callback.refs) {
    if (order) break;
    order = await getOrder(ref);
  }
  // A payment notification that matches no shop order (a transfer, or another payment into the account)
  // is still a valid notice: log it for staff and acknowledge it.
  if (callback.notification && !order) {
    await recordBankNotice(noticeRow(callback, "unmatched", authed));
    return ack({ matched: false });
  }
  if (!callback.orderId && !callback.refs.length) return json({ error: "orderId / dbsReferenceId / externalReference required." }, 400);
  if (!order) return json({ error: "Order not found." }, 404);
  const log = (result: BankNotice["result"]) =>
    callback.notification ? recordBankNotice(noticeRow(callback, result, authed, order!.id)) : Promise.resolve();

  const verified = (Boolean(secret) || authed) && callbackMatchesOrder(callback, order) && !order.mock;
  if (!verified) {
    // Not proof of payment, but worth seeing: the field names show what Stanbic actually sends.
    console.warn("[stanbic-webhook] unverified notice", order.id, callback.fields.join(","));
    if (order.status !== "paid") {
      await updateOrder(order.id, { error: `Payment notice could not be verified (fields: ${callback.fields.join(", ")}).` });
    }
    await log("unverified");
    if (callback.notification) return ack({ matched: false });
    return json({ ok: true, ignored: "unverified" }, 202);
  }

  if (callback.outcome === "paid") {
    if (callback.amountKes !== order.subtotalKes || !callback.receipt) {
      console.warn("[stanbic-webhook] amount below order total", order.id, callback.amountKes, order.subtotalKes);
      await updateOrder(order.id, { error: `Paid ${callback.amountKes} but the order is ${order.subtotalKes}. Check with Stanbic.` });
      await log("amount_mismatch");
      if (callback.notification) return ack({ matched: true, ignored: "amount_mismatch" });
      return json({ ok: true, ignored: "amount_mismatch" }, 202);
    }
    const paidRef = callback.receipt;
    const providerReference = order.stkReferences?.find(ref => callback.refs.includes(ref)) || order.paymentRef;
    if (!providerReference) return json({ error: "Missing payment reference" }, 409);
    try {
      await recordWebsiteSettlement(order.id, paidRef, callback.amountKes, providerReference);
    } catch {
      return json({ error: "Awaiting system reconciliation" }, 503);
    }
    const wasPaid = order.status === "paid";
    const updated = await markPaid(order.id, paidRef);
    await log(wasPaid ? "already_paid" : "paid");
    if (callback.notification) return ack({ matched: true, orderId: order.id });
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  if (callback.outcome === "failed" && order.status !== "paid") {
    const updated = await markFailed(order.id, callback.message || "Payment failed");
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  await log("ignored");
  if (callback.notification) return ack({ matched: true });
  return json({ ok: true, ignored: true, order: publicOrder(order) });
};
