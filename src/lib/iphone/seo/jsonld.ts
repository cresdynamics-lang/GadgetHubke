import { site } from "../../site";
import {
  SHOW_EX_UK,
  EX_UK_CONDITION_LABEL,
  EX_UK_WARRANTY,
  assertExUkWarrantyConfigured,
} from "./flags";
import { sharedProductFaq } from "./shared";
import type { IphoneSeoModel } from "./types";

function availability(status: IphoneSeoModel["variants"][0]["stockStatus"]): string | undefined {
  if (status === "in_stock") return "https://schema.org/InStock";
  if (status === "out_of_stock") return "https://schema.org/OutOfStock";
  return undefined;
}

/** ProductGroup + Product variants + BreadcrumbList + FAQPage for a model page. */
export function buildIphoneProductJsonLd(
  model: IphoneSeoModel,
  opts: { pageUrl: string; imageUrl?: string; seriesUrl?: string },
) {
  assertExUkWarrantyConfigured();

  const newProducts = model.variants.map((v) => {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      price: v.newKes,
      priceCurrency: "KES",
      itemCondition: "https://schema.org/NewCondition",
      url: opts.pageUrl,
    };
    const avail = availability(v.stockStatus);
    if (avail) offer.availability = avail;

    return {
      "@type": "Product",
      "@id": `${opts.pageUrl}#${v.sheetId}`,
      sku: v.sheetId,
      name: `${model.name} ${v.storage}`,
      image: opts.imageUrl ? [opts.imageUrl] : undefined,
      brand: { "@type": "Brand", name: "Apple" },
      offers: offer,
    };
  });

  const usedProducts =
    SHOW_EX_UK
      ? model.variants.map((v) => {
          const offer: Record<string, unknown> = {
            "@type": "Offer",
            price: v.exUkKes,
            priceCurrency: "KES",
            itemCondition: "https://schema.org/UsedCondition",
            url: opts.pageUrl,
            description: `${EX_UK_CONDITION_LABEL}. ${EX_UK_WARRANTY}`,
          };
          const avail = availability(v.stockStatus);
          if (avail) offer.availability = avail;
          return {
            "@type": "Product",
            "@id": `${opts.pageUrl}#${v.sheetId}-exuk`,
            sku: `${v.sheetId}-EXUK`,
            name: `${model.name} ${v.storage} (${EX_UK_CONDITION_LABEL})`,
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
    brand: { "@type": "Brand", name: "Apple" },
    productGroupID: model.id,
    variesBy: ["https://schema.org/storageCapacity"],
    hasVariant: products,
    url: opts.pageUrl,
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
