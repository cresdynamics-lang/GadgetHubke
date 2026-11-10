/**
 * Fills the live price placeholders in Journal articles, following the live list:
 *   {{price:iphone-17-pro}}       lowest listed price ("KES 158,000"), or "KES 80,000 Ex-UK" if not sold new
 *   {{price:iphone-17-pro:256}}   one storage / configuration
 *   {{exuk:iphone-15:128}}        Ex-UK price for that option
 * Ids are product or iPhone page ids. A price with nothing listed behind it never prints:
 * article text loses that list item or sentence, and titles and descriptions lose that price.
 */
import { isListedForSale, listedVariantPrices, listingOffers } from "./listing-offers.ts";
import type { PricedProduct } from "./pricing/live.ts";

export type JournalCatalog = {
  byId: Map<string, PricedProduct>;
  liveId: (id: string) => string;
};

const PRICE_TOKEN = /\{\{(price|exuk):([a-z0-9-]+)(?::([a-z0-9-]+))?\}\}/g;
const PRODUCT_LINK = /\[([^\]]+)\]\(\/(?:iphone|ipad|mac|watch|airpods|tv-home|accessories)\/([a-z0-9-]+)\)/g;
const NOT_LISTED = "\u0000";
const SOLD_NEW_WORDING = /\b(sealed|new)\b/i;
const LIST_SEPARATOR = /(; and |, and |; |, | · | and )/;

function kes(n: number) {
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
}

function productFor(id: string, catalog: JournalCatalog) {
  return catalog.byId.get(id) ?? catalog.byId.get(catalog.liveId(id));
}

/** New and Ex-UK prices behind a placeholder; 0 where that option is not listed and in stock. */
function listedPrices(product: PricedProduct, key?: string) {
  if (!isListedForSale(product)) return { newKes: 0, exUkKes: 0 };
  if (!key) {
    const offers = listingOffers(product, "").filter((offer) => offer.inStock && offer.priceKes > 0);
    return {
      newKes: offers.find((offer) => offer.channel === "new")?.priceKes ?? 0,
      exUkKes: offers.find((offer) => offer.channel === "ex-uk")?.priceKes ?? 0,
    };
  }
  const variant = product.variants.find((row) => row.key === key);
  if (!variant) return { newKes: 0, exUkKes: 0 };
  const listed = listedVariantPrices(product, variant);
  return {
    newKes: variant.inStock && product.inStock !== false ? listed.newKes : 0,
    exUkKes: variant.exUkInStock !== false && product.exUkInStock !== false ? listed.exUkKes : 0,
  };
}

/** The label for one placeholder, or NOT_LISTED. `exUkInPlaceOfNew` marks a New price replaced by Ex-UK. */
function tokenLabel(kind: string, id: string, key: string | undefined, catalog: JournalCatalog) {
  const product = productFor(id, catalog);
  if (!product) return { label: NOT_LISTED, exUkInPlaceOfNew: false };
  const { newKes, exUkKes } = listedPrices(product, key);
  if (kind === "exuk") return { label: exUkKes ? kes(exUkKes) : NOT_LISTED, exUkInPlaceOfNew: false };
  if (newKes) return { label: kes(newKes), exUkInPlaceOfNew: false };
  return exUkKes ? { label: `${kes(exUkKes)} Ex-UK`, exUkInPlaceOfNew: true } : { label: NOT_LISTED, exUkInPlaceOfNew: false };
}

/** Plain text instead of a link that would only redirect away from an off-list product. */
function unlinkOffList(text: string, catalog: JournalCatalog) {
  return text.replace(PRODUCT_LINK, (whole, label: string, id: string) => {
    const product = productFor(id, catalog);
    return product && !isListedForSale(product) ? label : whole;
  });
}

function fillTokens(text: string, catalog: JournalCatalog) {
  let exUkInPlaceOfNew = false;
  const filled = text.replace(PRICE_TOKEN, (_whole, kind: string, id: string, key?: string) => {
    const token = tokenLabel(kind, id, key, catalog);
    exUkInPlaceOfNew ||= token.exUkInPlaceOfNew;
    return token.label;
  });
  return { filled, exUkInPlaceOfNew };
}

/** One pattern per catalogue: it is the same for every paragraph and answer rendered from it. */
const offListCache = new WeakMap<JournalCatalog, RegExp | null>();

