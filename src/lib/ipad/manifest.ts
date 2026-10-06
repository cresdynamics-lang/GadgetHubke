/**
 * Maps each iPad model id → product folder colours + overview + page-asset family.
 * Paths come from generated-manifest.json (run: npm run ipad:manifest).
 */

import generated from "./generated-manifest.json";
import type { IpadModel } from "./models";

type GenManifest = typeof generated;
const g = generated as GenManifest;

const PRODUCT_FOLDER: Record<string, string | null> = {
  "ipad-pro-11-2020": null,
  "ipad-pro-12-9-2020": null,
  "ipad-pro-11-m1": null,
  "ipad-pro-12-9-m1": null,
  "ipad-pro-11-m2": null,
  "ipad-pro-12-9-m2": null,
  "ipad-pro-11-m4": "iPad_Pro_11in_and_13in_M4_M5_(same_design)",
  "ipad-pro-13-m4": "iPad_Pro_11in_and_13in_M4_M5_(same_design)",
  "ipad-pro-11-m5": "iPad_Pro_11in_and_13in_M4_M5_(same_design)",
  "ipad-pro-13-m5": "iPad_Pro_11in_and_13in_M4_M5_(same_design)",
  "ipad-air-4": null,
  "ipad-air-5": null,
  "ipad-air-11-m2": "iPad_Air_11in_and_13in_M2_M3_M4_(same_design)",
  "ipad-air-13-m2": "iPad_Air_11in_and_13in_M2_M3_M4_(same_design)",
  "ipad-air-11-m3": "iPad_Air_11in_and_13in_M2_M3_M4_(same_design)",
  "ipad-air-13-m3": "iPad_Air_11in_and_13in_M2_M3_M4_(same_design)",
  "ipad-air-11-m4": "iPad_Air_11in_and_13in_M2_M3_M4_(same_design)",
  "ipad-air-13-m4": "iPad_Air_11in_and_13in_M2_M3_M4_(same_design)",
  "ipad-mini-6": null,
  "ipad-mini-a17-pro": "iPad_mini_A17_Pro_2024",
  "ipad-8": null,
  "ipad-9": null,
  "ipad-10": "iPad_standard_10th_gen_and_A16_2022-2025",
  "ipad-a16": "iPad_standard_10th_gen_and_A16_2022-2025",
};

const OVERVIEW_KEY: Record<string, string> = {
  "ipad-pro-11-2020": "ios13-4-ipad-pro-4gen-11-in",
  "ipad-pro-12-9-2020": "ios13-4-ipad-pro-4gen-12-9-in",
  "ipad-pro-11-m1": "2021-ipad-pro-11-colors",
  "ipad-pro-12-9-m1": "2021-ipad-pro-12-9-colors",
  "ipad-pro-11-m2": "fall-2022-11-inch-4gen-ipad-pro",
  "ipad-pro-12-9-m2": "fall-2022-12-9-inch-6gen-ipad-pro",
  "ipad-pro-11-m4": "spring-2024-1",
  "ipad-pro-13-m4": "spring-2024-2",
  "ipad-pro-11-m5": "fall-2025-ipad-pro-m5-11in",
  "ipad-pro-13-m5": "fall-2025-ipad-pro-m5-13in",
  "ipad-air-4": "ipad-air-4th-gen-colors",
  "ipad-air-5": "ipad-air-5th-gen-colors",
  "ipad-air-11-m2": "spring-2024-3",
  "ipad-air-13-m2": "spring-2024-4",
  "ipad-air-11-m3": "spring-2025-ipad-air-11",
  "ipad-air-13-m3": "spring-2025-ipad-air-13",
  "ipad-air-11-m4": "spring-2026-ipad-air-11",
  "ipad-air-13-m4": "spring-2026-ipad-air-13",
  "ipad-mini-6": "ipad-mini-2021-colors",
  "ipad-mini-a17-pro": "ipad-mini-2024-colors",
  "ipad-8": "ipad-8th-gen-colors",
  "ipad-9": "ipad-2021-colors",
  "ipad-10": "fall-2022-10-gen-ipad",
  "ipad-a16": "spring-2025-ipad",
};

function pageFamily(model: IpadModel): "Pro" | "Air" | "mini" | "iPad" {
  return model.family;
}

function sizeToken(modelId: string): "11" | "13" | "" {
  if (/13|12-9/.test(modelId)) return "13";
  if (/11/.test(modelId)) return "11";
  return "";
}

function productMap(modelId: string): Record<string, string> {
  const folder = PRODUCT_FOLDER[modelId];
  if (!folder) return {};
  const raw = (g.productsByFolder as Record<string, Record<string, unknown>>)[folder] || {};
  const out: Record<string, string> = {};
  const size = sizeToken(modelId);

  for (const [slot, src] of Object.entries(raw)) {
    if (slot.startsWith("_") || typeof src !== "string") continue;
    // Prefer size-qualified slots for this model; keep unscoped (mini / swatch) as-is
    const parts = slot.split(":");
    if (parts.length === 3) {
      const [, slotSize] = parts;
      if (size && slotSize !== size) continue;
      // Collapse product:11:blue → product:blue for lookup
      out[`${parts[0]}:${parts[2]}`] = src;
      out[slot] = src;
      continue;
    }
    out[slot] = src;
  }
  return out;
}

export function productSrc(
  modelId: string,
  colourKey: string,
  kind: "product" | "box" | "swatch" = "product",
): string | undefined {
  const map = productMap(modelId);
  const size = sizeToken(modelId);
  const aliases: Record<string, string[]> = {
    "space-gray": ["space-gray", "spacegray"],
    "space-black": ["space-black", "spaceblack"],
  };
  const colourKeys = aliases[colourKey] || [colourKey];

  for (const c of colourKeys) {
    if (size && map[`${kind}:${size}:${c}`]) return map[`${kind}:${size}:${c}`];
    if (map[`${kind}:${c}`]) return map[`${kind}:${c}`];
  }
  // Do NOT fall back to a different colour — that makes swatches look "stuck"
  return undefined;
}

export function overviewSrc(modelId: string): string | undefined {
  const key = OVERVIEW_KEY[modelId];
  return key ? (g.overviews as Record<string, string>)[key] : undefined;
}

export function gallerySrcs(modelId: string): string[] {
  const folder = PRODUCT_FOLDER[modelId];
  if (!folder) return [];
  const raw = (g.productsByFolder as Record<string, Record<string, unknown>>)[folder] || {};
  const gals = raw._gallery;
  return Array.isArray(gals) ? (gals as string[]) : [];
}

export function pageAsset(family: IpadModel["family"], kind: string): string | undefined {
  const pack = (g.pages as Record<string, Record<string, { src: string }>>)[family];
  return pack?.[kind]?.src;
}

export function pageAssetAliases(family: IpadModel["family"], kinds: string[]): string | undefined {
  for (const k of kinds) {
    const src = pageAsset(family, k);
    if (src) return src;
  }
  return undefined;
}

export function missingStoreShot(model: IpadModel): boolean {
  return Boolean(model.overviewOnly) || !PRODUCT_FOLDER[model.id];
}

export { PRODUCT_FOLDER, OVERVIEW_KEY, pageFamily };
