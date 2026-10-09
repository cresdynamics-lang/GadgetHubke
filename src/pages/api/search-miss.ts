import type { APIRoute } from "astro";
import { addSearchMiss } from "../../lib/admin";

export const prerender = false;

/** Public: log a search with no results for admin review. */
export const POST: APIRoute = async ({ request }) => {
  let body: { q?: string };
  try {
    body = (await request.json()) as { q?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }
  try {
    const miss = await addSearchMiss(String(body.q || ""));
    return new Response(JSON.stringify({ ok: true, miss }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    // Silent fail for storefront - don't break search UX
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Skipped" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
};
