# CategoryHero

Silent image-loop heroes for the seven category landings. Not an MP4 - real pack images animated in the browser.

## Files

| Piece | Path |
| --- | --- |
| Component | `src/components/hero/CategoryHero.astro` |
| Playback | `src/scripts/categoryHero.ts` |
| Scene data | `src/lib/hero/scenes.ts` |
| Types / timing | `src/lib/hero/types.ts` |
| Validation | `src/lib/hero/validate.ts` |
| Source packs | `public/Hero/Gadget_Hub_Hero_Video_*` |
| WebP pipeline | `scripts/process-hero-webp.mjs` |
| Size table | `docs/hero-image-sizes.md` |
| iPhone test | `/dev/hero-iphone` |
| All packs test | `/dev/hero` |

## Add or edit a scene

1. Put the source file in the matching pack folder under `public/Hero/` (keep the `C##` / `P##` name).
2. Edit `src/lib/hero/scenes.ts` for that category.
3. Run `node scripts/process-hero-webp.mjs` to rebuild WebP variants.
4. Build - `validateHeroScenes()` fails the build if a path is missing.

## Timing

- Scene: 4000 ms
- Crossfade: 900 ms
- Desktop loop: 4 scenes / 16 s
- Phone loop: first 3 scenes / 12 s
- AirPods colour swap: 800 ms

## WhatsApp

Uses `whatsappUrl()` from `src/lib/site.ts` (`254729585471`). Never hardcode a number in the component.

## Optional MP4 later

Each category has optional `videoSrc` on the data object. The component already reserves a hidden `<video>` slot. Drop a file path in later without rewriting the scene stack.

## Handover

Launch verification (phone 3-scene, widths 360–1440, Lighthouse, budgets): [`docs/HERO_HANDOVER.md`](./HERO_HANDOVER.md).
