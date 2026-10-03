/** Blog posts - Phase 1 static content */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  dateLabel: string;
  tags: string[];
  /** Body paragraphs (plain text) */
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-trade-in-works",
    title: "How trade-in works at GadgetHub",
    excerpt:
      "Bring your iPhone or Samsung, get credit toward any new device in stock.",
    date: "2026-09-20",
    dateLabel: "20 Sep 2026",
    tags: ["Trade-In", "Guide"],
    paragraphs: [
      "At GadgetHub, trade-in is a way to put value from your current phone toward a new, sealed device - not a way we sell used stock. We accept iPhone and Samsung only.",
      "Start on the Trade-In page: tell us the brand, model, storage, and condition. You’ll continue on WhatsApp so we can give an estimate. Final credit is set after we inspect the device in person at Norwich Union Building, Suite 15.",
      "Credit applies toward any new product in our catalog - phones, Macs, iPads, and more. Devices with account locks or unclear ownership may be declined.",
      "Ready when you are: open Trade-In, or WhatsApp 0729 585 471 with photos and details.",
    ],
  },
  {
    slug: "lipa-mdogo-mdogo-plain-language",
    title: "Lipa Mdogo Mdogo, in plain language",
    excerpt:
      "Pay in smaller amounts - plans are with us, not a third-party bank.",
    date: "2026-09-18",
    dateLabel: "18 Sep 2026",
    tags: ["Financing", "Lipa"],
    paragraphs: [
      "Lipa Mdogo Mdogo is our in-house installment plan. Gadget Hub Investments offers it directly - there is no external bank or financer in the middle for these plans.",
      "You choose a new device, we agree a deposit and schedule that fits, and you pay over time. Corporate and bulk orders can be settled by a separate agreement.",
      "Stock and eligibility depend on the device and your conversation with the shop. The best next step is WhatsApp or a visit so we can walk through options for the model you want.",
      "Read more on the Lipa Mdogo Mdogo page, then message us to apply.",
    ],
  },
  {
    slug: "why-we-only-sell-new",
    title: "Why we only sell new devices",
    excerpt: "Sealed stock, manufacturer warranty, no refurbished listings.",
    date: "2026-09-15",
    dateLabel: "15 Sep 2026",
    tags: ["Trust", "Authenticity"],
    paragraphs: [
      "Every device we sell is new and sealed. You will not find refurbished grades, “A/B/C condition” filters, or used listings in our shop.",
      "Trade-ins are welcome as credit toward a purchase. They are inspected, valued, and applied to your new order - they are never listed as inventory on this website.",
      "New stock carries the manufacturer’s standard warranty. Keep your GadgetHub proof of purchase if you ever need support.",
      "Questions about authenticity or sourcing? See our authenticity page or WhatsApp the shop.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function latestPosts(limit = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
