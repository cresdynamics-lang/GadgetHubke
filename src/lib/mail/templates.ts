import { bagMetaLine, formatKes } from "../checkout/bag";
import { catalogAmount, dueTodayAmount, isLipa } from "../checkout/intent";
import type { CheckoutOrder } from "../checkout/types";
import { documentUrl, payUrl } from "../documents/pay-link";
import { site } from "../site";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(title: string, inner: string) {
  return `<!doctype html>
<html>
<body style="margin:0;background:#f5f5f7;font-family:Inter,Helvetica,Arial,sans-serif;color:#1d1d1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8e8ed;">
        <tr><td style="background:#1d1d1f;color:#fff;padding:18px 24px;font-size:18px;font-weight:700;">${esc(site.name)}</td></tr>
        <tr><td style="padding:24px;">
          <h1 style="margin:0 0 12px;font-size:20px;letter-spacing:-0.02em;">${esc(title)}</h1>
          ${inner}
        </td></tr>
        <tr><td style="padding:16px 24px;font-size:12px;color:#6e6e73;border-top:1px solid #e8e8ed;">
          ${esc(site.legalName)} · ${esc(site.address)}, ${esc(site.location)}<br>
          ${esc(site.phoneDisplay)} · ${esc(site.email)} · ${esc(site.hours.short)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function itemRows(order: CheckoutOrder) {
  return order.items
    .map((i) => {
      const meta = bagMetaLine(i);
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">
          <strong>${esc(i.name)}</strong>${meta ? `<br><span style="color:#6e6e73;font-size:12px;">${esc(meta)}</span>` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">×${i.qty}<br>${esc(formatKes(i.kes * i.qty))}</td>
      </tr>`;
    })
    .join("");
}

function firstName(order: CheckoutOrder) {
  return order.customer.name.split(" ")[0] || "there";
}

function fulfillLine(order: CheckoutOrder) {
  return order.customer.fulfillment === "delivery"
    ? "Delivery · Nairobi (fee confirmed after payment)"
    : `Pickup · ${site.address}`;
}

function lipaSummary(order: CheckoutOrder) {
  const lipa = order.lipa;
  if (!lipa) return "";
  return `Device total ${formatKes(lipa.catalogKes)}. Deposit ${lipa.depositPct}% due today. Remaining ${formatKes(lipa.remainingKes)} over ${lipa.months} months after we confirm your plan.`;
}

