/**
 * getWatchImage(modelId, kind) — lineup, bands, swatch, overview, page assets.
 * Never returns a broken path; falls back to overview then placeholder.
 */

import fs from "node:fs";
import path from "node:path";
import {
  productCases,
  productBands,
  overviewSrc,
  swatchSrcs,
  pageAssetAliases,
  pageAsset,
  genKey,
} from "./manifest";
import { getWatchModel, type WatchModel } from "./models";

export const WATCH_PLACEHOLDER = "/images/placeholder-watch.svg";

export type ResolvedWatchImage = {
  src: string;
  srcWebp?: string;
  alt: string;
  kind: string;
  fallback: boolean;
  width: number;
};

function webpSibling(src: string): string | undefined {
  if (!src || /\.webp$/i.test(src)) return src || undefined;
  const webp = src.replace(/\.(jpe?g|png)$/i, ".webp");
  const disk = path.join(process.cwd(), "public", webp.replace(/^\//, ""));
  return fs.existsSync(disk) ? webp : undefined;
}

function widthForKind(kind: string): number {
  if (/hero|startframe|endframe/i.test(kind)) return 1800;
  return 1400;
}

function finish(src: string, alt: string, kind: string, fallback: boolean): ResolvedWatchImage {
  return {
    src,
    srcWebp: fallback ? undefined : webpSibling(src),
    alt,
    kind,
    fallback,
    width: widthForKind(kind),
  };
}

export function getWatchImage(
  modelId: string,
  kind: string = "main",
  nameHint?: string,
): ResolvedWatchImage {
  const model = getWatchModel(modelId);
  const name = nameHint || model?.name || "Apple Watch";
  const pageFam = model?.pageFamily || "Series";

  if (kind === "main" || kind === "lineup" || kind === "product" || kind === "front") {
    const cases = model ? productCases(modelId, model) : productCases(modelId);
    if (cases[0]) return finish(cases[0], `${name}, lineup view`, "lineup", false);
  }

  if (kind === "bands" || kind === "band") {
    const bands = model ? productBands(modelId, model) : productBands(modelId);
    if (bands[0]) return finish(bands[0], `${name}, band gallery`, "bands", false);
  }

  if (kind === "swatch" || kind === "finishes") {
    const sw = model ? swatchSrcs(model) : [];
    if (sw[0]) return finish(sw[0], `${name}, finish close-up`, "swatch", false);
  }

  if (kind === "overview" || kind === "sizes") {
    const ov = model ? overviewSrc(model) : undefined;
    if (ov) return finish(ov, `${name}, colour overview`, "overview", Boolean(model?.overviewOnly));
  }

  const aliases: Record<string, string[]> = {
    hero_startframe: ["hero_startframe"],
    hero_endframe: ["hero_endframe"],
    design: ["design_hero", "hero_static", "hero_endframe"],
    display: ["display_hero", "hero_endframe", "contrast_hero"],
    health: ["health_hero", "heart_rate_hero", "fitness_hero"],
    fitness: ["workout_hero_endframe", "workout_hero", "fitness_hero"],
    fitness_start: ["workout_hero_startframe"],
    fitness_end: ["workout_hero_endframe"],
    battery: ["battery_hero"],
    safety: ["safety_hero", "sos_hero"],
    water: ["water_hero", "depth_hero", "go_hero_left"],
    on_the_go: ["go_hero_left", "go_hero_middle", "go_hero_right"],
  };

  const tryKeys = aliases[kind] || [kind];
  const src = pageAssetAliases(pageFam, tryKeys) || pageAsset(pageFam, kind);
  if (src) {
    return finish(src, `${name}, ${kind.replace(/_/g, " ")}`, kind, false);
  }

  // Fallbacks
  const cases = model ? productCases(modelId, model) : productCases(modelId);
  if (cases[0]) return finish(cases[0], `${name}, lineup view`, "lineup", true);
  const ov = model ? overviewSrc(model) : undefined;
  if (ov) return finish(ov, `${name}, overview`, "overview", true);
  return finish(WATCH_PLACEHOLDER, name, kind, true);
}

export function defaultWatchColour(model: WatchModel): string {
  if (model.colours.includes(model.defaultColour)) return model.defaultColour;
  return model.colours[0] || "black";
}

export function watchViewerTabs(model: WatchModel) {
  const tabs: { id: string; label: string; src: string; alt: string }[] = [];
  const lineup = getWatchImage(model.id, "lineup", model.name);
  if (!lineup.fallback || lineup.kind === "lineup") {
    tabs.push({ id: "lineup", label: "Lineup", src: lineup.src, alt: lineup.alt });
  }
  const bands = getWatchImage(model.id, "bands", model.name);
  if (!bands.fallback || bands.kind === "bands") {
    tabs.push({ id: "bands", label: "Bands", src: bands.src, alt: bands.alt });
  }
  const sw = getWatchImage(model.id, "swatch", model.name);
  if (!sw.fallback || sw.kind === "swatch") {
    tabs.push({ id: "finishes", label: "Finishes", src: sw.src, alt: sw.alt });
  }
  const sizes = getWatchImage(model.id, "overview", model.name);
  if (!sizes.fallback || sizes.kind === "overview") {
    tabs.push({ id: "sizes", label: "Sizes", src: sizes.src, alt: sizes.alt });
  }
  const design = getWatchImage(model.id, "design", model.name);
  if (!design.fallback) {
    tabs.push({ id: "design", label: "Design", src: design.src, alt: design.alt });
  }
  const use = getWatchImage(model.id, "on_the_go", model.name);
  if (!use.fallback) {
    tabs.push({ id: "in-use", label: "In use", src: use.src, alt: use.alt });
  }
  if (!tabs.length) {
    tabs.push({ id: "main", label: "Watch", src: lineup.src, alt: lineup.alt });
  }
  return tabs;
}

export function relatedWatchModels(model: WatchModel, all: WatchModel[]): WatchModel[] {
  return all
    .filter((m) => m.id !== model.id)
    .filter(
      (m) =>
        m.family === model.family ||
        Math.abs((m.seriesNumber || 0) - (model.seriesNumber || 0)) === 1 ||
        (m.family === "Ultra" && model.family === "Series") ||
        (m.family === "Series" && model.family === "Ultra"),
    )
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);
}

export { genKey };
