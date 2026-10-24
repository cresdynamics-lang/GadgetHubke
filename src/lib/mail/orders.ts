import type { CheckoutOrder } from "../checkout/types";
import { buildOrderPdf, pdfFilename } from "../documents/pdf";
import { site } from "../site";
import { trySendMail } from "./smtp";
import { invoiceEmail, orderNoticeToShop, receiptEmail } from "./templates";

export async function sendInvoiceForOrder(order: CheckoutOrder) {
  const pdf = Buffer.from(await buildOrderPdf(order, "invoice"));
  const msg = invoiceEmail(order);
  const customer = await trySendMail({
    to: order.customer.email,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    attachments: [{ filename: pdfFilename(order, "invoice"), content: pdf, contentType: "application/pdf" }],
  });
  const shop = orderNoticeToShop(order, "invoice");
  await trySendMail({
    to: site.email,
    subject: shop.subject,
    html: shop.html,
    text: shop.text,
  });
  return customer;
}

export async function sendReceiptForOrder(order: CheckoutOrder) {
  const pdf = Buffer.from(await buildOrderPdf(order, "receipt"));
  const msg = receiptEmail(order);
  const customer = await trySendMail({
    to: order.customer.email,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    attachments: [{ filename: pdfFilename(order, "receipt"), content: pdf, contentType: "application/pdf" }],
  });
  const shop = orderNoticeToShop(order, "receipt");
  await trySendMail({
    to: site.email,
    subject: shop.subject,
    html: shop.html,
    text: shop.text,
  });
  return customer;
}
