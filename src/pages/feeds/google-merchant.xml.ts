import type { APIRoute } from "astro";
import { buildAdsCatalogLive, catalogToGoogleXml } from "../../lib/ads/catalog-feed";

/** Google Merchant Center product feed (all categories, live shop prices). */
export const prerender = false;

export const GET: APIRoute = async () => {
  const xml = catalogToGoogleXml(await buildAdsCatalogLive());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
};
