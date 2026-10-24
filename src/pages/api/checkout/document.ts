import type { APIRoute } from "astro";
import { getOrder } from "../../../lib/checkout/orders";
import { buildOrderPdf, pdfFilename } from "../../../lib/documents/pdf";
import { verifyPayToken } from "../../../lib/documents/pay-link";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const orderId = url.searchParams.get("order")?.trim() || "";
  const token = url.searchParams.get("t")?.trim() || "";
  const requested = url.searchParams.get("kind") === "receipt" ? "receipt" : "invoice";
  if (!orderId) {
    return new Response("order is required", { status: 400 });
  }
  const order = await getOrder(orderId);
  if (!order) return new Response("Order not found", { status: 404 });
  if (!verifyPayToken(order.id, token)) {
    return new Response("This document link is invalid.", { status: 403 });
  }
  const kind: "invoice" | "receipt" =
    requested === "receipt" || (requested !== "invoice" && order.status === "paid")
      ? "receipt"
      : "invoice";
  if (kind === "receipt" && order.status !== "paid") {
    return new Response("Receipt is available after payment.", { status: 409 });
  }
  const bytes = await buildOrderPdf(order, kind);
  return new Response(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFilename(order, kind)}"`,
      "Cache-Control": "private, no-store",
    },
  });
};
