/**
 * Manifest accessors for AirPods images (v2 keys: page/section/readable).
 */
import generated from "./generated-manifest.json";
import type { AirpodsModel } from "./models";

export type AirpodsManifest = typeof generated;
export const airpodsManifest = generated as AirpodsManifest;

export type AirpodsProductKey = keyof AirpodsManifest["products"];

const MODEL_TO_PRODUCT: Record<string, string> = {
  "airpods-pro-3": "pro-3",
  "airpods-pro-2": "pro-2",
  "airpods-pro-1": "pro-2",
  "airpods-5": "airpods-5",
  "airpods-5-wireless": "airpods-5",
  "airpods-4": "airpods-4",
  "airpods-4-anc": "airpods-4",
  "airpods-3": "airpods-4",
  "airpods-2": "airpods-4",
  "airpods-max-2": "max",
  "airpods-max-usbc": "max",
  "airpods-max-2020": "max",
};

const CASE_FOR_MODEL: Record<string, string> = {
  "airpods-pro-3": "charging-case-for-airpods-pro-3",
  "airpods-pro-2": "airpods-pro-magsafe-charging-case-usb-c",
  "airpods-pro-1": "airpods-pro-charging-case-magsafe-charging-case",
  "airpods-5": "charging-case-for-airpods-5",
  "airpods-5-wireless": "wireless-charging-case-for-airpods-5",
  "airpods-4": "charging-case-for-airpods-4",
  "airpods-4-anc": "wireless-charging-case-for-airpods-4",
  "airpods-3": "airpods-lightning-charging-case-magsafe-charging-case-3rd-generation",
  "airpods-2": "airpods-lightning-charging-case",
};

export function productKey(modelId: string, model?: AirpodsModel): string {
  return MODEL_TO_PRODUCT[modelId] || (model ? MODEL_TO_PRODUCT[model.id] : "") || "airpods-5";
}

export function productEntry(modelId: string, model?: AirpodsModel) {
  const key = productKey(modelId, model) as AirpodsProductKey;
  return airpodsManifest.products[key];
}

export function heroSrc(modelId: string, model?: AirpodsModel): string | undefined {
  return productEntry(modelId, model)?.hero as string | undefined;
}

export function earbudsSrc(modelId: string, model?: AirpodsModel): string | undefined {
  const p = productEntry(modelId, model);
  return (p?.earbuds || p?.hero) as string | undefined;
}

export function gallerySrcs(modelId: string, model?: AirpodsModel): string[] {
  return ((productEntry(modelId, model)?.gallery as string[]) || []).filter(Boolean);
}

export function maxColourSrc(colour: string): string | undefined {
  const colours = airpodsManifest.products.max?.colours as Record<string, string> | undefined;
  return colours?.[colour.toLowerCase()];
}

export function caseSrc(modelId: string, _model?: AirpodsModel): string | undefined {
  const stem = CASE_FOR_MODEL[modelId];
  if (stem && airpodsManifest.cases[stem as keyof typeof airpodsManifest.cases]) {
    return airpodsManifest.cases[stem as keyof typeof airpodsManifest.cases];
  }
  const p = productEntry(modelId);
  return (p?.caseWireless || p?.case) as string | undefined;
}

export function caseOverviewSrc(stem: string): string | undefined {
  return airpodsManifest.cases[stem as keyof typeof airpodsManifest.cases];
}

export function swatchSrc(colour: string): string | undefined {
  return airpodsManifest.swatches[colour as keyof typeof airpodsManifest.swatches];
}

export function compareSrc(feat: string): string | undefined {
  const key = feat.startsWith("airpods-") ? feat : `airpods-compare-${feat}`;
  return (
    airpodsManifest.compare[key as keyof typeof airpodsManifest.compare] ||
    airpodsManifest.compare[feat as keyof typeof airpodsManifest.compare]
  );
}

export function marketingSrc(which: string): string | undefined {
  return airpodsManifest.marketing[which as keyof typeof airpodsManifest.marketing];
}

/** Page asset by full key e.g. pro/welcome/hero_startframe */
export function pageKey(key: string): { src?: string; webp?: string; start?: string; end?: string; startWebp?: string; endWebp?: string } | undefined {
  return airpodsManifest.pages[key as keyof typeof airpodsManifest.pages] as
    | { src?: string; webp?: string; start?: string; end?: string; startWebp?: string; endWebp?: string }
    | undefined;
}

/** @deprecated use pageKey - kept for older callers */
export function pageAsset(pageFamily: string, kind: string): string | undefined {
  const map: Record<string, string> = {
    Pro: "pro",
    AirPods5: "airpods5",
    Max: "max",
    Landing: "landing",
  };
  const page = map[pageFamily] || pageFamily.toLowerCase();
  const entry = pageKey(`${page}/${kind}`) || pageKey(`${page}/welcome/${kind}`) || pageKey(`${page}/stories/${kind}`);
  return entry?.src || entry?.start;
}

export function pageAssetAliases(pageFamily: string, kinds: string[]): string | undefined {
  for (const k of kinds) {
    const src = pageAsset(pageFamily, k);
    if (src) return src;
  }
  return undefined;
}

export { MODEL_TO_PRODUCT, CASE_FOR_MODEL };
