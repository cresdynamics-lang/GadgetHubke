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
      "Cache-Control": "public, max-age=1800",
    },
  });
};
