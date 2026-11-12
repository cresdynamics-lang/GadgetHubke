import type { APIRoute } from "astro";
import { publicOrder } from "../../../../lib/checkout/orders";
import { startOrderStk } from "../../../../lib/checkout/start-stk";

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

  try {
    const result = await startOrderStk(orderId, mobileNumber);
    return json({
      order: publicOrder(result.order),
      alreadyPaid: result.alreadyPaid || false,
      stk: { reference: result.stk.reference, message: result.stk.message, mock: result.stk.mock },
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "STK push failed." }, 502);
  }
};
