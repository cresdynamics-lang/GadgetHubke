import type { CheckoutOrder } from "../checkout/types";
import { opsLinked } from "./link";

function configured() {
  return opsLinked() && Boolean(process.env.OPS_CATALOG_URL?.trim() && process.env.WEBSITE_SYNC_SECRET?.trim());
}

export async function pushOrderToOps(order: CheckoutOrder) {
  if (!configured()) return;
  const base = process.env.OPS_CATALOG_URL!.replace(/\/$/, "");
  const secret = process.env.WEBSITE_SYNC_SECRET!;
  try {
    const response = await fetch(`${base}/api/website/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: order.id,
        status: order.status,
        intent: order.intent || "purchase",
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        customerEmail: order.customer.email || "",
        fulfillment: order.customer.fulfillment,
        deliveryAddress: order.customer.deliveryAddress,
        notes: order.customer.notes,
        subtotalKes: order.subtotalKes,
        catalogKes: order.catalogKes ?? order.subtotalKes,
        paidAmount: order.status === "paid" ? order.subtotalKes : 0,
        paymentMethod: order.paymentMethod,
        paymentRef: order.paymentRef,
        paidAt: order.paidAt,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          kes: item.kes,
          href: item.href,
        })),
      }),
    });
    if (!response.ok) console.error("[ops-order]", response.status, await response.text().catch(() => ""));
  } catch (error) {
    console.error("[ops-order]", error);
  }
}
