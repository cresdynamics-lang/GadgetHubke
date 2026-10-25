/**
 * Shared structured-data pieces for product pages:
 *  - offerExtras(): seller, price-valid-until, return policy and delivery methods
 *    for every Offer (facts from site.ts policy — no invented shipping fee).
 *  - reviewSchema(): star rating + reviews from real customer reviews only.
 *    Sample reviews (ids starting "seed-") are never sent to Google.
 */
import { listReviews } from "../reviews/store";
import { policy, site } from "../site";

export function priceValidUntil(d = new Date()): string {
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 2, 0));
  return end.toISOString().slice(0, 10);
}

const returnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "KE",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: policy.returnWindowDays,
  returnMethod: "https://schema.org/ReturnInStore",
  itemDefectReturnFees: "https://schema.org/FreeReturn",
  merchantReturnLink: `${site.url}/returns`,
};

export function offerExtras() {
  return {
    seller: { "@type": "Organization", name: site.legalName, url: site.url },
    priceValidUntil: priceValidUntil(),
    hasMerchantReturnPolicy: returnPolicy,
    availableDeliveryMethod: [
      "http://purl.org/goodrelations/v1#DeliveryModePickUp",
      "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
    ],
  };
}

export type ReviewSchema = {
  aggregateRating: Record<string, unknown>;
  review: Record<string, unknown>[];
};

/** Rating data from real, approved customer reviews for any of these product ids. */
export async function reviewSchema(...productIds: (string | undefined)[]): Promise<ReviewSchema | undefined> {
  const ids = [...new Set(productIds.filter((x): x is string => Boolean(x)))];
  const seen = new Set<string>();
  const real = [];
  for (const id of ids) {
    const { reviews } = await listReviews(id);
    for (const r of reviews) {
      if (r.id.startsWith("seed-") || seen.has(r.id)) continue;
      seen.add(r.id);
      real.push(r);
    }
  }
  if (!real.length) return undefined;
  const avg = real.reduce((s, r) => s + r.rating, 0) / real.length;
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(avg.toFixed(1)),
      reviewCount: real.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: real
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
      .map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        datePublished: r.createdAt.slice(0, 10),
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        ...(r.body ? { reviewBody: r.body } : {}),
      })),
  };
}
