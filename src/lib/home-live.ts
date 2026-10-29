/**
 * Homepage / mega merchandising uses live overlay prices and listed SKUs.
 * Fallback numbers in home.ts stay as art direction only.
 */
import type { DealItem, HomeCategoryRow } from "./home";
import type { PricedProduct } from "./pricing/live";

export function isListed(product: PricedProduct | undefined): product is PricedProduct {
  return Boolean(product && product.showOnWebsite !== false);
}

const DEAL_ALIASES: Record<string, string> = {
  "new-duo": "iphone-duo",
  "new-pro": "iphone-pro",
  "new-mac-air": "macbook-air-13-m4",
  "new-ipad-pro": "ipad-pro",
  "new-watch": "watch",
  "new-airpods": "airpods-pro-3",
  "mba-13-m4": "macbook-air-13-m4",
  "mba-15-m4": "macbook-air-15-m4",
  "mba-13-m3": "macbook-air-13-m3",
  "mba-15-m2": "macbook-air-15-m2",
  "mbp-14-m4": "macbook-pro-14-m4",
  "mbp-16-m4": "macbook-pro-16-m4-pro",
  "mbp-14-m3": "macbook-pro-14-m3",
  "mbp-13-m2": "macbook-pro-13-m2",
  "watch-s12": "watch-s12-42",
  "watch-ultra": "watch-ultra-4",
  "watch-s11": "watch-s11-42",
  "watch-se": "watch-se3-40",
  "watch-s10": "watch-s10-42",
  "ap-pro-3": "airpods-pro-3",
  "ap-5": "airpods-5",
  "ap-pro": "airpods-pro-3",
  "ap-4": "airpods-4",
  "ap-max": "airpods-max-2",
  "ipad-pro-13": "ipad-pro-13-m5",
  "ipad-air": "ipad-air-11-m4",
  "ipad-mini": "ipad-mini-a17-pro",
};

function slugFromHref(href: string): string | undefined {
  const path = href.split("?")[0].replace(/\/+$/, "");
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 2) return undefined;
  return parts.at(-1);
}

function successorIds(id: string): string[] {
  const match = id.match(/-m([1-4])(?=-|$)/i);
  if (!match) return [];
  const current = Number(match[1]);
  const out: string[] = [];
  for (let next = current + 1; next <= 5; next += 1) {
    out.push(id.replace(/-m[1-4](?=-|$)/i, `-m${next}`));
  }
  return out;
}

function cheapestListed(catalog: PricedProduct[], predicate: (product: PricedProduct) => boolean): PricedProduct | undefined {
  return catalog
    .filter((product) => isListed(product) && predicate(product))
    .sort((a, b) => a.priceKes - b.priceKes)[0];
}

function listedById(catalog: Map<string, PricedProduct>, id: string | undefined): PricedProduct | undefined {
  if (!id) return undefined;
  const direct = catalog.get(id);
  if (isListed(direct)) return direct;
  for (const successor of successorIds(id)) {
    const next = catalog.get(successor);
    if (isListed(next)) return next;
  }
  return undefined;
}

export function resolveLiveProduct(
  item: { id: string; name: string; href: string },
  catalog: PricedProduct[],
): PricedProduct | undefined {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const candidates = [DEAL_ALIASES[item.id], item.id, slugFromHref(item.href)].filter(Boolean) as string[];

  for (const id of candidates) {
    const hit = listedById(byId, id);
    if (hit) return hit;
  }

  const name = item.name.toLowerCase();
  const href = item.href.split("?")[0];

  if (/iphone duo/.test(name) || href.includes("iphone-duo")) return listedById(byId, "iphone-duo");
  if (/iphone 18 pro max/.test(name) || href.includes("iphone-pro-max")) return listedById(byId, "iphone-pro-max");
  if (/iphone 18 pro/.test(name) || /\/iphone-pro$/.test(href)) return listedById(byId, "iphone-pro");
  if (/ipad pro/.test(name) || href.includes("ipad-pro")) {
    return cheapestListed(catalog, (product) => product.group === "iPad" && product.id.includes("ipad-pro"));
  }
  if (/ipad air/.test(name)) return cheapestListed(catalog, (product) => product.group === "iPad" && product.id.includes("ipad-air"));
  if (/ipad mini/.test(name)) return cheapestListed(catalog, (product) => product.group === "iPad" && product.id.includes("ipad-mini"));
  if (name === "ipad") return cheapestListed(catalog, (product) => product.group === "iPad" && /^ipad-a?\d/.test(product.id));
  if (/macbook air/.test(name)) return cheapestListed(catalog, (product) => product.group === "Mac" && product.id.startsWith("macbook-air"));
  if (/macbook pro/.test(name)) return cheapestListed(catalog, (product) => product.group === "Mac" && product.id.startsWith("macbook-pro"));
  if (/airpods pro/.test(name)) return cheapestListed(catalog, (product) => product.group === "AirPods" && product.id.includes("airpods-pro"));
  if (/airpods max/.test(name)) return cheapestListed(catalog, (product) => product.group === "AirPods" && product.id.includes("airpods-max"));
  if (/airpods 4/.test(name)) return listedById(byId, "airpods-4");
  if (/series 12/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("watch-s12"));
  if (/series 11/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("watch-s11"));
  if (/watch ultra/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("watch-ultra"));
  if (/watch se/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("watch-se"));
  if (name === "apple watch" || href === "/watch") return cheapestListed(catalog, (product) => product.group === "Watch");
  if (/pencil/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("pencil-"));
  if (/magic keyboard/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("keyboard-"));
  if (/magic mouse|pointers/.test(name)) return cheapestListed(catalog, (product) => product.id.startsWith("mouse-"));

  return undefined;
}

function displayName(item: { name: string }, live: PricedProduct): string {
  if (/\bm[1-4]\b/i.test(item.name) && live.name) return live.name;
  return item.name;
}

export function liveMerchItems<T extends { id: string; name: string; href: string; priceKes: number }>(
  items: T[],
  catalog: PricedProduct[],
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const live = resolveLiveProduct(item, catalog);
    if (!live || seen.has(live.id)) continue;
    seen.add(live.id);
    out.push({
      ...item,
      id: live.id,
      href: live.href || item.href,
      priceKes: live.priceKes,
      name: displayName(item, live),
    });
  }
  return out;
}

export function liveDealItems(items: DealItem[], catalog: PricedProduct[]): DealItem[] {
  return liveMerchItems(items, catalog);
}

export function liveHomeCategoryRows(rows: HomeCategoryRow[], catalog: PricedProduct[]): HomeCategoryRow[] {
  return rows
    .map((row) => ({ ...row, items: liveDealItems(row.items, catalog) }))
    .filter((row) => row.items.length > 0);
}
