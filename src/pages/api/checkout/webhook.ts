import type { APIRoute } from "astro";
import { getOrder, markFailed, markPaid, publicOrder, updateOrder } from "../../../lib/checkout/orders";
import { STANBIC_WEBHOOK_URL } from "../../../lib/payments/stanbic";
import { callbackMatchesOrder, readStanbicCallback } from "../../../lib/payments/stanbic-callback";

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
  console.log("[stanbic-webhook]", JSON.stringify({ outcome: callback.outcome, orderId: callback.orderId, refs: callback.refs, fields: callback.fields }));

  let order = callback.orderId ? await getOrder(callback.orderId) : null;
  for (const ref of callback.refs) {
    if (order) break;
    order = await getOrder(ref);
  }
  if (!callback.orderId && !callback.refs.length) return json({ error: "orderId / dbsReferenceId / externalReference required." }, 400);
  if (!order) return json({ error: "Order not found." }, 404);

  const verified = Boolean(secret) || callbackMatchesOrder(callback, order);
  if (!verified) {
    // Not proof of payment, but worth seeing: the field names show what Stanbic actually sends.
    console.warn("[stanbic-webhook] unverified notice", order.id, callback.fields.join(","));
    if (order.status !== "paid") {
      await updateOrder(order.id, { error: `Payment notice could not be verified (fields: ${callback.fields.join(", ")}).` });
    }
    return json({ ok: true, ignored: "unverified" }, 202);
  }

  if (callback.outcome === "paid") {
    if (callback.amountKes != null && callback.amountKes < order.subtotalKes) {
      console.warn("[stanbic-webhook] amount below order total", order.id, callback.amountKes, order.subtotalKes);
      await updateOrder(order.id, { error: `Paid ${callback.amountKes} but the order is ${order.subtotalKes}. Check with Stanbic.` });
      return json({ ok: true, ignored: "amount_mismatch" }, 202);
    }
    const paidRef = callback.refs.find((ref) => ref !== order.id) || order.paymentRef;
    const updated = await markPaid(order.id, paidRef);
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  if (callback.outcome === "failed" && order.status !== "paid") {
    const updated = await markFailed(order.id, callback.message || "Payment failed");
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  return json({ ok: true, ignored: true, order: publicOrder(order) });
};
