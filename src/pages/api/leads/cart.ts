import type { APIRoute } from "astro";
import { upsertCartLead, type CartLeadItem } from "../../../lib/leads/carts";

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

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items: CartLeadItem[] = rawItems.map((row) => {
    const r = (row || {}) as Record<string, unknown>;
    return {
      id: String(r.id || ""),
      name: String(r.name || ""),
      qty: Number(r.qty) || 1,
      kes: Number(r.kes) || 0,
      href: String(r.href || "") || undefined,
    };
  });

  const sourceRaw = String(body.source || "cart");
  const source = sourceRaw === "checkout" || sourceRaw === "account" ? sourceRaw : "cart";

  try {
    const lead = await upsertCartLead({
      visitorId: String(body.visitorId || "").trim(),
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      items,
      source,
      href: String(body.href || "").trim() || undefined,
    });
    return json({ ok: true, id: lead?.id || null });
  } catch (e) {
    console.error("[cart-lead]", e);
    return json({ ok: false }, 200);
  }
};
