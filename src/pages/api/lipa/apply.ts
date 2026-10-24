import type { APIRoute } from "astro";
import { buildLipaTerms } from "../../../lib/checkout/intent";
import { addLipaPlan } from "../../../lib/management/lipa";
import { trySendMail } from "../../../lib/mail/smtp";
import { lipaApplicationEmail, lipaNoticeToShop } from "../../../lib/mail/templates";
import { site } from "../../../lib/site";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const device = String(body.device || "").trim();
  const catalogKes = Math.max(0, Math.round(Number(body.catalogKes) || 0));

  if (name.length < 2) return json({ error: "Enter your name." }, 400);
  if (phone.replace(/\D/g, "").length < 9) return json({ error: "Enter a valid phone number." }, 400);
  if (!device) return json({ error: "Tell us which device you want." }, 400);

  const terms = buildLipaTerms(catalogKes || 0, Number(body.depositPct), Number(body.months));

  try {
    const plan = await addLipaPlan({
      customer: name,
      phone,
      email: email || undefined,
      device,
      nextDue: "Awaiting deposit",
      remainingKes: terms.remainingKes,
      status: "Awaiting deposit",
      depositKes: terms.depositKes,
      months: terms.months,
      catalogKes: terms.catalogKes || undefined,
      notes: catalogKes
        ? `Application · ${terms.depositPct}% of ${catalogKes}`
        : "Application · price to confirm",
    });

    const shop = lipaNoticeToShop({
      name,
      phone,
      email,
      planId: plan.id,
      device,
      depositKes: terms.depositKes,
      remainingKes: terms.remainingKes,
      months: terms.months,
      notes: plan.notes,
    });
    await trySendMail({ to: site.email, subject: shop.subject, html: shop.html, text: shop.text });

    if (email.includes("@")) {
      const customer = lipaApplicationEmail({
        name,
        planId: plan.id,
        device,
        depositKes: terms.depositKes,
        remainingKes: terms.remainingKes,
        months: terms.months,
        depositPct: terms.depositPct,
      });
      await trySendMail({
        to: email,
        subject: customer.subject,
        html: customer.html,
        text: customer.text,
      });
    }

    return json({ ok: true, id: plan.id, lipa: terms }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not save application." }, 500);
  }
};
