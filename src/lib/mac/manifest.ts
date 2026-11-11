/**
 * Maps each Mac model id → product folder colours + overview + page-asset family.
 * Paths come from generated-manifest.json (run: npm run mac:manifest).
 */

import { publicFileExists } from "../public-file";
import { hasStoreAngles } from "../store-angles";
import generated from "./generated-manifest.json";
import type { MacModel } from "./models";

export type MacPageKind =
  | "product"
  | "overview"
  | "hero_startframe"
  | "hero_endframe"
  | "hero_static"
  | string;

type GenManifest = typeof generated;

const g = generated as GenManifest;

const PRODUCT_FOLDER: Record<string, string | null> = {
  "macbook-air-13-m1": "MacBook_Air/Air_2018-2020_chassis_(M1_2020_same_design)",
  "macbook-air-13-m2": "MacBook_Air/Air_13in_M3_2024", // same chassis family; store angles preferred
  "macbook-air-15-m2": "MacBook_Air/Air_15in_M2_2023",
  "macbook-air-13-m3": "MacBook_Air/Air_13in_M3_2024",
  "macbook-air-15-m3": "MacBook_Air/Air_15in_M2_2023", // same 15″ Air design
  "macbook-air-13-m4": "MacBook_Air/Air_13in_M4_2025",
  "macbook-air-15-m4": "MacBook_Air/Air_15in_M4_2025",
  "macbook-air-13-m5": "MacBook_Air/Air_13in_M4_2025", // same chassis as M4; store angles preferred
  "macbook-air-15-m5": "MacBook_Air/Air_15in_M4_2025",
  "macbook-pro-13-m1": "MacBook_Pro/Pro_13in_M1_2020",
  "macbook-pro-13-m2": "MacBook_Pro/Pro_13in_M2_2022",
  "macbook-pro-14-m1-pro": "MacBook_Pro/Pro_14in_16in_M1_Pro_Max_2021",
  "macbook-pro-16-m1-pro": "MacBook_Pro/Pro_14in_16in_M1_Pro_Max_2021",
  "macbook-pro-14-m2-pro": "MacBook_Pro/Pro_14in_16in_M2_Pro_Max_2023",
  "macbook-pro-16-m2-pro": "MacBook_Pro/Pro_14in_16in_M2_Pro_Max_2023",
  "macbook-pro-14-m3": "MacBook_Pro/Pro_14in_16in_M3_family_2023",
  "macbook-pro-14-m3-pro": "MacBook_Pro/Pro_14in_16in_M3_family_2023",
  "macbook-pro-16-m3-pro": "MacBook_Pro/Pro_14in_16in_M3_family_2023",
  "macbook-pro-14-m4": "MacBook_Pro/Pro_14in_16in_M4_family_2024",
  "macbook-pro-14-m4-pro": "MacBook_Pro/Pro_14in_16in_M4_family_2024",
  "macbook-pro-16-m4-pro": "MacBook_Pro/Pro_14in_16in_M4_family_2024",
  "macbook-pro-14-m5": "MacBook_Pro/Pro_14in_16in_M4_family_2024", // same chassis as M4; store angles preferred
  "macbook-pro-14-m5-pro": "MacBook_Pro/Pro_14in_16in_M4_family_2024",
  "macbook-pro-16-m5-pro": "MacBook_Pro/Pro_14in_16in_M4_family_2024",
};

