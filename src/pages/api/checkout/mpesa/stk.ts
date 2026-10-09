import type { APIRoute } from "astro";
import { getOrder, markAwaitingPayment, publicOrder } from "../../../../lib/checkout/orders";
import { initiateStkPush } from "../../../../lib/payments/stanbic";

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

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const orderId = String(body.orderId || "").trim();
  const mobileNumber = String(body.mobileNumber || "").trim();
  if (!orderId) return json({ error: "orderId is required." }, 400);
  if (!mobileNumber) return json({ error: "M-Pesa phone is required." }, 400);

  const order = await getOrder(orderId);
  if (!order) return json({ error: "Order not found." }, 404);
  if (order.status === "paid") return json({ order: publicOrder(order), alreadyPaid: true });

  try {
    const stk = await initiateStkPush({
      orderId: order.id,
      amountKes: order.subtotalKes,
      mobileNumber,
    });
    const updated = await markAwaitingPayment(order.id, "mpesa", stk.reference, stk.mock);
    return json({
      order: updated ? publicOrder(updated) : publicOrder(order),
      stk: { reference: stk.reference, message: stk.message, mock: stk.mock },
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "STK push failed." }, 502);
  }
};
