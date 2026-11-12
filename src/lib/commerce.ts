/**
 * Storefront checkout: create order → email invoice / pay link → Stanbic M-Pesa STK.
 * Set false to fall back to WhatsApp-only checkout.
 */
export const STOREFRONT_PAYMENTS = true;

export function whatsappOrderText(lines: string[]) {
  return ["Hi Gadget Hub — I would like to order:", "", ...lines].join("\n");
}
