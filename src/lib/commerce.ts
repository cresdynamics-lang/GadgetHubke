/**
 * Storefront checkout: create order → email invoice / pay link → Stanbic M-Pesa STK.
 * Set false to fall back to WhatsApp-only checkout.
 */
export const STOREFRONT_PAYMENTS = true;

/**
 * Online M-Pesa payment (Stanbic STK) at checkout. While false, the cart, checkout and Lipa
 * Mdogo Mdogo still work, but the order is saved and sent to the business WhatsApp with
 * every detail instead of asking for payment. Turn on once Stanbic production is live.
 */
export const ONLINE_PAYMENTS = false;

export function whatsappOrderText(lines: string[]) {
  return ["Hi Gadget Hub — I would like to order:", "", ...lines].join("\n");
}
