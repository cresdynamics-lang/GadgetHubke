/**
 * Search copy + structured data for product pages outside the iPhone SEO catalog
 * (iPad, Mac, Watch, AirPods, TV & Home, accessories).
 * Everything is built from live admin prices, so titles, tables and schema never drift.
 */
import { site, policy } from "../site";
import type { PricedProduct } from "../pricing/live";
import { isListedForSale, listedFromKes, listedVariantPrices } from "../listing-offers.ts";
import { offerExtras, type ReviewSchema } from "./offer-schema";
import { optionId, optionStories, type OptionStory } from "./option-stories.ts";

export type SeoFaqItem = { question: string; answer: string };

export type ProductSeoInput = {
  product: PricedProduct;
  /** "iPad", "Mac", "Apple Watch", ... */
  categoryLabel: string;
  categoryHref: string;
  /** Site-relative page path, e.g. /ipad/ipad-pro-11-m5 */
  path: string;
  images: string[];
  /** One plain sentence on what the device is / who it suits. */
  summary: string;
  /** e.g. "256GB to 2TB, Wi-Fi or 5G" */
  optionsSummary?: string;
  /** Other names Kenyans type for this product ("iPad Pro M5 11 inch"). */
  alsoKnownAs?: string[];
  extraFaq?: SeoFaqItem[];
  /** Star rating from real customer reviews (reviewSchema()). */
  reviews?: ReviewSchema;
};

export type ProductSeo = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  rows: { label: string; priceKes: number; exUkKes?: number; inStock: boolean }[];
  hasExUk: boolean;
  fromKes: number;
  topKes: number;
  updatedLabel: string;
  faq: SeoFaqItem[];
  /** One short story per configuration: price, Ex-UK saving, step up and Lipa plan. */
  options: OptionStory[];
  jsonLd: Record<string, unknown>;
  image?: string;
};

