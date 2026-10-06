# AirPods owner checklist (GadgetHubKe)

One-page list of placeholders and owner actions before launch. Tick each when done.

## Config (`src/lib/airpods/config.ts`)

- [ ] Confirm shop address line and opening hours (currently “To be confirmed”).
- [ ] Re-verify all sample KES prices in `airpodsBasePricesKes` against your margin sheet.
- [ ] Set `tradeIn.acceptAirpods` true/false once policy is decided.
- [ ] Confirm `wirelessCaseStepKes` for add-on SKUs.
- [ ] Review `ancRatios` — confirm Apple source/date for Pro 3 ANC claim before showing bars.
- [ ] Update `missingStoreShotNotes` if assets change.

## Specs (`src/lib/airpods/models.ts`) — check final specs

- [ ] Every model with `checkFinalSpecs: true` — re-read [apple.com/airpods/compare](https://www.apple.com/airpods/compare).
- [ ] Fill `batterySingleHours` / `batteryWithCaseHours` where Apple publishes hours (else leave null).
- [ ] Confirm `waterRating`, `mics`, `weightG`, chip, ANC ratios, case features per model.
- [ ] Confirm hearing features availability **in Kenya** (Pro 3 / software region).
- [ ] Confirm `lossless` and Live Translation claims per model/year.
- [ ] Remove or set `standInImage` when real product photos are in the manifest.

## Images (repaired)

- [x] Pack 1 kept at `Gadget_Hub_AirPods_1_Product_photos_cases_and_compare` (01/02/04/05).
- [x] Five `Airpods3/03_AirPods_animation_images_*` folders verified at **236** files (Pro 71, 5=65, Max=81, landing=19).
- [x] Stale `03_Animation_and_page_images_apple.com` (+ 2, + 3) deleted; Watch pack 4 kept.
- [x] Manifest rebuilt (`npm run airpods:manifest`) — 201 keys, 0 pair warnings (known singles allowed).
- [x] WebP siblings generated for pack + Airpods3.
- [ ] **Apple image permission** for live use (see `trademarkLine`).
- [ ] **Max colour name mapping:** landing pack uses `black` / `stardust`; store uses Midnight / Starlight. Confirm whether black≈Midnight and stardust≈Starlight before using landing Max colour shots interchangeably. Store names remain source of truth.
- [ ] Max purple/starlight **dots** remain approximate CSS until swatch files exist.
- [ ] Models without store photos (keep “Image shows the current design” / case overview): AirPods 2, AirPods 3, Pro 1, Pro 2 2022–2023 packs, original Max 2020 colours.

## UI copy / legal

- [ ] Sample price disclaimer still accurate once admin pricing is live.
- [ ] “In stock (sample)” → real stock rules when inventory exists.
- [ ] WhatsApp number, warranty and set-up fee wording.
- [ ] `medicalHonesty` reviewed; no audio demos; no fake ratings.

## Search, bag, nav

- [ ] Test search: “airpods pro 3”, “max 2”, “anc”, typos.
- [ ] Mega menu prices; bag `caseOption` + extras; trade-in policy.

---

When this checklist is complete, flip `checkFinalSpecs` flags off model-by-model and refresh sample prices from admin.

**Manifest report:** `src/lib/airpods/manifest-report.json` (count03=236, keys=201, warnings=[]).
