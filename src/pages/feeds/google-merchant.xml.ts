import type { APIRoute } from "astro";
import { buildGoogleFeedLive, googleFeedXml } from "../../lib/ads/catalog-feed";

/**
 * Google Merchant Center product feed ("PRODUCTS SOURCE 1"), built from live shop data on
 * every fetch: iPhones one row per colour × storage × condition, other products one row each.
 */
export const prerender = false;

export const GET: APIRoute = async () => {
  const { rows } = await buildGoogleFeedLive();
  return new Response(googleFeedXml(rows), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Never stored by Cloudflare or any cache: Meta and Google must always fetch the live list.
      "Cache-Control": "no-store, max-age=0",
      // Feeds are for Meta and Merchant Center, not search results.
      "X-Robots-Tag": "noindex",
    },
  });
};
