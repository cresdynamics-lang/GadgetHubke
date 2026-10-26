/**
 * Public Journal posts (formerly Blog).
 * Seeds ship in-repo; edits from /management/journal persist via admin KV.
 */
import { kvGetJson, kvSetJson } from "./admin/kv";
import { livePricedCatalog, iphoneLiveId, type PricedProduct } from "./pricing/live";
import { journalGuidePosts } from "./journal-guides";
import { journalSearchGuidePosts } from "./journal-search-guides";
import { journalStoreGuidePosts } from "./journal-store-guides";
import { journalHowToGuidePosts } from "./journal-howto-guides";

export type JournalStatus = "published" | "scheduled" | "review" | "draft";

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  tags: string[];
  author: string;
  status: JournalStatus;
  /** ISO date for published / scheduled */
  date: string;
  dateLabel: string;
  views: number;
  coverAlt?: string;
  coverUrl?: string;
  /** Paragraphs; one starting with "## " renders as a subheading. */
  paragraphs: string[];
  /** Questions shown under the article and sent to Google as FAQ data. */
  faq?: { q: string; a: string }[];
  needsReview?: boolean;
  updatedAt?: string;
};

const REDIS_KEY = "gh:journal:v1";

/** Safe in-article links: `[label](/relative-path)`. */
export type JournalInline =
  | { type: "text"; value: string }
  | { type: "link"; href: string; label: string };

