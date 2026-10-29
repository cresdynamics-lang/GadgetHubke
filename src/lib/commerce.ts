/**
 * Storefront checkout is WhatsApp-first. Admin still saves cart / trade-in / Lipa
 * contacts. Card and M-Pesa payment UIs stay in the codebase but are not shown.
 */
export const STOREFRONT_PAYMENTS = false;

export function whatsappOrderText(lines: string[]) {
  return ["Hi Gadget Hub — I would like to order:", "", ...lines].join("\n");
}
