import type { APIRoute } from "astro";
import { normalizeBagItem } from "../../../lib/checkout/bag";
import { createOrder, getOrder, publicOrder } from "../../../lib/checkout/orders";
import type { BagItem, CheckoutCustomer, Fulfillment } from "../../../lib/checkout/types";

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
  const id = url.searchParams.get("id")?.trim() || "";
  if (!id) return json({ error: "id is required." }, 400);
  const order = await getOrder(id);
  if (!order) return json({ error: "Order not found." }, 404);
  return json({ order: publicOrder(order) });
};

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems
    .map((r) => normalizeBagItem(r as Record<string, unknown>))
    .filter((x): x is BagItem => Boolean(x));

  const customerRaw = (body.customer || {}) as Record<string, unknown>;
  const fulfillment = (String(customerRaw.fulfillment || "pickup") === "delivery"
    ? "delivery"
    : "pickup") as Fulfillment;

  const customer: CheckoutCustomer = {
    name: String(customerRaw.name || "").trim(),
    phone: String(customerRaw.phone || "").trim(),
    email: String(customerRaw.email || "").trim(),
    fulfillment,
    notes: String(customerRaw.notes || "").trim() || undefined,
    mpesaPhone: String(customerRaw.mpesaPhone || "").trim() || undefined,
  };

  if (!customer.name || customer.name.length < 2) {
    return json({ error: "Enter your full name." }, 400);
  }
  if (!customer.phone || customer.phone.replace(/\D/g, "").length < 9) {
    return json({ error: "Enter a valid phone number." }, 400);
  }
  if (!customer.email.includes("@")) {
    return json({ error: "Enter a valid email." }, 400);
  }
  if (!items.length) return json({ error: "Your cart is empty." }, 400);

  try {
    const order = await createOrder({ items, customer });
    return json({ order: publicOrder(order) }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not create order." }, 500);
  }
};
