/**
 * Public Journal posts (formerly Blog).
 * Seeds ship in-repo; edits from /management/journal persist via admin KV.
 */
import { kvGetJson, kvSetJson } from "./admin/kv";

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
  paragraphs: string[];
  needsReview?: boolean;
  updatedAt?: string;
};

const REDIS_KEY = "gh:journal:v1";

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
    id: "j-iphone-15-or-16",
    slug: "iphone-15-or-iphone-16",
    title: "How to choose between an iPhone 15 and an iPhone 16",
    excerpt: "Real differences that matter for Nairobi buyers - storage, camera, and longevity.",
    seoTitle: "iPhone 15 or iPhone 16? How to choose | Gadget Hub",
    seoDescription:
      "Compare iPhone 15 and iPhone 16 for everyday use in Kenya - camera, battery, and which models we stock.",
    category: "Buying guides",
    tags: ["iPhone", "iPhone 15", "iPhone 16"],
    author: "GadgetHub",
    status: "published",
    date: "2026-10-02",
    dateLabel: "2 Oct 2026",
    views: 1204,
    coverAlt: "Two iPhones side by side",
    paragraphs: [
      "Which one fits you? The iPhone 15 and iPhone 16 both make sense depending on how long you want to keep the phone and which camera features you actually use.",
      "We stock sealed units only. Compare storage and colour options on the iPhone pages, then WhatsApp us if you want a side-by-side recommendation for your budget.",
      "Trade-in credit can bring the jump to a newer model within reach - start on Trade-In if you are moving from an older Android or iPhone.",
    ],
  },
  {
    id: "j-macbook-air-or-pro",
    slug: "macbook-air-or-macbook-pro",
    title: "MacBook Air or MacBook Pro: which one fits you?",
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
    title: "How to get your Android phone ready for a trade-in",
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
    title: "Setting up your new iPad in ten minutes",
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
    title: "A guide to Lipa Mdogo Mdogo",
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
    title: "Getting the most from AirPods Pro",
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
    title: "How trade-in works at GadgetHub",
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
      "Start on the Trade-In page: tell us the brand, model, storage, and condition. You’ll continue on WhatsApp so we can give an estimate. Final credit is set after we inspect the device in person at Norwich House, Suite 15.",
      "Credit applies toward any new product in our catalog - phones, Macs, iPads, and more. Devices with account locks or unclear ownership may be declined.",
      "Ready when you are: open Trade-In, or WhatsApp 0729 585 471 with photos and details.",
    ],
  },
  {
    id: "j-lipa-plain",
    slug: "lipa-mdogo-mdogo-plain-language",
    title: "Lipa Mdogo Mdogo, in plain language",
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
    slug: "why-we-only-sell-new",
    title: "Why we only sell new devices",
    excerpt: "Sealed stock, manufacturer warranty, no refurbished listings.",
    category: "Trust",
    tags: ["Trust", "Authenticity"],
    author: "GadgetHub",
    status: "published",
    date: "2026-09-15",
    dateLabel: "15 Sep 2026",
    views: 280,
    paragraphs: [
      "Every device we sell is new and sealed. You will not find refurbished grades, “A/B/C condition” filters, or used listings in our shop.",
      "Trade-ins are welcome as credit toward a purchase. They are inspected, valued, and applied to your new order - they are never listed as inventory on this website.",
      "New stock includes a 1-year warranty. Keep your GadgetHub proof of purchase if you ever need support.",
      "Questions about authenticity or sourcing? See our authenticity page or WhatsApp the shop.",
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
  const map = byIdMap(journalSeedPosts);
  for (const o of overrides) map.set(o.id, o);
  return [...map.values()].sort((a, b) => {
    const ad = a.date || "0000";
    const bd = b.date || "0000";
    return bd.localeCompare(ad);
  });
}

export async function listPublishedJournalPosts(): Promise<JournalPost[]> {
  const all = await listJournalPosts();
  const today = new Date().toISOString().slice(0, 10);
  return all.filter((p) => {
    if (p.status === "published") return true;
    if (p.status === "scheduled" && p.date && p.date <= today) return true;
    return false;
  });
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
  const date = input.date ?? existing?.date ?? (status === "published" ? new Date().toISOString().slice(0, 10) : "");
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
