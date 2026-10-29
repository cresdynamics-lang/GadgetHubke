import type { APIRoute } from "astro";
import { isBot, recordHit, type Hit } from "../../lib/analytics/presence";
import { startLivePush } from "../../lib/ops/push-live";

export const prerender = false;

/** Storefront heartbeat for Management → Live visitors. Anonymous; bots ignored. */
export const POST: APIRoute = async ({ request }) => {
  if (!isBot(request.headers.get("user-agent"))) {
    try {
      const text = await request.text();
      if (text.length < 4000) recordHit(JSON.parse(text) as Hit);
    } catch {}
  }
  startLivePush();
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
};
