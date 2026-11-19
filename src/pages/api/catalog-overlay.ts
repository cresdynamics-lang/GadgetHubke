import type { APIRoute } from "astro";
import { livePricedCatalog, variantUsedMap } from "../../lib/pricing/live";
import { isListedForSale, listedFromKes } from "../../lib/listing-offers";

export const prerender = false;

/**
 * Public live prices for storefront cards: lowest New price, lowest Ex-UK price
 * (when the product is sold Ex-UK), lowest Slightly used price, lowest listed price of any condition,
 * whether it is on the live list, and stock, per product id.
 */
export const GET: APIRoute = async () => {
  const overlay: Record<string, { priceKes: number; exUkKes?: number; usedKes?: number; fromKes: number; listed: boolean; inStock: boolean; showOnWebsite: boolean }> = {};
  for (const p of await livePricedCatalog()) {
    const ex = p.variants.map((v) => v.exUkKes).filter((n): n is number => typeof n === "number" && n > 0);
    const exUkKes = ex.length ? Math.min(...ex) : p.exUkKes && p.exUkKes > 0 ? p.exUkKes : undefined;
    const used = Object.values(variantUsedMap(p));
    const usedKes = used.length ? Math.min(...used) : undefined;
    overlay[p.id] = { priceKes: p.priceKes, ...(exUkKes ? { exUkKes } : {}), ...(usedKes ? { usedKes } : {}), fromKes: listedFromKes(p), listed: isListedForSale(p), inStock: p.inStock, showOnWebsite: p.showOnWebsite !== false };
  }
  return new Response(JSON.stringify({ overlay }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=30" },
  });
};