export function formatKes(n: number): string {
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function nairobiDate(d = new Date()): { iso: string; label: string } {
  const label = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(d);
  return { iso: d.toISOString().slice(0, 10), label };
}

/** Offers stay valid to the end of next month; prices are re-read on every request. */
export function buildProductSeo(input: ProductSeoInput): ProductSeo {
  const { product, categoryLabel, categoryHref, path } = input;
  const name = product.name;
  const url = new URL(path, site.url).href;
  const images = input.images.map((src) => new URL(src, site.url).href);
  const rows = (product.variants.length
    ? product.variants
    : [{ key: "base", label: "Standard", priceKes: product.priceKes, exUkKes: product.exUkKes, inStock: product.inStock }]
  )
    // Only options on the live list: nothing hidden or unpriced reaches the table or schema.
    .flatMap((v) => {
      const listed = listedVariantPrices(product, v);
      if (!listed.newKes && !listed.exUkKes) return [];
      return [{
        label: v.label,
        priceKes: listed.newKes,
        exUkKes: listed.exUkKes || undefined,
        inStock: v.inStock && product.inStock,
      }];
    })
    .sort((a, b) => (a.priceKes || a.exUkKes!) - (b.priceKes || b.exUkKes!));
  const prices = rows.map((r) => r.priceKes || r.exUkKes!);
  const fromKes = prices.length ? Math.min(...prices) : product.priceKes;
  const topKes = prices.length ? Math.max(...prices) : product.priceKes;
  const date = nairobiDate();
  const options = input.optionsSummary ? ` ${input.optionsSummary}.` : "";

  const longTitle = `${name} Price in Kenya | Gadget Hub Nairobi`;
  // Full title, never shortened: long titles carry more of what Kenyans search.
  const title = longTitle;
  const description = clip(
    `Buy the ${name} in Nairobi. ${formatKes(fromKes)}.${options} Genuine sealed Apple, ${site.warranty.years}-year warranty. Order on WhatsApp or Lipa Mdogo Mdogo.`,
    158,
  );

  const aka = input.alsoKnownAs?.[0] ? ` You may also see it listed as ${input.alsoKnownAs[0]}.` : "";
  const range =
    rows.length > 1
      ? `The ${name} price in Kenya at Gadget Hub starts at ${formatKes(fromKes)} and goes up to ${formatKes(topKes)} depending on the configuration.`
      : `The ${name} price in Kenya at Gadget Hub is ${formatKes(fromKes)}.`;
  const exUkRows = rows.filter((r) => r.exUkKes);
  const hasExUk = exUkRows.length > 0;
  const exUkFrom = hasExUk ? Math.min(...exUkRows.map((r) => r.exUkKes!)) : 0;
  const condition = hasExUk
    ? `Buy it sealed new with a ${site.warranty.years}-year warranty, or Ex-UK (UK-used) ${formatKes(exUkFrom)} to save — both with a Gadget Hub invoice`
    : `Every unit is new and sealed, sold with a ${site.warranty.years}-year warranty and a Gadget Hub invoice`;
  const intro = `${range} ${input.summary} ${condition}, from our shop at ${site.address}, Nairobi CBD.${aka}`;

  const faq: SeoFaqItem[] = [
    {
      question: `What is the ${name} price in Kenya?`,
      answer:
        rows.length > 1
          ? `At Gadget Hub the ${name} is ${formatKes(fromKes)} (${rows[0].label}) to ${formatKes(topKes)} (${rows[rows.length - 1].label}). Prices on this page are live and include VAT where it applies.`
          : `At Gadget Hub the ${name} costs ${formatKes(fromKes)}. The price on this page is live and includes VAT where it applies.`,
    },
    {
      question: `Is the ${name} at Gadget Hub original?`,
      answer: hasExUk
        ? `Yes. Gadget Hub is an Apple Authorised Reseller. New units are sealed with a ${site.warranty.years}-year warranty; Ex-UK units are genuine UK-used Apple devices, with condition and warranty stated on your invoice.`
        : `Yes. Gadget Hub is an Apple Authorised Reseller selling genuine, sealed Apple stock with a ${site.warranty.years}-year warranty. Keep your Gadget Hub invoice for warranty support.`,
    },
    ...(hasExUk
      ? [
          {
            question: `What is the Ex-UK ${name} price in Kenya?`,
            answer: `Ex-UK (UK-used) ${name} units at Gadget Hub are ${formatKes(exUkFrom)}. Switch the price toggle to Ex-UK on this page to see every option.`,
          },
        ]
      : []),
    {
      question: `Can I buy the ${name} on Lipa Mdogo Mdogo?`,
      answer: `Yes. Lipa Mdogo Mdogo is run in-house by ${site.legalName}: pay a deposit, then clear the balance in monthly instalments. Start from the Lipa Mdogo Mdogo page or ask on WhatsApp ${site.phoneDisplay}.`,
    },
    {
      question: "Where is your shop and do you deliver?",
      answer: `Collect at ${site.address}, Nairobi (${site.hours.short}). Nairobi delivery is confirmed after payment; see the shipping and delivery page for other towns.`,
    },
    {
      question: "What if the device is faulty?",
      answer: `Report a fault within ${policy.returnWindowDays} days of delivery for a return under our returns policy; after that the ${site.warranty.years}-year warranty applies.`,
    },
    // One price question per configuration (up to 6): "How much is the MacBook Air 13 M5 16GB / 512GB in Kenya?"
    ...rows.slice(0, rows.length > 1 ? 6 : 0).map((r) => ({
      question: `How much is the ${name} ${r.label} in Kenya?`,
      answer: r.priceKes
        ? `${formatKes(r.priceKes)} sealed new at Gadget Hub${r.exUkKes ? `, or ${formatKes(r.exUkKes)} Ex-UK` : ""}.`
        : `${formatKes(r.exUkKes!)} Ex-UK at Gadget Hub.`,
    })),
    ...(input.extraFaq ?? []),
  ];

  const extras = offerExtras();
  const offerFor = (priceKes: number, inStock: boolean, used = false) => ({
    "@type": "Offer",
    price: priceKes,
    priceCurrency: "KES",
    availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: used ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
    ...(used ? { description: "Ex-UK (UK-used)" } : {}),
    url,
    ...extras,
  });
  const offersFor = (r: { priceKes: number; exUkKes?: number; inStock: boolean }) =>
    !r.priceKes
      ? offerFor(r.exUkKes!, r.inStock, true)
      : r.exUkKes
        ? [offerFor(r.priceKes, r.inStock), offerFor(r.exUkKes, r.inStock, true)]
        : offerFor(r.priceKes, r.inStock);
  const brand = { "@type": "Brand", name: "Apple" };

  const productNode =
    rows.length > 1
      ? {
          "@type": "ProductGroup",
          "@id": `${url}#product`,
          name,
          description: intro,
          url,
          image: images,
          brand,
          productGroupID: product.id,
          ...(input.reviews ?? {}),
          // Google reads size and color as variant properties; the configuration is the size.
          variesBy: ["https://schema.org/size"],
          hasVariant: rows.map((r, i) => ({
            "@type": "Product",
            "@id": `${url}#${optionId(r.label)}`,
            name: `${name} ${r.label}`,
            description: `${name} ${r.label}. ${input.summary}`,
            sku: `${product.id}-${optionId(r.label)}`,
            image: images.slice(0, 1),
            brand,
            size: r.label,
            additionalProperty: [{ "@type": "PropertyValue", name: "Configuration", value: r.label }],
            offers: offersFor(r),
          })),
        }
      : {
          "@type": "Product",
          "@id": `${url}#product`,
          name,
          description: intro,
          url,
          sku: product.id,
          image: images,
          brand,
          ...(input.reviews ?? {}),
          offers: rows[0] ? offersFor(rows[0]) : offerFor(fromKes, product.inStock),
        };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      productNode,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: categoryLabel, item: new URL(categoryHref, site.url).href },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return {
    title,
    description,
    heading: `${name} price in Kenya`,
    intro,
    rows,
    hasExUk,
    fromKes,
    topKes,
    updatedLabel: date.label,
    faq,
    options: optionStories(name, rows),
    jsonLd,
    image: input.images[0],
  };
}

/** Category hub copy + ItemList schema. */
export function buildCategorySeo(input: {
  label: string;
  path: string;
  products: PricedProduct[];
  hrefFor?: (p: PricedProduct) => string;
}) {
  const priced = input.products.filter(isListedForSale);
  const fromKes = priced.length ? Math.min(...priced.map(listedFromKes)) : 0;
  const url = new URL(input.path, site.url).href;
  return {
    fromKes,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          name: `${input.label} price in Kenya`,
          url,
          isPartOf: { "@type": "WebSite", name: "Gadget Hub Kenya", url: site.url },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: priced.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: new URL(input.hrefFor ? input.hrefFor(p) : p.href, site.url).href,
              name: `${p.name} — ${formatKes(listedFromKes(p))}`,
            })),
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: input.label, item: url },
          ],
        },
      ],
    },
  };
}
