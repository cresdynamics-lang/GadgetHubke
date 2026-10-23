# Checkout · Stanbic Bank (M-Pesa STK Push)

Stanbic confirmed (Oct 2026) they **cannot support card integrations**. Checkout is M-Pesa STK Push only. Funds settle to Gadget Hub’s Stanbic account.

## Bank whitelist (shared with Stanbic)

| Item | Value |
| --- | --- |
| Website | `https://gadgethubke.com` |
| Server IP (sandbox + production) | `143.198.169.74` |
| Callback / payment notification URL | `https://gadgethubke.com/api/checkout/webhook` |
| Account name | Gadgethub Investment |
| Account number | `0100013199528` |
| Branch | International Life House |
| Paybill | `600100` |

These must stay exact. The shop posts the same callback URL on every STK request.

## Sandbox portal vs API keys

| What | Where |
| --- | --- |
| Portal login | https://sandbox.stanbicbank.co.ke/ (developer account username + password) |
| API Client Key / Secret | Portal → **Apps** → create app → copy **Client Key** and **Client Secret** (shown once) |
| Product to subscribe | **Send Money – Sandbox** → **STK PUSH - M-PESA CHECKOUT API** |

Portal username/password is **not** the API token. After login, create an app (use account `0100013199528`), subscribe it to Send Money, then put the Client Key / Secret in `.env` as `STANBIC_CLIENT_ID` / `STANBIC_CLIENT_SECRET`.

Sandbox contact: Ann Minjire (`@Minjire, Ann A`) via Andrew Njonjo, Head of Digital, eCommerce & Personalization.

## Customer flow

1. Add to cart → checkout
2. Details (name, phone, email, pickup/delivery)
3. **M-Pesa**: STK Push via Stanbic sandbox/live → customer enters PIN
4. Webhook and/or status poll mark the order paid → `/checkout/success`

## Modes

| `PAYMENTS_MODE` | Behaviour |
| --- | --- |
| `mock` (default without keys) | STK “succeeds” after ~4s |
| `sandbox` | Calls Stanbic Connect sandbox (`mpesa-checkout`) |
| `live` | Same client against production base URL when issued |

## API (sandbox)

- Token: `POST https://api.connect.stanbicbank.co.ke/api/sandbox/auth/oauth2/token`
- STK: `POST https://api.connect.stanbicbank.co.ke/api/sandbox/mpesa-checkout`
- Body: `dbsReferenceId`, `billAccountRef`, `amount`, `mobileNumber`

Set credentials in `.env` on the host (never commit secrets). See `.env.example`.

## Owner steps for live

1. Keep the sandbox app subscribed to **STK PUSH - M-PESA CHECKOUT**.
2. Complete Gadget Hub KYC with Stanbic (registration, KRA PIN, CR12, director IDs, CRES authorisation).
3. Ask Ann Minjire for production Client Key/Secret, token URL, and IPN signing secret.
4. Confirm IP + callback remain whitelisted.
5. Set `PAYMENTS_MODE=live` and production `STANBIC_API_BASE`.

Orders persist to Upstash Redis when configured, otherwise `.data/checkout-orders.json` locally.

WhatsApp remains help-only and is not the pay path.
