/**
 * Model-aware Apple Watch search: series/ultra/se typos, size tokens, future alerts.
 */

import { accessoriesForWatch, watchBands, fitsBand } from "./bands";
import { watchConfig } from "./config";
import { getWatchImage } from "./images";
import { lipaMonthly } from "./pricing";
import { watchModels, type WatchFamily, getWatchModel } from "./models";

export type WatchSearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  family: WatchFamily;
  generation: string;
  caseMm: number;
  year: number;
  searchable: string;
  kind: "watch";
};

export const watchPopularSearches = [
  "Series 12",
  "Ultra 4",
  "SE 3",
  "Watch 46mm",
  "Sport Loop",
  "Hermès Watch",
] as const;

export function normalizeWatchQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  q = q
    .replace(/\bi\s*watch\b/g, "watch")
    .replace(/\b(iwatch|apple\s*wach|wach)\b/g, "watch")
    .replace(/\bapple\s*watch\b/g, "watch");
  q = q.replace(/\bs(\d{1,2})\b/g, "series $1");
  q = q.replace(/\bse(\d)\b/g, "se $1");
  q = q.replace(/\bultra(\d)\b/g, "ultra $1");
  q = q.replace(/\b(\d{2})\s*mm\b/g, "$1");
  q = q.replace(/\bhermes\b/g, "hermès");
  return q.replace(/\s+/g, " ").trim();
}

export function looksLikeWatchQuery(raw: string): boolean {
  const q = normalizeWatchQuery(raw);
  if (!q) return false;
  if (/\biphone\b/.test(q) || /\bmacbook\b/.test(q) || /\bipad\b/.test(q)) return false;
  return (
    /\bwatch\b/.test(q) ||
    /\bseries\b/.test(q) ||
    /\bultra\b/.test(q) ||
    /\bse\b/.test(q) ||
    /\bband\b|\bstrap\b/.test(q) ||
    /\bhermès\b|\bhermes\b|\bnike\b/.test(q)
  );
}

export function buildWatchSearchIndex(): WatchSearchHit[] {
  return watchModels.map((m) => {
    const img = getWatchImage(m.id, "main", m.name);
    const searchable = [
      m.name,
      m.id,
      m.family,
      m.generation,
      String(m.defaultCaseMm),
      String(m.year),
      ...m.colours,
      ...m.materials,
      "watch",
      "apple watch",
    ]
      .join(" ")
      .toLowerCase();
    return {
      id: m.id,
      name: m.name,
      href: `/watch/${m.id}`,
      priceKes: m.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: m.family,
      generation: m.generation,
      caseMm: m.defaultCaseMm,
      year: m.year,
      searchable,
      kind: "watch" as const,
    };
  });
}

export function searchWatches(query: string, index: WatchSearchHit[]) {
  const q = normalizeWatchQuery(query);
  if (!q) return { hits: [] as WatchSearchHit[], future: null as null | { queried: string }, top: null as WatchSearchHit | null, topScore: 0, bands: [] as typeof watchBands };

  const tokens = q.split(" ").filter(Boolean);
  let future: { queried: string } | null = null;
  const seriesMatch = q.match(/\bseries\s*(1[3-9]|[2-9]\d)\b/);
  const ultraMatch = q.match(/\bultra\s*([5-9]|[1-9]\d)\b/);
  if (seriesMatch) future = { queried: `Apple Watch Series ${seriesMatch[1]}` };
  if (ultraMatch) future = { queried: `Apple Watch Ultra ${ultraMatch[1]}` };

  const wantsSeries = /\bseries\b/.test(q);
  const wantsUltra = /\bultra\b/.test(q);
  const wantsSe = /\bse\b/.test(q);
  const wantsHermes = /\bhermès\b|\bhermes\b/.test(q);
  const wantsNike = /\bnike\b/.test(q);
  const wantsBand = /\bband\b|\bstrap\b/.test(q);
  const sizeMatch = q.match(/\b(40|41|42|44|45|46|49)\b/);
  const size = sizeMatch ? Number(sizeMatch[1]) : null;
  const genMatch = q.match(/\bseries\s*([6-9]|1[0-2])\b/) || q.match(/\bultra\s*([1-4])\b/) || q.match(/\bse\s*([1-3])\b/);

  const scored = index.map((item) => {
    let score = 0;
    if (wantsSeries && item.family === "Series") score += 70;
    if (wantsUltra && item.family === "Ultra") score += 70;
    if (wantsSe && item.family === "SE") score += 70;
    if (wantsHermes && item.family === "Hermès") score += 80;
    if (wantsNike && item.family === "Nike") score += 80;
    if (size != null) {
      if (item.caseMm === size) score += 50;
      else if (Math.abs(item.caseMm - size) <= 2) score += 12;
    }
    if (genMatch) {
      const g = genMatch[0];
      if (item.generation.toLowerCase().includes(g.replace(/\s+/g, " "))) score += 90;
      else if (item.searchable.includes(genMatch[1])) score += 40;
    }
    if (future && item.year >= 2025) score += 30;
    for (const t of tokens) {
      if (["watch", "apple", "series", "ultra", "se", "mm"].includes(t)) continue;
      if (item.searchable.includes(t)) score += 14;
    }
    return { item, score };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score || b.item.year - a.item.year);

  const hits = scored.slice(0, 8).map((r) => r.item);
  const top = hits[0] || null;
  let bands = watchBands.slice(0, 4);
  if (wantsBand && top) {
    const m = getWatchModel(top.id);
    if (m) bands = watchBands.filter((b) => fitsBand(m, b)).slice(0, 6);
  } else if (top) {
    const m = getWatchModel(top.id);
    if (m) bands = watchBands.filter((b) => fitsBand(m, b)).slice(0, 4);
  }

  return { hits, future, top, topScore: scored[0]?.score || 0, bands };
}

export { watchConfig, accessoriesForWatch, lipaMonthly };
