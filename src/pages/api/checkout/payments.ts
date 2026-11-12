/**
 * Payments readiness (no secrets).
 * Confirms storefront checkout is wired; remaining work is Stanbic STK / IPN.
 */
import type { APIRoute } from "astro";
import { STOREFRONT_PAYMENTS } from "../../../lib/commerce";
import { paymentsReady, STANBIC_WEBHOOK_URL } from "../../../lib/payments/stanbic";
import { smtpConfigured, resendKey } from "../../../lib/mail/config";

export const prerender = false;

export const GET: APIRoute = async () => {
  const ready = paymentsReady();
  const mailOk = Boolean(resendKey("orders") || smtpConfigured());
  const body = {
    ok: STOREFRONT_PAYMENTS && ready.ready && mailOk,
    storefrontPayments: STOREFRONT_PAYMENTS,
    payments: {
      ...ready,
      storefrontPayments: STOREFRONT_PAYMENTS,
    },
    mail: {
      ordersConfigured: mailOk,
      invoiceOnCreate: STOREFRONT_PAYMENTS,
      receiptOnPaid: STOREFRONT_PAYMENTS,
      invoiceOnFailed: STOREFRONT_PAYMENTS,
    },
    endpoints: {
      createOrder: "/api/checkout/order",
      stk: "/api/checkout/mpesa/stk",
      status: "/api/checkout/mpesa/status",
      webhook: STANBIC_WEBHOOK_URL,
      payPage: "/checkout/pay",
    },
    note:
      STOREFRONT_PAYMENTS && ready.ready
        ? "App wiring complete. Waiting on Stanbic payment APIs (OAuth token + STK push + IPN webhook)."
        : "Storefront payments or Stanbic credentials are not ready.",
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
