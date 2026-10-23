import type { APIRoute } from "astro";
import { buildAdsCatalog, catalogToGoogleXml } from "../../lib/ads/catalog-feed";

/** Google Merchant Center product feed (all categories, live shop prices). */
export const GET: APIRoute = () => {
  const xml = catalogToGoogleXml(buildAdsCatalog());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
};
