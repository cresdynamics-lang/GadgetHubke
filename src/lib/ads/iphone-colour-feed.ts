/**
 * Google Merchant Center iPhone rows: one per colour × storage × condition offered on the site.
 *
 * Everything comes from the live shop: the per-storage rows (prices, stock, listing flags)
 * are worked out by applyLivePrices exactly as for the old one-row-per-storage feed, then
 * each is split by the colours photographed for that model. Nothing here holds a price.
 */
import { site } from "../site";
import { lipaPlan } from "../pricing/lipa";
import { iphoneSeoCatalog } from "../iphone/seo/catalog";
import { storagePath, storageGb } from "../iphone/seo/variant-pages";
import type { IphoneSeoModel } from "../iphone/seo/types";
import { getModel, type IphoneModel } from "../iphone/models";
import { availableColours, availableViews, getImage, textOnlyColours } from "../iphone/images";
import { colourLabel } from "../iphone/colours";
import { identifiersFor } from "./identifiers";
import { colourSku, modelGroupCode } from "./feed-ids";

export { colourSku, modelGroupCode };

export type ProductDetail = { section: string; attribute: string; value: string };

/** Extra Google attributes on top of the shared catalog row. */
export type GoogleExtras = {
  color?: string;
  gtin?: string;
  mpn?: string;
  identifier_exists?: "no";
  additional_image_link?: string[];
  product_detail?: ProductDetail[];
  product_highlight?: string[];
  custom_label_0?: string;
  custom_label_1?: string;
  custom_label_2?: string;
};

/** A per-storage row as the old feed builds it (live price, stock and copy already applied). */
export type StorageRow = {
  id: string;
  title: string;
  description: string;
  price: string;
  availability: string;
  link: string;
  image_link: string;
};

export type ColourRow = {
  id: string;
  item_group_id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  price: string;
  availability: "in_stock" | "out_of_stock" | "preorder";
  condition: "new" | "used";
  brand: "Apple";
  google_product_category: string;
  product_type: string;
} & GoogleExtras;

/** Live colour stock lists for one product (empty or missing = every colour). */
export type ColourStock = { coloursInStock?: string[]; exUkColoursInStock?: string[] };

export type MissingPhoto = { model: string; storage?: string; colour: string };

const STORE_LINE = `${site.address}, ${site.landmark}`;
const squash = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

export function colourLink(seoId: string, storage: string, colourKey: string | null, exUk: boolean): string {
  const url = new URL(storagePath(seoId, storage), site.url);
  if (colourKey) url.searchParams.set("colour", colourKey);
  if (exUk) url.searchParams.set("condition", "ex-uk");
  return url.href;
}

