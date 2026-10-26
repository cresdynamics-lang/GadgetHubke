import type { APIRoute } from "astro";
import { requireAdmin } from "../../../lib/admin";
import { liveSnapshot } from "../../../lib/analytics/presence";

export const prerender = false;

/** Live visitor snapshot for the admin Live and Dashboard pages (polled every few seconds). */
export const GET: APIRoute = async ({ cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  return new Response(JSON.stringify(liveSnapshot()), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};
