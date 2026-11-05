import type { APIRoute } from "astro";
import { resolveDevice } from "../../lib/device-options";
import { liveDeviceOptions } from "../../lib/device-options-live";
import { addTradeIn } from "../../lib/management/trade-ins";
import { cleanAnswers } from "../../lib/trade-in-questions";
import { trySendMail } from "../../lib/mail/smtp";
import { tradeInCustomerEmail, tradeInNoticeToShop } from "../../lib/mail/templates";
import { site } from "../../lib/site";
import { pushCustomerToOps } from "../../lib/ops/push-customer";

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
  const brand = String(body.brand || "").trim();
  const model = String(body.model || "").trim();
  const storage = String(body.storage || "").trim();
  const colour = String(body.colour || "").trim();
  const extra = String(body.notes || "").trim().slice(0, 500);

  if (name.length < 2) return json({ error: "Enter your name." }, 400);
  if (phone.replace(/\D/g, "").length < 9) return json({ error: "Enter a valid phone number." }, 400);
  if (!brand || !model) return json({ error: "Enter the brand and model of the phone you are trading in." }, 400);

  const want = resolveDevice(await liveDeviceOptions(), (body.want ?? {}) as Record<string, unknown>);
  if (!want) return json({ error: "Choose the device you want. That option is not available." }, 400);

  const modelName = model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`;
  const device = [modelName, storage, colour].filter(Boolean).join(" · ");
  const answers = cleanAnswers(body.answers);
  const notes = [extra, email ? `Email: ${email}` : ""].filter(Boolean).join(" · ");

  try {
    const row = await addTradeIn({
      customer: name,
      phone,
      email: email || undefined,
      device,
      wantDevice: want.summary,
      wantKes: want.priceKes,
      answers,
      notes,
    });

    // Listed in Management → Trade-ins; only the customer gets an email.

    if (email.includes("@")) {
      const customer = tradeInCustomerEmail({ name, requestId: row.id, device: `${device}, toward ${want.summary}` });
      await trySendMail({
        to: email,
        subject: customer.subject,
        html: customer.html,
        text: customer.text,
      });
    }

    const shop = tradeInNoticeToShop({
      name,
      phone,
      email: email || undefined,
      requestId: row.id,
      device,
      wantDevice: want.summary,
      wantKes: want.priceKes,
      notes,
    });
    await trySendMail({
      to: site.email,
      subject: shop.subject,
      html: shop.html,
      text: shop.text,
    });

    await pushCustomerToOps({ name, email, phone, source: "trade-in" });

    return json({ ok: true, id: row.id }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not save trade-in." }, 500);
  }
};
