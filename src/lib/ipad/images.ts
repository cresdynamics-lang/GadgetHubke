/**
 * Central iPad image resolver. Every iPad page uses getIpadImage() only.
 * Product select shots under Gadget_Hub_iPad_1_…/01_Product_photos prefer .jpg.
 */

import fs from "node:fs";
import path from "node:path";
import { colourLabel } from "./colours";
import {
  gallerySrcs,
  missingStoreShot,
  overviewSrc,
  pageAsset,
  pageAssetAliases,
  productSrc,
} from "./manifest";
import { getIpadModel, type IpadModel } from "./models";

export const IPAD_PLACEHOLDER = "/images/ipad/placeholder.svg";

export type ResolvedIpadImage = {
  src: string;
  srcWebp?: string;
  alt: string;
  kind: string;
  fallback: boolean;
  width: number;
};

/** Only advertise WebP when the sibling file exists (many selects are .jpg + .webp). */
function webpSibling(src: string): string | undefined {
  if (!src || src === IPAD_PLACEHOLDER) return undefined;
  if (/\.webp$/i.test(src)) return src;
  const webp = src.replace(/\.(jpe?g|png)$/i, ".webp");
  const disk = path.join(process.cwd(), "public", webp.replace(/^\//, ""));
  return fs.existsSync(disk) ? webp : undefined;
}

function widthForKind(kind: string): number {
  if (/hero|startframe|endframe/i.test(kind)) return 1800;
  return 1400;
}

/**
 * kind: product | back | box | overview | swatch | size | pencil | keyboard | named page asset
 */
export function getIpadImage(
  modelId: string,
  colourKey: string | null | undefined,
  kind: string = "product",
  modelName?: string,
): ResolvedIpadImage {
  const model = getIpadModel(modelId);
  const name = modelName ?? model?.name ?? modelId.replace(/-/g, " ");
  const family = model?.family ?? "iPad";
  const colour = colourKey || model?.defaultColour || "silver";

  const finish = (src: string, alt: string, k: string, fallback: boolean): ResolvedIpadImage => ({
    src,
    srcWebp: webpSibling(src),
    alt,
    kind: k,
    fallback,
    width: widthForKind(k),
  });

  if (kind === "overview") {
    const ov = overviewSrc(modelId);
    return finish(ov || IPAD_PLACEHOLDER, `${name}, all colours overview`, "overview", !ov);
  }

  if (kind === "product" || kind === "front") {
    if (model && missingStoreShot(model)) {
      const ov = overviewSrc(modelId);
      return finish(
        ov || IPAD_PLACEHOLDER,
        `${name}, colour overview (store shot coming soon)`,
        "overview",
        true,
      );
    }
    const src = productSrc(modelId, colour, "product");
    if (src) {
      return finish(src, `${name} in ${colourLabel(colour)}, front view`, "product", false);
    }
    const ov = overviewSrc(modelId);
    return finish(ov || IPAD_PLACEHOLDER, `${name}, overview`, "overview", true);
  }

  if (kind === "box" || kind === "back") {
    const src = productSrc(modelId, colour, "box");
    if (src) {
      return finish(src, `${name} in ${colourLabel(colour)}, in the box`, "box", false);
    }
    return getIpadImage(modelId, colour, "product", name);
  }

  if (kind === "swatch") {
    const src = productSrc(modelId, colour, "swatch");
    if (src) return finish(src, `${name} ${colourLabel(colour)} finish`, "swatch", false);
    const closer = pageAssetAliases(family, [
      `closer_look_${colour.replace(/-/g, "_")}`,
      colour.replace(/-/g, "_"),
    ]);
    if (closer) return finish(closer, `${name} ${colourLabel(colour)}`, "swatch", false);
    return getIpadImage(modelId, colour, "overview", name);
  }

  if (kind === "size" || kind === "sizes") {
    const gals = gallerySrcs(modelId);
    if (gals[0]) return finish(gals[0], `${name} size comparison`, "size", false);
    const src = pageAssetAliases(family, [
      "two_sizes_hero",
      "design_hero_endframe",
      "design_hero_startframe",
      "hero_endframe",
    ]);
    return finish(src || IPAD_PLACEHOLDER, `${name} size`, "size", !src);
  }

  if (kind === "pencil") {
    const src = pageAssetAliases(family, [
      "pencil_hero",
      "apple_pencil_pro",
      "pencil_gallery_endframe",
    ]);
    return finish(src || IPAD_PLACEHOLDER, `${name} with Apple Pencil`, "pencil", !src);
  }

  if (kind === "keyboard") {
    const src = pageAssetAliases(family, ["keyboard_hero", "keyboard_startframe", "keyboard_endframe"]);
    return finish(src || IPAD_PLACEHOLDER, `${name} with keyboard`, "keyboard", !src);
  }

  // Named page assets
  const aliases: Record<string, string[]> = {
    hero_startframe: ["hero_startframe", "design_hero_startframe", "display_hero_startframe"],
    hero_endframe: ["hero_endframe", "design_hero_endframe", "display_hero_endframe"],
    display: ["display_hero_endframe", "display_hero_startframe", "design_hero_endframe"],
    display_start: ["display_hero_startframe"],
    display_end: ["display_hero_endframe"],
    design: ["design_hero_endframe", "design_hero_startframe"],
    design_start: ["design_hero_startframe"],
    design_end: ["design_hero_endframe"],
    chip: ["chip_hero_endframe", "chip_hero_startframe"],
    camera: ["camera_hero", "cameras_hero", "camera_startframe"],
    camera_start: [
      "camera_center_stage_startframe",
      "center_stage_startframe",
      "front_landscape_camera_startframe",
      "camera_startframe",
    ],
    camera_end: [
      "camera_center_stage_endframe",
      "center_stage_endframe",
      "front_landscape_camera_endframe",
      "camera_endframe",
    ],
    connectivity: ["cellular_hero", "connectivity_hero", "wireless", "thunderbolt_usb_4"],

    pencil_hero: ["pencil_hero"],
  };

  const tryKeys = aliases[kind] || [kind];
  const src = pageAssetAliases(family, tryKeys) || pageAsset(family, kind);
  if (src) {
    return finish(src, `${name}, ${kind.replace(/_/g, " ")}`, kind, false);
  }

  const ov = overviewSrc(modelId);
  if (ov) return finish(ov, `${name}, overview`, "overview", true);
  const prod = productSrc(modelId, colour, "product");
  if (prod) return finish(prod, name, "product", true);
  return finish(IPAD_PLACEHOLDER, name, kind, true);
}

export function defaultIpadColour(model: IpadModel): string {
  if (model.colours.includes(model.defaultColour)) return model.defaultColour;
  return model.colours[0] || "silver";
}

export function ipadViewerTabs(model: IpadModel, colourKey: string) {
  const tabs: { id: string; label: string; src: string; alt: string }[] = [];
  const front = getIpadImage(model.id, colourKey, "product", model.name);
  tabs.push({ id: "front", label: "Front", src: front.src, alt: front.alt });

  const box = getIpadImage(model.id, colourKey, "box", model.name);
  if (!box.fallback || box.kind === "box") {
    if (!box.fallback) tabs.push({ id: "box", label: "In the box", src: box.src, alt: box.alt });
  }

  const colours = getIpadImage(model.id, colourKey, "swatch", model.name);
  if (!colours.fallback || colours.kind === "swatch" || colours.kind === "overview") {
    tabs.push({ id: "colours", label: "Colours", src: colours.src, alt: colours.alt });
  }

  const sizes = getIpadImage(model.id, colourKey, "size", model.name);
  if (!sizes.fallback) tabs.push({ id: "sizes", label: "Sizes", src: sizes.src, alt: sizes.alt });

  const pencil = getIpadImage(model.id, colourKey, "pencil", model.name);
  if (!pencil.fallback) tabs.push({ id: "pencil", label: "With Pencil", src: pencil.src, alt: pencil.alt });

  const keyboard = getIpadImage(model.id, colourKey, "keyboard", model.name);
  if (!keyboard.fallback) {
    tabs.push({ id: "keyboard", label: "With keyboard", src: keyboard.src, alt: keyboard.alt });
  }

  // de-dupe consecutive identical src
  return tabs.filter((t, i, arr) => i === 0 || t.src !== arr[i - 1].src);
}

export function ipadLidFrames(model: IpadModel) {
  const start = getIpadImage(model.id, null, "hero_startframe", model.name);
  const end = getIpadImage(model.id, null, "hero_endframe", model.name);
  if (start.fallback || end.fallback) return null;
  return { start, end };
}

export function relatedIpadModels(model: IpadModel, all: IpadModel[]): IpadModel[] {
  const sameFamily = all.filter((m) => m.family === model.family && m.id !== model.id);
  const sibling = sameFamily.filter((m) => m.chipGen === model.chipGen && m.screenInches !== model.screenInches);
  const prev = sameFamily
    .filter((m) => m.year < model.year)
    .sort((a, b) => b.year - a.year)
    .slice(0, 1);
  const next = sameFamily
    .filter((m) => m.year > model.year)
    .sort((a, b) => a.year - b.year)
    .slice(0, 1);
  const out = [...sibling, ...prev, ...next];
  const seen = new Set<string>();
  return out.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  }).slice(0, 3);
}