function kes(n: number): string {
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function storageUse(storage: string): string {
  const gb = storageGb(storage);
  if (gb <= 64) return `The ${storage} size suits calls, messaging and streaming, with photos kept in iCloud.`;
  if (gb <= 128) return `The ${storage} size suits everyday use: apps, photos and some video.`;
  if (gb <= 256) return `The ${storage} size suits heavy photo and 4K video use without running out of space.`;
  if (gb <= 512) return `The ${storage} size suits large photo libraries, long 4K video and offline media.`;
  return `The ${storage} size is for pro video, very large photo libraries and offline media kept on the phone.`;
}

/** Spec sentences from the model's own data, for models without hand-written feed copy. */
function specSentences(m: IphoneModel, exUk: boolean): string[] {
  if (m.specsPending) return [];
  const out: string[] = [];
  if (m.displayInches) {
    const res = m.resolution ? ` (${m.resolution}${m.ppi ? `, ${m.ppi} ppi` : ""})` : "";
    const hz = m.refreshHz > 60 ? ` with a refresh rate up to ${m.refreshHz}Hz` : "";
    const cut = m.cutout ? ` and ${m.cutout}` : "";
    out.push(`It has a ${m.displayInches}-inch display${res}${hz}${cut}.`);
  }
  if (m.chip) out.push(`It runs on the ${m.chip} chip${m.appleIntelligence ? " and supports Apple Intelligence" : ""}.`);
  if (m.rearCameras.length)
    out.push(`Rear cameras: ${joinList(m.rearCameras)}${m.frontCamera ? `; front camera: ${m.frontCamera}` : ""}.`);
  if (m.batteryVideoHours)
    out.push(`Apple rates battery life at up to ${m.batteryVideoHours} hours of video playback${exUk ? " for a new battery" : ""}.`);
  const extras = [m.cameraControl ? "Camera Control" : "", m.actionButton ? "the Action button" : ""].filter(Boolean);
  if (extras.length) out.push(`${joinList(extras)} ${extras.length > 1 ? "are" : "is"} included.`);
  out.push(`The port is ${m.port}${m.magsafe ? ", with MagSafe support" : ""}.`);
  const conn = [m.cellular, m.wifi, m.faceId ? "Face ID" : "", m.crashDetection ? "Crash Detection" : ""].filter(Boolean);
  if (conn.length) out.push(`Features: ${joinList(conn)}.`);
  const build = [m.frame ? `${m.frame.toLowerCase()} frame` : "", m.glass ?? "", m.waterResistance, m.weightGrams ? `${m.weightGrams} g` : ""].filter(Boolean);
  if (build.length) out.push(`Build: ${build.join(", ")}.`);
  return out;
}

function conditionLines(name: string, exUk: boolean): string[] {
  return exUk
    ? [
        "Ex-UK means UK-used. Condition, included items and warranty terms are stated on the GadgetHub invoice, and battery health is checked on request before you buy.",
      ]
    : [`New and sealed, with a ${site.warranty.years}-year warranty.`, `In the box: ${name}, charge cable and documentation.`];
}

function buyingLines(priceKes: number): string[] {
  const plan = lipaPlan(priceKes, 40, 6);
  return [
    `Pay in full by M-Pesa, or with Lipa Mdogo Mdogo: a 40% deposit of ${kes(plan.depositKes)} today and the balance over 1 to 6 months.`,
    `Delivery in Nairobi and across Kenya, priced by location, or collect from our shop at ${STORE_LINE}.`,
  ];
}

/**
 * The row's description: the hand-written storage copy when there is one (its colour list
 * narrowed to this colour), otherwise copy built from the model's specs; then condition,
 * payment for this storage's price, delivery and the shop. Always 500–1,500 characters.
 */
export function colourDescription(opts: {
  base: string;
  hasEditorial: boolean;
  seo: IphoneSeoModel;
  model?: IphoneModel;
  storage: string;
  colour?: string;
  exUk: boolean;
  priceKes: number;
}): string {
  const { seo, model, storage, colour, exUk, priceKes } = opts;
  const colourLine = colour ? `Colour: ${colour}.` : "";
  let body: string[];
  if (opts.hasEditorial) {
    let text = opts.base.trim();
    const listRe = /(Colours?: [^.]+\.|Available in [^.]+\.)/;
    if (colourLine) text = listRe.test(text) ? text.replace(listRe, colourLine) : text.replace(/^([^.]+\.)/, `$1 ${colourLine}`);
    body = [text];
  } else {
    body = [
      `Apple ${seo.name} with ${storage} of storage, sold ${exUk ? "Ex-UK (UK-used)" : "new"} by GadgetHub in Nairobi, Kenya.`,
      colourLine,
      ...(model ? specSentences(model, exUk) : []),
      storageUse(storage),
      ...conditionLines(seo.name, exUk),
    ].filter(Boolean);
  }
  const tail = buyingLines(priceKes);
  // Keep within Google's limit: drop spec sentences from the end of the body, never the condition or payment lines.
  let text = [...body, ...tail].join(" ");
  if (!opts.hasEditorial) {
    const fixed = conditionLines(seo.name, exUk).length + 1;
    while (text.length > 1500 && body.length > fixed + 2) {
      body.splice(body.length - fixed - 1, 1);
      text = [...body, ...tail].join(" ");
    }
  } else if (text.length > 1500) {
    const sentences = body[0].split(/(?<=\.)\s+/);
    while (sentences.length > 3 && [...sentences, ...tail].join(" ").length > 1500) sentences.splice(sentences.length - 2, 1);
    text = [...sentences, ...tail].join(" ");
  }
  return text;
}

function highlights(m: IphoneModel | undefined, storage: string, exUk: boolean): string[] {
  const out: string[] = [];
  if (m && !m.specsPending) {
    if (m.chip) out.push(`${m.chip} chip${m.appleIntelligence ? " with Apple Intelligence" : ""}`);
    if (m.displayInches) out.push(`${m.displayInches}-inch display${m.refreshHz > 60 ? ` up to ${m.refreshHz}Hz` : ""}`);
    if (m.rearCameras.length) out.push(`${joinList(m.rearCameras)} rear camera${m.rearCameras.length > 1 ? "s" : ""}`);
    if (m.batteryVideoHours) out.push(`Up to ${m.batteryVideoHours} hours of video playback${exUk ? " (new battery)" : ""}`);
  }
  out.push(`${storage} storage`);
  out.push(exUk ? "Ex-UK (UK-used), terms on the GadgetHub invoice" : `New and sealed, ${site.warranty.years}-year warranty`);
  return out.slice(0, 6);
}

/** Site-relative photo paths for one colour, main view first. */
export function colourPhotos(modelId: string, colourKey: string): string[] {
  return availableViews(modelId, colourKey).map((v) => getImage(modelId, colourKey, v).src);
}

/**
 * Split per-storage rows into colour rows.
 * `square` turns a site photo path into the feed's square JPEG URL.
 */
export function expandIphoneRows(
  rows: StorageRow[],
  opts: {
    stockFor: (seoId: string) => ColourStock | undefined;
    hasEditorial: (sheetId: string, exUk: boolean) => boolean;
    square: (publicPath: string) => string;
  },
): { rows: ColourRow[]; missingPhotos: MissingPhoto[] } {
  const bySheet = new Map<string, { seo: IphoneSeoModel; storage: string }>();
  for (const seo of iphoneSeoCatalog) for (const v of seo.variants) bySheet.set(v.sheetId, { seo, storage: v.storage });

  const out: ColourRow[] = [];
  const missing: MissingPhoto[] = [];
  const missingSeen = new Set<string>();
  for (const row of rows) {
    const exUk = row.id.endsWith("-EXUK");
    const sheetId = exUk ? row.id.slice(0, -5) : row.id;
    const hit = bySheet.get(sheetId);
    if (!hit) continue;
    const { seo, storage } = hit;
    const model = getModel(seo.id);
    const priceKes = Number(row.price.replace(/[^\d.]/g, ""));
    const photoColours = availableColours(seo.id).filter((c) => colourPhotos(seo.id, c).length);
    for (const c of textOnlyColours(seo.id)) {
      if (missingSeen.has(`${seo.id}|${c}`)) continue;
      missingSeen.add(`${seo.id}|${c}`);
      missing.push({ model: seo.name, colour: colourLabel(c) });
    }
    const stock = opts.stockFor(seo.id);
    const list = ((exUk ? stock?.exUkColoursInStock : stock?.coloursInStock) ?? []).map(squash);
    const family = model?.family ?? Number(seo.name.match(/\d+/)?.[0] ?? 0);
    const common = {
      item_group_id: `${modelGroupCode(seo.id)}-${exUk ? "EXUK" : "NEW"}`,
      price: row.price,
      condition: (exUk ? "used" : "new") as ColourRow["condition"],
      brand: "Apple" as const,
      google_product_category: "267",
      product_type: `Phones > iPhone > iPhone ${family || ""}`.trim() + ` > ${seo.name}`,
      product_detail: [{ section: "General", attribute: "Storage", value: storage }],
      product_highlight: highlights(model, storage, exUk),
      custom_label_0: family ? `iPhone ${family}` : seo.series,
      custom_label_1: exUk ? "Ex-UK" : "New",
      custom_label_2: storage,
    };
    const condTitle = exUk ? "Used ex-UK" : "Brand New, Sealed";
    const description = (colour?: string) =>
      colourDescription({
        base: row.description,
        hasEditorial: opts.hasEditorial(sheetId, exUk),
        seo,
        model,
        storage,
        colour,
        exUk,
        priceKes,
      });

    if (!photoColours.length) {
      // No colour photos (e.g. overview only): one row for the storage, on the overview photo.
      missing.push({ model: seo.name, storage, colour: "all colours (overview photo only)" });
      const id = row.id;
      out.push({
        ...common,
        ...idFields(id),
        id,
        title: `Apple ${seo.name} ${storage} – ${condTitle}`,
        description: description(),
        link: colourLink(seo.id, storage, null, exUk),
        image_link: row.image_link,
        availability: row.availability as ColourRow["availability"],
      });
      continue;
    }

    for (const key of photoColours) {
      const label = colourLabel(key);
      const photos = colourPhotos(seo.id, key).map(opts.square);
      const inStock = !list.length || list.includes(squash(key)) || list.includes(squash(label));
      const id = colourSku(sheetId, key, exUk);
      out.push({
        ...common,
        ...idFields(id),
        id,
        title: `Apple ${seo.name} ${storage} ${label} – ${condTitle}`,
        description: description(label),
        link: colourLink(seo.id, storage, key, exUk),
        image_link: photos[0],
        additional_image_link: photos.slice(1, 11),
        availability: inStock ? (row.availability as ColourRow["availability"]) : "out_of_stock",
        color: label,
      });
    }
  }
  return { rows: out, missingPhotos: missing };
}

/** gtin / mpn from product-identifiers.json; identifier_exists "no" only when neither is filled in. */
export function idFields(id: string): Pick<GoogleExtras, "gtin" | "mpn" | "identifier_exists"> {
  const { gtin, mpn } = identifiersFor(id);
  if (!gtin && !mpn) return { identifier_exists: "no" };
  return { ...(gtin ? { gtin } : {}), ...(mpn ? { mpn } : {}) };
}
