import type { APIRoute } from "astro";
import { buildAdsCatalogLive, catalogToCsv } from "../../lib/ads/catalog-feed";

/** Meta Commerce Manager scheduled feed (CSV). */
export const prerender = false;

export const GET: APIRoute = async () => {
  const csv = catalogToCsv(await buildAdsCatalogLive());
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="gadgethub-meta-catalog.csv"',
      // Never stored by Cloudflare or any cache: Meta and Google must always fetch the live list.
      "Cache-Control": "no-store, max-age=0",
    },
  });
};
