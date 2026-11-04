import type { APIRoute } from "astro";
import { buildLipaTerms } from "../../../lib/checkout/intent";
import { resolveDevice } from "../../../lib/device-options";
import { liveDeviceOptions } from "../../../lib/device-options-live";
import { addLipaPlan } from "../../../lib/management/lipa";
import { trySendMail } from "../../../lib/mail/smtp";
import { lipaApplicationEmail } from "../../../lib/mail/templates";
import { pushCustomerToOps } from "../../../lib/ops/push-customer";

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

  if (name.length < 2) return json({ error: "Enter your name." }, 400);
  if (phone.replace(/\D/g, "").length < 9) return json({ error: "Enter a valid phone number." }, 400);

  const chosen = resolveDevice(await liveDeviceOptions(), body);
  if (!chosen) return json({ error: "That device is not available. Please choose another." }, 400);
  const device = chosen.summary;
  const catalogKes = chosen.priceKes;

  const terms = buildLipaTerms(catalogKes, Number(body.depositPct), Number(body.months));

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
      notes: `Application · ${terms.depositPct}% of ${catalogKes} · ${terms.monthlyKes} a month for ${terms.months} · total ${terms.totalKes}`,
    });

    // Listed in Management → Lipa; only the customer gets an email.

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
        stream: "orders",
        to: email,
        subject: customer.subject,
        html: customer.html,
        text: customer.text,
      });
    }

    await pushCustomerToOps({ name, email, phone, source: "lipa" });

    return json({ ok: true, id: plan.id, lipa: terms }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not save application." }, 500);
  }
};
