import type { APIRoute } from "astro";
import { buildGoogleFeedLive, googleFeedXml } from "../../lib/ads/catalog-feed";

/** iPhone rows only, same data as /feeds/google-merchant.xml. */
export const prerender = false;

export const GET: APIRoute = async () => {
  const { rows } = await buildGoogleFeedLive();
  return new Response(googleFeedXml(rows.filter((r) => r.google_product_category === "267")), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex",
    },
  });
};
