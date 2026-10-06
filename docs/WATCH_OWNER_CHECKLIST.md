# Apple Watch — owner checklist before launch

Replace every placeholder below. Anything marked **check** must be confirmed against Apple’s published compare page ([apple.com/watch/compare](https://www.apple.com/watch/compare/)).

## Commerce
- [ ] Sample KES prices in `src/lib/watch/config.ts` (`watchBasePricesKes`, cellular +KES 9,000, material steps)
- [ ] Real stock / admin inventory
- [ ] WhatsApp number (`watchConfig.whatsapp`)
- [ ] Shop address and hours
- [ ] Lipa Mdogo Mdogo deposit/months and “0% extra” wording
- [ ] Trade-in condition percentages
- [ ] Set-up / pairing fee and service wording
- [ ] Warranty: what cover comes with the watch and who honours it
- [ ] Cellular / eSIM support with Kenyan carriers

## Specs flagged check-final-specs
- [ ] Series 12: brightness, chip, battery hours, Low Power hours, charging speed
- [ ] Ultra 4: 3000 nits claim, battery hours, depth gauge figures
- [ ] SE 3: Always-On status, chip, battery, health feature list
- [ ] Series 6–11 / Ultra 1–3 / SE 1–2: re-verify from Apple compare
- [ ] Band fit rules (esp. Ultra Alpine/Trail/Ocean on 42–46 mm) vs Apple’s fit guide
- [ ] Wrist / case size guide ranges
- [ ] Health-feature availability in Kenya (ECG, Blood Oxygen, hypertension, sleep apnea, satellite SOS)

## Imagery
- [ ] Permission to use Apple product photos on a live site
- [ ] Models with **no gallery shot** (overview only): Series 6–8, SE 1–2, Ultra 1
- [ ] Do not promise per-colour store photos, 360° spin, or wrist try-on
- [ ] Run `npm run watch:manifest` after adding images; `npm run images:watch-webp` for WebP

## Folders used
- `public/Gadget_Hub_Watch_1_Product_photos_and_swatches_part1` (01 product + 02 swatches)
- `public/Gadget_Hub_Watch_1_Product_photos_and_swatches_part2` (02 swatches, 04 compare, 05 overviews)
- `public/Gadget_Hub_Watch_3_Animation_and_page_images` (consolidated page frames)
- Duplicate unzip folders `03_Animation_and_page_images_apple.com` … `… 4` were merged into Watch_3; keep or delete duplicates after verifying

## Medical / legal copy
- [ ] Keep the medical honesty block; confirm feature availability wording for Kenya
- [ ] Footer trademark line includes Apple Watch
