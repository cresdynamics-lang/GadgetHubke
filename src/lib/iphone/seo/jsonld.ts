import { site } from "../../site";
import {
  SHOW_EX_UK,
  EX_UK_CONDITION_LABEL,
  EX_UK_WARRANTY,
  assertExUkWarrantyConfigured,
} from "./flags";
import { sharedProductFaq } from "./shared";
import type { IphoneSeoModel } from "./types";
import { offerExtras, type ReviewSchema } from "../../seo/offer-schema";

function availability(status: IphoneSeoModel["variants"][0]["stockStatus"]): string {
  return status === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";
}

/** ProductGroup + Product variants + BreadcrumbList + FAQPage for a model page. */
export function buildIphoneProductJsonLd(
  model: IphoneSeoModel,
  opts: { pageUrl: string; imageUrl?: string; seriesUrl?: string; reviews?: ReviewSchema },
) {
  assertExUkWarrantyConfigured();
  const extras = offerExtras();

  const newProducts = model.variants.filter((v) => v.newKes > 0).map((v) => {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      price: v.newKes,
      priceCurrency: "KES",
      itemCondition: "https://schema.org/NewCondition",
      url: `${opts.pageUrl}?storage=${encodeURIComponent(v.storage)}`,
      availability: availability(v.stockStatus),
      ...extras,
    };

    return {
      "@type": "Product",
      "@id": `${opts.pageUrl}#${v.sheetId}`,
      sku: v.sheetId,
      name: `${model.name} ${v.storage}`,
      description: `${model.name} ${v.storage}, new and sealed. ${model.metaDescription}`,
      image: opts.imageUrl ? [opts.imageUrl] : undefined,
      brand: { "@type": "Brand", name: "Apple" },
      offers: offer,
    };
  });

  const usedProducts =
    SHOW_EX_UK
      ? model.variants.filter((v) => v.exUkKes > 0).map((v) => {
          const offer: Record<string, unknown> = {
            "@type": "Offer",
            price: v.exUkKes,
            priceCurrency: "KES",
            itemCondition: "https://schema.org/UsedCondition",
            url: `${opts.pageUrl}?storage=${encodeURIComponent(v.storage)}&condition=ex-uk`,
            description: `${EX_UK_CONDITION_LABEL}. ${EX_UK_WARRANTY}`,
            availability: availability(v.stockStatus),
            ...extras,
          };
          return {
            "@type": "Product",
            "@id": `${opts.pageUrl}#${v.sheetId}-exuk`,
            sku: `${v.sheetId}-EXUK`,
            name: `${model.name} ${v.storage} (${EX_UK_CONDITION_LABEL})`,
            description: `${model.name} ${v.storage}, ${EX_UK_CONDITION_LABEL}. ${EX_UK_WARRANTY}`,
            image: opts.imageUrl ? [opts.imageUrl] : undefined,
            brand: { "@type": "Brand", name: "Apple" },
            offers: offer,
          };
        })
      : [];

  const products = [...newProducts, ...usedProducts];

  const productGroup = {
    "@type": "ProductGroup",
    "@id": `${opts.pageUrl}#productgroup`,
    name: model.name,
    description: model.metaDescription,
    image: opts.imageUrl ? [opts.imageUrl] : undefined,
    brand: { "@type": "Brand", name: "Apple" },
    productGroupID: model.id,
    variesBy: ["https://schema.org/storageCapacity"],
    hasVariant: products,
    url: opts.pageUrl,
    ...(opts.reviews ?? {}),
  };

  const crumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "iPhone", item: `${site.url}/iphone` },
  ];
  if (opts.seriesUrl) {
    crumbs.push({
      "@type": "ListItem",
      position: 3,
      name: model.series,
      item: opts.seriesUrl,
    });
    crumbs.push({
      "@type": "ListItem",
      position: 4,
      name: model.name,
      item: opts.pageUrl,
    });
  } else {
    crumbs.push({
      "@type": "ListItem",
      position: 3,
      name: model.name,
      item: opts.pageUrl,
    });
  }

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs,
  };

  const faqEntities = [
    ...model.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
    ...sharedProductFaq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  ];

  const faqPage = {
    "@type": "FAQPage",
    mainEntity: faqEntities,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [productGroup, breadcrumb, faqPage],
  };
}

