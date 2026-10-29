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

/** New and Ex-UK prices for one storage — leftover sheet figures on an unlisted channel stay at 0. */
export function listedVariantPrices(
  product: PricedProduct | undefined,
  variant?: PricedProduct["variants"][number],
) {
  const productNew = product?.showOnWebsite !== false && product?.showNewOnWebsite !== false;
  const productEx = SHOW_EX_UK && product?.showOnWebsite !== false && product?.exUkShowOnWebsite !== false;
  if (!variant) {
    return { showNew: Boolean(productNew), showEx: Boolean(productEx), newKes: 0, exUkKes: 0, displayKes: 0 };
  }
  const showNew = Boolean(productNew) && variant.showOnWebsite !== false && positive(variant.priceKes);
  const showEx = Boolean(productEx) && variant.exUkShowOnWebsite !== false && positive(variant.exUkKes);
  const newKes = showNew ? variant.priceKes : 0;
  const exUkKes = showEx ? variant.exUkKes! : 0;
  return { showNew, showEx, newKes, exUkKes, displayKes: newKes || exUkKes };
}

function newPrice(p: PricedProduct) {
  const shown = p.variants.filter((variant) => listedVariantPrices(p, variant).showNew);
  const pool = shown.length ? shown : [];
  const inStock = pool.filter((variant) => variant.inStock);
  const prices = (inStock.length ? inStock : pool).map((variant) => variant.priceKes).filter(positive);
  if (prices.length) return Math.min(...prices);
  if (p.showNewOnWebsite === false) return 0;
  return positive(p.priceKes) ? p.priceKes : 0;
}

function exUkPrice(p: PricedProduct) {
  const shown = p.variants.filter((variant) => listedVariantPrices(p, variant).showEx);
  const inStock = shown.filter((variant) => variant.exUkInStock !== false);
  const prices = (inStock.length ? inStock : shown).map((variant) => variant.exUkKes!).filter(positive);
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

  if (!offers.length && product?.showOnWebsite !== false && showNew) {
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
