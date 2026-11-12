/**
 * Start Stanbic M-Pesa STK for an existing checkout order.
 */
import { initiateStkPush, type StkResult } from "../payments/stanbic";
import { getOrder, markAwaitingPayment, updateOrder } from "./orders";
import type { CheckoutOrder } from "./types";

export type StartStkResult = {
  order: CheckoutOrder;
  stk: StkResult;
  alreadyPaid?: boolean;
};

export async function startOrderStk(
  orderId: string,
  mobileNumber: string,
): Promise<StartStkResult> {
  const order = await getOrder(orderId);
  if (!order) throw new Error("Order not found.");
  if (order.status === "paid") {
    return {
      order,
      alreadyPaid: true,
      stk: {
        ok: true,
        mock: Boolean(order.mock),
        reference: order.paymentRef || order.id,
        message: "Already paid.",
      },
    };
  }

  const stk = await initiateStkPush({
    orderId: order.id,
    amountKes: order.subtotalKes,
    mobileNumber,
  });
  const updated = await markAwaitingPayment(order.id, "mpesa", stk.reference, stk.mock);
  return {
    order: updated || order,
    stk,
  };
}

/** Fire STK after order/pay-link creation; never throws — order still returns. */
export async function startOrderStkSafe(
  order: CheckoutOrder,
  mobileNumber: string,
): Promise<{ order: CheckoutOrder; stk?: StkResult; stkError?: string }> {
  try {
    const result = await startOrderStk(order.id, mobileNumber);
    return { order: result.order, stk: result.stk };
  } catch (e) {
    const message = e instanceof Error ? e.message : "STK push failed.";
    console.error("[stk-on-create]", message);
    const updated = await updateOrder(order.id, { error: message });
    return { order: updated || order, stkError: message };
  }
}
