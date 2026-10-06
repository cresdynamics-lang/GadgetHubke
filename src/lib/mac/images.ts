/**
 * Central Mac image resolver. Every Mac page uses getMacImage() only.
 */

import { colourLabel } from "./colours";
import {
  overviewSrc,
  pageAsset,
  pageAssetAliases,
  productSrc,
  sizeComparisonSrc,
  missingStoreShot,
} from "./manifest";
import { getMacModel, type MacModel } from "./models";

export const MAC_PLACEHOLDER = "/images/mac/placeholder.svg";

export type ResolvedMacImage = {
  src: string;
  srcWebp?: string;
  alt: string;
  kind: string;
  fallback: boolean;
  width: number;
};

function webpSibling(src: string): string | undefined {
  if (!src || src === MAC_PLACEHOLDER) return undefined;
  if (/\.webp$/i.test(src)) return src;
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

function widthForKind(kind: string): number {
  if (/hero|startframe|endframe|welcome|pv_hero/i.test(kind)) return 1800;
  return 1400;
}

/**
 * kind: "product" | "overview" | named page asset (hero_startframe, design_top_midnight, …)
 */
export function getMacImage(
  modelId: string,
  colourKey: string | null | undefined,
  kind: string = "product",
  modelName?: string,
): ResolvedMacImage {
  const model = getMacModel(modelId);
  const name = modelName ?? model?.name ?? modelId.replace(/-/g, " ");
  const family = model?.family ?? "Air";

  const finish = (src: string, alt: string, k: string, fallback: boolean): ResolvedMacImage => ({
    src,
    srcWebp: webpSibling(src),
    alt,
    kind: k,
    fallback,
    width: widthForKind(k),
  });

  if (kind === "overview") {
    const ov = overviewSrc(modelId);
    return finish(
      ov || MAC_PLACEHOLDER,
      `${name}, all colours overview`,
      "overview",
      !ov,
    );
  }

  if (kind === "product") {
    if (model && missingStoreShot(model)) {
      const ov = overviewSrc(modelId);
      return finish(
        ov || MAC_PLACEHOLDER,
        `${name}, colour overview (store shot coming soon)`,
        "overview",
        true,
      );
    }
    const colour = colourKey || model?.defaultColour || "silver";
    const src = productSrc(modelId, colour);
    if (src) {
      return finish(
        src,
        `${name} in ${colourLabel(colour)}, open, front view`,
        "product",
        false,
      );
    }
    const ov = overviewSrc(modelId);
    return finish(ov || MAC_PLACEHOLDER, `${name}, overview`, "overview", true);
  }

  if (kind === "size" || kind === "size_comparison") {
    const src =
      sizeComparisonSrc() ||
      pageAssetAliases(family, ["design_sizes_endframe", "pv_sizes_endframe", "pv_sizes_startframe"]);
    return finish(src || MAC_PLACEHOLDER, `${name} size comparison`, "size", !src);
  }

  // Named page assets (Air / Pro packs)
  const aliases: Record<string, string[]> = {
    hero_startframe: ["hero_startframe", "pv_hero_startframe"],
    hero_endframe: ["hero_endframe", "pv_hero_endframe"],
    hero_static: ["hero_static"],
    display: ["display_hero", "pv_display"],
    display_edr: ["display_edr"],
    display_promotion: ["display_promotion"],
    display_nano_texture: ["display_nano_texture"],
    display_multiple: ["display_multiple"],
    battery: ["design_battery", "battery_hero"],
    camera_start: [
      "camera_audio_center_stage_startframe",
      "camera_center_stage_startframe",
      "pv_camera_startframe",
    ],
    camera_end: [
      "camera_audio_center_stage_endframe",
      "camera_center_stage_endframe",
      "pv_camera_endframe",
    ],
    desk_view: ["camera_audio_desk_view", "camera_desk_view"],
    ports_1: ["connections_hw_1", "connectivity_left", "pv_connectivity"],
    ports_2: ["connections_hw_2", "connectivity_right"],
    magsafe: colourKey
      ? [
          `design_magsafe_${colourKey.replace(/-/g, "")}`,
          `design_magsafe_${colourKey}`,
          colourKey === "sky-blue" ? "design_magsafe_skyblue" : "",
          colourKey === "space-gray" ? "design_magsafe_spacegray" : "",
        ].filter(Boolean)
      : ["design_magsafe_midnight", "design_magsafe_silver"],
    design_top: colourKey
      ? [
          `design_top_${colourKey.replace(/-/g, "")}`,
          `design_top_${colourKey}`,
          colourKey === "sky-blue" ? "design_top_skyblue" : "",
        ].filter(Boolean)
      : ["design_top_midnight", "design_top_silver"],
    design_side: colourKey
      ? [
          `design_side_${colourKey.replace(/-/g, "")}`,
          `design_side_${colourKey}`,
          colourKey === "sky-blue" ? "design_side_skyblue" : "",
        ].filter(Boolean)
      : ["design_side_midnight", "design_side_silver"],
  };

  const tryKeys = aliases[kind] || [kind];
  const src = pageAssetAliases(family, tryKeys) || pageAsset(family, kind);
  if (src) {
    return finish(src, `${name}, ${kind.replace(/_/g, " ")}`, kind, false);
  }

  // Fallbacks
  const ov = overviewSrc(modelId);
  if (ov) return finish(ov, `${name}, overview`, "overview", true);
  const prod = productSrc(modelId, colourKey || model?.defaultColour || "silver");
  if (prod) return finish(prod, `${name}`, "product", true);
  return finish(MAC_PLACEHOLDER, name, kind, true);
}

export function defaultMacColour(model: MacModel): string {
  const available = model.colours;
  if (available.includes(model.defaultColour)) return model.defaultColour;
  return available[0] || "silver";
}

/** Build viewer tab list for a model+colour — only include views with real images. */
export function macViewerTabs(model: MacModel, colourKey: string) {
  const id = model.id;
  const name = model.name;
  const tabs: { id: string; label: string; src: string; alt: string; srcWebp?: string }[] = [];

  const front = getMacImage(id, colourKey, "product", name);
  tabs.push({ id: "front", label: "Front", src: front.src, alt: front.alt, srcWebp: front.srcWebp });

  const top = getMacImage(id, colourKey, "design_top", name);
  const side = getMacImage(id, colourKey, "design_side", name);
  if (!top.fallback) tabs.push({ id: "top", label: "Top", src: top.src, alt: top.alt, srcWebp: top.srcWebp });
  if (!side.fallback) tabs.push({ id: "side", label: "Side", src: side.src, alt: side.alt, srcWebp: side.srcWebp });

  const ports =
    model.family === "Pro"
      ? getMacImage(id, colourKey, "ports_1", name)
      : getMacImage(id, colourKey, "magsafe", name);
  if (!ports.fallback) tabs.push({ id: "ports", label: "Ports", src: ports.src, alt: ports.alt, srcWebp: ports.srcWebp });

  const display = getMacImage(id, colourKey, "display", name);
  if (!display.fallback) {
    tabs.push({ id: "display", label: "Display", src: display.src, alt: display.alt, srcWebp: display.srcWebp });
  }

  const cam = getMacImage(id, colourKey, "camera_end", name);
  if (!cam.fallback) tabs.push({ id: "camera", label: "Camera", src: cam.src, alt: cam.alt, srcWebp: cam.srcWebp });

  const size = getMacImage(id, colourKey, "size", name);
  if (!size.fallback) tabs.push({ id: "size", label: "Size", src: size.src, alt: size.alt, srcWebp: size.srcWebp });

  return tabs;
}

export function macLidFrames(model: MacModel) {
  const start = getMacImage(model.id, null, "hero_startframe", model.name);
  const end = getMacImage(model.id, null, "hero_endframe", model.name);
  if (start.fallback || end.fallback) return null;
  return { start, end };
}

export function relatedMacModels(model: MacModel, all: MacModel[]): MacModel[] {
  const sameFamily = all.filter((m) => m.family === model.family && m.id !== model.id);
  const prev = sameFamily
    .filter((m) => m.screenInches === model.screenInches && m.year < model.year)
    .sort((a, b) => b.year - a.year)[0];
  const next = sameFamily
    .filter((m) => m.screenInches === model.screenInches && m.year > model.year)
    .sort((a, b) => a.year - b.year)[0];
  const sibling = sameFamily.find(
    (m) => m.chipGen === model.chipGen && m.screenInches !== model.screenInches,
  );
  return [prev, next, sibling].filter(Boolean) as MacModel[];
}
