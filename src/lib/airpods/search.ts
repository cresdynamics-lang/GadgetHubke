/**
 * Model-aware AirPods search: typos, Max/Pro generations, not-in-stock newer models.
 */

import { accessoriesForAirpods, airpodsAccessories } from "./accessories";
import { airpodsConfig } from "./config";
import { getAirpodsImage } from "./images";
import { lipaMonthly } from "./pricing";
import { airpodsModels, type AirpodsFamily, getAirpodsModel } from "./models";

export type AirpodsSearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  family: AirpodsFamily;
  generation: string;
  year: number;
  searchable: string;
  kind: "airpods";
  standInImage?: boolean;
};

export const airpodsPopularSearches = [
  "AirPods Pro 3",
  "AirPods 5",
  "AirPods Max",
  "AirPods 4 ANC",
  "Pro 2",
  "AirPods 3",
] as const;

export function normalizeAirpodsQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  q = q
    .replace(/\bear\s*pods\b/g, "airpods")
    .replace(/\bair\s*pods\b/g, "airpods")
    .replace(/\bairpod\b/g, "airpods")
    .replace(/\bapple\s*airpods\b/g, "airpods");
  q = q.replace(/\bpro(\s*)([123])\b/g, "pro $2");
  q = q.replace(/\bmax(\s*)([12])\b/g, "max $2");
  q = q.replace(/\bairpods(\s*)([2345])\b/g, "airpods $2");
  q = q.replace(/\banc\b/g, "anc");
  q = q.replace(/\busb\s*c\b/g, "usbc");
  return q.replace(/\s+/g, " ").trim();
}

export function looksLikeAirpodsQuery(raw: string): boolean {
  const q = normalizeAirpodsQuery(raw);
  if (!q) return false;
  if (/\biphone\b/.test(q) || /\bmacbook\b/.test(q) || /\bipad\b/.test(q) || /\bwatch\b/.test(q))
    return false;
  return (
    /\bairpods\b/.test(q) ||
    /\bearbuds\b/.test(q) ||
    /\bpro\b/.test(q) && /\b(anc|noise|tips)\b/.test(q) ||
    /\bmax\b/.test(q) ||
    /\bairpods\s*[2345]\b/.test(q)
  );
}

export function buildAirpodsSearchIndex(): AirpodsSearchHit[] {
  return airpodsModels.map((m) => {
    const img = getAirpodsImage(m.id, "hero", m.name);
    const searchable = [
      m.name,
      m.id,
      m.family,
      m.generation,
      String(m.year),
      ...m.colours,
      "airpods",
      "air pods",
      "earbuds",
      m.family === "Max" ? "over ear headphones max" : "",
      m.family === "Pro" ? "pro anc noise cancelling" : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return {
      id: m.id,
      name: m.name,
      href: `/airpods/${m.id}`,
      priceKes: m.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: m.family,
      generation: m.generation,
      year: m.year,
      searchable,
      kind: "airpods" as const,
      standInImage: m.standInImage,
    };
  });
}

/** No-result queries for admin review (session memory; not persisted). */
export const searchMisses: string[] = [];

export function logAirpodsSearchMiss(query: string): void {
  const q = query.trim();
  if (!q) return;
  if (!searchMisses.includes(q)) searchMisses.push(q);
  if (searchMisses.length > 200) searchMisses.splice(0, searchMisses.length - 200);
}

export function searchAirpods(query: string, index: AirpodsSearchHit[]) {
  const q = normalizeAirpodsQuery(query);
  if (!q)
    return {
      hits: [] as AirpodsSearchHit[],
      future: null as null | { queried: string; note: string },
      notInStockNewer: null as null | { message: string },
      top: null as AirpodsSearchHit | null,
      topScore: 0,
      accessories: [] as typeof airpodsAccessories,
    };

  const tokens = q.split(" ").filter(Boolean);
  let future: { queried: string; note: string } | null = null;
  const airpodsGenMatch = q.match(/\bairpods\s*([6-9]|[1-9]\d)\b/);
  const proGenMatch = q.match(/\bpro\s*([4-9]|[1-9]\d)\b/);
  const maxGenMatch = q.match(/\bmax\s*([3-9]|[1-9]\d)\b/);
  if (airpodsGenMatch) {
    const name = `AirPods ${airpodsGenMatch[1]}`;
    future = {
      queried: name,
      note: `${name} is not in the shop yet. Leave your number and we message you the day it is in stock. Meanwhile, these are the newest AirPods we have.`,
    };
  }
  if (proGenMatch) {
    const name = `AirPods Pro ${proGenMatch[1]}`;
    future = {
      queried: name,
      note: `${name} is not in the shop yet. Leave your number and we message you the day it is in stock. Meanwhile, these are the newest AirPods we have.`,
    };
  }
  if (maxGenMatch) {
    const name = `AirPods Max ${maxGenMatch[1]}`;
    future = {
      queried: name,
      note: `${name} is not in the shop yet. Leave your number and we message you the day it is in stock. Meanwhile, these are the newest AirPods we have.`,
    };
  }

  const wantsPro = /\bpro\b/.test(q);
  const wantsMax = /\bmax\b/.test(q);
  const wantsStandard = /\bairpods\s*[2345]\b/.test(q) || (/\bairpods\b/.test(q) && !wantsPro && !wantsMax);
  const wantsAnc = /\banc\b/.test(q) || /noise/.test(q);
  const genMatch =
    q.match(/\bairpods\s*([2345])\b/) ||
    q.match(/\bpro\s*([123])\b/) ||
    q.match(/\bmax\s*([12]|2020|usbc)\b/);

  const scored = index
    .map((item) => {
      let score = 0;
      if (wantsPro && item.family === "Pro") score += 70;
      if (wantsMax && item.family === "Max") score += 70;
      if (wantsStandard && item.family === "AirPods") score += 55;
      if (wantsAnc && item.searchable.includes("anc")) score += 40;
      if (future && item.year >= 2025 && !item.standInImage) score += 25;
      if (genMatch) {
        const num = genMatch[1];
        if (item.generation.toLowerCase().includes(num)) score += 90;
        else if (item.searchable.includes(num)) score += 35;
      }
      for (const t of tokens) {
        if (["airpods", "apple", "pro", "max", "anc", "usb", "usbc"].includes(t)) continue;
        if (item.searchable.includes(t)) score += 14;
      }
      if (item.standInImage && /\b(newest|latest|202[56])\b/.test(q)) score -= 20;
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.item.year - a.item.year);

  const hits = scored.slice(0, 8).map((r) => r.item);
  const top = hits[0] || null;

  let notInStockNewer: { message: string } | null = null;
  if (
    future &&
    top &&
    (top.standInImage || top.year < 2024) &&
    /\b(pro\s*3|airpods\s*5|max\s*2|2025|2026|newest|latest)\b/.test(q)
  ) {
    notInStockNewer = {
      message:
        "We may not have the newest model in stock - results show similar or earlier AirPods we can source.",
    };
  }

  let accessories = airpodsAccessories.slice(0, 4);
  if (top) {
    const m = getAirpodsModel(top.id);
    if (m) accessories = accessoriesForAirpods(m).slice(0, 6);
  }

  if (!hits.length && !future) logAirpodsSearchMiss(query);

  return {
    hits,
    future,
    notInStockNewer,
    top,
    topScore: scored[0]?.score || 0,
    accessories,
  };
}

export { airpodsConfig, lipaMonthly };
