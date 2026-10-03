# GadgetHub Website - Phase 1 To-Do List

**Starting point:** logo only (`gadgethublogo.jpg`)  
**Shop contact:** `0729585471` (calls + WhatsApp)  
**Inventory rule:** new devices only - trade-ins accepted as currency; no refurbished/used stock on site

---

## 0. Decisions locked (do not reverse)

- [x] New-only storefront confirmed: no Refurbished nav, no A/B/C condition on products for sale, no used inventory listings
- [x] Trade-in condition applies only to the device being traded in (Trade-In form), never to buy-side configurators
- [x] Strict black & white only - no accent color; CTAs/prices/badges use black, white, and greyscale
- [x] One type family (Inter variable), 2-3 weights max
- [x] Static-first stack (Astro preferred, or Next.js static export) with JS islands only
- [x] WhatsApp / call number everywhere: **0729585471**

---

## 1. Brand foundation

### Palette
- [x] Define near-black `#0A0A0A` as primary text/surface dark (not pure `#000`)
- [x] Define white as primary light surface
- [x] Define full greyscale tokens for cards, dividers, borders, disabled states
- [x] Strict B&W - no accent color; CTAs/prices/badges use black / white / grey only
- [x] Document palette rules in `src/styles/tokens.css`

### Typography
- [x] Load Inter as a single variable font file (`@fontsource-variable/inter`)
- [x] Limit to 2-3 weights site-wide (400 / 500 / 600)
- [x] Ban decorative / display fonts from the project
- [x] Set type scale (hero, H1-H3, body, small, price) on the greyscale system

### Logo & assets
- [x] Place logo in `public/images/` (jpg + png); WebP/AVIF optimization later with image pipeline
- [x] Generate favicon + apple-touch-icon from logo
- [ ] Define logo clear-space and light/dark usage rules (when header lands)

---

## 2. Technical foundation (speed-first)

### Scaffold
- [ ] Initialize Astro (or Next.js static-export) project in repo
- [ ] Configure TypeScript, linting, formatting
- [ ] Set up folder structure: `layouts`, `pages`, `components`, `islands`, `styles`, `content`, `public`
- [ ] Establish design tokens as CSS variables (color, type, spacing, radius)

### Islands (hydrate only these)
- [ ] Cart island
- [ ] Product configurator island (storage + color/finish)
- [ ] Trade-in form island
- [ ] Confirm all other pages ship minimal / no client JS by default

### Media & delivery
- [x] Image pipeline: WebP/AVIF, responsive `srcset`/`sizes`
- [x] Lazy-load all below-the-fold images
- [x] Eager-load only LCP hero assets
- [x] CDN hosting setup (Vercel / Netlify / Cloudflare Pages)
- [x] Confirm Kenya-friendly edge delivery

### Analytics & fonts
- [x] Add **one** lightweight analytics tool only
- [x] Self-host or optimally load Inter variable font; preload critical face
- [x] No extra tracking pixels / tag managers in Phase 1

### Contact constants
- [ ] Centralize shop phone/WhatsApp as `0729585471` (single config source)
- [ ] Build WhatsApp deep-link helper (`wa.me` / `api.whatsapp.com` with prefilled text)

---

## 3. Global chrome (every page)

### Header / navbar (final sitemap)
- [ ] Home
- [ ] Shop (mega-menu)
- [ ] Deals
- [ ] Trade-In
- [ ] Lipa Mdogo Mdogo (Financing)
- [ ] Blog
- [ ] Support
- [ ] About
- [ ] Contact
- [ ] Cart icon
- [ ] Account icon
- [ ] WhatsApp icon in header → `0729585471`

### Shop mega-menu
- [ ] iPhone
- [ ] Mac
- [ ] iPad
- [ ] Watch
- [ ] AirPods
- [ ] TV & Home
- [ ] Accessories
- [ ] Mobile-friendly mega-menu / drawer behavior
- [ ] Confirm **no** Refurbished / Used item in menu

