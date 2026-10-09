import type { APIRoute } from "astro";
import { getOrder, markPaid, publicOrder } from "../../../../lib/checkout/orders";
import { mockStkShouldSucceed, paymentsMode } from "../../../../lib/payments/stanbic";

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

export const GET: APIRoute = async ({ url }) => {
  const orderId = url.searchParams.get("orderId")?.trim() || "";
  if (!orderId) return json({ error: "orderId is required." }, 400);

  let order = await getOrder(orderId);
  if (!order) return json({ error: "Order not found." }, 404);

  if (
    order.status === "awaiting_payment" &&
    order.paymentMethod === "mpesa" &&
    (order.mock || paymentsMode() === "mock") &&
    mockStkShouldSucceed(order.updatedAt, order.paymentRef)
  ) {
    order = (await markPaid(order.id, order.paymentRef)) || order;
  }

  return json({
    order: publicOrder(order),
    status: order.status,
  });
};
