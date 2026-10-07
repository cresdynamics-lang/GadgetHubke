/**
 * getAccessoryImage(productId, kind) - single door for accessory images.
 * kind: hero | angle:n | swatch | feature:name | gallery:n | gesture:name | overview | manifest key
 */

import fs from "node:fs";
import path from "node:path";
import {
  angleSrcs,
  featureSrc,
  gestureSrc,
  heroSrc,
  overviewSrc,
  pageKey,
  productGestureSrc,
  productGeoUs,
  productManifestEntry,
  storeGallerySrcs,
  storeInUseSrc,
  swatchSrc,
} from "./manifest";
import { getCaseVariant, getCaseVariants } from "./power-cases-data";
import { getAccessory, type Accessory } from "./models";

export const ACCESSORY_PLACEHOLDER = "/images/placeholder-accessory.svg";

export type ResolvedAccessoryImage = {
  src: string;
  srcWebp?: string;
  alt: string;
  kind: string;
  fallback: boolean;
  width: number;
  designOnly?: boolean;
  geoUs?: boolean;
  start?: string;
  end?: string;
  startWebp?: string;
  endWebp?: string;
};

const missingLogged = new Set<string>();

function logMissing(key: string) {
  if (typeof console === "undefined") return;
  if (missingLogged.has(key)) return;
  missingLogged.add(key);
  console.warn(`MISSING IMAGE: ${key}`);
}