### Persistent WhatsApp
- [x] Floating WhatsApp button site-wide → `0729585471`
- [x] Accessible label; does not block primary CTAs on mobile

### Footer
- [x] Location / store address block
- [x] WhatsApp + call: `0729585471`
- [x] Social links
- [x] Newsletter signup
- [x] Policy links (privacy, terms, warranty, shipping/returns as applicable)
- [x] Sitemap echoes of key nav items

---

## 4. Homepage (section order - build in this order)

1. [ ] **Hero** - current flagship, one line of original copy, price, **Shop Now** + **Trade In & Save**
2. [ ] **Category tile strip** - one tap to each top-level category
3. [ ] **Deals row** - bestsellers + promos, horizontal scroll
4. [ ] **Trade-In banner** - iPhone or Samsung toward any new device
5. [ ] **Lipa Mdogo Mdogo strip** - plain-language installments → financing page
6. [ ] **Trust row** - warranty, authenticity, reviews
7. [ ] **Blog teaser** - 2-3 latest posts
8. [x] **Footer** - as above

### Homepage QA
- [ ] First viewport: brand-strong, not a dashboard of widgets
- [ ] Accent used only on CTAs/prices/badges
- [ ] LCP / mobile layout verified

---

## 5. Category / Shop pages

- [ ] Category landing for each mega-menu node
- [ ] Product cards: image, name, from-price, optional badge (Deal / New) - accent on price/badge only
- [ ] Filters appropriate to new-only catalog (storage, color where useful) - **no condition filter**
- [ ] Empty states and “coming soon” for unpopulated categories
- [ ] Deals page listing promos / bestsellers

---

## 6. Product pages - two-page pattern per model

### Overview page
- [ ] Hero with product imagery
- [ ] Storage selector
- [ ] Color / finish selector
- [ ] Live price tied to configuration
- [ ] Highlights strip (4-6 icon + stat tiles)
- [ ] Chip / performance story section
- [ ] Display story section
- [ ] Battery story section (large-number stat callout)
- [ ] What comes preinstalled (built-in apps list)
- [ ] Color / finish gallery
- [ ] Closing buy module: **Add to Cart**, **WhatsApp Order** (`0729585471`), inline **trade in toward this**
- [ ] Sticky buy bar on scroll (same actions)
- [ ] Confirm **no condition field** on Overview

### Tech Specs page
- [ ] Finish
- [ ] Chip
- [ ] Memory
- [ ] Storage
- [ ] Display
- [ ] Battery and Power
- [ ] Ports / Connectivity
- [ ] Camera
- [ ] Audio
- [ ] Wireless
- [ ] Operating System
- [ ] Built-in Apps
- [ ] Accessibility
- [ ] Size and Weight
- [ ] In the Box
- [ ] Warranty and Service (**GadgetHub’s own terms**, not Apple’s)
- [ ] Confirm **no condition field** on Specs
- [ ] Clear nav between Overview ↔ Tech Specs for the same model

### Buy / WhatsApp order
- [ ] WhatsApp Order message includes model, storage, color, price
- [ ] Trade-in CTA links into Trade-In flow with context when possible

---

## 7. Trade-In flow

- [ ] Trade-In page with short form:
 - [ ] Device brand (iPhone / Samsung)
 - [ ] Model
 - [ ] Storage
 - [ ] Condition of **trade-in device** (not the device being purchased)
- [ ] On submit: compile message → redirect to WhatsApp `0729585471` with prefilled quote request
- [ ] Copy clarifies: credit toward **any new** device in catalog
- [ ] No used/refurbished products listed as inventory from this flow

---

## 8. Lipa Mdogo Mdogo (Financing)

- [ ] Standalone financing page with plain-language installment explainer
- [ ] Link from homepage strip and main nav
- [ ] Clear CTAs to Shop / Contact / WhatsApp `0729585471` for application help
- [ ] Avoid dense legal walls on the marketing surface; link to terms if needed

---

## 9. Content pages

