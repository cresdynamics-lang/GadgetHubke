import type { APIRoute } from "astro";
import { getOrder, markFailed, markPaid, publicOrder } from "../../../lib/checkout/orders";

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

/**
 * Stanbic Instant Payment Notification / result URL.
 * Exact payload fields depend on merchant product — map flexibly.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.STANBIC_WEBHOOK_SECRET;
  if (secret) {
    const header =
      request.headers.get("x-stanbic-signature") ||
      request.headers.get("x-webhook-secret") ||
      "";
    if (header !== secret) return json({ error: "Unauthorized." }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const orderId = String(
    body.orderId || body.externalReference || body.ExternalReference || "",
  ).trim();
  const status = String(body.status || body.Status || body.result || "").toLowerCase();
  const ref = String(
    body.reference || body.transactionId || body.TransactionID || body.paymentRef || "",
  );

  if (!orderId) return json({ error: "orderId / externalReference required." }, 400);

  const order = await getOrder(orderId);
  if (!order) return json({ error: "Order not found." }, 404);

  const paidHints = ["paid", "success", "successful", "completed", "0"];
  const failHints = ["failed", "failure", "cancelled", "canceled", "timeout"];

  if (paidHints.some((h) => status.includes(h)) || status === "") {
    // Empty status with a reference still treated cautiously — only mark paid on explicit success
    if (paidHints.some((h) => status.includes(h))) {
      const updated = await markPaid(orderId, ref || order.paymentRef);
      return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
    }
  }

  if (failHints.some((h) => status.includes(h))) {
    const updated = await markFailed(orderId, String(body.message || "Payment failed"));
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  return json({ ok: true, ignored: true, order: publicOrder(order) });
};
