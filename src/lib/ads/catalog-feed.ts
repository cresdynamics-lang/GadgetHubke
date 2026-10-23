/**
 * Unified product catalog for Meta Commerce Manager + Google Merchant Center.
 * Prices come from the same sheet / model base prices as the live shop.
 */
import fs from "node:fs";
import path from "node:path";
import { site } from "../site";
import { buildIphoneMerchantFeed } from "../iphone/seo/merchant-feed";
import { macModels } from "../mac/models";
import { getMacImage, defaultMacColour } from "../mac";
import { ipadModels } from "../ipad/models";
import { getIpadImage, defaultIpadColour } from "../ipad";
import { watchModels } from "../watch/models";
import { getWatchImage } from "../watch";
import { airpodsModels } from "../airpods/models";
import { getAirpodsImage } from "../airpods";
import { tvHomeModels } from "../tv-home/models";
import { getTvHomeImage } from "../tv-home";
import { accessories } from "../accessories/models";
import { getAccessoryImage } from "../accessories";
import { cardImageSrc } from "../card-images";

export type CatalogRow = {
  id: string;
  title: string;
  description: string;
  availability: "in_stock" | "out_of_stock" | "preorder";
  condition: "new";
  price: string;
  link: string;
  image_link: string;
  brand: "Apple";
  google_product_category: string;
  product_type: string;
  item_group_id: string;
};

function absUrl(p: string): string {
  return new URL(p.startsWith("/") ? p : `/${p}`, site.url).href;
}

function priceKes(kes: number): string {
  return `${kes.toFixed(2)} KES`;
}

function diskExists(publicPath: string): boolean {
  const disk = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  return fs.existsSync(disk);
}

function imageLink(publicPath: string | undefined, fallbackId?: string): string | undefined {
  if (publicPath && diskExists(publicPath)) return absUrl(publicPath);
  if (fallbackId) {
    const card = cardImageSrc(fallbackId, "");
    if (card && diskExists(card)) return absUrl(card);
  }
  return undefined;
}

