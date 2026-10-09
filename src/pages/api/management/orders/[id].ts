export const prerender = false;

import type { APIRoute } from "astro";
import { requireAdmin } from "../../../../lib/admin";
import { getOrder, updateOrder } from "../../../../lib/checkout/orders";
import { orderStatusPatch } from "../../../../lib/management/orders-view";

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing order id" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const existing = await getOrder(id);
  if (!existing) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  let body: { action?: string; notes?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const action = body.action;
  if (
    action !== "confirm" &&
    action !== "dispatch" &&
    action !== "deliver" &&
    action !== "cancel" &&
    body.notes === undefined
  ) {
    return new Response(JSON.stringify({ error: "Provide action or notes" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const patch =
    action === "confirm" || action === "dispatch" || action === "deliver" || action === "cancel"
      ? orderStatusPatch(action)
      : {};

  if (body.notes !== undefined) {
    Object.assign(patch, { adminNotes: String(body.notes).slice(0, 2000) });
  }

  if (action === "confirm" && existing.status !== "paid") {
    return new Response(JSON.stringify({ error: "Only paid orders can be confirmed for fulfillment." }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const updated = await updateOrder(id, patch);
  return new Response(JSON.stringify({ ok: true, order: updated }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
