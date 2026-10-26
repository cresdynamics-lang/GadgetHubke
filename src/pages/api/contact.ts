import type { APIRoute } from "astro";
import { addContactMessage } from "../../lib/leads/messages";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  try {
    // Saved for Management → Messages; no email to the shop inbox.
    const row = await addContactMessage(body);
    return json({ ok: true, id: row.id }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not save message." }, 400);
  }
};