### Blog
- [x] Blog index
- [x] Post template
- [x] Homepage teaser wired to latest 2-3 posts (static or content collection)

### Support
- [x] Support landing (FAQs, warranty help, how to reach shop)
- [x] Paths to WhatsApp / call `0729585471`

### About
- [x] About page (brand story, new-only positioning, Nairobi/Kenya context as available)

### Contact
- [x] Contact page with call + WhatsApp `0729585471`
- [x] Location / map or address
- [x] Optional short contact form (or WhatsApp-first if preferred)

### Policies (footer)
- [x] Privacy (stub page live; full copy TBD)
- [x] Terms (stub page live; full copy TBD)
- [x] Warranty & service (GadgetHub terms) - stub at `/warranty-repairs`
- [x] Shipping / returns / Lipa terms as needed - stubs at `/shipping-delivery`, `/returns`

---

## 10. Cart & Account

### Cart
- [ ] Add / update quantity / remove
- [ ] Persist cart (localStorage or equivalent)
- [ ] Cart drawer or page
- [ ] Checkout path for Phase 1 (WhatsApp order handoff and/or placeholder checkout - decide and implement consistently)
- [ ] Line items show configured storage/color; never condition

### Account
- [ ] Account icon in header
- [ ] Phase 1 shell: login placeholder or “coming soon” / simple account page (decide before build)
- [ ] Do not block cart or WhatsApp purchase paths on Account

---

## 11. Cross-cutting QA & launch readiness

### Product rules
- [ ] Full-site search for “Refurbished”, “Used”, condition grades on sale pages - must be absent
- [ ] Configurators: storage + color/finish only

### Contact consistency
- [ ] Header WhatsApp, FAB, footer, Contact, Trade-In, Product WhatsApp Order all use `0729585471`

### Performance
- [x] Lighthouse (or equivalent) on Home, Category, Product Overview, Trade-In - see `PERFORMANCE.md`
- [x] Confirm islands-only JS on interactive surfaces
- [x] Font / image / CDN caching verified in build + deploy config
- [x] Verify minimal JS payload on static pages
- [x] Fonts: single variable file, limited weights (latin + latin-ext)
- [x] Images: modern formats + lazy-load below fold

### Responsive / a11y
- [x] Mobile nav + mega-menu
- [x] Sticky buy bar does not collide with WhatsApp FAB
- [x] Keyboard / focus states on CTAs and form controls
- [x] Sufficient contrast on greyscale + accent

### Launch checklist
- [x] All sitemap routes return real pages (no dead nav links)
- [x] 404 page
- [x] SEO basics: titles, meta descriptions, OG tags, canonical
- [x] Sitemap.xml + robots.txt
- [ ] Production deploy on chosen CDN host

---

## 12. Phase 2 handoff gate (after Phase 1 templates exist)

Do **not** start full catalog until Phase 1 templates are done. Then:

- [ ] Confirm Overview + Specs templates ready for content injection
- [ ] Pilot content slots for:
 - [ ] iPhone flagship (brief named iPhone 18 Pro - confirm real SKU/name at content time)
 - [ ] MacBook Pro 14"
 - [ ] iPad Pro
- [ ] Specs, original copy, and imagery checklist per pilot SKU
- [ ] Only then roll out remaining catalog categories

---

## Suggested build order

1. Tokens + typography + logo  
2. Astro/static scaffold + contact constants (`0729585471`)  
3. Layout (header, mega-menu, footer, WhatsApp FAB)  
4. Homepage sections in listed order  
5. Category + Deals shells  
6. Product Overview + Specs templates + configurator/buy islands  
7. Trade-In → WhatsApp flow  
8. Lipa Mdogo Mdogo, Blog, Support, About, Contact, policies  
9. Cart (+ Account shell)  
10. Performance / QA / deploy  
11. Phase 2 pilot content  

---

*This list is the Phase 1 definition of done: brand system, sitemap/chrome, homepage, product templates, trade-in, financing entry, supporting pages, and speed-first technical foundation - reflecting new-only inventory.*
