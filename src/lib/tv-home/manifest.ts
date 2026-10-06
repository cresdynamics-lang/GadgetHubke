/**
 * Manifest accessors for TV & Home images.
 */
import generated from "./generated-manifest.json";
import type { TvHomeModel } from "./models";

export type TvHomeManifest = typeof generated;

export const tvHomeManifest = generated as TvHomeManifest;

export type TvHomeProductKey = keyof TvHomeManifest["products"];

const MODEL_TO_PRODUCT: Record<string, TvHomeProductKey> = {
  "apple-tv-4k-3": "apple-tv-4k",
  "apple-tv-4k-3-ethernet": "apple-tv-4k",
  "homepod-2": "homepod-2",
  "homepod-1": "homepod-2",
  "homepod-mini": "homepod-mini",
};

const OVERVIEW_BY_MODEL: Record<string, keyof TvHomeManifest["overviews"]> = {
  "apple-tv-4k-1": "1gen",
  "apple-tv-4k-2": "2gen",
  "apple-tv-4k-3": "3gen",
  "apple-tv-4k-3-ethernet": "3gen",
  "apple-tv-hd": "hd",
};

export function productKey(modelId: string, model?: TvHomeModel): TvHomeProductKey | null {
  if (model?.noImage) return null;
  if (model?.overviewOnly) return null;
  if (MODEL_TO_PRODUCT[modelId]) return MODEL_TO_PRODUCT[modelId];
  if (model && MODEL_TO_PRODUCT[model.id]) return MODEL_TO_PRODUCT[model.id];
  if (/apple-tv|appletv/.test(modelId)) return "apple-tv-4k";
  if (/mini/.test(modelId)) return "homepod-mini";
  if (/homepod/.test(modelId)) return "homepod-2";
  return null;
}

export function productEntry(modelId: string, model?: TvHomeModel) {
  const key = productKey(modelId, model);
  if (!key) return undefined;
  return tvHomeManifest.products[key];
}

export function gallerySrcs(modelId: string, model?: TvHomeModel): string[] {
  return productEntry(modelId, model)?.gallery ?? [];
}

export function heroSrc(modelId: string, model?: TvHomeModel): string | undefined {
  return productEntry(modelId, model)?.hero;
}

export function boxSrc(modelId: string, model?: TvHomeModel): string | undefined {
  return productEntry(modelId, model)?.box;
}

export function remoteSrc(modelId: string, model?: TvHomeModel): string | undefined {
  return productEntry(modelId, model)?.remote;
}

export function colourSrc(modelId: string, colour: string, model?: TvHomeModel): string | undefined {
  const entry = productEntry(modelId, model);
  const colours = entry?.colours as Record<string, string> | undefined;
  return colours?.[colour.toLowerCase()];
}

export function swatchSrc(colour: string): string | undefined {
  const key = colour.toLowerCase() as keyof typeof tvHomeManifest.swatches;
  return tvHomeManifest.swatches[key];
}

export function overviewSrc(modelId: string, model?: TvHomeModel): string | undefined {
  const key = OVERVIEW_BY_MODEL[modelId] || (model && OVERVIEW_BY_MODEL[model.id]);
  if (key) return tvHomeManifest.overviews[key];
  if (/apple-tv-4k-1/.test(modelId)) return tvHomeManifest.overviews["1gen"];
  if (/apple-tv-4k-2/.test(modelId)) return tvHomeManifest.overviews["2gen"];
  if (/apple-tv-hd|apple-tv-hd/.test(modelId)) return tvHomeManifest.overviews.hd;
  if (/apple-tv-4k-3/.test(modelId)) return tvHomeManifest.overviews["3gen"];
  return undefined;
}

export function compareSrc(which: "homepod" | "mini" | string): string | undefined {
  if (which === "mini") return tvHomeManifest.compare.mini;
  if (which === "homepod") return tvHomeManifest.compare.homepod;
  const lower = which.toLowerCase();
  if (lower.includes("mini")) return tvHomeManifest.compare.mini;
  return tvHomeManifest.compare.homepod;
}

export function pageAsset(pageFamily: string, kind: string): string | undefined {
  const pack = tvHomeManifest.pages[pageFamily as keyof typeof tvHomeManifest.pages] as
    | Record<string, { src: string }>
    | undefined;
  return pack?.[kind]?.src;
}

export function pageAssetAliases(pageFamily: string, kinds: string[]): string | undefined {
  for (const k of kinds) {
    const src = pageAsset(pageFamily, k);
    if (src) return src;
  }
  return undefined;
}

export function iconSrc(kind: string): string | undefined {
  return tvHomeManifest.icons[kind as keyof typeof tvHomeManifest.icons];
}

export { MODEL_TO_PRODUCT, OVERVIEW_BY_MODEL };
