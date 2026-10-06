# Owner launch checklist — iPhone 11–16 section

Replace every sample / placeholder before going live.

## Must replace

1. **Prices and stock** — all KES figures in `src/lib/iphone/models.ts` and storage steps in `src/lib/iphone/config.ts` are samples. Labelled in the UI.
2. **WhatsApp number** — `iphoneConfig.whatsapp` / `site.whatsapp` (currently 254729585471).
3. **Shop address and hours** — `iphoneConfig.address` still says “To be confirmed” in places that use it; footer may still use `site.address`.
4. **Lipa Mdogo Mdogo terms** — deposit/month defaults and the “0% extra illustration” note in config. Real terms are set by Gadget Hub Investments.
5. **Set-up and warranty wording** — confirm service fee and warranty copy (owner to confirm).
6. **Sierra Blue** — iPhone 13 Pro / 13 Pro Max shipped in Sierra Blue; listed as text-only until images exist.
7. **Missing angle sets** — overview-only today: iPhone 11, 12 Pro, 12 Pro Max, 16e. UI shows “Full angle set coming soon”.
8. **Apple image permission** — product photos are Apple’s (or supplied pack). Live site needs permission / licensed use.

## Optional polish

- WebP resized assets (~760 / ~900): run `npm run images:iphone-webp` (Sharp). Sibling `.webp` next to each pack JPEG; `getImage()` already prefers them via `<picture>`.
- Admin stock entry will replace “In stock (sample)”.
- Search misses are logged in `sessionStorage` key `gh-search-misses` for later admin review.
