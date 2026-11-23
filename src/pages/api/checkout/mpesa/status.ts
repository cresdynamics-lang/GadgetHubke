import { recordWebsiteSettlement } from "../../../../lib/ops/push-order";
import { readStanbicCallback } from "../../../../lib/payments/stanbic-callback";
import type { APIRoute } from "astro";
import { getOrder, markFailed, markPaid, publicOrder } from "../../../../lib/checkout/orders";
import { mockStkShouldSucceed, paymentsMode, stkTransactionStatus } from "../../../../lib/payments/stanbic";

// The pay page polls every few seconds; ask the bank at most this often per order.
const BANK_CHECK_MS = 10_000;
const lastBankCheck = new Map<string, number>();

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
  } else if (order.status === "awaiting_payment" && order.paymentMethod === "mpesa" && !order.mock && paymentsMode() !== "mock") {
    // Our latest dbsReferenceId: 13 characters from A–Z / 2–9 (see stanbic.ts).
    const dbsRef = [...(order.stkReferences ?? [])].reverse().find((ref) => /^[A-HJ-NP-Z2-9]{13}$/.test(ref));
    const last = lastBankCheck.get(order.id) ?? 0;
    if (dbsRef && Date.now() - last >= BANK_CHECK_MS) {
      lastBankCheck.set(order.id, Date.now());
      try {
        const bank = await stkTransactionStatus(dbsRef);
        if (bank.status === "paid") {
          const result = readStanbicCallback(bank.raw);
          if (result.receipt && result.amountKes === order.subtotalKes && result.refs.includes(dbsRef)) {
            await recordWebsiteSettlement(order.id, result.receipt, result.amountKes, dbsRef);
            order = (await markPaid(order.id, result.receipt)) || order;
          }
        }
        else if (bank.status === "failed") order = (await markFailed(order.id, "M-Pesa payment did not complete.")) || order;
      } catch (e) {
        console.error("[stanbic-status]", e instanceof Error ? e.message : e);
      }
    }
  }

  return json({
    order: publicOrder(order),
    status: order.status,
  });
};
