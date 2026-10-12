# Google Merchant iPhone feed — handover

## Feed URL
- Path: `/feeds/google-merchant-iphone.xml`
- Production: `https://gadgethubke.com/feeds/google-merchant-iphone.xml`
- Listed in `/sitemap.xml`

## Counts (build)
- Included rows: **97** (`scripts/merchant-row-count.json`)
- Exclusions: **7** (`scripts/merchant-exclusions.json`)

## Exclusions (do not submit)
| Sheet ID | Model | Storage | Reason |
|----------|-------|---------|--------|
| IP-086 | iPhone 17 Pro | 256GB | no_photo |
| IP-087 | iPhone 17 Pro | 512GB | no_photo |
| IP-088 | iPhone 17 Pro | 1TB | no_photo |
| IP-089 | iPhone 17 Pro Max | 256GB | no_photo |
| IP-090 | iPhone 17 Pro Max | 512GB | no_photo |
| IP-091 | iPhone 17 Pro Max | 1TB | no_photo |
| IP-092 | iPhone 17 Pro Max | 2TB | no_photo |

## EX-UK
- `SHOW_EX_UK = false` — used/EX-UK offer rows are not in the feed.

## Owner next steps
1. Confirm Contabo is reachable, then run `python3 scripts/ship-packs.py`.
2. Verify live feed + `robots.txt` Sitemap line.
3. Submit feed in Google Merchant Center; keep exclusions out until photos exist.
