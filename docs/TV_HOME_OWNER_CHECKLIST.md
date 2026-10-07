# TV & Home owner checklist (GadgetHubKe)

One-page list of placeholders and owner actions before launch. Tick each when done.

## Config (`src/lib/tv-home/config.ts`)

- [ ] Confirm shop address line and opening hours (currently “To be confirmed”).
- [ ] Re-verify all sample KES prices in `tvHomeBasePricesKes` against your margin sheet.
- [ ] Set `tradeIn.acceptTvHome` true/false once policy is decided.
- [ ] Confirm `ethernetStorageStepKes` between Wi-Fi and Ethernet Apple TV SKUs.
- [ ] Review `performanceRatios` - do not show bars until Apple-published ratios are confirmed.
- [ ] Update `missingImageNotes` if assets change.

## Specs (`src/lib/tv-home/models.ts`)

- [ ] Every model with `checkFinalSpecs: true` - re-read Apple TV and HomePod compare pages on apple.com.
- [ ] Confirm Thread/Matter/home hub claims **for Kenya**.
- [ ] Confirm which HomePod mini colours are stocked.
- [ ] Keep `noImage` on HomePod (1st gen) until a photo exists or remove from stock.
- [ ] `overviewOnly` older Apple TV - only list if you have stock.

## Images (`src/lib/tv-home/`, `public/`)

- [ ] Run `npm run tvhome:manifest` after adding/moving image files.
- [ ] Run `npm run images:tvhome-webp` after new product/hero shots.
- [ ] Product photos under `Gadget_Hub_TV_and_Home_1_Product_photos_colours_and_compare/`.
- [ ] Page feel assets under `public/TV&Home/03_Animation_and_page_images_*`.
- [ ] Wi-Fi vs Ethernet Apple TV - same photos (do not invent separate heroes).
- [ ] Original HomePod - no image; keep text-only until a photo exists.
- [ ] Trademark / image permission for production (see `trademarkLine`).

## UI copy

- [ ] Sample price disclaimer still accurate once admin pricing is live.
- [ ] “In stock (sample)” → real stock rules when inventory exists.
- [ ] WhatsApp number matches live shop line.
- [ ] Corporate / visit CTAs point to correct workflows.
- [ ] `setupRequirement` and Kenya availability lines reviewed.

## Search & nav

- [ ] Test site search: “apple tv”, “homepod mini”, “siri remote”, typos.
- [ ] Mega menu “from” prices match config after price updates.
- [ ] `/shop/tv-home` redirects to `/tv-home/shop`.
- [ ] Footer TV & Home column links.

## Bag & orders

- [ ] WhatsApp order template reads well with `storage`, `pair`, and add-on `extras`.
- [ ] Stereo pair pricing (×2) matches your shop policy.
- [ ] Bundle “add all to bag” messaging on landing.

## Optional

- [ ] Generated manifest (like AirPods/Watch) if the image tree grows.
- [ ] Dedicated `/shop/tv-home` marketing redirect from old bookmarks only (301 in place).

---

When this checklist is complete, flip `checkFinalSpecs` flags off model-by-model and refresh sample prices from admin.