/** How article text names products that are off the list, e.g. "iPhone 16e", "16e", "MacBook Air 13-inch M4". */
function offListNames(catalog: JournalCatalog): RegExp | null {
  if (offListCache.has(catalog)) return offListCache.get(catalog)!;
  const pattern = buildOffListNames(catalog);
  offListCache.set(catalog, pattern);
  return pattern;
}

function buildOffListNames(catalog: JournalCatalog): RegExp | null {
  const products = [...catalog.byId.values()];
  const spellings = (name: string) => {
    const inches = name.replace(/″/g, "-inch");
    const noSize = name.replace(/ \d+″/, "");
    const short = /^iPhone \d+\s?[a-zA-Z]/.test(name) ? name.replace("iPhone ", "") : "";
    return [name, inches, noSize, short].filter(Boolean);
  };
  const onList = new Set(products.filter(isListedForSale).flatMap((p) => spellings(p.name)));
  const names = products
    .filter((p) => !isListedForSale(p))
    .flatMap((p) => spellings(p.name))
    .filter((name) => !onList.has(name));
  if (!names.length) return null;
  const escaped = [...new Set(names)].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(?<![\\w-])(?:${escaped.join("|")})(?![\\w-])`);
}

/** One sentence: a list loses only its unavailable items, anything else goes whole. Empty when nothing is left. */
function renderSentence(sentence: string, catalog: JournalCatalog, offList: RegExp | null) {
  const pieces = sentence.split(LIST_SEPARATOR);
  const tokenParts = pieces.filter((piece, i) => i % 2 === 0 && piece.includes("{{")).length;
  let out = "";
  let priced = 0;
  let exUkInPlaceOfNew = false;
  for (let i = 0; i < pieces.length; i += 2) {
    const { filled, exUkInPlaceOfNew: replacedNew } = fillTokens(pieces[i], catalog);
    const notSoldNew = replacedNew && /^(?:and )?new from\b/i.test(pieces[i]);
    if (filled.includes(NOT_LISTED) || notSoldNew) {
      if (tokenParts < 2) return "";
      continue;
    }
    if (pieces[i].includes("{{")) priced += 1;
    exUkInPlaceOfNew ||= replacedNew;
    out += (out ? pieces[i - 1] : "") + filled;
  }
  if (tokenParts && !priced) return "";
  if (exUkInPlaceOfNew && SOLD_NEW_WORDING.test(out)) return "";
  if (offList?.test(out)) return "";
  return /[.!?]$/.test(out) || !/[.!?]$/.test(sentence) ? out : `${out}${sentence.slice(-1)}`;
}

/** Article paragraphs and FAQ answers: a sentence about something unavailable goes, and so does a question it answered. */
export function renderJournalBody(text: string, catalog: JournalCatalog): string {
  if (!text) return text;
  const offList = offListNames(catalog);
  const kept: string[] = [];
  for (const sentence of unlinkOffList(text, catalog).split(/(?<=[.!?])\s+/)) {
    const rendered = renderSentence(sentence, catalog, offList);
    if (rendered) kept.push(rendered);
    else if (kept.at(-1)?.endsWith("?")) kept.pop();
  }
  return kept.join(" ");
}

/** Titles and descriptions: keep the wording and take out only the unavailable price. */
export function renderJournalMeta(text: string, catalog: JournalCatalog): string {
  if (!text) return text;
  const { filled } = fillTokens(unlinkOffList(text, catalog), catalog);
  const withNewPricesOut = filled.replace(/\bKES [\d,]+ Ex-UK new\b|\bnew from KES [\d,]+ Ex-UK\b/gi, NOT_LISTED);
  return withNewPricesOut
    .replace(new RegExp(`[,;]\\s[^,;.:—]*?\\b(?:from|at) ${NOT_LISTED}(?: new| Ex-UK)?(?=[,;.])`, "g"), "")
    .replace(new RegExp(`(?:\\s+and|\\s+(?:new\\s+)?(?:from|at|starts at))?\\s*${NOT_LISTED}(?: new| Ex-UK)?`, "g"), "")
    .replace(/:\s*,\s*/g, ": ")
    .replace(/,(?=[.,;])/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Shop link text such as "iPhone 16 KES 80,000 Ex-UK"; undefined when the product is off the list. */
export function journalShopPrice(id: string, catalog: JournalCatalog): string | undefined {
  const { label } = tokenLabel("price", id, undefined, catalog);
  return label === NOT_LISTED ? undefined : label;
}
