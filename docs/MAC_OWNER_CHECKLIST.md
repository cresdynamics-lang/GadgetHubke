# Owner launch checklist — MacBook Air + Pro

Replace every sample / placeholder before going live.

## Must replace

1. **Prices and stock** — all KES in `src/lib/mac/config.ts` (`macBasePricesKes`) and memory/storage steps are samples.
2. **WhatsApp number** — shared with iPhone config / `site.whatsapp`.
3. **Shop address and hours** — `macConfig.address` still TBC.
4. **Lipa Mdogo Mdogo terms** — deposit/months and 0% illustration note.
5. **Set-up and warranty wording** — owner to confirm service fee and cover.
6. **Thickness and weight** — `macConfig.thicknessMm` and model `weightKg` are “about” figures; re-verify.
7. **M5 specs** — every M5 / M5 Pro / M5 Max row is flagged “Check final specs” until verified on apple.com.
8. **Apple performance ratios** — `macConfig.performanceRatios` are provisional citations; do not invent bars.
9. **Missing store photos** — Air 13″ M2, Air 15″ M3, all M5 Air/Pro; M1 Air uses 2018-labelled chassis shots.
10. **Apple image permission** — footer line states mock-up only; live use needs permission.

## Scripts

- `npm run mac:manifest` — rebuild image keys from the three Mac folders.
- `npm run images:mac-webp` — sibling WebP (~1400 product / ~1800 hero).
