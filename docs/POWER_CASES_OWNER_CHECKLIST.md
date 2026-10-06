# Owner launch checklist — Power and Cases

Replace every sample / placeholder before going live.

## Must replace

1. **Prices and stock** — every Power and Cases SKU / colour in `src/lib/accessories/config.ts` (`accessoryBasePricesKes`). Colour-level prices only where the owner enters them.
2. **WhatsApp number** — `accessoriesConfig.whatsapp`.
3. **Shop address and hours** — `accessoriesConfig.address`.
4. **Lipa terms** — deposit/months and 0% illustration note.
5. **Plug variants stocked in Kenya** — UK-style three-pin vs photos that may show `_GEO_US` two-pin. Confirm before collect; keep `plugCaption` honest.
6. **Fitting and warranty wording** — who honours cover; fitting/set-up fee.
7. **Every flagged “check final specs” rule** — adapter wattages and “designed for” lines; cable power/data ratings; MagSafe iPhone lists; Watch charger models; strap↔case pairings; Duo / FineWoven Wallet fit lists; Smart Folio model mapping; dimensions.
8. **Charge-time / fast-charging claims** — do not publish unless Apple publishes and you confirm. Site blocks invented claims.
9. **Bundle prices** — iPhone + case + 20W; iPad + Folio + Pencil + Keyboard; MacBook + adapter + cable — owner confirms combined prices.
10. **Which colours are actually in stock in Kenya** — variant index lists Apple photo colours; stock may be a subset.
11. **Third-party brands not stocked** — Belkin, Anker, Spigen, mophie, OtterBox, Beats cases, Tech21, Moft, Logitech, Nimble — search shows WhatsApp only.
12. **Apple image permission** — live use needs permission (footer trademark line).

## Honest gaps already labelled on site

- Lead colour often has full angles; other colours main + swatch (+ one angle).
- Some Clear cases: main + swatch only.
- Extension cable: one photo.
- `_GEO_US` photos show US plugs — caption shown.
- No Apple marketing hero/animation frames for Power/Cases.

## Scripts

- `npm run accessories:manifest` — pencil **74**, keyboard **79**, mouse **29**, trackpad **41**, power **57**, cases **375**.
- `node scripts/accept-power-cases-fits.mjs` — Part 12 fit / charger advice table.
- `npm run images:accessories-webp` — WebP siblings (swatches ~160 px).

## Manifest case families (colour counts)

See `src/lib/accessories/manifest-report.json` → `caseFamilySummary` (27 families, 110 colours).

## Pages to smoke-test

- `/accessories`, `/accessories/power`, `/accessories/cases`
- PDP with `?v=<partNumber>` colour change (swatch ring, photo, part number, bag)
- Finder: case mode + charger mode
- Search: “belkin case”, “iphone 17 pro max case”, “70w”
- No “Coming next” / `/accessories/coming-next` (redirects to `/accessories`)
