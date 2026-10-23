import type { APIRoute } from "astro";
import { getOrder, markFailed, markPaid, publicOrder } from "../../../lib/checkout/orders";
import { STANBIC_WEBHOOK_URL } from "../../../lib/payments/stanbic";

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

function pick(body: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = body[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
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
export const GET: APIRoute = async () =>
  json({
    ok: true,
    endpoint: STANBIC_WEBHOOK_URL,
    method: "POST",
    website: "https://gadgethubke.com",
    product: "STK Push – M-Pesa Checkout",
  });

/**
 * Stanbic Instant Payment Notification / STK result URL.
 * Whitelisted: https://gadgethubke.com/api/checkout/webhook
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
    body = await parseBody(request);
  } catch {
    return json({ error: "Invalid JSON or form body." }, 400);
  }

  const orderId = pick(body, [
    "orderId",
    "externalReference",
    "ExternalReference",
    "dbsReferenceId",
    "reference",
    "transactionId",
    "TransactionID",
  ]);
  const status = pick(body, [
    "status",
    "Status",
    "result",
    "transactionStatus",
    "txnStatus",
    "resultCode",
  ]).toLowerCase();
  const ref = pick(body, [
    "dbsReferenceId",
    "reference",
    "transactionId",
    "TransactionID",
    "paymentRef",
  ]);

  if (!orderId) return json({ error: "orderId / dbsReferenceId / externalReference required." }, 400);

  const order = await getOrder(orderId);
  if (!order) return json({ error: "Order not found." }, 404);

  const paidHints = ["paid", "success", "successful", "completed", "0"];
  const failHints = ["failed", "failure", "cancelled", "canceled", "timeout", "1"];

  if (paidHints.some((h) => status.includes(h))) {
    const updated = await markPaid(order.id, ref || order.paymentRef);
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  if (failHints.some((h) => status.includes(h))) {
    const updated = await markFailed(order.id, String(body.message || "Payment failed"));
    return json({ ok: true, order: updated ? publicOrder(updated) : publicOrder(order) });
  }

  return json({ ok: true, ignored: true, order: publicOrder(order) });
};
