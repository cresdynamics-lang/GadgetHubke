/**
 * getAirpodsImage(modelId, kind) - single door for AirPods images.
 * kind: hero | earbuds | case | colour:<n> | gallery:<n> | compare | manifest key | pair:<key>
 * Missing manifest keys log MISSING IMAGE and fall back to product shot.
 */

import {
  caseSrc,
  compareSrc,
  earbudsSrc,
  gallerySrcs,
  heroSrc,
  marketingSrc,
  maxColourSrc,
  pageKey,
  productEntry,
  productKey,
  swatchSrc,
} from "./manifest";
import { getAirpodsModel, type AirpodsModel } from "./models";

export const AIRPODS_PLACEHOLDER = "/images/placeholder-airpods.svg";

export type ResolvedAirpodsImage = {
  src: string;
  srcWebp?: string;
  alt: string;
  kind: string;
  fallback: boolean;
  width: number;
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

function webpSibling(src: string): string | undefined {
  if (/\.webp$/i.test(src) || src === AIRPODS_PLACEHOLDER) return undefined;
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

function widthForKind(kind: string): number {
  if (/hero|startframe|endframe|pair:/i.test(kind)) return 1800;
  return 1400;
}

function finish(
  src: string,
  alt: string,
  kind: string,
  fallback: boolean,
  extra: Partial<ResolvedAirpodsImage> = {},
): ResolvedAirpodsImage {
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

function marketingForModel(model?: AirpodsModel): string | undefined {
  if (!model) return marketingSrc("family");
  if (model.family === "Pro") return marketingSrc("pro");
  if (model.family === "Max") return marketingSrc("max");
  if (model.generation.startsWith("4")) return marketingSrc("airpods4");
  return marketingSrc("family");
}

function resolveModelIdForAssets(modelId: string, model?: AirpodsModel): string {
  if (model?.standInImage) {
    if (modelId === "airpods-pro-1") return "airpods-pro-2";
    if (modelId === "airpods-2" || modelId === "airpods-3") return "airpods-4";
    if (modelId === "airpods-max-2020") return "airpods-max-usbc";
  }
  return modelId;
}

function productFallback(modelId: string, model: AirpodsModel | undefined, name: string, kind: string): ResolvedAirpodsImage {
  const assetId = resolveModelIdForAssets(modelId, model);
  const src =
    heroSrc(assetId, getAirpodsModel(assetId)) ||
    caseSrc(modelId, model) ||
    marketingForModel(model) ||
    AIRPODS_PLACEHOLDER;
  return finish(src, name, kind, true);
}

/** Resolve a manifest key (e.g. pro/welcome/hero_startframe or pair:pro/noise-control/noise_control). */
export function resolveAirpodsKey(key: string, alt = "AirPods"): ResolvedAirpodsImage {
  const isPair = key.startsWith("pair:");
  const bare = isPair ? key.slice(5) : key;
  const entry = pageKey(bare);

  if (isPair || (entry?.start && entry?.end)) {
    if (entry?.start && entry?.end) {
      return finish(entry.end, alt, key, false, {
        start: entry.start,
        end: entry.end,
        startWebp: entry.startWebp || webpSibling(entry.start),
        endWebp: entry.endWebp || webpSibling(entry.end),
      });
    }
    if (entry?.start) {
      return finish(entry.start, alt, key, false, { start: entry.start, startWebp: entry.startWebp });
    }
    if (entry?.src) {
      return finish(entry.src, alt, key, false);
    }
    logMissing(bare);
    return finish(AIRPODS_PLACEHOLDER, alt, key, true);
  }

  if (entry?.src) {
    return finish(entry.src, alt, key, false);
  }
  if (entry?.start) {
    return finish(entry.start, alt, key, false, { start: entry.start });
  }
  if (entry?.end) {
    return finish(entry.end, alt, key, false, { end: entry.end });
  }

  logMissing(bare);
  return finish(AIRPODS_PLACEHOLDER, alt, key, true);
}

export function getAirpodsImage(
  modelId: string,
  kind: string = "hero",
  nameHint?: string,
): ResolvedAirpodsImage {
  const model = getAirpodsModel(modelId);
  const assetId = resolveModelIdForAssets(modelId, model);
  const assetModel = getAirpodsModel(assetId);
  const name = nameHint || model?.name || "AirPods";

  // Manifest key or pair form
  if (kind.startsWith("pair:") || kind.includes("/")) {
    const resolved = resolveAirpodsKey(kind, name);
    if (resolved.fallback || resolved.src === AIRPODS_PLACEHOLDER) {
      return productFallback(modelId, model, name, kind);
    }
    return resolved;
  }

  if (kind.startsWith("colour:")) {
    const colour = kind.slice("colour:".length);
    const src = maxColourSrc(colour) || swatchSrc(colour);
    if (src) return finish(src, `${name} in ${colour}`, kind, Boolean(model?.standInImage));
  }

  if (kind.startsWith("gallery:")) {
    const idx = Number(kind.slice("gallery:".length)) || 0;
    const gals = gallerySrcs(assetId, assetModel);
    if (gals[idx]) return finish(gals[idx], `${name}, gallery ${idx + 1}`, kind, false);
  }

  if (kind === "hero" || kind === "main" || kind === "overview") {
    const src = heroSrc(assetId, assetModel);
    if (src) return finish(src, `${name}, hero`, "hero", Boolean(model?.standInImage && assetId !== modelId));
  }

  if (kind === "earbuds" || kind === "product") {
    const src = earbudsSrc(assetId, assetModel) || heroSrc(assetId, assetModel);
    if (src) return finish(src, `${name}, earbuds`, "earbuds", Boolean(model?.standInImage && assetId !== modelId));
  }

  if (kind === "case" || kind === "caseWireless") {
    const src = caseSrc(modelId === "airpods-5-wireless" ? modelId : assetId, model || assetModel);
    if (src) return finish(src, `${name}, charging case`, kind, Boolean(model?.standInImage));
  }

  if (kind === "gallery") {
    const gals = gallerySrcs(assetId, assetModel);
    if (gals[0]) return finish(gals[0], `${name}, gallery`, "gallery", false);
  }

  if (kind === "compare" || kind.startsWith("compare:")) {
    const feat = kind === "compare" ? "airpods-pro-compare" : kind.slice("compare:".length);
    const src = compareSrc(feat);
    if (src) return finish(src, `${name}, ${feat}`, kind, false);
  }

  if (kind === "swatch") {
    const colour = model?.defaultColour || "midnight";
    const src = swatchSrc(colour) || maxColourSrc(colour);
    if (src) return finish(src, `${name}, finish swatch`, "swatch", false);
  }

  // Legacy feel kinds → map to keys when possible
  const legacy: Record<string, string> = {
    noise_hero: model?.family === "Max"
      ? "pair:max/media-card/anc"
      : model?.id?.includes("airpods-5")
        ? "airpods5/stories/noise_hero"
        : "pair:pro/noise-control/noise_control",
    audio_spatial: model?.family === "Max"
      ? "max/product-stories/hifi-sound/audio_airpod_max"
      : model?.id?.includes("airpods-5")
        ? "airpods5/stories/audio_spatial_audio"
        : "pro/audio-performance/audio_airpods_pro_pair",
    fitness: "pair:pro/fitness/fitness_hero",
  };
  if (legacy[kind]) {
    return getAirpodsImage(modelId, legacy[kind], name);
  }

  return productFallback(modelId, model, name, kind);
}

export function defaultAirpodsColour(model: AirpodsModel): string {
  if (model.colours.includes(model.defaultColour)) return model.defaultColour;
  return model.colours[0] || "white";
}

export function airpodsViewerTabs(model: AirpodsModel) {
  const tabs: { id: string; label: string; src: string; alt: string; srcWebp?: string; start?: string; end?: string }[] = [];
  const name = model.name;

  const overview = getAirpodsImage(model.id, "hero", name);
  tabs.push({ id: "overview", label: "Overview", src: overview.src, alt: overview.alt, srcWebp: overview.srcWebp });

  if (model.id === "airpods-pro-3") {
    const closer = resolveAirpodsKey("pro/product-viewer/closer_look_initial", name);
    if (!closer.fallback) {
      tabs.push({ id: "earbuds", label: "Earbuds", src: closer.src, alt: closer.alt, srcWebp: closer.srcWebp });
    }
    const withCase = resolveAirpodsKey("pro/product-viewer/closer_look_case", name);
    if (!withCase.fallback) {
      tabs.push({ id: "with-case", label: "With case", src: withCase.src, alt: withCase.alt, srcWebp: withCase.srcWebp });
    }
  } else {
    const buds = getAirpodsImage(model.id, "earbuds", name);
    if (!buds.fallback || buds.kind === "earbuds") {
      tabs.push({ id: "earbuds", label: "Earbuds", src: buds.src, alt: buds.alt, srcWebp: buds.srcWebp });
    }
    if (model.id.startsWith("airpods-5")) {
      const wcc = productEntry(model.id)?.caseWireless as string | undefined;
      if (wcc) {
        tabs.push({
          id: "with-case",
          label: "With case",
          src: wcc,
          alt: `${name} with wireless charging case`,
          srcWebp: webpSibling(wcc),
        });
      } else {
        const p = getAirpodsImage(model.id, "case", name);
        if (!p.fallback) {
          tabs.push({ id: "with-case", label: "With case", src: p.src, alt: p.alt, srcWebp: p.srcWebp });
        }
      }
    }
  }

  gallerySrcs(resolveModelIdForAssets(model.id, model), getAirpodsModel(resolveModelIdForAssets(model.id, model)))
    .slice(0, 5)
    .forEach((src, i) => {
      tabs.push({
        id: `gallery-${i}`,
        label: i === 0 ? "Gallery" : `Gallery ${i + 1}`,
        src,
        alt: `${name}, gallery ${i + 1}`,
        srcWebp: webpSibling(src),
      });
    });

  if (model.family === "Max" && !model.textOnlyColours) {
    for (const c of model.colours) {
      const col = getAirpodsImage(model.id, `colour:${c}`, name);
      if (!col.fallback) {
        tabs.push({ id: `colour-${c}`, label: c, src: col.src, alt: col.alt, srcWebp: col.srcWebp });
      }
    }
  }

  const caseOv = getAirpodsImage(model.id, "case", name);
  if (!caseOv.fallback) {
    tabs.push({ id: "case", label: "Case", src: caseOv.src, alt: caseOv.alt, srcWebp: caseOv.srcWebp });
  }

  if (model.id === "airpods-pro-3") {
    const closerSteps = [
      ["initial", "pro/product-viewer/closer_look_initial", "pair:pro/product-viewer/initial"],
      ["fit", "pro/product-viewer/closer_look_fit_feel", "pair:pro/product-viewer/fit_feel"],
      ["touch", "pro/product-viewer/closer_look_touch_control", "pair:pro/product-viewer/touch_controls"],
      ["heart", "pro/product-viewer/closer_look_heart_rate", "pair:pro/product-viewer/heart_rate"],
      ["water", "pro/product-viewer/closer_look_water_resistance", ""],
      ["acoustic", "pro/product-viewer/closer_look_acoustic_a", ""],
      ["case-close", "pro/product-viewer/closer_look_case", "pair:pro/product-viewer/case"],
    ] as const;
    for (const [id, key, pair] of closerSteps) {
      const img = resolveAirpodsKey(pair || key, name);
      const still = resolveAirpodsKey(key, name);
      const use = !img.fallback ? img : still;
      if (!use.fallback) {
        tabs.push({
          id: `closer-${id}`,
          label: `Closer · ${id}`,
          src: use.end || use.src,
          alt: use.alt,
          srcWebp: use.srcWebp,
          start: use.start,
          end: use.end,
        });
      }
    }
  }

  return tabs;
}

export function relatedAirpodsModels(model: AirpodsModel, all: AirpodsModel[]): AirpodsModel[] {
  return all
    .filter((m) => m.id !== model.id)
    .filter((m) => m.family === model.family || Math.abs(m.year - model.year) <= 2)
    .sort((a, b) => b.year - a.year || b.basePriceKes - a.basePriceKes)
    .slice(0, 4);
}

export { productKey };