const OVERVIEW_KEY: Record<string, string> = {
  "macbook-air-13-m1": "macbook-air-2020-late-device",
  "macbook-air-13-m2": "2022-macbook-air-m2-colors",
  "macbook-air-15-m2": "2023-macbook-air-15in-m2-colors",
  "macbook-air-13-m3": "2024-macbook-air-13in-m3-colors",
  "macbook-air-15-m3": "2024-macbook-air-15in-m3-colors",
  "macbook-air-13-m4": "2025-macbook-air-13in-colors",
  "macbook-air-15-m4": "2025-macbook-air-15in-colors",
  "macbook-air-13-m5": "macbook-air-13in-m5-colors",
  "macbook-air-15-m5": "macbook-air-15in-m5-colors",
  "macbook-pro-13-m1": "macbook-pro-2020-late-13in-device",
  "macbook-pro-13-m2": "macbook-pro-13-in-M2-2022",
  "macbook-pro-14-m1-pro": "macbook-pro-2021-14in",
  "macbook-pro-16-m1-pro": "macbook-pro-2021-16in",
  "macbook-pro-14-m2-pro": "macbook-pro-14in-2023",
  "macbook-pro-16-m2-pro": "macbook-pro-16in-2023",
  "macbook-pro-14-m3": "macbook-pro-14in-m3-nov-2023-silver-space-gray",
  "macbook-pro-14-m3-pro": "macbook-pro-14in-m3-pro-m3-max-nov-2023-silver-space-black",
  "macbook-pro-16-m3-pro": "macbook-pro-16in-m3-pro-m3-max-nov-2023-silver-space-black",
  "macbook-pro-14-m4": "macbook-pro-14in-2024-m4-colors",
  "macbook-pro-14-m4-pro": "macbook-pro-14in-2024-m4-pro-m4-max-colors",
  "macbook-pro-16-m4-pro": "macbook-pro-16in-2024-colors",
  "macbook-pro-14-m5": "macbook-pro-14in-m5-colors",
  "macbook-pro-14-m5-pro": "macbook-pro-14in-m5-pro-m5-max",
  "macbook-pro-16-m5-pro": "macbook-pro-16in-m5-pro-m5-max",
};

/** Rewrite shared-folder select shots to the matching 14″ / 16″ file when present. */
function sizeMatchedProductPath(modelId: string, src: string): string | null {
  const want14 = modelId.includes("-14-");
  const want16 = modelId.includes("-16-");
  if (want14 && /mbp16/i.test(src)) {
    const alt = src.replace(/mbp16/gi, "mbp14");
    return publicFileExists(alt) ? alt : null;
  }
  if (want16 && /mbp14/i.test(src)) {
    const alt = src.replace(/mbp14/gi, "mbp16");
    return publicFileExists(alt) ? alt : null;
  }
  if (want14 && /mbp14/i.test(src)) return src;
  if (want16 && /mbp16/i.test(src)) return src;
  if (!want14 && !want16) return src;
  // Size-tagged folder entry that already matches, or untagged Air-style selects.
  if (!/mbp1[46]/i.test(src)) return src;
  return publicFileExists(src) ? src : null;
}

/** For 14/16 shared folders, prefer the select shot for this screen size. */
function productColourMap(modelId: string): Record<string, string> {
  const folder = PRODUCT_FOLDER[modelId];
  if (!folder) return {};
  const raw = g.productsByFolder[folder] || {};
  const out: Record<string, string> = {};
  for (const [colour, src] of Object.entries(raw)) {
    if (colour === "_misc" || Array.isArray(src)) continue;
    const matched = sizeMatchedProductPath(modelId, String(src));
    if (matched) out[colour] = matched;
  }
  return out;
}

export function productColoursFor(modelId: string): string[] {
  return Object.keys(productColourMap(modelId));
}

export function productSrc(modelId: string, colourKey: string): string | undefined {
  const map = productColourMap(modelId);
  if (map[colourKey]) return map[colourKey];
  // try aliases
  const aliases: Record<string, string[]> = {
    "space-gray": ["spacegray", "space-gray"],
    "space-black": ["spaceblack", "space-black"],
    "sky-blue": ["skyblue", "sky-blue"],
  };
  for (const a of aliases[colourKey] || []) {
    if (map[a]) return map[a];
  }
  return Object.values(map)[0];
}

export function overviewSrc(modelId: string): string | undefined {
  const key = OVERVIEW_KEY[modelId];
  return key ? g.overviews[key] : undefined;
}

export function pageAsset(family: "Air" | "Pro", kind: string): string | undefined {
  const pack = family === "Air" ? g.airPage : g.proPage;
  const hit = pack[kind as keyof typeof pack] as { src: string } | undefined;
  return hit?.src;
}

export function pageAssetAliases(family: "Air" | "Pro", kinds: string[]): string | undefined {
  for (const k of kinds) {
    const src = pageAsset(family, k);
    if (src) return src;
  }
  return undefined;
}

export function sizeComparisonSrc(): string {
  return g.sizeComparison;
}

export function airPageKeys(): string[] {
  return Object.keys(g.airPage);
}

export function proPageKeys(): string[] {
  return Object.keys(g.proPage);
}

export function missingStoreShot(model: MacModel): boolean {
  // Per-colour store angles count as real product shots for cards and choose tiles.
  if (hasStoreAngles(model.id)) return false;
  return Boolean(model.overviewOnly) || !PRODUCT_FOLDER[model.id];
}

export { PRODUCT_FOLDER, OVERVIEW_KEY };
