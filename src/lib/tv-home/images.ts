/**
 * getTvHomeImage(modelId, kind) — hero, colour, gallery, box, remote, swatch, compare, page assets.
 * Uses generated-manifest.json via manifest.ts. Never returns a broken path.
 */

import { colourLabel } from "./colours";
import {
  boxSrc,
  colourSrc as manifestColourSrc,
  compareSrc,
  gallerySrcs,
  heroSrc,
  overviewSrc,
  pageAsset,
  pageAssetAliases,
  remoteSrc,
  swatchSrc as manifestSwatchSrc,
} from "./manifest";
import { getTvHomeModel, type TvHomeModel } from "./models";

export const TV_HOME_PLACEHOLDER = "/images/placeholder-tv-home.svg";

export type ResolvedTvHomeImage = {
  src: string;
  srcWebp?: string;
  alt: string;
  kind: string;
  fallback: boolean;
  width: number;
};

export type TvHomeViewerTab = {
  id: string;
  label: string;
  src: string;
  alt: string;
  srcWebp?: string;
};

function webpSibling(src: string): string | undefined {
  if (/\.webp$/i.test(src) || src === TV_HOME_PLACEHOLDER) return undefined;
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

function widthForKind(kind: string): number {
  if (/hero|startframe|endframe/i.test(kind)) return 1800;
  return 1400;
}

function finish(src: string, alt: string, kind: string, fallback: boolean): ResolvedTvHomeImage {
  return {
    src,
    srcWebp: fallback ? undefined : webpSibling(src),
    alt,
    kind,
    fallback,
    width: widthForKind(kind),
  };
}

const FEEL_ALIASES: Record<string, string[]> = {
  hero_startframe: ["hero_startframe", "hero_tv_hw", "hero_homepod", "apple_tv_4k"],
  hero_endframe: ["hero_endframe", "hero_static", "hero_tv_hw"],
  picture: ["dolby_staticframe_alt_reduced_motion", "performance", "entertainment", "hero_tv_hw"],
  sound: ["spatial_audio_startframe", "mini_sounds", "music_album_hero", "hub_homepod"],
  remote: ["remote_hand", "remote_startframe", "siri_remote", "appletv-witb-remote"],
  smarthome: ["smart_home_hub", "hub_homeapp", "hub_homekit", "hub_discover", "icon_homeapp"],
  intercom: ["intercom_floorplan", "intercom_livingroom", "intercom_kitchen", "multiuser"],
  continuity: ["calibration_apple_tv", "facetime", "better_together", "apple_experience_hardware"],
  room: ["screen_tv_app", "rooms", "intercom_livingroom", "intercom_bedroom"],
  landing: ["apple_tv_4k", "homepod", "tv_and_home"],
};

export function defaultTvHomeColour(model: TvHomeModel): string {
  if (model.colours.includes(model.defaultColour)) return model.defaultColour;
  return model.colours[0] || "black";
}

export function getTvHomeImage(
  modelId: string,
  kind: string = "hero",
  nameHint?: string,
): ResolvedTvHomeImage {
  const model = getTvHomeModel(modelId);
  const name = nameHint || model?.name || "TV & Home";
  const pageFam = model?.pageFamily || "Landing";

  if (model?.noImage) {
    return finish(TV_HOME_PLACEHOLDER, `${name} — image not available`, kind, true);
  }

  if (kind.startsWith("colour:")) {
    const colour = kind.slice("colour:".length);
    const src =
      manifestColourSrc(modelId, colour, model) ||
      manifestSwatchSrc(colour) ||
      heroSrc(modelId, model);
    if (src) return finish(src, `${name} in ${colourLabel(colour)}`, kind, false);
  }

  if (kind.startsWith("gallery:")) {
    const idx = Number(kind.slice("gallery:".length)) || 0;
    const gals = gallerySrcs(modelId, model);
    if (gals[idx]) return finish(gals[idx], `${name}, gallery ${idx + 1}`, kind, false);
  }

  if (kind === "swatch") {
    const colour = model?.defaultColour || "midnight";
    const src = manifestSwatchSrc(colour) || manifestColourSrc(modelId, colour, model);
    if (src) return finish(src, `${name}, finish swatch`, kind, false);
  }

  if (kind === "compare") {
    const which = model?.family === "HomePod mini" ? "mini" : "homepod";
    const src = compareSrc(which);
    if (src) return finish(src, `${name}, compare`, kind, false);
  }

  if (kind === "box" || kind === "inbox") {
    const src = boxSrc(modelId, model) || remoteSrc(modelId, model);
    if (src) return finish(src, `${name}, in the box`, kind, false);
  }

  if (kind === "remote") {
    const src =
      remoteSrc(modelId, model) ||
      pageAssetAliases("AppleTV", ["remote_hand", "remote_startframe", "siri_remote"]);
    if (src) return finish(src, `${name}, Siri Remote`, kind, false);
  }

  if (kind === "hero" || kind === "product" || kind === "main") {
    if (model?.overviewOnly) {
      const ov = overviewSrc(modelId, model);
      if (ov) return finish(ov, `${name}, overview`, "hero", true);
    }
    const src = heroSrc(modelId, model) || overviewSrc(modelId, model);
    if (src) return finish(src, `${name}, hero`, "hero", Boolean(model?.overviewOnly));
  }

  if (kind === "gallery") {
    const g = gallerySrcs(modelId, model)[0];
    if (g) return finish(g, `${name}, gallery`, kind, false);
  }

  const feelKey = kind.replace(/^feel-/, "");
  const aliases = FEEL_ALIASES[feelKey] || FEEL_ALIASES[kind] || [kind, kind.replace(/-/g, "_")];
  const pageSrc = pageAssetAliases(pageFam, aliases) || pageAsset(pageFam, kind);
  if (pageSrc) {
    return finish(pageSrc, `${name}, ${kind.replace(/_/g, " ")}`, kind, false);
  }

  const landing = pageAssetAliases("Landing", FEEL_ALIASES.landing);
  if (kind === "landing" && landing) {
    return finish(landing, "TV & Home", kind, false);
  }

  const hero = heroSrc(modelId, model) || overviewSrc(modelId, model);
  if (hero) return finish(hero, name, kind, true);

  return finish(TV_HOME_PLACEHOLDER, name, kind, true);
}

export function tvHomeViewerTabs(model: TvHomeModel): TvHomeViewerTab[] {
  if (model.noImage) {
    return [
      {
        id: "unavailable",
        label: "Overview",
        src: TV_HOME_PLACEHOLDER,
        alt: "Image not available",
      },
    ];
  }

  const tabs: TvHomeViewerTab[] = [];
  const hero = getTvHomeImage(model.id, "hero", model.name);
  tabs.push({
    id: "overview",
    label: "Overview",
    src: hero.src,
    alt: hero.alt,
    srcWebp: hero.srcWebp,
  });

  gallerySrcs(model.id, model)
    .slice(0, 5)
    .forEach((src, i) => {
      tabs.push({
        id: `gallery-${i}`,
        label: i === 0 ? "Gallery" : `Gallery ${i + 1}`,
        src,
        alt: `${model.name}, gallery ${i + 1}`,
        srcWebp: webpSibling(src),
      });
    });

  if (model.colours.length > 1) {
    const c = defaultTvHomeColour(model);
    const col = getTvHomeImage(model.id, `colour:${c}`, model.name);
    if (!col.fallback || col.kind.startsWith("colour:")) {
      tabs.push({
        id: "colours",
        label: "Colours",
        src: col.src,
        alt: col.alt,
        srcWebp: col.srcWebp,
      });
    }
  }

  const box = getTvHomeImage(model.id, "box", model.name);
  if (!box.fallback) {
    tabs.push({ id: "box", label: "In the box", src: box.src, alt: box.alt, srcWebp: box.srcWebp });
  }

  if (model.family === "Apple TV") {
    const remote = getTvHomeImage(model.id, "remote", model.name);
    if (!remote.fallback) {
      tabs.push({
        id: "remote",
        label: "Remote",
        src: remote.src,
        alt: remote.alt,
        srcWebp: remote.srcWebp,
      });
    }
    const room = getTvHomeImage(model.id, "room", model.name);
    if (!room.fallback) {
      tabs.push({ id: "room", label: "In the room", src: room.src, alt: room.alt, srcWebp: room.srcWebp });
    }
  }

  return tabs;
}

export function relatedTvHomeModels(model: TvHomeModel, all: TvHomeModel[]): TvHomeModel[] {
  return all
    .filter((m) => m.id !== model.id)
    .filter(
      (m) =>
        m.family === model.family ||
        (model.family.startsWith("HomePod") && m.family.startsWith("HomePod")) ||
        (model.family === "Apple TV" && m.family === "Apple TV"),
    )
    .sort((a, b) => b.year - a.year || b.basePriceKes - a.basePriceKes)
    .slice(0, 4);
}

export function swatchSrc(colour: string): string | undefined {
  return manifestSwatchSrc(colour);
}
