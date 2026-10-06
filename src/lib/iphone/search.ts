/**
 * Model-aware iPhone search: normalize, rank, iPhone 18+ alert path.
 */

import { models, type IphoneModel } from "./models";
import { getImage, defaultColourForModel, isOverviewOnly } from "./images";
import { accessoriesFor } from "./accessories";
import { lipaMonthly } from "./pricing";
import { iphoneConfig } from "./config";

export type IphoneSearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  family: number;
  tier: string;
  chip: string;
  searchable: string;
  cameras: number;
  battery: number;
  display: number;
  port: string;
};

export const iphonePopularSearches = [
  "iPhone 16 Pro",
  "iPhone 15 Pro Max",
  "iPhone 14",
  "iPhone 13 mini",
  "iPhone 12",
  "iPhone 11 Pro",
  "iPhone 18",
  "MagSafe case",
] as const;

const VOCAB = [
  "pro",
  "max",
  "plus",
  "mini",
  "titanium",
  "black",
  "white",
  "blue",
  "pink",
  "teal",
  "case",
  "charger",
  "cable",
  "magsafe",
  "screen",
  "protector",
  "ultramarine",
  "desert",
  "natural",
];

function editDistance1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a === b) return true;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    edits++;
    if (edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  if (i < a.length || j < b.length) edits++;
  return edits <= 1;
}

export function normalizeQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ");
  q = q.replace(/\s+/g, " ").trim();

  // iphone typos
  q = q
    .replace(/\bi\s*phone\b/g, "iphone")
    .replace(/\b(ipone|iphon|ifone|aifon)\b/g, "iphone");

  // spacing fixes
  q = q.replace(/iphone(\d)/g, "iphone $1");
  q = q.replace(/(\d)pro\b/g, "$1 pro");
  q = q.replace(/promax\b/g, "pro max");
  q = q.replace(/(\d)plus\b/g, "$1 plus");
  q = q.replace(/(\d)mini\b/g, "$1 mini");
  q = q.replace(/(\d+)\s*gb\b/g, "$1gb");

  // vocab typo fix (edit distance 1)
  q = q
    .split(" ")
    .map((w) => {
      if (VOCAB.includes(w)) return w;
      const hit = VOCAB.find((v) => editDistance1(w, v));
      return hit || w;
    })
    .join(" ");

  return q.replace(/\s+/g, " ").trim();
}

export function buildIphoneSearchIndex(): IphoneSearchHit[] {
  return models.map((m) => {
    const colour = defaultColourForModel(m.id, m.defaultColour ?? undefined);
    const img = getImage(m.id, colour, isOverviewOnly(m.id) ? "overview" : 1, m.name);
    const searchable = [
      m.name,
      m.id,
      m.chip,
      m.tier,
      String(m.family),
      String(m.year),
      m.port,
      ...m.rearCameras,
      ...m.storage,
    ]
      .join(" ")
      .toLowerCase();
    return {
      id: m.id,
      name: m.name,
      href: `/iphone/${m.id}`,
      priceKes: m.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: m.family,
      tier: m.tier,
      chip: m.chip,
      searchable,
      cameras: m.rearCameras.length,
      battery: m.batteryVideoHours,
      display: m.displayInches,
      port: m.port,
    };
  });
}

export type SearchResult = {
  hits: IphoneSearchHit[];
  futureNotice: null | { queried: string; suggestFamily: number };
  accessories: ReturnType<typeof accessoriesFor>;
  top: IphoneSearchHit | null;
  monthly: number | null;
};

export function searchIphones(query: string, index: IphoneSearchHit[]): SearchResult {
  const q = normalizeQuery(query);
  if (!q) {
    return { hits: [], futureNotice: null, accessories: [], top: null, monthly: null };
  }

  const tokens = q.split(" ").filter(Boolean);
  const genMatch = q.match(/\b(1[1-9]|[2-9]\d)\b/);
  let gen = genMatch ? Number(genMatch[1]) : null;
  let futureNotice: SearchResult["futureNotice"] = null;

  if (gen != null && gen > 16) {
    futureNotice = { queried: `iPhone ${gen}`, suggestFamily: 16 };
    // rank as if 16 + same tier words
    gen = 16;
  }

  const wantsProMax = /\bpro\s*max\b/.test(q);
  const wantsPro = /\bpro\b/.test(q) && !wantsProMax;
  const wantsPlus = /\bplus\b/.test(q);
  const wantsMini = /\bmini\b/.test(q);
  const wantsE = /\be\b/.test(q) || /16e/.test(q);

  const scored = index
    .map((item) => {
      let score = 0;
      if (gen != null) {
        if (item.family === gen) score += 100;
        else if (Math.abs(item.family - gen) === 1) score += 25;
        else score += Math.max(0, 8 - Math.abs(item.family - gen) * 2);
      } else if (tokens.includes("iphone") && tokens.length === 1) {
        if (item.family === 16) score += 80;
      }

      if (wantsProMax && item.tier === "Pro Max") score += 60;
      else if (wantsPro && item.tier === "Pro") score += 60;
      else if (wantsPro && item.tier === "Pro Max") score += 35;
      else if (wantsPlus && item.tier === "Plus") score += 60;
      else if (wantsMini && item.tier === "mini") score += 60;
      else if (wantsE && item.tier === "e") score += 60;

      for (const t of tokens) {
        if (t === "iphone" || /^\d+$/.test(t)) continue;
        if (item.searchable.includes(t)) score += 14;
      }

      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.item.family - a.item.family);

  const hits = scored.slice(0, 8).map((r) => r.item);
  const top = hits[0] || null;
  let accessories: ReturnType<typeof accessoriesFor> = [];
  let monthly: number | null = null;
  if (top) {
    const m = models.find((x) => x.id === top.id);
    if (m) {
      accessories = accessoriesFor(m).slice(0, 4);
      monthly = lipaMonthly(m.basePriceKes).monthlyKes;
    }
  }

  return { hits, futureNotice, accessories, top, monthly };
}

export function searchMissLogKey() {
  return "gh-search-misses";
}

export { iphoneConfig };
