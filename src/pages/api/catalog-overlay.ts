import type { APIRoute } from "astro";
import { livePricedCatalog } from "../../lib/pricing/live";

export const prerender = false;

/**
 * Public live prices for storefront cards: lowest New price, lowest Ex-UK price
 * (when the product is sold Ex-UK) and stock, per product id.
 */
export const GET: APIRoute = async () => {
  const overlay: Record<string, { priceKes: number; exUkKes?: number; inStock: boolean }> = {};
  for (const p of await livePricedCatalog()) {
    const ex = p.variants.map((v) => v.exUkKes).filter((n): n is number => typeof n === "number" && n > 0);
    const exUkKes = ex.length ? Math.min(...ex) : p.exUkKes && p.exUkKes > 0 ? p.exUkKes : undefined;
    overlay[p.id] = { priceKes: p.priceKes, ...(exUkKes ? { exUkKes } : {}), inStock: p.inStock };
  }
  return new Response(JSON.stringify({ overlay }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=30" },
  });
};
