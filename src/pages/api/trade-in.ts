import type { APIRoute } from "astro";
import { addTradeIn } from "../../lib/management/trade-ins";
import { trySendMail } from "../../lib/mail/smtp";
import { tradeInCustomerEmail, tradeInNoticeToShop } from "../../lib/mail/templates";
import { site } from "../../lib/site";

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
  const condition = String(body.condition || "").trim();

  if (name.length < 2) return json({ error: "Enter your name." }, 400);
  if (phone.replace(/\D/g, "").length < 9) return json({ error: "Enter a valid phone number." }, 400);
  if (!brand || !model) return json({ error: "Enter the device brand and model." }, 400);

  const device = [brand, model, storage].filter(Boolean).join(" ");
  const notes = [`Condition: ${condition || "not given"}`, email ? `Email: ${email}` : ""]
    .filter(Boolean)
    .join(" · ");

  try {
    const row = await addTradeIn({
      customer: name,
      phone,
      email: email || undefined,
      device,
      notes,
    });

    const shop = tradeInNoticeToShop({
      name,
      phone,
      email,
      requestId: row.id,
      device,
      notes,
    });
    await trySendMail({ to: site.email, subject: shop.subject, html: shop.html, text: shop.text });

    if (email.includes("@")) {
      const customer = tradeInCustomerEmail({ name, requestId: row.id, device });
      await trySendMail({
        to: email,
        subject: customer.subject,
        html: customer.html,
        text: customer.text,
      });
    }

    return json({ ok: true, id: row.id }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not save trade-in." }, 500);
  }
};