export function parseJournalParagraph(text: string): JournalInline[] {
  const parts: JournalInline[] = [];
  const re = /\[([^\]]+)\]\((\/[a-zA-Z0-9/?#._\-]*)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    parts.push({ type: "link", href: match[2], label: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts.length ? parts : [{ type: "text", value: text }];
}

function formatDateLabel(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Nairobi",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Seed posts: existing blog content + PDF sample rows */
export const journalSeedPosts: JournalPost[] = [
  {
    id: "j-iphone-16-price-kenya",
    slug: "iphone-16-price-in-kenya",
    title: "iPhone 16 Price in Kenya 2026: iPhone 16, 16 Plus, 16e, 16 Pro and 16 Pro Max Prices in Nairobi, New and Ex-UK",
    excerpt:
      "What Kenyans actually search: iPhone 16 price in Kenya, 128GB vs 256GB, Pro vs Pro Max — with Gadget Hub Nairobi prices and product links.",
    seoTitle: "iPhone 16 Price in Kenya 2026 | iPhone 16, 16 Plus, 16e, 16 Pro & 16 Pro Max Prices in Nairobi | New & Ex-UK | Gadget Hub",
    seoDescription:
      "iPhone 16 price in Kenya from {{price:iphone-16}} at Gadget Hub, Norwich Union House. Compare 16, 16e, Plus, Pro and Pro Max. Pay with M-Pesa STK or Lipa Mdogo Mdogo.",
    category: "Buying guides",
    tags: ["iPhone 16", "iPhone 16 price in Kenya", "Nairobi", "iPhone 16 Pro Max"],
    author: "GadgetHub",
    status: "published",
    date: "2026-10-23",
    dateLabel: "23 Oct 2026",
    views: 86,
    coverAlt: "iPhone 16 lineup",
    paragraphs: [
      "If you typed “iPhone 16 price in Kenya”, “iPhone 16 128GB Nairobi”, “buy iPhone 16 original Kenya”, or “iPhone 16 Pro Max how much”, you are not looking for a rumour thread. You want a sealed phone, a Kenyan shilling figure you can trust, and a shop you can walk into on Nairobi’s CBD. That is what this page is for. Gadget Hub sells new Apple devices at Norwich Union House, Suite 15, 4th Floor. Below are the starting prices we publish on the site today, then the storage, Pro vs non-Pro, and payment questions people actually send on WhatsApp.",
      "Start with the standard [iPhone 16](/iphone/iphone-16). In our shop it begins at {{price:iphone-16:128}} for 128GB, {{price:iphone-16:256}} for 256GB, and {{price:iphone-16:512}} for 512GB. Those three SKUs cover most Nairobi buyers. Open that page, pick storage and colour, and you can pay from the site with M-Pesa STK Push — no screenshot of a till number, no “pay the rider”.",
      "“iPhone 16 128GB vs 256GB Kenya” is the next most common follow-up, and the answer is practical rather than technical. Choose 128GB if you stream Netflix and YouTube, offload photos to iCloud or Google Photos, and clear WhatsApp every few months. Choose 256GB if you shoot 4K, keep years of chat media, download maps for upcountry trips, or use the phone as a work camera. Choose 512GB if the phone is also your archive. In Kenya, 256GB is the SKU people regret not buying when status videos and client work pile up. The step from 128GB to 256GB on 16 is {{price:iphone-16:256}} against {{price:iphone-16:128}} here — cheaper than a storage panic a year later.",
      "People also search “iPhone 16e price Kenya” when they want a 16-generation chip, USB-C, and Apple updates without paying Pro money. The [iPhone 16e](/iphone/iphone-16e) starts at {{price:iphone-16e:128}} (128GB), then {{price:iphone-16e:256}} (256GB) and {{price:iphone-16e:512}} (512GB). If your budget sits under a lakh and you still want a current-shape iPhone, 16e is the result that should land on our shop — not a grey-market listing with no invoice.",
      "Bigger screen searches (“iPhone 16 Plus Kenya”, “iPhone 16 Plus 128GB price”) map to the [iPhone 16 Plus](/iphone/iphone-16-plus): from {{price:iphone-16-plus:128}} (128GB), {{price:iphone-16-plus:256}} (256GB), {{price:iphone-16-plus:512}} (512GB). Plus is the phone for video, maps, and split WhatsApp + Safari. If your query was “is Plus worth it over 16”, the honest Nairobi answer is: yes if you hate a small canvas and read a lot on the phone; no if you want the same cameras in a pocket that fits a matatu seat.",
      "Pro searches are a different intent. “iPhone 16 Pro price Kenya” and “iPhone 16 Pro 256GB Nairobi” should go to the [iPhone 16 Pro](/iphone/iphone-16-pro): from {{price:iphone-16-pro:128}} (128GB), {{price:iphone-16-pro:256}} (256GB), {{price:iphone-16-pro:512}} (512GB), {{price:iphone-16-pro:1tb}} (1TB). “iPhone 16 Pro Max price in Kenya” is the [iPhone 16 Pro Max](/iphone/iphone-16-pro-max): from {{price:iphone-16-pro-max:256}} (256GB — there is no 128GB Pro Max), {{price:iphone-16-pro-max:512}} (512GB), {{price:iphone-16-pro-max:1tb}} (1TB). Pro and Pro Max are the telephoto, the brighter display, and the phone you keep five years. If you already know you want Pro Max, skip the comparison posts and open that page.",
      "A word on “original iPhone 16 Kenya” and “ex UK iPhone 16 price”. Gadget Hub is an Apple Authorised Reseller and sells both: sealed new with a one-year warranty, or Ex-UK (UK-used) from {{exuk:iphone-16}} — switch the toggle on the [iPhone 16](/iphone/iphone-16) page to see every Ex-UK price. Either way you get a Gadget Hub invoice. If a Facebook ad is far under our prices and asks you to send money to a personal M-Pesa, that is not a deal — that is the risk you came here to avoid. Confirm the model on our page, pay on gadgethubke.com, collect at Norwich Union House or wait for confirmed Nairobi delivery.",
      "Dual SIM in Kenya: current iPhones use eSIM plus physical nano-SIM, which is how most Nairobi buyers run Safaricom and Airtel together. If your search was “iPhone 16 dual SIM Kenya”, you do not need a special SKU — you need a sealed unit and a shop that can help you scan the eSIM QR after pickup. Ask at the counter; we can set the phone up before you leave (fee confirmed when you engage).",
      "Kenya traffic also asks “iPhone 16 vs iPhone 16 Pro” and “should I buy Pro Max or save for 17”. If you are still deciding between generations, read [iPhone 17 vs iPhone 16 in Kenya](/journal/iphone-17-vs-iphone-16-kenya). If you are weighing last year’s 15, use [iPhone 15 vs iPhone 16](/journal/iphone-15-or-iphone-16). If the search was simply “cheapest iPhone in Nairobi”, go to [the budget iPhone guide](/journal/cheapest-iphone-in-kenya) — 16 is not the cheapest sealed iPhone we sell.",
      "How to buy once the price looks right: add the storage you want on the product page, go to [checkout](/checkout), and pay with M-Pesa. We prompt your phone; you enter PIN; funds settle to Gadget Hub. Pickup is at Norwich Union House, Suite 15, 4th Floor. Nairobi delivery is confirmed after payment. If cash-up-front is tight, [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo) is in-house — deposit and schedule with us, not a third-party app. Have an old iPhone or Samsung? Start [trade-in](/trade-in) so the 16 price is net of credit.",
      "Quick answers we get every week. What is the iPhone 16 price in Kenya at Gadget Hub? From {{price:iphone-16:128}} for sealed 128GB. Is 16 still worth buying with 17 in stock? Yes, if 99k is the budget — see the 17 vs 16 guide. Do you sell on Jumia only? No — buy on this site or walk in. Can I pay in instalments? Yes, Lipa Mdogo Mdogo. Do prices include VAT? Displayed shop prices include VAT where VAT applies.",
      "Prices move with stock. The numbers above match the live shop today; always confirm on the model page before you pay. Browse the full [iPhone lineup](/iphone), or WhatsApp 0729 585 471 with the exact search you typed (“16 Pro 256 desert titanium”) and we will send the matching sealed unit.",
    ],
  },
  {
    id: "j-iphone-17-vs-16",
    slug: "iphone-17-vs-iphone-16-kenya",
    title: "iPhone 17 vs iPhone 16 in Kenya 2026: Price Difference, Camera, Battery and Which iPhone to Buy in Nairobi",
    excerpt:
      "The comparison Kenyans search after every launch — 17 vs 16, 17 Pro vs 16 Pro, and whether to wait, with Nairobi prices.",
    seoTitle: "iPhone 17 vs iPhone 16 in Kenya 2026 | Price Difference, Camera, Battery & Which to Buy | 17 Pro vs 16 Pro | Gadget Hub Nairobi",
    seoDescription:
      "Compare iPhone 17 and iPhone 16 in Kenya. 16 from {{price:iphone-16}}, 17 from {{price:iphone-17}}. Pro and Pro Max prices, who should upgrade, buy in Nairobi at Gadget Hub.",
    category: "Buying guides",
    tags: ["iPhone 17", "iPhone 16", "iPhone 17 vs 16", "Kenya"],
    author: "GadgetHub",
    status: "published",
    date: "2026-10-23",
    dateLabel: "23 Oct 2026",
    views: 64,
    coverAlt: "iPhone 17 and iPhone 16",
    paragraphs: [
      "“iPhone 17 vs iPhone 16”, “is iPhone 17 worth it in Kenya”, “iPhone 17 price in Kenya”, “should I skip 16 for 17” — those queries spike the week a new Apple event lands, then they stay for a year while Nairobi buyers wait for a salary, a trade-in, or Lipa approval. This guide is written for people who will pay in shillings, pick up in town, and keep the phone through two more iOS cycles. We stock both generations as new, sealed units. You can open the [iPhone 16](/iphone/iphone-16) or the [iPhone 17](/iphone/iphone-17) and buy from the same checkout.",
      "Price is the first filter, and it should be. Standard [iPhone 16](/iphone/iphone-16) starts at {{price:iphone-16:128}} (128GB). Standard [iPhone 17](/iphone/iphone-17) starts at {{price:iphone-17:256}} (256GB) and {{price:iphone-17:512}} (512GB) — 17 begins at 256GB, there is no 128GB 17. That gap is not small. If your search was “iPhone 16 128GB Kenya” because {{price:iphone-17}}k is the ceiling, 17 is not the answer — 16 (or [16e from {{price:iphone-16e}}](/iphone/iphone-16e)) is. If your search was “latest iPhone Kenya” or “buy iPhone 17 Nairobi” and 256GB is already in the budget, 17 is the cleaner long-term buy.",
      "What you actually feel day to day: both take excellent daylight photos, both have USB-C, both run current iOS. 17 is the one to choose if you specifically searched “best iPhone camera Kenya 2026”, shoot a lot of low-light video, or want the newest photographic styles for client work. 16 is enough if you mainly need a sharp camera for WhatsApp status, school, church, and travel. Do not upgrade 16 → 17 for a spec-sheet megapixel unless you feel the limit every week. The software features you use (iMessage, WhatsApp, Maps, Safari) work on both.",
      "Battery and heat in Nairobi traffic: both generations are fine for a full day of maps plus calls if you are not gaming. If your complaint on an old 11 or 12 is “dead by 4pm”, either 16 or 17 is the upgrade. If you already have 15 or 16 and battery is healthy, 17 will not feel like a new phone in that one dimension. Charge with a proper USB-C brick; cheap stalls on Tom Mboya Street are why people think “iPhones die fast in Kenya”.",
      "Pro line searches (“iPhone 17 Pro vs 16 Pro Kenya”, “17 Pro Max price Nairobi”, “iPhone 17 Pro Max 256GB”) are where the money actually moves. [iPhone 16 Pro](/iphone/iphone-16-pro) from {{price:iphone-16-pro}}; [iPhone 16 Pro Max](/iphone/iphone-16-pro-max) from {{price:iphone-16-pro-max}}. [iPhone 17 Pro](/iphone/iphone-17-pro) from {{price:iphone-17-pro:256}} (256GB); [iPhone 17 Pro Max](/iphone/iphone-17-pro-max) from {{price:iphone-17-pro-max:256}} (256GB), {{price:iphone-17-pro-max:512}} (512GB), {{price:iphone-17-pro-max:1tb}} (1TB), {{price:iphone-17-pro-max:2tb}} (2TB). If you already decided Pro Max, buy the generation you can pay for this month. Waiting six months “for a deal” in Kenya usually means you keep using a cracked 13 while prices on the new one barely move.",
      "There is also “iPhone 17e vs iPhone 16” and “iPhone Air Kenya”. [iPhone 17e](/iphone/iphone-17e) starts at {{price:iphone-17e:256}} (256GB). [iPhone Air](/iphone/iphone-air) starts at {{price:iphone-air:256}} (256GB). Those pages exist because people search the names Apple put on the box. 17e is the value 17; Air is the thin one. Neither replaces Pro Max. If you landed here from a “which iPhone in 2026” roundup, pick a family first (e / standard / Pro / Air), then a generation, then storage.",
      "Upgrade rule we use at the counter. Coming from iPhone 11, 12 or 13 — either 16 or 17 is a real jump: USB-C, a modern chip, a camera that does not look dated, and years of updates. Coming from 14 — 16 is the value move; 17 if you want the newest. Coming from 15 or 16 — only move to 17 if you have a feature you can name (camera, display, storage, or you simply want the latest). Coming from Android — start on [trade-in](/trade-in) so the Kenya price is net of your Samsung credit, then choose 16 for budget or 17 if the extra is comfortable.",
      "Should you wait for the next launch? Search interest always jumps around rumours of iPhone 18. If you do not have a working phone this week, waiting is how Nairobi buyers lose another six months on a dying battery. If your 16 Pro Max is fine and you are only shopping out of FOMO, keep the money. If you are on 11–13 and you have the cash or a Lipa plan, buy 16 or 17 now and stop refreshing Twitter.",
      "How to buy: open the model, pick storage, pay M-Pesa STK on [checkout](/checkout). Lipa Mdogo Mdogo is in-house on [the Lipa page](/lipa-mdogo-mdogo). Pickup at Norwich Union House, Suite 15. See every model on [iPhone](/iphone). For the exact 16 shilling breakdown (128 / 256 / 512 and Pro Max), read [iPhone 16 price in Kenya](/journal/iphone-16-price-in-kenya). Still comparing last year? [iPhone 15 vs iPhone 16](/journal/iphone-15-or-iphone-16). WhatsApp 0729 585 471 with your current phone and budget and we will answer in one line.",
    ],
  },
  {
    id: "j-cheapest-iphone-kenya",
    slug: "cheapest-iphone-in-kenya",
    title: "Cheapest iPhone in Kenya 2026: Affordable iPhone Prices in Nairobi from iPhone 11, 12 and 13, New and Ex-UK",
    excerpt:
      "“Cheapest iPhone in Kenya”, “iPhone 11 price Nairobi”, “iPhone 13 128GB” — sealed stock from {{price:iphone-11}}, with links to buy.",
    seoTitle: "Cheapest iPhone in Kenya 2026 | Affordable iPhones from {{exuk:iphone-11}} | iPhone 11, 12, 13 Ex-UK & New Prices in Nairobi | Gadget Hub",
    seoDescription:
      "Cheapest new iPhone in Kenya: iPhone 11 from {{price:iphone-11}} at Gadget Hub Nairobi. Compare 12, 13, 14, 15 and 16e prices. M-Pesa and Lipa Mdogo Mdogo.",
    category: "Buying guides",
    tags: ["cheapest iPhone Kenya", "iPhone 11", "iPhone 13", "Nairobi"],
    author: "GadgetHub",
    status: "published",
    date: "2026-10-23",
    dateLabel: "23 Oct 2026",
    views: 71,
    coverAlt: "Affordable iPhones in Nairobi",
    paragraphs: [
      "Kenya search is blunt: “cheapest iPhone in Kenya”, “cheapest iPhone in Nairobi”, “iPhone 11 price in Nairobi”, “iPhone 12 64GB how much”, “iPhone 13 128GB original”, “iPhone for students Kenya”. Those queries are not looking for a 17 Pro Max. They want a genuine Apple phone that still gets apps, still takes a decent photo, and still has a shop behind the listing. Gadget Hub only sells new sealed devices on this website — the cheap ads you see with “UK used, slight shadow, Face ID 100%” are a different market. If you want sealed + invoice + warranty path, start here.",
      "First, decode the word cheap. On Jumia, Facebook, and WhatsApp groups, “cheap iPhone Kenya” often means a used import with a battery at 78% and a story. On this site it means the lowest sealed new price we will put on an invoice. That number will always be higher than a used 11 from Ngara. It will also still work in two years. If your budget is under KES 30,000, a new iPhone is not honest — talk to us about accessories or wait. From the mid-30s upward, we have sealed stock.",
      "The lowest sealed full-size iPhone on our floor is the [iPhone 11](/iphone/iphone-11), from {{price:iphone-11:64}} (64GB), {{price:iphone-11:128}} (128GB), {{price:iphone-11:256}} (256GB). That is the phone people mean when they search “first iPhone Kenya”, “iPhone for mum Nairobi”, or “iPhone 11 original price”. It does not do 5G. It still does iMessage, WhatsApp, maps, and years of iOS that a random Android at the same price will not match. [iPhone 11 Pro](/iphone/iphone-11-pro) from {{price:iphone-11-pro}} and [iPhone 11 Pro Max](/iphone/iphone-11-pro-max) from {{price:iphone-11-pro-max}} if you want the older Pro cameras without a 16 Pro bill. 64GB fills up if the owner shoots video; 128GB is the 11 we recommend for a parent.",
      "Next band — “iPhone 12 price Kenya”, “iPhone 12 mini Nairobi”, “iPhone 12 64GB original”: [iPhone 12 mini](/iphone/iphone-12-mini) from {{price:iphone-12-mini}} (the smallest sealed price in the shop), [iPhone 12](/iphone/iphone-12) from {{price:iphone-12}} [iPhone 12 Pro](/iphone/iphone-12-pro) from {{price:iphone-12-pro}} [iPhone 12 Pro Max](/iphone/iphone-12-pro-max) from {{price:iphone-12-pro-max}}. 12 is the first 5G iPhone in this list. If Safaricom 5G is a real reason you searched, do not buy 11. Mini is the pocket phone; Pro Max 12 is still a serious camera for the money.",
      "“iPhone 13 128GB Kenya” is one of the stickiest local keywords, and for good reason. [iPhone 13](/iphone/iphone-13) from {{price:iphone-13:128}} (128GB), {{price:iphone-13:256}} (256GB), {{price:iphone-13:512}} (512GB). Mini from {{price:iphone-13}}. [iPhone 13 Pro](/iphone/iphone-13-pro) from {{price:iphone-13-pro}}. [iPhone 13 Pro Max](/iphone/iphone-13-pro-max) from {{price:iphone-13-pro-max}}. 13 is the sweet spot we recommend when someone says “I don’t want the oldest, I don’t want 100k”. Battery, cameras, and app support are still comfortable in 2026. If you can stretch from 11 money to 13 money, do it.",
      "One step up: “iPhone 14 price Kenya” and “iPhone 14 Plus Nairobi”. [iPhone 14](/iphone/iphone-14) from {{price:iphone-14:128}} (128GB), [iPhone 14 Plus](/iphone/iphone-14-plus) from {{price:iphone-14-plus}} [iPhone 14 Pro](/iphone/iphone-14-pro) from {{price:iphone-14-pro}} [iPhone 14 Pro Max](/iphone/iphone-14-pro-max) from {{price:iphone-14-pro-max}}. 14 is crash detection and a newer look without jumping to 15. It is not the cheapest in the shop; it is the cheapest Dynamic Island-adjacent generation before 15.",
      "If the search was “iPhone 15 price in Kenya cheap” or “iPhone 15 128GB Nairobi”, [iPhone 15](/iphone/iphone-15) starts at {{price:iphone-15:128}} (128GB) — USB-C, Dynamic Island, and the model you keep if 16’s extra is not in the budget. [iPhone 16e](/iphone/iphone-16e) from {{price:iphone-16e}} is often cheaper than people expect for a 16-generation phone, and it is the best “cheap current iPhone” we sell. Full 16 prices are in [the iPhone 16 Kenya price guide](/journal/iphone-16-price-in-kenya). Comparing 15 and 16 directly: [iPhone 15 vs iPhone 16](/journal/iphone-15-or-iphone-16).",
      "Who should buy which budget phone. Student / first iPhone: 11 128GB or 12 mini, then save. Parent who only WhatsApps: 11 128GB. Someone on Safaricom 5G: 12 or newer. Someone who hates charging twice a day: 13. Someone who wants USB-C so they share a laptop charger: 15 or 16e. Someone who said “cheapest” but actually has 100k: do not buy 11 — buy 16e or 16 and keep it four years.",
      "How to buy a cheap iPhone without getting a story: open the model, confirm storage, pay M-Pesa STK on [checkout](/checkout), collect at Norwich Union House, Suite 15 or arrange Nairobi delivery. Do not pay a personal number. [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo) can split a 13 or 15 if the cash price is the blocker. [Trade-in](/trade-in) an old Samsung so the cheapest iPhone is even cheaper net. See the whole [iPhone shop](/iphone). WhatsApp 0729 585 471 with your budget in shillings (“50k sealed”) and we will point at the exact SKU.",
    ],
  },
  {
    id: "j-iphone-15-or-16",
    slug: "iphone-15-or-iphone-16",
    title: "iPhone 15 vs iPhone 16 in Kenya 2026: Prices, Differences and Whether iPhone 15 Is Still Worth Buying in Nairobi",
    excerpt:
      "Still one of the most searched iPhone comparisons in Kenya — 15 vs 16, Plus vs Pro, with current Nairobi prices.",
    seoTitle: "iPhone 15 vs iPhone 16 in Kenya 2026 | Price, Differences & Is iPhone 15 Still Worth It | 15 Pro Max vs 16 Pro Max | Gadget Hub Nairobi",
    seoDescription:
      "iPhone 15 vs iPhone 16 in Kenya: 15 from {{price:iphone-15}}, 16 from {{price:iphone-16}}. Camera, battery, storage. Buy sealed in Nairobi at Gadget Hub, Norwich Union House.",
    category: "Buying guides",
    tags: ["iPhone 15", "iPhone 16", "iPhone 15 vs 16", "Kenya"],
    author: "GadgetHub",
    status: "published",
    date: "2026-10-23",
    dateLabel: "23 Oct 2026",
    views: 1204,
    coverAlt: "iPhone 15 and iPhone 16",
    paragraphs: [
      "“iPhone 15 vs iPhone 16”, “is iPhone 15 still worth it 2026”, “iPhone 15 128GB price Kenya”, “should I buy iPhone 15 or 16 in Nairobi” — this comparison did not die when 16 launched. In Kenya it is still the fork in the road for buyers who have about KES 80–120k, want USB-C (Lightning chargers are done), and do not want to overpay for Pro. Both phones are new and sealed at Gadget Hub. You can open [iPhone 15](/iphone/iphone-15) or [iPhone 16](/iphone/iphone-16) and pay with M-Pesa from the page.",
      "Price first, because that is what the search is. [iPhone 15](/iphone/iphone-15) starts at {{price:iphone-15:128}} (128GB), {{price:iphone-15:256}} (256GB), {{price:iphone-15:512}} (512GB). [iPhone 15 Plus](/iphone/iphone-15-plus) from {{price:iphone-15-plus:128}} (128GB). [iPhone 15 Pro](/iphone/iphone-15-pro) from {{price:iphone-15-pro}}. [iPhone 15 Pro Max](/iphone/iphone-15-pro-max) from {{price:iphone-15-pro-max}}. [iPhone 16](/iphone/iphone-16) starts at {{price:iphone-16:128}} (128GB), {{price:iphone-16:256}} (256GB), {{price:iphone-16:512}} (512GB). Compare the two 128GB prices above: the gap is small if you keep the phone four years, large if this is a one-year handset you will flip.",
      "What you actually feel in the hand: both have USB-C, Dynamic Island, and a chip that will run apps for years. 16 adds Camera Control and the newer-generation stack Apple will support longer. 15 is not a compromise phone; it is last year’s excellent phone at this year’s Kenya price. Action button lives on 15 Pro, not on standard 15 — if that is why you watched a YouTube comparison, you are comparing the wrong SKUs. Standard 15 vs standard 16 is USB-C vs USB-C, Island vs Island, with 16 a year newer.",
      "Buy 15 if you searched “iPhone 15 128GB Nairobi” because 82k is the number that fits, or if you are moving from Lightning (11–14) and USB-C is the whole point. Buy 16 if you searched “iPhone 16 128GB Kenya” and can clear 99k without stretching Lipa into pain. Buy [16e](/iphone/iphone-16e) from {{price:iphone-16e}} if you want 16-generation without paying the 16 tax — it undercuts 15 128GB in our shop on some days, which surprises people who only Googled “iPhone 15 vs 16”.",
      "Plus and Pro searches need their own links, because a “15 vs 16” thumbnail often mixes them. “iPhone 15 Plus vs 16 Plus”: [15 Plus](/iphone/iphone-15-plus) from {{price:iphone-15-plus}} versus [16 Plus](/iphone/iphone-16-plus) from {{price:iphone-16-plus}} — same logic as the small phones, bigger canvas for maps and video. “15 Pro vs 16 Pro Kenya”: [15 Pro](/iphone/iphone-15-pro) from {{price:iphone-15-pro}} versus [16 Pro](/iphone/iphone-16-pro) from {{price:iphone-16-pro}}. Depending on stock, 16 Pro can start close to, or even below, 15 Pro. That is why you should check live pages instead of a 2024 YouTube thumbnail. [15 Pro Max](/iphone/iphone-15-pro-max) from {{price:iphone-15-pro-max}} versus [16 Pro Max](/iphone/iphone-16-pro-max) from {{price:iphone-16-pro-max}}. If you want Pro, look at 16 Pro first.",
      "Cameras in real Nairobi light: both 15 and 16 take the photo you will send on WhatsApp. 16 is better if you shoot a lot of video or use Camera Control as a shutter. 15 is enough for school, church, travel, and status. Do not spend the extra 17k only because a reviewer said “computational photography”. Spend it if you will still own the phone in 2029 and want the newer base.",
      "Coming from an older iPhone. 11 or 12 → 15 or 16 is a huge jump (5G if you skip 11, USB-C, cameras, battery). 13 or 14 → 15 is the USB-C move; 16 if you can. Already on 15 → stay, unless you want Camera Control or a Pro. Already deciding against 17? Read [iPhone 17 vs iPhone 16](/journal/iphone-17-vs-iphone-16-kenya) before you pay; 17 starts at {{price:iphone-17:256}} for 256GB.",
      "How to buy: open [iPhone 15](/iphone/iphone-15) or [iPhone 16](/iphone/iphone-16), pick 128 or 256, pay M-Pesa on [checkout](/checkout), collect at Norwich Union House, Suite 15. Stretching every shilling? [Cheapest iPhone in Kenya](/journal/cheapest-iphone-in-kenya). Full 16 ladder including 16e, Plus, Pro, Pro Max: [iPhone 16 price in Kenya](/journal/iphone-16-price-in-kenya). Trade in on [trade-in](/trade-in), split payments on [Lipa Mdogo Mdogo](/lipa-mdogo-mdogo), or message 0729 585 471 with “15 or 16, 100k budget”.",
    ],
  },

  {
    id: "j-macbook-air-or-pro",
    slug: "macbook-air-or-macbook-pro",
    title: "MacBook Air or MacBook Pro in Kenya 2026: Which MacBook to Buy for Students, Work and Video Editing in Nairobi",
    seoTitle: "MacBook Air vs MacBook Pro in Kenya 2026 | Which MacBook to Buy for Students, Work & Editing | Prices in Nairobi | Gadget Hub",
    excerpt: "A practical guide to choosing between Air and Pro for school, work, and creative use.",
    category: "Buying guides",
    tags: ["Mac", "MacBook"],
    author: "GadgetHub",
    status: "published",
    date: "2026-09-28",
    dateLabel: "28 Sep 2026",
    views: 863,
    paragraphs: [
      "MacBook Air is the everyday pick for most people - light, quiet, and strong enough for browsing, docs, and light creative work.",
      "MacBook Pro earns its keep when you edit video, run heavier apps, or need more ports and sustained performance.",
      "Visit the Mac pages for current configurations we stock in Nairobi, or message the shop for a quick recommendation.",
    ],
  },
  {
    id: "j-android-trade-in-ready",
    slug: "android-phone-ready-for-trade-in",
    title: "How to Get Your Android Phone Ready for Trade-In in Nairobi: Samsung Backup, Reset and Getting the Best Value for an iPhone",
    seoTitle: "How to Prepare Your Android or Samsung Phone for Trade-In in Kenya | Back Up, Reset & Swap for an iPhone in Nairobi | Gadget Hub",
    excerpt: "Back up, remove accounts, and bring the right accessories so your quote goes smoothly.",
    category: "Trade-ins",
    tags: ["Trade-in", "Android"],
    author: "GadgetHub",
    status: "published",
    date: "2026-09-21",
    dateLabel: "21 Sep 2026",
    views: 541,
    paragraphs: [
      "Before you visit, back up photos and WhatsApp, then remove your Google account and any screen lock you can.",
      "We accept iPhone and Samsung for trade-in credit toward a new sealed device - not for resale on this site.",
      "Start the Trade-In form online, then finish the estimate on WhatsApp.",
    ],
  },
  {
    id: "j-ipad-setup",
    slug: "setting-up-your-new-ipad",
    title: "Setting Up Your New iPad in Ten Minutes: Apple ID, iCloud, Apple Pencil and Apps for Students and Work in Kenya",
    seoTitle: "How to Set Up a New iPad in Kenya | Apple ID, iCloud, Apple Pencil & Best Apps for Students and Work | Gadget Hub Nairobi",
    excerpt: "A short checklist for first boot, Apple ID, and essential settings.",
    category: "How-to",
    tags: ["iPad", "How-to"],
    author: "GadgetHub",
    status: "scheduled",
    date: "2026-10-12",
    dateLabel: "12 Oct 2026",
    views: 0,
    paragraphs: [
      "Power on, connect to Wi‑Fi, and sign in with your Apple ID - or create one if you are new to Apple.",
      "Update iPadOS, turn on Find My, and restore from a backup if you are moving from another iPad.",
      "Need a Magic Keyboard or Pencil? Browse Accessories after setup.",
    ],
  },
  {
    id: "j-lipa-guide",
    slug: "a-guide-to-lipa-mdogo-mdogo",
    title: "A Guide to Lipa Mdogo Mdogo: How to Buy an iPhone, MacBook or iPad on Instalments in Kenya",
    seoTitle: "Lipa Mdogo Mdogo iPhone Kenya | Buy iPhone, MacBook & iPad on Instalments in Nairobi | Deposit & Monthly Plan | Gadget Hub",
    excerpt: "How our in-house installment plans work - deposit, schedule, and what to expect.",
    category: "Lipa Mdogo Mdogo",
    tags: ["Lipa", "Financing"],
    author: "GadgetHub",
    status: "review",
    date: "",
    dateLabel: "-",
    views: 0,
    needsReview: true,
    paragraphs: [
      "Lipa Mdogo Mdogo is offered directly by Gadget Hub Investments - there is no third-party bank in the middle for these plans.",
      "You agree a deposit and schedule for a new sealed device, then pay over time with reminders from the shop.",
      "Eligibility depends on the device and a conversation with staff. Start on the Lipa page or WhatsApp.",
    ],
  },
  {
    id: "j-airpods-tips",
    slug: "getting-the-most-from-airpods-pro",
    title: "Getting the Most from AirPods Pro in Kenya: Noise Cancellation, Fit, Battery Tips and How to Spot Fake AirPods",
    seoTitle: "AirPods Pro Tips Kenya | Noise Cancellation, Fit, Battery & How to Spot Original vs Fake AirPods in Nairobi | Gadget Hub",
    excerpt: "Fit, ANC, and pairing tips for day-one owners.",
    category: "How-to",
    tags: ["AirPods", "How-to"],
    author: "GadgetHub",
    status: "draft",
    date: "",
    dateLabel: "-",
    views: 0,
    paragraphs: [
      "Try each ear tip size - a good seal is what makes noise cancellation work.",
      "Pair once from the case near your iPhone, then enable Automatic Ear Detection and Find My.",
      "Draft in progress - expand with shop-specific tips before publish.",
    ],
  },
  // Legacy blog slugs kept as published so old links still resolve after redirect
  {
    id: "j-how-trade-in-works",
    slug: "how-trade-in-works",
    title: "How iPhone Trade-In Works in Nairobi: Swap Your Old iPhone or Samsung for a New iPhone at Gadget Hub",
    seoTitle: "iPhone Trade-In Nairobi | Swap Your Old iPhone or Samsung for a New iPhone 17 or 18 in Kenya | How It Works | Gadget Hub",
    excerpt: "Bring your iPhone or Samsung, get credit toward any new device in stock.",
    category: "Trade-ins",
    tags: ["Trade-In", "Guide"],
    author: "GadgetHub",
    status: "published",
    date: "2026-09-20",
    dateLabel: "20 Sep 2026",
    views: 320,
    paragraphs: [
      "At GadgetHub, trade-in is a way to put value from your current phone toward a new, sealed device - not a way we sell used stock. We accept iPhone and Samsung only.",
      "Start on the Trade-In page: tell us the brand, model, storage, and condition. You’ll continue on WhatsApp so we can give an estimate. Final credit is set after we inspect the device in person at Norwich Union House, Suite 15.",
      "Credit applies toward any new product in our catalog - phones, Macs, iPads, and more. Devices with account locks or unclear ownership may be declined.",
      "Ready when you are: open Trade-In, or WhatsApp 0729 585 471 with photos and details.",
    ],
  },
  {
    id: "j-lipa-plain",
    slug: "lipa-mdogo-mdogo-plain-language",
    title: "Lipa Mdogo Mdogo in Plain Language: iPhone on Credit in Kenya, Deposits, Monthly Payments and What Happens If You Miss One",
    seoTitle: "iPhone on Credit in Kenya Explained | Lipa Mdogo Mdogo Deposit, Monthly Payments & Terms in Plain Language | Gadget Hub Nairobi",
    excerpt: "Pay in smaller amounts - plans are with us, not a third-party bank.",
    category: "Lipa Mdogo Mdogo",
    tags: ["Financing", "Lipa"],
    author: "GadgetHub",
    status: "published",
    date: "2026-09-18",
    dateLabel: "18 Sep 2026",
    views: 410,
    paragraphs: [
      "Lipa Mdogo Mdogo is our in-house installment plan. Gadget Hub Investments offers it directly - there is no external bank or financer in the middle for these plans.",
      "You choose a new device, we agree a deposit and schedule that fits, and you pay over time. Corporate and bulk orders can be settled by a separate agreement.",
      "Stock and eligibility depend on the device and your conversation with the shop. The best next step is WhatsApp or a visit so we can walk through options for the model you want.",
      "Read more on the Lipa Mdogo Mdogo page, then message us to apply.",
    ],
  },
  {
    id: "j-why-new",
    slug: "new-and-ex-uk-apple-devices",
    title: "New or Ex-UK iPhone in Kenya: What Ex-UK Means, Price Difference and How Gadget Hub Sells Both in Nairobi",
    excerpt: "Apple Authorised Reseller in Nairobi: sealed new stock with a 1-year warranty, or Ex-UK (UK-used) to save — both with an invoice.",
    seoTitle: "New vs Ex-UK iPhone in Kenya | What Ex-UK Means, Price Difference & Warranty | Ex-UK iPhone, MacBook & iPad Prices Nairobi | Gadget Hub",
    seoDescription:
      "Gadget Hub, an Apple Authorised Reseller in Nairobi, sells sealed new and Ex-UK (UK-used) Apple devices. Ex-UK iPhones from {{exuk:iphone-11}}. What each option means.",
    category: "Trust",
    tags: ["Trust", "Authenticity", "Ex-UK", "ex UK iPhone Kenya"],
    author: "GadgetHub",
    status: "published",
    date: "2026-10-25",
    dateLabel: "25 Oct 2026",
    views: 280,
    paragraphs: [
      "Gadget Hub is an Apple Authorised Reseller at Norwich Union House, Nairobi CBD. We sell Apple devices two ways, and every product page lets you switch between them with the New / Ex-UK toggle above the price.",
      "New means sealed in the box, never activated, with a 1-year warranty and a Gadget Hub invoice. It is the right choice if you want the longest warranty, a fresh battery and the latest models the day they land.",
      "Ex-UK means a genuine Apple device used in the United Kingdom and brought into Kenya. It costs less than new — for example, Ex-UK iPhones start from {{exuk:iphone-11}} — and the condition and warranty terms for your unit are written on your Gadget Hub invoice. Ask us on WhatsApp for battery health and photos of the exact unit before you pay.",
      "How to choose: buy new if the phone must last four or five years or you want the newest model. Buy Ex-UK if you want a Pro model or more storage for the same money. Compare both prices on any [iPhone](/iphone), [iPad](/ipad), [Mac](/mac) or [Apple Watch](/watch) page.",
      "Trade-ins are welcome as credit toward either. We inspect and value your device, then take the amount off your order. [Start a trade-in](/trade-in).",
      "Questions about authenticity or sourcing? See our [authenticity page](/authenticity) or WhatsApp the shop on 0729 585 471.",
    ],
  },
];

function byIdMap(posts: JournalPost[]) {
  return new Map(posts.map((p) => [p.id, p]));
}

async function loadOverrides(): Promise<JournalPost[]> {
  return kvGetJson<JournalPost[]>(REDIS_KEY, []);
}

/** Merge seeds with persisted overrides (override wins by id). */
export async function listJournalPosts(): Promise<JournalPost[]> {
  const overrides = await loadOverrides();
  const map = byIdMap([...journalSeedPosts, ...journalGuidePosts, ...journalSearchGuidePosts, ...journalStoreGuidePosts, ...journalHowToGuidePosts]);
  for (const o of overrides) map.set(o.id, o);
  return [...map.values()].sort((a, b) => {
    const ad = a.date || "0000";
    const bd = b.date || "0000";
    return bd.localeCompare(ad);
  });
}

/**
 * Live price placeholders for articles, so posts never quote stale prices:
 *   {{price:iphone-17-pro}}       lowest live price ("KES 158,000")
 *   {{price:iphone-17-pro:256}}   one storage / configuration
 *   {{exuk:iphone-15:128}}        Ex-UK price for that option
 * Ids are product or iPhone page ids (iphone-18-pro resolves to its shop id).
 */
const PRICE_TOKEN = /\{\{(price|exuk):([a-z0-9-]+)(?::([a-z0-9-]+))?\}\}/g;

function formatKesToken(n: number) {
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
}

export function renderPriceTokens(text: string, catalog: Map<string, PricedProduct>): string {
  if (!text || !text.includes("{{")) return text;
  return text.replace(PRICE_TOKEN, (whole, kind: string, id: string, key?: string) => {
    const product = catalog.get(id) ?? catalog.get(iphoneLiveId(id));
    if (!product) return whole;
    if (!key) {
      if (kind === "exuk") {
        const ex = product.variants.map((v) => v.exUkKes).filter((n): n is number => typeof n === "number" && n > 0);
        return ex.length ? formatKesToken(Math.min(...ex)) : whole;
      }
      return formatKesToken(product.priceKes);
    }
    const v = product.variants.find((x) => x.key === key);
    const n = v ? (kind === "exuk" ? v.exUkKes : v.priceKes) : undefined;
    return n ? formatKesToken(n) : whole;
  });
}

export async function withLivePrices(posts: JournalPost[]): Promise<JournalPost[]> {
  if (!posts.some((p) => JSON.stringify(p).includes("{{"))) return posts;
  const catalog = new Map((await livePricedCatalog()).map((p) => [p.id, p]));
  const r = (t?: string) => (t ? renderPriceTokens(t, catalog) : t);
  return posts.map((p) => ({
    ...p,
    title: r(p.title)!,
    excerpt: r(p.excerpt)!,
    seoTitle: r(p.seoTitle),
    seoDescription: r(p.seoDescription),
    paragraphs: p.paragraphs.map((x) => r(x)!),
    faq: p.faq?.map((f) => ({ q: r(f.q)!, a: r(f.a)! })),
  }));
}

export async function listPublishedJournalPosts(): Promise<JournalPost[]> {
  const all = await listJournalPosts();
  const today = new Date().toISOString().slice(0, 10);
  return withLivePrices(
    all.filter((p) => {
      if (p.status === "published") return true;
      if (p.status === "scheduled" && p.date && p.date <= today) return true;
      return false;
    }),
  );
}

export async function getJournalPost(slug: string): Promise<JournalPost | undefined> {
  const all = await listJournalPosts();
  return all.find((p) => p.slug === slug);
}

export async function getPublishedJournalPost(slug: string): Promise<JournalPost | undefined> {
  const posts = await listPublishedJournalPosts();
  return posts.find((p) => p.slug === slug);
}

export async function latestJournalPosts(limit = 3): Promise<JournalPost[]> {
  const posts = await listPublishedJournalPosts();
  return posts.slice(0, limit);
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function saveJournalPost(input: Partial<JournalPost> & { title: string }): Promise<JournalPost> {
  const all = await listJournalPosts();
  const id = input.id || `j-${crypto.randomUUID().slice(0, 8)}`;
  const existing = all.find((p) => p.id === id);
  const slug = (input.slug || existing?.slug || slugifyTitle(input.title)).replace(/^\/+/, "").replace(/^journal\//, "");
  const status = (input.status || existing?.status || "draft") as JournalStatus;
  const today = new Date().toISOString().slice(0, 10);
  const requestedDate = typeof input.date === "string" ? input.date.trim() : "";
  const date =
    requestedDate ||
    existing?.date ||
    (status === "published" || status === "scheduled" ? today : "");
  const post: JournalPost = {
    id,
    slug,
    title: input.title.trim(),
    excerpt: (input.excerpt ?? existing?.excerpt ?? "").trim(),
    seoTitle: input.seoTitle ?? existing?.seoTitle,
    seoDescription: input.seoDescription ?? existing?.seoDescription,
    category: input.category ?? existing?.category ?? "Guides",
    tags: input.tags ?? existing?.tags ?? [],
    author: input.author ?? existing?.author ?? "GadgetHub",
    status,
    date,
    dateLabel: date ? formatDateLabel(date) : "-",
    views: input.views ?? existing?.views ?? 0,
    coverAlt: input.coverAlt ?? existing?.coverAlt,
    coverUrl: input.coverUrl ?? existing?.coverUrl,
    paragraphs: input.paragraphs ?? existing?.paragraphs ?? [""],
    needsReview: input.needsReview ?? existing?.needsReview,
    updatedAt: new Date().toISOString(),
  };

  const overrides = await loadOverrides();
  const next = overrides.filter((p) => p.id !== id);
  next.push(post);
  await kvSetJson(REDIS_KEY, next);
  return post;
}

export async function deleteJournalPost(id: string) {
  const overrides = await loadOverrides();
  const seedIds = new Set(journalSeedPosts.map((p) => p.id));
  if (seedIds.has(id)) {
    // Soft-hide seed by storing a draft tombstone? Prefer status archived - use draft empty
    const seed = journalSeedPosts.find((p) => p.id === id)!;
    await saveJournalPost({ ...seed, status: "draft", title: seed.title, paragraphs: seed.paragraphs });
    const all = await loadOverrides();
    const filtered = all.filter((p) => p.id !== id);
    // Mark deleted via override with special status - store as draft titled [deleted]
    filtered.push({ ...seed, status: "draft", title: `[removed] ${seed.title}`, paragraphs: [], views: 0, updatedAt: new Date().toISOString() });
    await kvSetJson(REDIS_KEY, filtered);
    return;
  }
  await kvSetJson(
    REDIS_KEY,
    overrides.filter((p) => p.id !== id),
  );
}

export function journalStatusCounts(posts: JournalPost[]) {
  return {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    review: posts.filter((p) => p.status === "review").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };
}

/** @deprecated use Journal - kept for gradual import updates */
export type BlogPost = JournalPost;
export const blogPosts = journalSeedPosts;
export function getPost(slug: string) {
  return journalSeedPosts.find((p) => p.slug === slug);
}
export function latestPosts(limit = 3) {
  return [...journalSeedPosts]
    .filter((p) => p.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
