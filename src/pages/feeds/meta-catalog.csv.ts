import type { APIRoute } from "astro";
import { buildMetaFeedLive, metaFeedCsv } from "../../lib/ads/catalog-feed";

/** Meta Commerce Manager scheduled feed (CSV): iPhones one row per colour × storage × condition, as in the Google feed. */
export const prerender = false;

export const GET: APIRoute = async () => {
  const csv = metaFeedCsv(await buildMetaFeedLive());
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="gadgethub-meta-catalog.csv"',
      // Never stored by Cloudflare or any cache: Meta and Google must always fetch the live list.
      "Cache-Control": "no-store, max-age=0",
      // Feeds are for Meta and Merchant Center, not search results.
      "X-Robots-Tag": "noindex",
    },
  });
};