/** Only advertise WebP when the sibling file actually exists on disk. */
function webpSibling(src: string): string | undefined {
  if (!src || src === ACCESSORY_PLACEHOLDER) return undefined;
  if (/\.webp$/i.test(src)) return src;
  const webp = src.replace(/\.(jpe?g|png)$/i, ".webp");
  if (webp === src) return undefined;
  const disk = path.join(process.cwd(), "public", webp.replace(/^\//, ""));
  return fs.existsSync(disk) ? webp : undefined;
}

function widthForKind(kind: string): number {
  if (/swatch|SW_COLOR|variant:.*swatch/i.test(kind)) return 160;
  if (/hero|startframe|endframe|pair:|\/hero\/|featurecard/i.test(kind)) return 1800;
  return 1400;
}

function finish(
  src: string,
  alt: string,
  kind: string,
  fallback: boolean,
  extra: Partial<ResolvedAccessoryImage> = {},
): ResolvedAccessoryImage {
  return {
    src,
    srcWebp: fallback ? undefined : webpSibling(src),
    alt,
    kind,
    fallback,
    width: widthForKind(kind),
    ...extra,
  };
}

function productFallback(
  product: Accessory | undefined,
  productId: string,
  name: string,
  kind: string,
): ResolvedAccessoryImage {
  const src =
    heroSrc(productId) ||
    overviewSrc(productId) ||
    storeGallerySrcs(productId)[0] ||
    ACCESSORY_PLACEHOLDER;
  const designOnly = Boolean(
    product?.overviewOnly || product?.noStorePhoto || product?.earlierGeneration,
  );
  return finish(src, name, kind, src === ACCESSORY_PLACEHOLDER || designOnly, { designOnly });
}

export function resolveAccessoryKey(key: string, alt = "Accessory"): ResolvedAccessoryImage {
  const entry = pageKey(key);
  if (entry?.start && entry?.end) {
    return finish(entry.end, alt, key, false, {
      start: entry.start,
      end: entry.end,
      startWebp: entry.startWebp || webpSibling(entry.start),
      endWebp: entry.endWebp || webpSibling(entry.end),
    });
  }
  if (entry?.src) return finish(entry.src, alt, key, false);
  if (entry?.start) {
    return finish(entry.start, alt, key, false, { start: entry.start, startWebp: entry.startWebp });
  }
  logMissing(key);
  return finish(ACCESSORY_PLACEHOLDER, alt, key, true);
}

export function getAccessoryImage(
  productId: string,
  kind: string = "hero",
  nameHint?: string,
): ResolvedAccessoryImage {
  const product = getAccessory(productId);
  const name = nameHint || product?.name || productId.replace(/-/g, " ");
  const designOnly = Boolean(
    product?.overviewOnly || product?.noStorePhoto || product?.earlierGeneration,
  );

  if (kind.startsWith("pair:") || (kind.includes("/") && !kind.includes(":"))) {
    const bare = kind.startsWith("pair:") ? kind.slice(5) : kind;
    const resolved = resolveAccessoryKey(bare, name);
    if (!resolved.fallback) return resolved;
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("angle:")) {
    const raw = kind.slice("angle:".length);
    let idx = Number(raw);
    if (Number.isNaN(idx)) idx = 0;
    const angles = angleSrcs(productId);
    const src = angles[idx] || angles[idx - 1];
    if (src) return finish(src, `${name}, angle ${idx || idx + 1}`, kind, false, { designOnly });
    logMissing(`${productId}/${kind}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("gesture:")) {
    const gname = kind.slice("gesture:".length);
    const src = productGestureSrc(productId, gname) || gestureSrc(gname);
    if (src) return finish(src, `${name}, ${gname.replace(/-/g, " ")} gesture`, kind, false);
    logMissing(`${productId}/${kind}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("variant:")) {
    const part = kind.slice("variant:".length);
    const v = getCaseVariant(productId, part);
    if (v?.mainImage) {
      return finish(
        v.mainImage,
        `${name} in ${v.colour}, front view`,
        kind,
        false,
      );
    }
    if (v?.swatchImage) {
      return finish(v.swatchImage, `${name} in ${v.colour}, swatch`, kind, false);
    }
    logMissing(`${productId}/${kind}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("variant-swatch:")) {
    const part = kind.slice("variant-swatch:".length);
    const v = getCaseVariant(productId, part);
    if (v?.swatchImage) {
      return finish(v.swatchImage, `${name} in ${v.colour}, colour swatch`, kind, false);
    }
    if (v?.mainImage) {
      return finish(v.mainImage, `${name} in ${v.colour}`, kind, false);
    }
    logMissing(`${productId}/${kind}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("variant-angle:")) {
    // variant-angle:<partNumber>:<n>
    const rest = kind.slice("variant-angle:".length);
    const [part, nRaw] = rest.split(":");
    const idx = Number(nRaw) || 0;
    const v = getCaseVariant(productId, part);
    const src = v?.angleImages?.[idx];
    if (src) {
      return finish(src, `${name} in ${v?.colour || ""}, angle ${idx + 1}`, kind, false);
    }
    // Fall back to lead colour angles
    const lead = getCaseVariants(productId)[0];
    const leadSrc = lead?.angleImages?.[idx];
    if (leadSrc) {
      return finish(
        leadSrc,
        `${name}, angle ${idx + 1} (shown in ${lead.colour})`,
        kind,
        false,
        { designOnly: true },
      );
    }
    logMissing(`${productId}/${kind}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("gallery:")) {
    const idx = Number(kind.slice("gallery:".length)) || 0;
    const gals = storeGallerySrcs(productId);
    if (gals[idx]) return finish(gals[idx], `${name}, gallery ${idx + 1}`, kind, false);
    const inUse = storeInUseSrc(productId);
    if (inUse && idx === 0) return finish(inUse, `${name}, in use`, kind, false);
    logMissing(`${productId}/${kind}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind.startsWith("feature:")) {
    const feat = kind.slice("feature:".length);
    const src = featureSrc(feat);
    if (src) return finish(src, `${name}, ${feat}`, kind, false);
    logMissing(`feature:${feat}`);
    return productFallback(product, productId, name, kind);
  }

  if (kind === "hero" || kind === "main") {
    const src = heroSrc(productId);
    if (src) {
      return finish(src, `${name}, front view`, "hero", false, {
        designOnly,
        geoUs: productGeoUs(productId) || /GEO_US/i.test(src),
      });
    }
  }

  if (kind === "overview") {
    const src = overviewSrc(productId) || heroSrc(productId);
    if (src) return finish(src, `${name}, overview`, "overview", false, { designOnly: true });
  }

  if (kind === "swatch") {
    const src = swatchSrc(productId);
    if (src) return finish(src, `${name}, colour`, "swatch", false);
  }

  if (kind === "gallery" || kind === "in-use") {
    const inUse = storeInUseSrc(productId);
    if (inUse) return finish(inUse, `${name}, in use`, kind, false);
    const gals = storeGallerySrcs(productId);
    if (gals[0]) return finish(gals[0], `${name}, gallery`, kind, false);
  }

  if (kind === "compare") {
    const src = heroSrc(productId);
    if (src) return finish(src, `${name}, compare`, "compare", false, { designOnly });
  }

  logMissing(`${productId}/${kind}`);
  return productFallback(product, productId, name, kind);
}

export function getAccessoriesPageImage(key: string, alt: string): ResolvedAccessoryImage {
  return resolveAccessoryKey(key, alt);
}
