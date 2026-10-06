/**
 * Manifest accessors for Watch images.
 */
import generated from "./generated-manifest.json";
import type { WatchModel } from "./models";

export type WatchManifest = typeof generated;

export const watchManifest = generated as WatchManifest;

function genKey(model: WatchModel): string {
  if (model.family === "Ultra") {
    if (model.generation.includes("4")) return "ultra-4";
    if (model.generation.includes("3")) return "ultra-3";
    if (model.generation.includes("2")) return "ultra-2";
    return "ultra-1";
  }
  if (model.family === "SE") {
    if (model.generation.includes("3")) return "se-3";
    if (model.generation.includes("2")) return "se-2";
    return "se-1";
  }
  if (model.family === "Hermès") {
    if (model.generation.includes("Ultra")) return "ultra-4";
    return "series-12";
  }
  if (model.family === "Nike" && model.seriesNumber) {
    return `series-${model.seriesNumber}`;
  }
  if (model.seriesNumber) return `series-${model.seriesNumber}`;
  return "series-12";
}

export function productCases(modelId: string, model?: WatchModel): string[] {
  const m = model || null;
  const key = m ? genKey(m) : guessKeyFromId(modelId);
  return watchManifest.products[key as keyof typeof watchManifest.products]?.cases || [];
}

export function productBands(modelId: string, model?: WatchModel): string[] {
  const m = model || null;
  const key = m ? genKey(m) : guessKeyFromId(modelId);
  return watchManifest.products[key as keyof typeof watchManifest.products]?.bands || [];
}

export function overviewSrc(model: WatchModel): string | undefined {
  const key = genKey(model);
  if (model.family === "Hermès") {
    return watchManifest.overviews.hermes || watchManifest.overviews[key as keyof typeof watchManifest.overviews];
  }
  if (model.family === "Nike") {
    return watchManifest.overviews.nike || watchManifest.overviews[key as keyof typeof watchManifest.overviews];
  }
  return watchManifest.overviews[key as keyof typeof watchManifest.overviews];
}

export function swatchSrcs(model: WatchModel): string[] {
  const key = genKey(model);
  return watchManifest.swatches[key as keyof typeof watchManifest.swatches] || [];
}

export function pageAsset(pageFamily: string, kind: string): string | undefined {
  const map: Record<string, string> = {
    Series: "Series_12",
    SE: "SE_3",
    Ultra: "Ultra_4",
    Hermès: "Hermes",
    Nike: "Nike",
    Why: "Why_Apple_Watch",
    Kids: "Kids",
  };
  const page = map[pageFamily] || pageFamily;
  const pack = watchManifest.pages[page as keyof typeof watchManifest.pages] as
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

function guessKeyFromId(id: string): string {
  if (/ultra-4/.test(id)) return "ultra-4";
  if (/ultra-3/.test(id)) return "ultra-3";
  if (/ultra-2/.test(id)) return "ultra-2";
  if (/ultra-1|ultra$/.test(id)) return "ultra-1";
  if (/se3|se-3/.test(id)) return "se-3";
  if (/se2|se-2/.test(id)) return "se-2";
  if (/se1|se-1/.test(id)) return "se-1";
  const m = id.match(/s(\d+)/);
  if (m) return `series-${m[1]}`;
  return "series-12";
}

export { genKey };
