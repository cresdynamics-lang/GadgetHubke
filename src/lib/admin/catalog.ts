/**
 * Unified product index for admin stock/price editing.
 * Defaults come from repo configs; overlays override commerce fields.
 */
import { products } from "../products";
import { models as iphoneModels } from "../iphone/models";
import { macModels } from "../mac";
import { ipadModels } from "../ipad";
import { watchModels } from "../watch";
import { airpodsModels } from "../airpods";
import { tvHomeModels } from "../tv-home";
import { accessories } from "../accessories/models";
import { getOverlayMap, type CatalogOverlayEntry } from "./overlay";

export type AdminCatalogItem = {
  id: string;
  name: string;
  group: string;
  href: string;
  basePriceKes: number;
  priceKes: number;
  inStock: boolean;
  sample: boolean;
  updatedAt?: string;
};

export function listCatalogDefaults(): AdminCatalogItem[] {
  const rows: AdminCatalogItem[] = [];

  for (const p of products) {
    rows.push({
      id: p.id,
      name: p.name,
      group: "Shop iPhone",
      href: p.overviewHref,
      basePriceKes: p.storages[0]?.priceKes ?? 0,
      priceKes: p.storages[0]?.priceKes ?? 0,
      inStock: true,
      sample: true,
    });
  }

  for (const m of iphoneModels) {
    rows.push({
      id: m.id,
      name: m.name,
      group: "iPhone catalog",
      href: `/iphone/${m.id}`,
      basePriceKes: m.basePriceKes,
      priceKes: m.basePriceKes,
      inStock: true,
      sample: true,
    });
  }

  for (const m of macModels) {
    rows.push({
      id: m.id,
      name: m.name,
      group: "Mac",
      href: `/mac/${m.id}`,
      basePriceKes: m.basePriceKes,
      priceKes: m.basePriceKes,
      inStock: true,
      sample: true,
    });
  }

  for (const m of ipadModels) {
    rows.push({
      id: m.id,
      name: m.name,
      group: "iPad",
      href: `/ipad/${m.id}`,
      basePriceKes: m.basePriceKes,
      priceKes: m.basePriceKes,
      inStock: true,
      sample: true,
    });
  }

  for (const m of watchModels) {
    rows.push({
      id: m.id,
      name: m.name,
      group: "Watch",
      href: `/watch/${m.id}`,
      basePriceKes: m.basePriceKes,
      priceKes: m.basePriceKes,
      inStock: true,
      sample: true,
    });
  }

  for (const m of airpodsModels) {
    rows.push({
      id: m.id,
      name: m.name,
      group: "AirPods",
      href: `/airpods/${m.id}`,
      basePriceKes: m.basePriceKes,
      priceKes: m.basePriceKes,
      inStock: true,
      sample: true,
    });
  }

  for (const m of tvHomeModels) {
    rows.push({
      id: m.id,
      name: m.name,
      group: "TV & Home",
      href: `/tv-home/${m.id}`,
      basePriceKes: m.basePriceKes,
      priceKes: m.basePriceKes,
      inStock: !m.noImage,
      sample: true,
    });
  }

  for (const a of accessories) {
    rows.push({
      id: a.id,
      name: a.name,
      group: "Accessories",
      href: `/accessories/${a.id}`,
      basePriceKes: a.basePriceKes,
      priceKes: a.basePriceKes,
      inStock: true,
      sample: true,
    });
  }

  return rows;
}

export async function listCatalogMerged(): Promise<AdminCatalogItem[]> {
  const overlay = await getOverlayMap();
  return listCatalogDefaults().map((row) => {
    const o = overlay[row.id];
    if (!o) return row;
    return {
      ...row,
      priceKes: o.priceKes != null ? o.priceKes : row.priceKes,
      inStock: o.inStock != null ? o.inStock : row.inStock,
      sample: false,
      updatedAt: o.updatedAt,
    };
  });
}

export type OverlayPatch = CatalogOverlayEntry & { id: string };
