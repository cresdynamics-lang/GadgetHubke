# Management craft plan (from Admin PDF)

Route prefix: **`/management`** (never `/admin` — that redirects home).  
Source: *Gadget Hub Admin Page by Page* PDF.

## Principles

- Match PDF information architecture: left nav, staff identity, role-gated pages.
- Sample data until owner confirms real rules (PDF p14).
- Persist with Upstash / local `.data` (same pattern as reviews).
- Journal = public **Journal** on the site (`/journal`); old `/blog` redirects there.
- Align storefront chrome (Inter, black/ink, Nairobi EAT) without looking like a purple SaaS dashboard.

## Phases

### Phase A — Shell & access (PDF p2) · **done**
- [x] `/management` sign-in (email + password; OTP stub — any 6 digits unless `MANAGEMENT_OTP_CODE`)
- [ ] Session lockout counters (5 tries) — UI copy only for now
- [x] `/admin` → `/` redirect
- [x] Shared `ManagementLayout` with PDF nav: Dashboard, Live visitors, Journal, Orders, Trade-ins, Sales, Lipa Mdogo Mdogo, Staff

### Phase B — Dashboard (PDF p3) · **done (sample)**
- [x] Live visitor summary card (sample until Phase C)
- [x] Today metrics: orders, sales, WhatsApp clicks, trade-ins
- [x] Needs attention queue (links into Orders / Trade-ins / Lipa / Journal)
- [x] Pages viewing now + latest orders table

### Phase C — Live visitors (PDF p4) · **UI sample**
- [x] Anonymous visitor table, sources, activity stream, pages ranking (sample)
- [ ] Frontend beacon: `POST /api/management/presence` (page, device, referrer; no PII)
- [ ] Privacy copy on cookie/privacy pages

### Phase D — Journal (PDF p5–6) · **done**
- [x] List: status filters, counts, search
- [x] Editor: title/slug, body, cover alt, category/tags, publish/schedule/review, SEO preview, checklist
- [x] Public `/journal` + `/journal/[slug]` (rename from Blog)
- [x] Home teaser + footer + sitemap → Journal
- [ ] Bulk actions + cover image upload

### Phase E — Orders (PDF p7–8)
- [ ] Unified list (website + WhatsApp), status tabs, CSV export, add WhatsApp order
- [ ] Detail: progress, items, payment, notes, customer/delivery, actions
- [ ] Wire cart / WhatsApp CTAs to create draft orders

### Phase F — Trade-ins (PDF p9)
- [ ] Request list + detail + quote + apply credit
- [ ] Connect existing `/trade-in` form submissions

### Phase G — Sales (PDF p10)
- [ ] Range filter, totals, revenue chart, payment mix, top products, by staff
- [ ] Owner/manager only

### Phase H — Lipa Mdogo Mdogo (PDF p11–12)
- [ ] Plans list + alerts
- [ ] Plan detail: schedule, record payment, reminders log, rules placeholders
- [ ] Blocked on owner rules (p14)

### Phase I — Staff & roles (PDF p13)
- [ ] Team invites, role matrix, activity log
- [ ] Permission middleware on every management route

### Phase J — Owner decisions (PDF p14)
- [ ] Decisions checklist page in management (non-blocking reminders)
- [ ] Delivery charges, Lipa rules, reminder timings, M-Pesa mode, message templates

## Data model (target)

| Domain | Key / store |
| --- | --- |
| Staff sessions | signed cookie + `gh:mgmt:staff` |
| Journal posts | `gh:journal:v1` + seed JSON |
| Orders | `gh:orders:v1` |
| Trade-ins | `gh:tradeins:v1` |
| Lipa plans | `gh:lipa:v1` |
| Presence | `gh:presence:v1` (TTL) |
| Activity log | `gh:activity:v1` |
| Catalog overlay | existing `gh:catalog-overlay:v1` |

## Role matrix (PDF default)

| Area | Owner | Manager | Sales |
| --- | --- | --- | --- |
| Dashboard | ✓ | ✓ | ✓ (no sales totals) |
| Live visitors | ✓ | ✓ | – |
| Journal | publish | publish | draft |
| Orders | ✓ | ✓ | ✓ |
| Trade-ins | ✓ | ✓ | quote |
| Sales | ✓ | ✓ | – |
| Lipa | edit | edit | record payment |
| Staff | ✓ | – | – |

## Frontend alignment

- Journal listing/detail uses storefront `BaseLayout`, same type scale as category pages.
- Presence beacon only after cookie consent if analytics already gated.
- Prices/stock overlays remain available from existing catalog admin capabilities (fold into Orders later).

## Implementation order (this sprint)

1. Plan doc (this file)
2. `/management` shell + sign-in + `/admin` → home
3. Dashboard sample UI
4. Journal CRUD + public `/journal`
5. Nav stubs for remaining PDF sections (real data in later phases)
