/**
 * Per-colour angle photos from Apple's online store (Gadget_Hub_Store_Angles),
 * so every category shows each finish the way iPhone pages do.
 * Built by scripts/fetch-store-angles.py; Watch angles are Apple's band + case + face layers stacked.
 */
import data from "./store-angles.json";

export type StoreAngle = { src: string; srcWebp: string; label: string };
export type AngleTab = { id: string; label: string; src: string; alt: string; srcWebp?: string };

const angles = data as Record<string, Record<string, StoreAngle[]>>;

export function storeAngles(modelId: string, colour: string): StoreAngle[] {
  return angles[modelId]?.[colour] ?? [];
}

export function hasStoreAngles(modelId: string): boolean {
  return Boolean(angles[modelId]);
}

/** Viewer tabs for one finish; WebP is used as the main source (jpg kept for feeds). */
export function storeAngleTabs(modelId: string, colour: string, name: string, colourName: string): AngleTab[] {
  return storeAngles(modelId, colour).map((a, i) => ({
    id: `angle-${i + 1}`,
    label: a.label,
    src: a.srcWebp,
    srcWebp: a.srcWebp,
    alt: `${name} in ${colourName}, ${a.label.toLowerCase()} view`,
  }));
}
