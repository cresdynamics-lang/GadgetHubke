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

**Catalog feeds (live shop prices):**
- Meta Commerce Manager CSV: `https://gadgethubke.com/feeds/meta-catalog.csv`
- Google Merchant Center XML: `https://gadgethubke.com/feeds/google-merchant.xml`
- iPhone-only (legacy): `https://gadgethubke.com/feeds/google-merchant-iphone.xml`

