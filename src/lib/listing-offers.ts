/**
 * Listing cards are one offer per condition. New and Ex-UK never share a card
 * or a toggle — if both are listed, the grid shows two cards of the same model.
 */
import { SHOW_EX_UK } from "./iphone/seo/flags.ts";
import type { PricedProduct } from "./pricing/live.ts";

export type ListingChannel = "new" | "ex-uk";

export type ListingOffer = {
  channel: ListingChannel;
  priceKes: number;
  colours: string[];
  href: string;
  inStock: boolean;
};

export function colourKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Keep only colours marked in stock. Unknown keys are ignored; if none match, keep the catalog set so the card still has art. */
export function filterColours<T extends string>(all: readonly T[], inStock?: readonly string[] | null): T[] {
  if (!inStock?.length) return [...all];
  const allowed = new Set(inStock.map(colourKey));
  const hit = all.filter((colour) => allowed.has(colourKey(colour)));
  return hit.length ? hit : [...all];
}

export function channelHref(href: string, channel: ListingChannel) {
  if (channel !== "ex-uk") return href;
  const joiner = href.includes("?") ? "&" : "?";
  if (/[?&]condition=/.test(href)) return href;
  return `${href}${joiner}condition=ex-uk`;
}

function positive(n: number | undefined) {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

function newPrice(p: PricedProduct) {
  const shown = p.variants.filter((variant) => variant.showOnWebsite !== false);
  const pool = shown.length ? shown : p.variants;
  const inStock = pool.filter((variant) => variant.inStock);
  const prices = (inStock.length ? inStock : pool).map((variant) => variant.priceKes).filter(positive);
  if (prices.length) return Math.min(...prices);
  return positive(p.priceKes) ? p.priceKes : 0;
}

function exUkPrice(p: PricedProduct) {
  const shown = p.variants.filter((variant) => variant.showOnWebsite !== false && variant.exUkShowOnWebsite !== false);
  const pool = shown.length ? shown : p.variants;
  const withEx = pool.filter((variant) => positive(variant.exUkKes));
  const inStock = withEx.filter((variant) => variant.exUkInStock !== false && variant.inStock);
  const prices = (inStock.length ? inStock : withEx).map((variant) => variant.exUkKes!).filter(positive);
  if (prices.length) return Math.min(...prices);
  return positive(p.exUkKes) ? p.exUkKes! : 0;
}

export function listingOffers(product: PricedProduct | undefined, href: string, fallbackPrice = 0): ListingOffer[] {
  if (product?.showOnWebsite === false) return [];

  const showNew = product?.showNewOnWebsite !== false;
  const showExUk = SHOW_EX_UK && product?.exUkShowOnWebsite !== false;
  const offers: ListingOffer[] = [];

  if (showNew) {
    const priceKes = product ? newPrice(product) : fallbackPrice;
    if (priceKes > 0 || !product) {
      offers.push({
        channel: "new",
        priceKes: priceKes || fallbackPrice,
        colours: product?.coloursInStock ?? [],
        href: channelHref(href, "new"),
        inStock: product?.inStock !== false,
      });
    }
  }

  if (showExUk && product) {
    const priceKes = exUkPrice(product);
    if (priceKes > 0) {
      offers.push({
        channel: "ex-uk",
        priceKes,
        colours: product.exUkColoursInStock?.length ? product.exUkColoursInStock : product.coloursInStock ?? [],
        href: channelHref(href, "ex-uk"),
        inStock: product.exUkInStock !== false,
      });
    }
  }

  if (!offers.length && product?.showOnWebsite !== false) {
    offers.push({
      channel: "new",
      priceKes: fallbackPrice || product?.priceKes || 0,
      colours: product?.coloursInStock ?? [],
      href,
      inStock: product?.inStock !== false,
    });
  }

  return offers;
}

export function listingRows<T extends { id: string }>(
  items: T[],
  catalog: PricedProduct[] | Map<string, PricedProduct>,
  opts: {
    href: (item: T) => string;
    liveId?: (item: T) => string;
    fallbackPrice: (item: T) => number;
  },
): { item: T; offer: ListingOffer }[] {
  const map = catalog instanceof Map ? catalog : new Map(catalog.map((row) => [row.id, row]));
  const rows: { item: T; offer: ListingOffer }[] = [];
  for (const item of items) {
    const liveId = opts.liveId ? opts.liveId(item) : item.id;
    const product = map.get(liveId);
    const offers = listingOffers(product, opts.href(item), opts.fallbackPrice(item));
    for (const offer of offers) rows.push({ item, offer });
  }
  return rows;
}
