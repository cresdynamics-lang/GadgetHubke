# Product page SEO copy

The copy for one model is in one file:
- [iphone-18-pro-max.md](iphone-18-pro-max.md): 256GB, 512GB, 1TB
- [iphone-18-pro.md](iphone-18-pro.md): 256GB, 512GB
- [iphone-duo.md](iphone-duo.md): 256GB, 512GB, 1TB

The iPhone Air is grouped with the 18 series on the site but isn't for sale right now, because it has no listed price. It has no copy here yet.

All prices, SKUs, colours and specs come from the live site as of 22 November 2026. If a price changes in admin, update the opening paragraph, meta description, FAQ, feed title and description, and schema for that page.

## Pattern notes

**How each file is laid out**
1. **Part A, the model page** (`/iphone/<model>`), with all 17 sections. This page ranks for the broad searches: "[model] price in Kenya", "[model] Nairobi", "[model] vs [previous]", "is [model] worth it". It lists every storage and price.
2. **Part B, the storage pages** (`/iphone/<model>/<size>`). Each page gets its own:
   - title, meta, slug and H1;
   - opening paragraph;
   - "Who this size is for" section;
   - 4 storage-specific FAQs;
   - feed title and feed description;
   - single-variant schema.

   The specs table, box contents, delivery and returns summary are shared with Part A. These pages rank for "[model] 256GB", "[model] 512GB price" and "[model] 1TB Kenya". Each feed item also needs its own unique title and description.

**Rules applied on every page**
- **Facts.** Use only what's on the site or in the input. Gaps are listed at the top of each file, not filled in. For example, the Duo's weight and water rating aren't on file.
- **Keyword placement.**
  - The primary keyword appears in the title, meta description, H1 and the first sentence.
  - Storage keywords appear in the storage-page title, H1 and first sentence.
- **The first sentence answers the search.** It gives the product name, its price in KES and the fact that it's at GadgetHub.
- **Each feature is a spec plus what it means in Kenya**: the matatu commute, match day, events, upcountry trips, M-Pesa.
- **Trust lines are only the ones you supplied**: Apple Authorised Reseller, over a million customers, 1-year warranty, serial number on the invoice. There are no "best" or "cheapest" claims.
- **Comparisons use the previous model's numbers from our own spec pages**, plus our live New and Ex-UK prices for it.
- **Delivery wording.** Use the shipping page's exact terms: "may be available" for same-day, "from KES 1,500", and courier timelines quoted on WhatsApp. No towns are named until you confirm which ones.
- **Instalments** use the site's 6-month Lipa Mdogo Mdogo example: the deposit, then the monthly amount.
- **Length limits.**
  - Title: under 60 characters.
  - Meta description: under 155 characters.
  - Opening paragraph: 60–90 words.
  - Description: 400–700 words.
  - Feed title: 80–150 characters.
  - Feed description: 800–1,500 characters, plain and with no promotional wording.
- **Schema.**
  - The model page uses a `ProductGroup`, with one `Product` per storage.
  - Each storage page uses a single `Product`.
  - Both use the site SKU (IP-0xx), price in KES, `InStock` and `NewCondition`.

**Adapting the pattern to other products**
- **Mac:** replace Camera with "Processor and memory" and add a "Ports" row.
- **AirPods:** replace Camera with "Sound and noise cancellation", and Display with "Fit and comfort".
- **iPad:** keep Camera short and add "Apple Pencil and keyboard support".
- **Ex-UK or Slightly used:**
  - Change the condition wording: Ex-UK condition and warranty are stated on the invoice.
  - Use `UsedCondition` in the schema.
  - Never say "sealed".

**Before publishing, confirm**
- the SIM setup per model (nano-SIM plus eSIM, or eSIM only) and whether to say "unlocked";
- whether card payments are live, because they're left out for now;
- which delivery towns and timelines to name;
- GTINs, if you want them in the feed and schema;
- the line about the Japanese and Chinese communities, because it's written as "Nairobi's Japanese and Chinese communities" and needs your approval.
