import type { APIRoute } from "astro";
import { clearSearchMisses, listSearchMisses, requireAdmin } from "../../../lib/admin";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  return json({ misses: await listSearchMisses() });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  try {
    await clearSearchMisses();
    return json({ ok: true, misses: [] });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Clear failed." }, 503);
  }
};