export function buildSeriesHubJsonLd(opts: {
  name: string;
  pageUrl: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "iPhone", item: `${site.url}/iphone` },
      { "@type": "ListItem", position: 3, name: opts.name, item: opts.pageUrl },
    ],
  };
}

/**
 * Storage × colour variants Google can read: each is its own Product with `size`
 * (storage) and `color`, its own price and a link that opens that exact phone.
 * `variesBy` uses the properties Google supports (size, color).
 * The model page passes every storage; a storage page passes only its own.
 */
export function buildIphoneVariantJsonLd(
  model: IphoneSeoModel,
  opts: {
    modelUrl: string;
    /** This storage page, when the page is one storage option. */
    pageUrl?: string;
    pageName?: string;
    storages: import("./variant-pages").StorageOption[];
    colours: import("./variant-pages").ColourOption[];
    imageFor: (colourKey: string | null) => string;
    seriesUrl?: string;
    faq: { question: string; answer: string }[];
    reviews?: ReviewSchema;
  },
) {
  assertExUkWarrantyConfigured();
  const extras = offerExtras();
  const colours = opts.colours.length ? opts.colours : [null];

  const products = opts.storages.flatMap((s) => {
    const storageUrl = new URL(`/iphone/${model.id}/${s.slug}`, opts.modelUrl).href;
    const conditions = [
      s.newKes > 0 ? { exUk: false, price: s.newKes } : null,
      SHOW_EX_UK && s.exUkKes > 0 ? { exUk: true, price: s.exUkKes } : null,
    ].filter((c): c is { exUk: boolean; price: number } => Boolean(c));
    return conditions.flatMap((c) =>
      colours.map((colour) => {
        const params = new URLSearchParams();
        if (colour) params.set("colour", colour.key);
        if (c.exUk) params.set("condition", "ex-uk");
        const query = params.toString();
        const label = [model.name, s.storage, colour?.label].filter(Boolean).join(" ");
        const inStock = s.inStock && colour?.inStock !== false;
        return {
          "@type": "Product",
          "@id": `${storageUrl}#${colour?.key ?? "any"}${c.exUk ? "-exuk" : ""}`,
          sku: [s.sheetId, colour?.key.toUpperCase(), c.exUk ? "EXUK" : ""].filter(Boolean).join("-"),
          name: c.exUk ? `${label} (${EX_UK_CONDITION_LABEL})` : label,
          description: c.exUk
            ? `${label}, ${EX_UK_CONDITION_LABEL}. ${EX_UK_WARRANTY}`
            : `${label}, sealed new, at Gadget Hub in Nairobi CBD.`,
          image: [opts.imageFor(colour?.key ?? null)],
          brand: { "@type": "Brand", name: "Apple" },
          size: s.storage,
          ...(colour ? { color: colour.label } : {}),
          additionalProperty: [{ "@type": "PropertyValue", name: "Storage", value: s.storage }],
          offers: {
            "@type": "Offer",
            price: c.price,
            priceCurrency: "KES",
            itemCondition: c.exUk ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
            url: query ? `${storageUrl}?${query}` : storageUrl,
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            ...(c.exUk ? { description: `${EX_UK_CONDITION_LABEL}. ${EX_UK_WARRANTY}` } : {}),
            ...extras,
          },
        };
      }),
    );
  });

  const productGroup = {
    "@type": "ProductGroup",
    "@id": `${opts.modelUrl}#productgroup`,
    name: model.name,
    description: model.metaDescription,
    image: [opts.imageFor(null)],
    brand: { "@type": "Brand", name: "Apple" },
    productGroupID: model.id,
    variesBy: opts.colours.length ? ["https://schema.org/size", "https://schema.org/color"] : ["https://schema.org/size"],
    hasVariant: products,
    url: opts.modelUrl,
    ...(opts.reviews ?? {}),
  };

  const crumbs: { "@type": string; position: number; name: string; item: string }[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "iPhone", item: `${site.url}/iphone` },
  ];
  if (opts.seriesUrl) crumbs.push({ "@type": "ListItem", position: 3, name: model.series, item: opts.seriesUrl });
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: model.name, item: opts.modelUrl });
  if (opts.pageUrl && opts.pageName)
    crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: opts.pageName, item: opts.pageUrl });

  return {
    "@context": "https://schema.org",
    "@graph": [
      productGroup,
      { "@type": "BreadcrumbList", itemListElement: crumbs },
      {
        "@type": "FAQPage",
        mainEntity: opts.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}
