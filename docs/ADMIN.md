# GadgetHub management

Owner tools live at **`/management`** (password protected, noindex).

**`/admin` redirects to the homepage** — do not use it.

See also: [MANAGEMENT_CRAFT_PLAN.md](./MANAGEMENT_CRAFT_PLAN.md) for the full PDF-aligned roadmap.

## What it does (live now)

| Section | Purpose |
| --- | --- |
| **Dashboard** | Live visitor summary, today’s numbers, attention queue (sample + real tools) |
| **Journal** | Write / schedule / publish posts shown on `/journal` |
| **Prices & stock** | Override sample KES prices and in-stock flags |
| **Reviews** | Approve / hide / delete customer reviews |
| **Search misses** | Storefront searches that returned nothing |
| **Live / Orders / Trade-ins / Sales / Lipa / Staff** | PDF UI with sample data (phases C–I) |

Live price/stock overlays: `GET /api/catalog-overlay`.

## Setup

1. Set env vars (Vercel + local `.env`):

```bash
ADMIN_SECRET=choose-a-long-password
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
# Optional: require a fixed OTP after password (otherwise any 6 digits)
# MANAGEMENT_OTP_CODE=123456
```

2. Deploy / run `astro dev --background`
3. Open `/management` and sign in (email + password + 6-digit code)

**Local dev:** if `ADMIN_SECRET` is unset, password defaults to `gadgethub-dev-admin`.

## Notes

- Journal on the storefront is `/journal` (old `/blog` redirects there).
- Repo `config.ts` / `products.ts` prices remain the defaults until you save an override.
- Without Upstash on Vercel, management writes fail; local/dev uses `.data/*.json`.
- Do not link `/management` in the public nav — share the URL with staff only.
