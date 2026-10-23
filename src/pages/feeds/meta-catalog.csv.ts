import type { APIRoute } from "astro";
import { buildAdsCatalog, catalogToCsv } from "../../lib/ads/catalog-feed";

/** Meta Commerce Manager scheduled feed (CSV). */
export const GET: APIRoute = () => {
  const csv = catalogToCsv(buildAdsCatalog());
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="gadgethub-meta-catalog.csv"',
      "Cache-Control": "public, max-age=1800",
    },
  });
};
