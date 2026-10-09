import type { APIRoute } from "astro";
import {
  adminPersistenceMode,
  listCatalogMerged,
  requireAdmin,
  upsertOverlay,
} from "../../../lib/admin";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  const items = await listCatalogMerged();
  return json({ items, persistence: adminPersistenceMode() });
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  let body: { id?: string; priceKes?: number | null; inStock?: boolean | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const id = String(body.id || "").trim();
  if (!id) return json({ error: "id is required." }, 400);
  try {
    const entry = await upsertOverlay(id, {
      priceKes: body.priceKes === undefined ? undefined : body.priceKes,
      inStock: body.inStock === undefined ? undefined : body.inStock,
    });
    const items = await listCatalogMerged();
    return json({ ok: true, entry, items, persistence: adminPersistenceMode() });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Save failed." }, 503);
  }
};