export function invoiceEmail(order: CheckoutOrder) {
  const pay = payUrl(order.id);
  const pdf = documentUrl(order.id, "invoice");
  const due = formatKes(dueTodayAmount(order));
  const lipa = isLipa(order);
  const title = lipa ? `Lipa Mdogo Mdogo deposit ${order.id}` : `Invoice ${order.id}`;
  const intro = lipa
    ? `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(firstName(order))}, this is your Lipa Mdogo Mdogo deposit invoice. Pay ${esc(due)} today with M-Pesa to start the plan — not the full device price.</p>
    <p style="margin:0 0 16px;line-height:1.5;color:#6e6e73;font-size:13px;">${esc(lipaSummary(order))}</p>`
    : `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(firstName(order))}, here is your Gadget Hub invoice for this purchase. Pay ${esc(due)} with M-Pesa using the button below — it opens checkout with this amount already set.</p>`;
  const html = wrap(
    title,
    `${intro}
    <p style="margin:0 0 20px;"><a href="${esc(pay)}" style="display:inline-block;background:#1d1d1f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Pay ${esc(due)} now</a></p>
    <table width="100%" cellspacing="0" cellpadding="0">${itemRows(order)}</table>
    ${
      lipa
        ? `<p style="margin:16px 0 4px;font-size:13px;color:#6e6e73;">Device total ${esc(formatKes(catalogAmount(order)))}</p>
    <p style="margin:0 0 8px;font-size:16px;"><strong>Deposit due today ${esc(due)}</strong></p>`
        : `<p style="margin:16px 0 8px;font-size:16px;"><strong>Total ${esc(due)}</strong></p>`
    }
    <p style="margin:0 0 8px;font-size:13px;color:#6e6e73;">${esc(fulfillLine(order))}</p>
    <p style="margin:0;font-size:13px;"><a href="${esc(pdf)}">Download invoice PDF</a> · <a href="${esc(pay)}">${esc(pay)}</a></p>`,
  );
  const text = [
    title,
    `Hi ${order.customer.name}, pay ${due}:`,
    pay,
    lipa ? lipaSummary(order) : "",
    "",
    ...order.items.map((i) => `• ${i.name} ×${i.qty} ${formatKes(i.kes * i.qty)}`),
    lipa ? `Device total ${formatKes(catalogAmount(order))}` : "",
    `${lipa ? "Deposit due today" : "Total"} ${due}`,
    `PDF: ${pdf}`,
    `${site.legalName} · ${site.phoneDisplay} · ${site.email}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
  return {
    subject: lipa
      ? `Lipa Mdogo Mdogo deposit ${order.id} · ${due} · Gadget Hub`
      : `Invoice ${order.id} · ${due} · Gadget Hub`,
    html,
    text,
  };
}

export function receiptEmail(order: CheckoutOrder) {
  const pdf = documentUrl(order.id, "receipt");
  const paid = formatKes(dueTodayAmount(order));
  const lipa = isLipa(order);
  const title = lipa ? `Lipa Mdogo Mdogo deposit received ${order.id}` : `Receipt ${order.id}`;
  const intro = lipa
    ? `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(firstName(order))}, we have received your Lipa Mdogo Mdogo deposit of ${esc(paid)}. This is not the full device price — remaining ${esc(formatKes(order.lipa?.remainingKes || 0))} over ${order.lipa?.months || 6} months after we confirm your schedule.</p>`
    : `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(firstName(order))}, we have received your payment of ${esc(paid)} for this purchase. This email is your receipt.</p>`;
  const html = wrap(
    title,
    `${intro}
    <p style="margin:0 0 16px;font-weight:700;color:#1f7a46;">${lipa ? "DEPOSIT PAID" : "PAID"}${order.paymentRef ? ` · Ref ${esc(order.paymentRef)}` : ""}</p>
    <table width="100%" cellspacing="0" cellpadding="0">${itemRows(order)}</table>
    <p style="margin:16px 0 8px;font-size:16px;"><strong>${lipa ? "Deposit paid" : "Total paid"} ${esc(paid)}</strong></p>
    ${lipa ? `<p style="margin:0 0 8px;font-size:13px;color:#6e6e73;">Device total ${esc(formatKes(catalogAmount(order)))} · remaining ${esc(formatKes(order.lipa?.remainingKes || 0))}</p>` : ""}
    <p style="margin:0 0 8px;font-size:13px;color:#6e6e73;">${order.customer.fulfillment === "delivery" ? "We will confirm Nairobi delivery shortly." : `Collect at ${esc(site.address)}.`}</p>
    <p style="margin:0;font-size:13px;"><a href="${esc(pdf)}">Download receipt PDF</a> · WhatsApp ${esc(site.phoneDisplay)}</p>`,
  );
  const text = [
    `${title} — ${lipa ? "DEPOSIT PAID" : "PAID"} ${paid}`,
    order.paymentRef ? `Ref ${order.paymentRef}` : "",
    lipa ? lipaSummary(order) : "",
    ...order.items.map((i) => `• ${i.name} ×${i.qty} ${formatKes(i.kes * i.qty)}`),
    `PDF: ${pdf}`,
    `${site.legalName} · ${site.phoneDisplay}`,
  ]
    .filter(Boolean)
    .join("\n");
  return {
    subject: lipa
      ? `Lipa Mdogo Mdogo deposit paid ${order.id} · ${paid} · Gadget Hub`
      : `Receipt ${order.id} · Paid ${paid} · Gadget Hub`,
    html,
    text,
  };
}

export function passwordResetEmail(name: string, resetUrl: string) {
  const title = "Reset your Gadget Hub password";
  const html = wrap(
    title,
    `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(name || "there")}, we received a request to reset the password for this email. The link expires in 2 hours.</p>
    <p style="margin:0 0 20px;"><a href="${esc(resetUrl)}" style="display:inline-block;background:#1d1d1f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Choose a new password</a></p>
    <p style="margin:0;font-size:13px;color:#6e6e73;">If you did not ask for this, you can ignore the email. Need help? WhatsApp ${esc(site.phoneDisplay)} or write ${esc(site.email)}.</p>`,
  );
  const text = [
    "Reset your Gadget Hub password",
    resetUrl,
    "This link expires in 2 hours.",
    `Help: ${site.phoneDisplay} · ${site.email}`,
  ].join("\n");
  return { subject: "Reset your Gadget Hub password", html, text };
}

export function welcomeEmail(name: string) {
  const title = "Your Gadget Hub account";
  const html = wrap(
    title,
    `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(name || "there")}, your account is ready. Use it to check out faster and receive invoices and receipts by email.</p>
    <p style="margin:0;font-size:13px;"><a href="${esc(`${site.url}/account`)}">Open your account</a> · Shop ${esc(site.url)}</p>`,
  );
  const text = `Hi ${name}, your Gadget Hub account is ready. ${site.url}/account`;
  return { subject: "Welcome to Gadget Hub", html, text };
}

export function orderNoticeToShop(order: CheckoutOrder, kind: "invoice" | "receipt") {
  const lipa = isLipa(order);
  const due = formatKes(dueTodayAmount(order));
  const title =
    kind === "receipt"
      ? lipa
        ? `Lipa deposit paid ${order.id}`
        : `Paid purchase ${order.id}`
      : lipa
        ? `New Lipa deposit invoice ${order.id}`
        : `New purchase invoice ${order.id}`;
  const html = wrap(
    title,
    `<p>${esc(order.customer.name)} · ${esc(order.customer.phone)} · ${esc(order.customer.email)}</p>
    <p>${lipa ? `Lipa Mdogo Mdogo · deposit ${esc(due)} · remaining ${esc(formatKes(order.lipa?.remainingKes || 0))} over ${order.lipa?.months || 6} months` : `Purchase · ${esc(due)}`} · ${order.customer.fulfillment}</p>
    <table width="100%">${itemRows(order)}</table>`,
  );
  const text = `${title}\n${order.customer.name} ${order.customer.phone} ${order.customer.email}\n${lipa ? `Lipa deposit ${due}` : due}`;
  return { subject: `${title} · Gadget Hub`, html, text };
}

export function tradeInCustomerEmail(input: {
  name: string;
  requestId: string;
  device: string;
}) {
  const title = `Trade-in request ${input.requestId}`;
  const html = wrap(
    title,
    `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(input.name.split(" ")[0] || "there")}, we have your trade-in request for <strong>${esc(input.device)}</strong>. This is not a payment — we will inspect the device and send a quote. Credit can go toward any new device in the shop.</p>
    <p style="margin:0 0 12px;font-size:13px;color:#6e6e73;">Reference ${esc(input.requestId)}. Bring the phone to ${esc(site.address)} (${esc(site.hours.short)}) or keep chatting on WhatsApp ${esc(site.phoneDisplay)}.</p>
    <p style="margin:0;font-size:13px;"><a href="${esc(`${site.url}/trade-in`)}">Trade-in details</a></p>`,
  );
  const text = [
    title,
    `Hi ${input.name}, we have your trade-in for ${input.device}.`,
    `Reference ${input.requestId}. This is not a payment — quote after inspection.`,
    `${site.address} · ${site.phoneDisplay}`,
  ].join("\n");
  return { subject: `${title} · Gadget Hub`, html, text };
}

export function tradeInNoticeToShop(input: {
  name: string;
  phone: string;
  email?: string;
  requestId: string;
  device: string;
  notes?: string;
}) {
  const title = `New trade-in ${input.requestId}`;
  const html = wrap(
    title,
    `<p>${esc(input.name)} · ${esc(input.phone)}${input.email ? ` · ${esc(input.email)}` : ""}</p>
    <p>Device: ${esc(input.device)}</p>
    ${input.notes ? `<p style="color:#6e6e73;font-size:13px;">${esc(input.notes)}</p>` : ""}
    <p style="font-size:13px;">Follow up on WhatsApp. Quote after inspection — no money has been taken.</p>`,
  );
  const text = `${title}\n${input.name} ${input.phone} ${input.email || ""}\n${input.device}\n${input.notes || ""}`;
  return { subject: `${title} · Gadget Hub`, html, text };
}

export function lipaApplicationEmail(input: {
  name: string;
  planId: string;
  device: string;
  depositKes: number;
  remainingKes: number;
  months: number;
  depositPct: number;
}) {
  const title = `Lipa Mdogo Mdogo plan ${input.planId}`;
  const html = wrap(
    title,
    `<p style="margin:0 0 16px;line-height:1.5;">Hi ${esc(input.name.split(" ")[0] || "there")}, we have your Lipa Mdogo Mdogo application for <strong>${esc(input.device)}</strong>.</p>
    <p style="margin:0 0 16px;line-height:1.5;">Deposit ${esc(formatKes(input.depositKes))} (${input.depositPct}%) to start. Remaining ${esc(formatKes(input.remainingKes))} over ${input.months} months after we confirm terms. This email is not a receipt — pay the deposit when we send the invoice or on WhatsApp.</p>
    <p style="margin:0;font-size:13px;">Reference ${esc(input.planId)} · ${esc(site.phoneDisplay)} · ${esc(site.address)}</p>`,
  );
  const text = [
    title,
    `Hi ${input.name}, Lipa Mdogo Mdogo for ${input.device}.`,
    `Deposit ${formatKes(input.depositKes)} (${input.depositPct}%). Remaining ${formatKes(input.remainingKes)} over ${input.months} months.`,
    `Reference ${input.planId}`,
  ].join("\n");
  return { subject: `${title} · Gadget Hub`, html, text };
}

export function lipaNoticeToShop(input: {
  name: string;
  phone: string;
  email?: string;
  planId: string;
  device: string;
  depositKes: number;
  remainingKes: number;
  months: number;
  notes?: string;
}) {
  const title = `New Lipa application ${input.planId}`;
  const html = wrap(
    title,
    `<p>${esc(input.name)} · ${esc(input.phone)}${input.email ? ` · ${esc(input.email)}` : ""}</p>
    <p>${esc(input.device)} · deposit ${esc(formatKes(input.depositKes))} · remaining ${esc(formatKes(input.remainingKes))} / ${input.months} months</p>
    ${input.notes ? `<p style="color:#6e6e73;font-size:13px;">${esc(input.notes)}</p>` : ""}`,
  );
  const text = `${title}\n${input.name} ${input.phone}\n${input.device}\ndeposit ${formatKes(input.depositKes)}`;
  return { subject: `${title} · Gadget Hub`, html, text };
}

export function cartFollowUpNoticeToShop(input: {
  name?: string;
  phone?: string;
  email?: string;
  items: { name: string; qty: number; kes: number }[];
  totalKes: number;
  href?: string;
}) {
  const who = input.name || input.phone || input.email || "A shopper";
  const title = `Cart follow-up · ${who}`;
  const rows = input.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee;">${esc(i.name)} ×${i.qty}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">${esc(formatKes(i.kes * i.qty))}</td></tr>`,
    )
    .join("");
  const html = wrap(
    title,
    `<p>${esc(input.name || "Name not given")} · ${esc(input.phone || "no phone")} · ${esc(input.email || "no email")}</p>
    <p>They added items and may need help finishing checkout. Total ${esc(formatKes(input.totalKes))}${input.href ? ` · last page ${esc(input.href)}` : ""}.</p>
    <table width="100%">${rows}</table>
    <p style="font-size:13px;color:#6e6e73;">Contact is name / email / phone only — no passwords are stored.</p>`,
  );
  const text = [
    title,
    `${input.name || ""} ${input.phone || ""} ${input.email || ""}`.trim(),
    `Total ${formatKes(input.totalKes)}`,
    ...input.items.map((i) => `• ${i.name} ×${i.qty}`),
  ].join("\n");
  return { subject: `${title} · Gadget Hub`, html, text };
}
