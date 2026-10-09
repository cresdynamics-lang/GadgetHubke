# Checkout · Stanbic Bank (M-Pesa STK + Card)

## Customer flow

1. **Add to Cart** → cart drawer → **Checkout**
2. **Buy now** → `/checkout?mode=buy-now` with that configured line
3. Review → details (name, phone, email, pickup/delivery) → pay
4. **M-Pesa**: STK Push via Stanbic → poll until paid
5. **Card**: Stanbic card/ACS session → return to `/checkout/success`

## Modes

| `PAYMENTS_MODE` | Behaviour |
| --- | --- |
| `mock` (default without keys) | STK “succeeds” after ~4s; card marks paid and redirects to success |
| `sandbox` | Calls Stanbic sandbox with `STANBIC_*` credentials |
| `live` | Same client against production base URL |

Set credentials in `.env` / Vercel (see `.env.example`).

## Owner steps for live

1. Onboard merchant on [Stanbic API portal](https://sandbox.stanbicbank.co.ke/).
2. Enable **STK PUSH - M-PESA CHECKOUT** and card/ACS product.
3. Confirm exact STK and card session paths; set `STANBIC_STK_PATH` / `STANBIC_CARD_PATH` if needed.
4. Register webhook URL: `https://<domain>/api/checkout/webhook` (+ `STANBIC_WEBHOOK_SECRET` if required).
5. Set `PAYMENTS_MODE=live` and production `STANBIC_API_BASE`.

Orders persist to Upstash Redis when configured, otherwise `.data/checkout-orders.json` locally.

Ask on WhatsApp remains help-only (green button) and is not the pay path.