function pushRow(
  rows: CatalogRow[],
  row: Omit<CatalogRow, "brand" | "condition" | "availability"> & {
    availability?: CatalogRow["availability"];
  },
) {
  if (!row.image_link || !row.price || !row.link) return;
  rows.push({
    ...row,
    brand: "Apple",
    condition: "new",
    availability: row.availability ?? "in_stock",
  });
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Category order for ads feeds — iPhones always list first. */
function categoryRank(productType: string): number {
  if (productType.includes("Phones") || productType.includes("iPhone")) return 0;
  if (productType.includes("Computers") || productType.includes("MacBook")) return 1;
  if (productType.includes("Tablets") || productType.includes("iPad")) return 2;
  if (productType.includes("Wearables") || productType.includes("Watch")) return 3;
  if (productType.includes("AirPods") || productType.includes("Audio")) return 4;
  if (productType.includes("TV & Home")) return 5;
  return 6;
}

/** Sheet IDs like IP-105 → 105 (newer iPhones have higher numbers). */
function sheetSortKey(id: string): number {
  const m = id.match(/IP-(\d+)/i);
  return m ? Number(m[1]) : 0;
}

/**
 * Build every sellable SKU for ads catalogs.
 * - One row per product (unique id)
 * - iPhones first, newest sheet IDs at the top
 * - Meta: item_group_id = id so Commerce Manager does not collapse variants
 */
export function buildAdsCatalog(): CatalogRow[] {
  const rows: CatalogRow[] = [];

  // --- iPhone (each storage SKU is its own product row) ---
  const { rows: iphoneRows } = buildIphoneMerchantFeed();
  for (const r of iphoneRows) {
    const kes = Number(String(r.price).replace(/[^\d.]/g, ""));
    // Standalone product — do not group storage sizes under one Meta item
    pushRow(rows, {
      id: r.id,
      title: r.title,
      description: r.description,
      price: priceKes(kes),
      link: r.link,
      image_link: r.image_link,
      google_product_category: "Electronics > Communications > Telephones > Mobile Phones",
      product_type: "Electronics > Phones > iPhone",
      item_group_id: r.id,
      availability: r.availability as CatalogRow["availability"],
    });
  }

  // --- Mac ---
  for (const m of macModels) {
    if (!m.basePriceKes || m.basePriceKes <= 0) continue;
    const img = getMacImage(m.id, defaultMacColour(m), "product", m.name);
    const link = imageLink(img.src, m.id);
    if (!link) continue;
    pushRow(rows, {
      id: m.id,
      title: m.name,
      description: `${m.tagline} ${m.whoItSuits} From Gadget Hub, Nairobi.`.trim(),
      price: priceKes(m.basePriceKes),
      link: absUrl(`/mac/${m.id}`),
      image_link: link,
      google_product_category: "Electronics > Computers > Laptops",
      product_type: `Electronics > Computers > MacBook > ${m.family}`,
      item_group_id: m.id,
    });
  }

  // --- iPad ---
  for (const m of ipadModels) {
    if (!m.basePriceKes || m.basePriceKes <= 0) continue;
    const img = getIpadImage(m.id, defaultIpadColour(m), "product", m.name);
    const link = imageLink(img.src, m.id);
    if (!link) continue;
    pushRow(rows, {
      id: m.id,
      title: m.name,
      description: `${m.tagline ?? m.name}. ${m.whoItSuits ?? ""} Buy at Gadget Hub, Nairobi.`.trim(),
      price: priceKes(m.basePriceKes),
      link: absUrl(`/ipad/${m.id}`),
      image_link: link,
      google_product_category: "Electronics > Computers > Tablet Computers",
      product_type: `Electronics > Tablets > iPad > ${m.family}`,
      item_group_id: m.id,
    });
  }

  // --- Watch ---
  for (const m of watchModels) {
    if (!m.basePriceKes || m.basePriceKes <= 0) continue;
    const img = getWatchImage(m.id, "main", m.name);
    const link = imageLink(img.src, m.id);
    if (!link) continue;
    pushRow(rows, {
      id: m.id,
      title: m.name,
      description: `${m.tagline ?? m.name}. ${m.whoItSuits ?? ""} Gadget Hub, Nairobi.`.trim(),
      price: priceKes(m.basePriceKes),
      link: absUrl(`/watch/${m.id}`),
      image_link: link,
      google_product_category: "Apparel & Accessories > Jewelry > Watches",
      product_type: `Electronics > Wearables > Apple Watch > ${m.family}`,
      item_group_id: m.id,
    });
  }

  // --- AirPods ---
  for (const m of airpodsModels) {
    if (!m.basePriceKes || m.basePriceKes <= 0) continue;
    const img = getAirpodsImage(m.id, "hero", m.name);
    const link = imageLink(img.src, m.id);
    if (!link) continue;
    pushRow(rows, {
      id: m.id,
      title: m.name,
      description: `${m.tagline ?? m.name}. ${m.whoItSuits ?? ""} Gadget Hub, Nairobi.`.trim(),
      price: priceKes(m.basePriceKes),
      link: absUrl(`/airpods/${m.id}`),
      image_link: link,
      google_product_category: "Electronics > Audio > Headphones",
      product_type: `Electronics > Audio > AirPods > ${m.family}`,
      item_group_id: m.id,
    });
  }

  // --- TV & Home ---
  for (const m of tvHomeModels) {
    if (!m.basePriceKes || m.basePriceKes <= 0) continue;
    const img = getTvHomeImage(m.id, "hero", m.name);
    const link = imageLink(img.src, m.id);
    if (!link) continue;
    pushRow(rows, {
      id: m.id,
      title: m.name,
      description: `${m.tagline ?? m.name}. ${m.whoItSuits ?? ""} Gadget Hub, Nairobi.`.trim(),
      price: priceKes(m.basePriceKes),
      link: absUrl(`/tv-home/${m.id}`),
      image_link: link,
      google_product_category: "Electronics > Audio > Speakers",
      product_type: `Electronics > TV & Home > ${m.family}`,
      item_group_id: m.id,
    });
  }

  // --- Accessories ---
  for (const a of accessories) {
    if (!a.basePriceKes || a.basePriceKes <= 0) continue;
    const img = getAccessoryImage(a.id, "hero");
    const link = imageLink(img.src, a.id);
    if (!link) continue;
    pushRow(rows, {
      id: a.id,
      title: a.name,
      description: `${a.tagline ?? a.name}. ${a.whoItSuits ?? ""} Gadget Hub, Nairobi.`.trim(),
      price: priceKes(a.basePriceKes),
      link: absUrl(`/accessories/${a.id}`),
      image_link: link,
      google_product_category: "Electronics > Electronics Accessories",
      product_type: `Electronics > Accessories > ${a.group}`,
      item_group_id: a.id,
    });
  }

  // iPhones first (newest sheet IDs on top), then other categories
  rows.sort((a, b) => {
    const ca = categoryRank(a.product_type);
    const cb = categoryRank(b.product_type);
    if (ca !== cb) return ca - cb;
    if (ca === 0) return sheetSortKey(b.id) - sheetSortKey(a.id);
    return a.title.localeCompare(b.title);
  });

  return rows;
}


const CSV_HEADERS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "brand",
  "google_product_category",
  "product_type",
  "item_group_id",
] as const;

export function catalogToCsv(rows: CatalogRow[]): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const r of rows) {
    lines.push(
      CSV_HEADERS.map((h) => csvEscape(String(r[h] ?? ""))).join(","),
    );
  }
  return lines.join("\n") + "\n";
}

export function catalogToGoogleXml(rows: CatalogRow[]): string {
  const items = rows
    .map(
      (r) => `    <item>
      <g:id>${escXml(r.id)}</g:id>
      <g:title>${escXml(r.title)}</g:title>
      <g:description>${escXml(r.description)}</g:description>
      <g:link>${escXml(r.link)}</g:link>
      <g:image_link>${escXml(r.image_link)}</g:image_link>
      <g:availability>${r.availability}</g:availability>
      <g:condition>${r.condition}</g:condition>
      <g:price>${escXml(r.price)}</g:price>
      <g:brand>${r.brand}</g:brand>
      <g:google_product_category>${escXml(r.google_product_category)}</g:google_product_category>
      <g:product_type>${escXml(r.product_type)}</g:product_type>
      <g:item_group_id>${escXml(r.item_group_id)}</g:item_group_id>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Gadget Hub Kenya</title>
    <link>${site.url}</link>
    <description>Apple products from Gadget Hub, Nairobi — live shop prices</description>
${items}
  </channel>
</rss>
`;
}

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
