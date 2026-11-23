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

/** Commit the verified receipt to the system before showing the customer a paid order. */
export async function recordWebsiteSettlement(orderId: string, receipt: string, amountKes: number, providerReference: string) {
  const base = process.env.OPS_CATALOG_URL?.trim();
  const secret = process.env.WEBSITE_SYNC_SECRET?.trim();
  if (!base || !secret) throw new Error("Website payment synchronization is not configured.");
  const endpoint = new URL("/api/website/orders", base);
  if (endpoint.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(endpoint.hostname)) {
    throw new Error("Website payment synchronization requires HTTPS.");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, receipt, amountKes, providerReference }),
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok || (await response.json()).recorded !== true) throw new Error("The system could not record this website payment.");
}
