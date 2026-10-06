# Owner launch checklist — iPad Pro / Air / mini / standard

Replace every sample / placeholder before going live.

## Must replace

1. **Prices and stock** — all KES in `src/lib/ipad/config.ts` (`ipadBasePricesKes`) and storage/cellular/nano steps are samples.
2. **WhatsApp number** — shared with iPhone/Mac config / `site.whatsapp`.
3. **Shop address and hours** — `ipadConfig.address` still TBC.
4. **Lipa Mdogo Mdogo terms** — deposit/months and 0% illustration note.
5. **Set-up and warranty wording** — owner to confirm service fee and cover.
6. **Thickness and weight** — `ipadConfig.thicknessMm` and model `weightG` are “about” figures; re-verify. Speaker counts per model also need confirm on feel copy.
7. **Check final specs** — iPad Pro M5 (11″/13″), iPad Air M4 (11″/13″), iPad (A16) until verified on apple.com. Air 11″ M4 brightness especially.
8. **Apple performance ratios** — `ipadConfig.performanceRatios` are provisional citations; do not invent bars.
9. **Missing store photos (overview-only)** — Pro 2020–2022, Air 4/5, mini 6, iPad 8/9. Colour names show as text.
10. **Pro M4/M5 pack note** — pack has `select-wificell` + `witb` shots; plain `select-wifi` files were not in the zip (flagged).
11. **Air hero** — `hero_startframe` missing in pack; only `hero_endframe` found. Landing uses Pro start/end pair.
12. **Apple image permission** — footer line states mock-up only; live use needs permission.

## Scripts

- `npm run ipad:manifest` — rebuild image keys from the ten iPad folders.
- `npm run images:ipad-webp` — sibling WebP (~1400 product / ~1800 hero).

## Image folders checked

| Folder | Role | Files |
|--------|------|------:|
| `Gadget_Hub_iPad_1_Product_photos` | Store shots | 69 |
| `Gadget_Hub_iPad_2_Colour_overviews` | Colour overviews | 24 |
| `Gadget_Hub_iPad_3_Pro_page_images_part1` | Pro page assets | 89 |
| `Gadget_Hub_iPad_3_Pro_page_images_part2` | Pro page assets | 16 |
| `Gadget_Hub_iPad_4_Air_page_images_part1` | Air page assets | 65 |
| `Gadget_Hub_iPad_4_Air_page_images_part2` | Air page assets | 26 |
| `Gadget_Hub_iPad_4_Air_page_images_part3` | Air page assets | 1 |
| `Gadget_Hub_iPad_5_mini_page_images_part1` | mini page assets | 43 |
| `Gadget_Hub_iPad_5_mini_page_images_part2` | mini page assets | 9 |
| `Gadget_Hub_iPad_6_iPad_page_images` | standard page assets | 51 |
