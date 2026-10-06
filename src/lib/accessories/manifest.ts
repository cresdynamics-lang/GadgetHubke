/**
 * Manifest accessors for Accessories images (all groups).
 */
import generated from "./generated-manifest.json";
import type { CaseFamilyManifest, CaseVariant } from "./power-cases-data";

export type AccessoriesManifest = typeof generated;
export const accessoriesManifest = generated as AccessoriesManifest;

export type AccessoryProductManifestKey = keyof AccessoriesManifest["products"];

export function productManifestEntry(productId: string) {
  return accessoriesManifest.products[productId as AccessoryProductManifestKey] as
    | {
        hero?: string;
        angles?: string[];
        swatch?: string;
        overviewOnly?: boolean;
        earlierGeneration?: boolean;
        gestures?: Record<string, string>;
        scene?: string;
        geoUs?: boolean;
        variants?: CaseVariant[];
      }
    | undefined;
}

export function heroSrc(productId: string): string | undefined {
  return productManifestEntry(productId)?.hero;
}

export function angleSrcs(productId: string): string[] {
  return (productManifestEntry(productId)?.angles as string[] | undefined) || [];
}

export function swatchSrc(productId: string): string | undefined {
  return productManifestEntry(productId)?.swatch as string | undefined;
}

export function productGeoUs(productId: string): boolean {
  return Boolean(productManifestEntry(productId)?.geoUs);
}

export function overviewSrc(productId: string): string | undefined {
  return accessoriesManifest.overviews[productId as keyof typeof accessoriesManifest.overviews] as
    | string
    | undefined;
}

export function featureSrc(featureId: string): string | undefined {
  return accessoriesManifest.features[featureId as keyof typeof accessoriesManifest.features] as
    | string
    | undefined;
}

export function gestureSrc(name: string): string | undefined {
  const gestures = (accessoriesManifest as { gestures?: Record<string, string> }).gestures || {};
  return gestures[name] || gestures[`mouse/${name}`] || gestures[`trackpad/${name}`];
}

export function productGestureSrc(productId: string, name: string): string | undefined {
  return productManifestEntry(productId)?.gestures?.[name] || gestureSrc(name);
}

export function storeGallerySrcs(productId: string): string[] {
  const entry = accessoriesManifest.store[productId as keyof typeof accessoriesManifest.store] as
    | { gallery?: string[]; cards?: string[]; inUse?: string }
    | undefined;
  return (entry?.gallery as string[] | undefined) || [];
}

export function storeInUseSrc(productId: string): string | undefined {
  const entry = accessoriesManifest.store[productId as keyof typeof accessoriesManifest.store] as
    | { inUse?: string; cards?: string[] }
    | undefined;
  return entry?.inUse || entry?.cards?.[0];
}

export function storeSplitterSrc(productId: string): string | undefined {
  const entry = accessoriesManifest.store[productId as keyof typeof accessoriesManifest.store] as
    | { splitter?: string }
    | undefined;
  return entry?.splitter;
}

export function pageKey(key: string): {
  src?: string;
  webp?: string;
  start?: string;
  end?: string;
  startWebp?: string;
  endWebp?: string;
  geoUs?: boolean;
} | undefined {
  return accessoriesManifest.pages[key as keyof typeof accessoriesManifest.pages] as
    | {
        src?: string;
        webp?: string;
        start?: string;
        end?: string;
        startWebp?: string;
        endWebp?: string;
        geoUs?: boolean;
      }
    | undefined;
}

export function caseVariantsIndex(): Record<string, CaseFamilyManifest> {
  return ((accessoriesManifest as { caseVariants?: Record<string, CaseFamilyManifest> }).caseVariants ||
    {}) as Record<string, CaseFamilyManifest>;
}

export function manifestCounts() {
  const m = accessoriesManifest as {
    countPencil: number;
    countKeyboard: number;
    countMouse?: number;
    countTrackpad?: number;
    countPower?: number;
    countCases?: number;
  };
  return {
    countPencil: m.countPencil,
    countKeyboard: m.countKeyboard,
    countMouse: m.countMouse ?? 0,
    countTrackpad: m.countTrackpad ?? 0,
    countPower: m.countPower ?? 0,
    countCases: m.countCases ?? 0,
  };
}
