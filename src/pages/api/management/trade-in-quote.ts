import type { APIRoute } from "astro";
import { requireAdmin } from "../../../lib/admin";
import { tradeInQuoteEmail } from "../../../lib/mail/templates";
import { trySendMail } from "../../../lib/mail/smtp";
import { listTradeIns, updateTradeIn } from "../../../lib/management/trade-ins";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const id = String(body.id || "").trim();
  const quoteKes = Math.round(Number(body.quoteKes));
  if (!id) return json({ error: "Missing the trade-in request." }, 400);
  if (!Number.isSafeInteger(quoteKes) || quoteKes < 1 || quoteKes > 2_000_000_000) {
    return json({ error: "Enter the quote in shillings." }, 400);
  }

  const existing = (await listTradeIns()).find((row) => row.id === id);
  if (!existing) return json({ error: "That trade-in request is not on file." }, 404);

  const updated = await updateTradeIn(id, { quoteKes, status: "Quoted" });
  if (!updated) return json({ error: "Could not save the quote." }, 500);

  let emailed = false;
  if (existing.email?.includes("@")) {
    const message = tradeInQuoteEmail({
      name: existing.customer,
      requestId: existing.id,
      device: existing.device,
      wantDevice: existing.wantDevice,
      quoteKes,
    });
    const sent = await trySendMail({
      to: existing.email,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    emailed = sent.ok;
  }

  return json({ ok: true, quoteKes, emailed, email: existing.email || "" });
};
