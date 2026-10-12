/**
 * Google Merchant Center feed rows from the same SEO + sheet data as the pages.
 * EX-UK variants are excluded while SHOW_EX_UK is false.
 */
import fs from "node:fs";
import path from "node:path";
import { site } from "../../site";
import { iphoneSeoCatalog } from "./catalog";
import { SHOW_EX_UK } from "./flags";
import { getModel } from "../models";
import { getImage, defaultColourForModel, isOverviewOnly } from "../images";
import { getProduct } from "../../products";

const seoIdToShopProductId: Record<string, string> = {
  "iphone-18-pro": "iphone-pro",
  "iphone-18-pro-max": "iphone-pro-max",
  "iphone-17": "iphone-17",
  "iphone-17e": "iphone-17e",
  "iphone-air": "iphone-air",
  "iphone-duo": "iphone-duo",
  "iphone-16": "iphone-16",
};

export type MerchantRow = {
  id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  price: string;
  availability: string;
  condition: "new" | "used";
  brand: "Apple";
};

export type MerchantExclusion = {
  sheetId: string;
  model: string;
  storage: string;
  reason: "no_price" | "no_photo";
};

function resolveImage(modelId: string, name: string): string | undefined {
  const legacy = getModel(modelId);
  if (legacy) {
    const colour = defaultColourForModel(legacy.id, legacy.defaultColour ?? undefined);
    const img = getImage(
      legacy.id,
      colour,
      isOverviewOnly(legacy.id) ? "overview" : 1,
      legacy.name,
    );
    if (img?.src && img.src !== "/images/logo.png") {
      const disk = path.join(process.cwd(), "public", img.src.replace(/^\//, ""));
      if (fs.existsSync(disk)) return new URL(img.src, site.url).href;
    }
  }
  const shop = getProduct(seoIdToShopProductId[modelId] ?? modelId);
  if (shop?.image?.src) {
    const disk = path.join(process.cwd(), "public", shop.image.src.replace(/^\//, ""));
    if (fs.existsSync(disk)) return new URL(shop.image.src, site.url).href;
  }
  return undefined;
}

export function buildIphoneMerchantFeed(): {
  rows: MerchantRow[];
  exclusions: MerchantExclusion[];
} {
  const rows: MerchantRow[] = [];
  const exclusions: MerchantExclusion[] = [];

  for (const model of iphoneSeoCatalog) {
    const image = resolveImage(model.id, model.name);
    for (const v of model.variants) {
      if (!v.newKes || v.newKes <= 0) {
        exclusions.push({
          sheetId: v.sheetId,
          model: model.name,
          storage: v.storage,
          reason: "no_price",
        });
        continue;
      }
      if (!image) {
        exclusions.push({
          sheetId: v.sheetId,
          model: model.name,
          storage: v.storage,
          reason: "no_photo",
        });
        continue;
      }
      rows.push({
        id: v.sheetId,
        title: `${model.name} ${v.storage}`,
        description: model.metaDescription,
        link: new URL(`/iphone/${model.id}`, site.url).href,
        image_link: image,
        price: `${v.newKes} KES`,
        availability:
          v.stockStatus === "in_stock"
            ? "in_stock"
            : v.stockStatus === "out_of_stock"
              ? "out_of_stock"
              : "in_stock",
        condition: "new",
        brand: "Apple",
      });

      if (SHOW_EX_UK && v.exUkKes > 0) {
        rows.push({
          id: `${v.sheetId}-EXUK`,
          title: `${model.name} ${v.storage} Used (ex-UK)`,
          description: model.metaDescription,
          link: new URL(`/iphone/${model.id}`, site.url).href,
          image_link: image,
          price: `${v.exUkKes} KES`,
          availability: "in_stock",
          condition: "used",
          brand: "Apple",
        });
      }
    }
  }

  return { rows, exclusions };
}

export function merchantFeedXml(rows: MerchantRow[]): string {
  const items = rows
    .map(
      (r) => `    <item>
      <g:id>${escapeXml(r.id)}</g:id>
      <g:title>${escapeXml(r.title)}</g:title>
      <g:description>${escapeXml(r.description)}</g:description>
      <g:link>${escapeXml(r.link)}</g:link>
      <g:image_link>${escapeXml(r.image_link)}</g:image_link>
      <g:price>${escapeXml(r.price)}</g:price>
      <g:availability>${r.availability}</g:availability>
      <g:condition>${r.condition}</g:condition>
      <g:brand>${r.brand}</g:brand>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Gadget Hub iPhone</title>
    <link>${site.url}</link>
    <description>iPhone offers from Gadget Hub Kenya</description>
${items}
  </channel>
</rss>
`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
