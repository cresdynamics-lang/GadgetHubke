import type { APIRoute } from "astro";
import { getOrder, markAwaitingPayment, markPaid, publicOrder } from "../../../../lib/checkout/orders";
import { initiateCardSession } from "../../../../lib/payments/stanbic";
import { site } from "../../../../lib/site";

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

export const POST: APIRoute = async ({ request, url }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const orderId = String(body.orderId || "").trim();
  if (!orderId) return json({ error: "orderId is required." }, 400);

  const order = await getOrder(orderId);
  if (!order) return json({ error: "Order not found." }, 404);
  if (order.status === "paid") {
    return json({
      order: publicOrder(order),
      alreadyPaid: true,
      redirectUrl: `/checkout/success?order=${encodeURIComponent(order.id)}`,
    });
  }

  const origin = url.origin || site.url;
  const returnUrl = `${origin}/checkout/success`;
  const cancelUrl = `${origin}/checkout/cancel?order=${encodeURIComponent(order.id)}`;

  try {
    const session = await initiateCardSession({
      orderId: order.id,
      amountKes: order.subtotalKes,
      customerEmail: order.customer.email,
      customerName: order.customer.name,
      returnUrl,
      cancelUrl,
    });

    let updated = await markAwaitingPayment(order.id, "card", session.reference, session.mock);

    // Mock card: mark paid immediately so success page shows paid.
    if (session.mock) {
      updated = (await markPaid(order.id, session.reference)) || updated;
    }

    return json({
      order: updated ? publicOrder(updated) : publicOrder(order),
      card: {
        reference: session.reference,
        redirectUrl: session.redirectUrl,
        message: session.message,
        mock: session.mock,
      },
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Card session failed." }, 502);
  }
};
