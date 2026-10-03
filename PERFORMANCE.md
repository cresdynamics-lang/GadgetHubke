## Performance notes (Phase 1)

Build snapshot after optimization pass:

| Metric | Before | After |
|--------|--------|-------|
| `dist/` | ~35 MB | **5.3 MB** |
| `dist/_astro` | ~468 KB | **180 KB** |
| Base layout CSS | ~108 KB (Font Awesome) | **28 KB** |
| Fonts | 7 Inter subsets + FA brands | **Latin + Latin Ext only** (~132 KB) |
| Images | scrape dumps in `public/` | **1.9 MB** (heroes + cards + logo) |

Changes shipped:

- Removed Font Awesome; inline SVGs via `SocialIcon.astro`
- Latin-only Inter (`src/styles/fonts.css`) + preload of latin woff2
- Deleted Apple.com scrape dumps from `public/images/` (were copying into `dist` despite gitignore)
- Remaining shop stubs → `StockInquiryPage` (WhatsApp stock check)
- Cache headers in `vercel.json` + `public/_headers`

Lighthouse CLI hung in this environment; re-run locally after deploy:

```bash
npm run build && npx astro preview --port 4322
npx lighthouse http://127.0.0.1:4322/ --preset=desktop --only-categories=performance,accessibility,best-practices
```
