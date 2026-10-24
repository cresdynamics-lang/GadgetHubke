import type { APIRoute } from "astro";
import {
  adminPersistenceMode,
  listCatalogMerged,
  requireAdmin,
  upsertOverlay,
} from "../../../lib/admin";
import type { OverlayVariantPatch } from "../../../lib/admin/overlay";
import { clearLiveCache, livePricedProduct } from "../../../lib/pricing/live";

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
  let body: {
    id?: string;
    priceKes?: number | null;
    exUkKes?: number | null;
    inStock?: boolean | null;
    storages?: Record<string, OverlayVariantPatch>;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const id = String(body.id || "").trim();
  if (!id) return json({ error: "id is required." }, 400);
  const current = await livePricedProduct(id);
  if (!current) return json({ error: `Unknown product: ${id}` }, 404);
  if (body.storages) {
    const known = new Set(current.variants.map((v) => v.key));
    const bad = Object.keys(body.storages).filter((k) => !known.has(k));
    if (bad.length) return json({ error: `Unknown option(s) for ${id}: ${bad.join(", ")}` }, 400);
  }
  try {
    const entry = await upsertOverlay(id, {
      priceKes: body.priceKes,
      exUkKes: body.exUkKes,
      inStock: body.inStock,
      storages: body.storages,
    });
    clearLiveCache();
    const item = await livePricedProduct(id);
    return json({ ok: true, entry, item, persistence: adminPersistenceMode() });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Save failed." }, 503);
  }
};
