# GadgetHub Kenya - deploy notes

## Recommended host

**Cloudflare Pages** or **Vercel** - both have strong African/Middle East edge coverage for Nairobi visitors.

### Cloudflare Pages
1. Connect the GitHub repo.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node version: `22` (see `package.json` engines)
5. `public/_headers` is applied automatically for cache + security headers.

### Vercel
1. Import the repo.
2. Framework preset: Astro (or Other with `npm run build` → `dist`).
3. `vercel.json` sets long-cache for `/images` and `/_astro`, plus basic security headers.

### Analytics & ads (optional)
Set `PUBLIC_PLAUSIBLE_DOMAIN=gadgethubke.com` in the host env after creating a Plausible site.
Script loads only when the visitor opts into analytics cookies.

**Meta Pixel** defaults to `971017782717953` (override with `PUBLIC_META_PIXEL_ID`).
**Google tag** defaults to `GT-TWQKGRD3` (override with `PUBLIC_GOOGLE_TAG_ID`).
Optional extras: `PUBLIC_GOOGLE_ADS_ID` (AW-…) and/or `PUBLIC_GA_MEASUREMENT_ID` (G-…).

**Email (invoices, receipts, password reset):**
Set SMTP on the host from Namecheap Private Email (never commit the app password):

```
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@gadgethubke.com
SMTP_PASS=
MAIL_FROM=Gadget Hub <info@gadgethubke.com>
```

Checkout emails an invoice PDF (with a pay link) before M-Pesa, then a receipt PDF after payment.

**Catalog feeds (live shop prices):**
- Meta Commerce Manager CSV: `https://gadgethubke.com/feeds/meta-catalog.csv`
- Google Merchant Center XML: `https://gadgethubke.com/feeds/google-merchant.xml`
- iPhone-only (legacy): `https://gadgethubke.com/feeds/google-merchant-iphone.xml`



## VPS deploy (current: DigitalOcean, PM2)

The live site runs on `deploy@143.198.169.74` from `/var/www/sites/gadgethubke.com`
as PM2 app `gadgethub` (user `site_gadget`). Product pages, category pages, the
sitemap and the Google/Meta feeds render on each request, so admin price edits
show immediately.

```
npm run deploy
```

The script refuses to deploy uncommitted or unpushed code (the server always
matches GitHub `main`), then builds, backs up `dist/server`, uploads with rsync,
restarts PM2 and smoke-tests key pages and the Google feed. A failed smoke test
prints the rollback command.

Admin prices live on the server in `.data/gh:catalog-overlay:v1.json`; back it up
before bulk edits. Never upload a local `.data/` folder over the server's.
