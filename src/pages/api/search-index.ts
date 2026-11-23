import type { APIRoute } from "astro";
import { siteSearchData } from "../../lib/site-search-data";

/** Site search indexes, fetched by the search panel when it first opens. */
export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await siteSearchData()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Short browser and CDN cache: listings change in admin.
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    },
  });
