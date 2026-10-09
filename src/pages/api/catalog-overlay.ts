import type { APIRoute } from "astro";
import { getOverlayMap } from "../../lib/admin";

export const prerender = false;

/** Public read of price/stock overlays for storefront cards. */
export const GET: APIRoute = async () => {
  const overlay = await getOverlayMap();
  return new Response(JSON.stringify({ overlay }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=30",
    },
  });
};
