# CategoryHero handover checklist

Silent image-loop heroes on `/iphone`, `/mac`, `/ipad`, `/watch`, `/airpods`, `/tv-home`, `/accessories`.

## Behaviour (shipped)

| Item | Spec | Status |
| --- | --- | --- |
| Desktop loop | First 4 scenes · 4 s each · 0.9 s crossfade · 16 s | Done |
| Phone loop | First **3** scenes · 12 s (`max-width: 47.99rem`) | Done |
| AirPods colour swap | P01–P05 · 800 ms | Done |
| CTAs | WhatsApp + Shop side-by-side (static) | Done |
| Pause / progress UI | Removed from category landings | Done |
| Reduced motion / saveData | Still poster on phone+saveData or `prefers-reduced-motion` | Done |
| Build guard | `validateHeroScenes()` fails build on missing assets | Done |

## Widths 360–1440

Spot-check each category landing at:

- **360** – phone frame (4:5), 3-scene loop, CTAs readable, cutouts centred
- **768** – tablet boundary near phone/desktop breakpoint (`48rem`)
- **1024** – desktop 16:9 frame, 4-scene loop
- **1440** – full cinematic / cutout layout, no crop of brand copy

Dev helpers: `/dev/hero-iphone`, `/dev/hero`.

## Image budget (phone · 800w WebP · first 3 scenes)

Target: scene 1 ≤ ~150 KB; 3-scene pack ≤ ~1.2 MB. Measured from generated `.w800.webp`:

| Category | Scene 1 | 3 scenes | Pass |
| --- | --- | --- | --- |
| iPhone | 3.6 KB | 45.6 KB | Yes |
| MacBook | 3.7 KB | 50.6 KB | Yes |
| iPad | 3.8 KB | 61.7 KB | Yes |
| Watch | 8.1 KB | 63.8 KB | Yes |
| AirPods | 16.5 KB | 98.7 KB | Yes |
| TV & Home | 50.7 KB | 75.9 KB | Yes |
| Accessories | 93.5 KB | 129.4 KB | Yes |

Full variant table: `docs/hero-image-sizes.md`.

## Lighthouse

After `npm run build`:

```bash
npx astro preview --port 4322
npx lighthouse http://127.0.0.1:4322/iphone --preset=desktop --only-categories=performance,accessibility,best-practices --output=json --output-path=./docs/lighthouse-iphone.json --chrome-flags="--headless --no-sandbox"
npx lighthouse http://127.0.0.1:4322/iphone --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility --output=json --output-path=./docs/lighthouse-iphone-mobile.json --chrome-flags="--headless --no-sandbox"
```

Local run (2026-10-07, `astro preview --host 127.0.0.1 --port 4322`):

| Page | Form factor | Perf | A11y | BP |
| --- | --- | ---: | ---: | ---: |
| `/iphone` | desktop | 97 | 93 | 96 |
| `/iphone` | mobile | 77 | 93 | 96 |

Re-run after deploy with the commands above; update this table if scores drift.

## Owner ops

1. Swap a scene → edit `src/lib/hero/scenes.ts` → `node scripts/process-hero-webp.mjs` → build.
2. Timing → `HERO_SCENE_MS` / `HERO_CROSSFADE_MS` / `HERO_COLOUR_SWAP_MS` in `src/lib/hero/types.ts` (and matching args in `CategoryHero.astro`).
3. Optional MP4 later → set `videoSrc` on the category object; slot already wired.
4. Product cards: label is **Add to Cart** (not Bag); View / Add to Cart use `btn--xs`; hover swaps to a second product image when one exists.

## Docs

- `docs/HERO_VIDEO.md` — how to edit scenes / timing
- `docs/hero-image-sizes.md` — WebP size table
- This file — launch verification
