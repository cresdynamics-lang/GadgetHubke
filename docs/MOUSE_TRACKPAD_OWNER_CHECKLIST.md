# Owner launch checklist — Magic Mouse and Magic Trackpad

Replace every sample / placeholder before going live.

## Must replace

1. **Prices and stock** — sample KES in `src/lib/accessories/config.ts` (`accessoryBasePricesKes`) for all Mouse and Trackpad SKUs.
2. **Black premium** — confirm whether black Mouse / Trackpad cost more than white (`accessoriesConfig.blackPremiumNote`).
3. **WhatsApp number** — `accessoriesConfig.whatsapp`.
4. **Shop address and hours** — `accessoriesConfig.address`.
5. **Lipa terms** — deposit/months and 0% illustration note.
6. **Charging copy** — Magic Mouse underside port (`mouseChargeNote`); Trackpad back-edge port and use-while-charging (`trackpadChargeNote`).
7. **Earlier generations** — MRME2 / MRMF2 / MJ2R2 connector and condition; toggle `stocked` if not carrying them.
8. **Compatibility** — re-verify every `pointerFits` rule on Apple's macOS / iPadOS / Bluetooth lists (minimum OS versions, iPhone, Windows, Android).
9. **Windows / Android** — confirm whether the shop recommends pairing; site shows “Fits, but …” with limited gestures.
10. **Weights and dimensions** — currently `null` in the data model; fill published mm/g or leave blank.
11. **Battery / short-charge claim** — only show if confirmed.
12. **Set-up and warranty wording** — pairing fee and who honours cover.
13. **Older white Magic Mouse 2** — no separate photo; USB-C white is the stand-in look — label if used.
14. **Power and cases** — still “Coming next” with no products or prices.
15. **Apple image permission** — footer trademark line; live use needs permission.

## Scripts

- `npm run accessories:manifest` — mouse **29** + trackpad **41** image counts (fails if counts change).
- `node scripts/accept-pointer-fits.mjs` — Part 12 pointer fit acceptance table.

## Manifest counts (expected)

| Pack | Count |
|------|------:|
| Mouse | 29 |
| Trackpad | 41 |

## Product IDs live

- `mouse-usbc-white` (MXK53), `mouse-usbc-black` (MXK63), `mouse-earlier-space-gray` (MRME2)
- `trackpad-usbc-white` (MXK93), `trackpad-usbc-black` (MXKA3), `trackpad-earlier-space-gray` (MRMF2), `trackpad-earlier-white` (MJ2R2)

## Pages to smoke-test

- `/accessories/magic-mouse`, `/accessories/magic-trackpad`
- `/accessories/compare?group=pointer`
- Accessories mega menu preview for Mouse / Trackpad links
- Bag drawer shows **Connector** line on pointer SKUs
