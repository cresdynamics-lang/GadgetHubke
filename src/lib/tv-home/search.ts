/**
 * Model-aware TV & Home search (Apple TV, HomePod, HomePod mini).
 */

import { accessoriesForTvHome, tvHomeAccessories } from "./accessories";
import { tvHomeConfig } from "./config";
import { getTvHomeImage } from "./images";
import { lipaMonthly } from "./pricing";
import { getTvHomeModel, tvHomeModels, type TvHomeFamily } from "./models";

export type TvHomeSearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  family: TvHomeFamily;
  generation: string;
  year: number;
  searchable: string;
  kind: "tv-home";
};

export const tvHomePopularSearches = [
  "Apple TV 4K",
  "HomePod",
  "HomePod mini",
  "Apple TV",
  "HomePod stereo",
  "Siri Remote",
] as const;

export function normalizeTvHomeQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  q = q
    .replace(/\bapple\s*tv\b/g, "apple tv")
    .replace(/\batv\b/g, "apple tv")
    .replace(/\bhome\s*pod\b/g, "homepod")
    .replace(/\bhomepod\s*mini\b/g, "homepod mini")
    .replace(/\bsiri\s*remote\b/g, "siri remote");
  return q.replace(/\s+/g, " ").trim();
}

export function looksLikeTvHomeQuery(raw: string): boolean {
  const q = normalizeTvHomeQuery(raw);
  if (!q) return false;
  if (/\biphone\b/.test(q) || /\bmacbook\b/.test(q) || /\bipad\b/.test(q) || /\bwatch\b/.test(q))
    return false;
  if (/\bairpods\b/.test(q) || /\bearbuds\b/.test(q)) return false;
  if (/\bpencil\b/.test(q) || /\bkeyboard\b/.test(q) || /\bmagic keyboard\b/.test(q)) return false;
  return (
    /\bapple tv\b/.test(q) ||
    /\bhomepod\b/.test(q) ||
    /\bsiri remote\b/.test(q) ||
    (/\btv\b/.test(q) && /\bhome\b/.test(q)) ||
    (/\b4k\b/.test(q) && /\btv\b/.test(q))
  );
}

export function buildTvHomeSearchIndex(): TvHomeSearchHit[] {
  return tvHomeModels.map((m) => {
    const img = getTvHomeImage(m.id, "hero", m.name);
    const searchable = [
      m.name,
      m.id,
      m.family,
      m.generation,
      String(m.year),
      ...m.colours,
      "apple tv",
      "homepod",
      "tv home",
      m.chip || "",
      ...m.storageOptions,
    ]
      .join(" ")
      .toLowerCase();
    return {
      id: m.id,
      name: m.name,
      href: `/tv-home/${m.id}`,
      priceKes: m.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: m.family,
      generation: m.generation,
      year: m.year,
      searchable,
      kind: "tv-home",
    };
  });
}

export const searchMisses: string[] = [];

export function logTvHomeSearchMiss(q: string): void {
  const t = q.trim();
  if (t && !searchMisses.includes(t)) searchMisses.push(t);
}

export function searchTvHome(raw: string): {
  hits: TvHomeSearchHit[];
  future: { kind: "tv-home"; queried: string } | null;
  top: TvHomeSearchHit | null;
  topScore: number;
} {
  const q = normalizeTvHomeQuery(raw);
  if (!q) return { hits: [], future: null, top: null, topScore: 0 };
  const index = buildTvHomeSearchIndex();
  const tokens = q.split(" ").filter(Boolean);

  let future: { kind: "tv-home"; queried: string } | null = null;
  const tvGen = q.match(/\bapple tv\s*(5|6|[7-9]|[1-9]\d)\b/);
  if (tvGen) future = { kind: "tv-home", queried: `Apple TV ${tvGen[1]}` };

  const wantsAtv = /\bapple tv\b/.test(q) || /\b4k\b/.test(q);
  const wantsHomePod = /\bhomepod\b/.test(q) && !/\bmini\b/.test(q);
  const wantsMini = /\bmini\b/.test(q) || /\bhomepod mini\b/.test(q);
  const wantsHub = /\bhub\b/.test(q) || /\bsmart home\b/.test(q);
  const wantsDolby = /\bdolby\b/.test(q);

  const scored = index
    .map((item) => {
      let score = 0;
      if (wantsAtv && item.family === "Apple TV") score += 70;
      if (wantsHomePod && item.family === "HomePod") score += 70;
      if (wantsMini && item.family === "HomePod mini") score += 70;
      if (wantsHub && item.searchable.includes("hub")) score += 25;
      if (wantsDolby && item.searchable.includes("dolby")) score += 20;
      if (future && item.year >= 2024) score += 15;
      for (const t of tokens) {
        if (["apple", "tv", "homepod", "mini", "4k"].includes(t)) continue;
        if (item.searchable.includes(t)) score += 14;
      }
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.item.year - a.item.year);

  const hits = scored.slice(0, 8).map((r) => r.item);
  if (!hits.length && !future && q) logTvHomeSearchMiss(raw);

  return { hits, future, top: hits[0] || null, topScore: scored[0]?.score || 0 };
}

export { accessoriesForTvHome, tvHomeAccessories, tvHomeConfig, getTvHomeModel, lipaMonthly };
