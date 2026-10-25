import type { APIRoute } from "astro";
import { addContactMessage } from "../../lib/leads/messages";
import { trySendMail } from "../../lib/mail/smtp";
import { contactNoticeToShop } from "../../lib/mail/templates";
import { site } from "../../lib/site";

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
    const row = await addContactMessage(body);
    const shop = contactNoticeToShop(row);
    await trySendMail({ to: site.email, subject: shop.subject, html: shop.html, text: shop.text });
    return json({ ok: true, id: row.id }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not save message." }, 400);
  }
};
