/**
 * Model-aware MacBook search: MBA/MBP typos, chip + size tokens, M6+ alert.
 */

import { accessoriesForMac } from "./accessories";
import { macConfig } from "./config";
import { getMacImage, defaultMacColour } from "./images";
import { lipaMonthly } from "./pricing";
import { macModels } from "./models";

export type MacSearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  family: "Air" | "Pro";
  chipGen: string;
  chip: string;
  screenInches: number;
  year: number;
  searchable: string;
  kind: "mac";
};

export const macPopularSearches = [
  "MacBook Air M4",
  "MacBook Pro 14",
  "MBA M3",
  "MBP M4 Pro",
  "Air 15",
  "MacBook Air M5",
  "M6",
] as const;

const VOCAB = [
  "air",
  "pro",
  "max",
  "macbook",
  "mac",
  "midnight",
  "starlight",
  "silver",
  "space",
  "gray",
  "grey",
  "black",
  "sky",
  "blue",
  "gold",
  "case",
  "sleeve",
  "charger",
  "hub",
  "dock",
  "magsafe",
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

export function normalizeMacQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

  q = q
    .replace(/\bmac\s*book\b/g, "macbook")
    .replace(/\b(macbok|mackbook|macbookk)\b/g, "macbook");

  // Abbreviations
  q = q.replace(/\bmba\b/g, "macbook air");
  q = q.replace(/\bmbp\b/g, "macbook pro");

  // Chip spacing: m4pro → m4 pro
  q = q.replace(/\bm([1-9])\s*pro\b/g, "m$1 pro");
  q = q.replace(/\bm([1-9])\s*max\b/g, "m$1 max");
  q = q.replace(/\bm([1-9])pro\b/g, "m$1 pro");
  q = q.replace(/\bm([1-9])max\b/g, "m$1 max");

  // Size tokens: 15in, 15", 15-inch
  q = q.replace(/\b(1[3-6])\s*(inch|in|")\b/g, "$1");
  q = q.replace(/\bair\s*(1[3-6])\b/g, "air $1");
  q = q.replace(/\bpro\s*(1[3-6])\b/g, "pro $1");

  q = q.replace(/(\d+)\s*gb\b/g, "$1gb");

  q = q
    .split(" ")
    .map((w) => {
      if (VOCAB.includes(w) || /^m[1-9]$/.test(w) || /^(13|14|15|16)$/.test(w)) return w;
      const hit = VOCAB.find((v) => editDistance1(w, v));
      return hit || w;
    })
    .join(" ");

  return q.replace(/\s+/g, " ").trim();
}

export function looksLikeMacQuery(raw: string): boolean {
  const q = normalizeMacQuery(raw);
  if (!q) return false;
  if (/\biphone\b/.test(q)) return false;
  return (
    /\bmacbook\b/.test(q) ||
    /\bmac\b/.test(q) ||
    /\b(air|pro)\b/.test(q) && /\bm[1-9]\b/.test(q) ||
    /\bmba\b|\bmbp\b/.test(raw.toLowerCase()) ||
    /\bm[1-9]\b/.test(q) && /\b(13|14|15|16)\b/.test(q)
  );
}

export function buildMacSearchIndex(): MacSearchHit[] {
  return macModels.map((m) => {
    const colour = defaultMacColour(m);
    const img = getMacImage(m.id, colour, "product", m.name);
    const searchable = [
      m.name,
      m.id,
      m.family,
      m.chip,
      m.chipGen,
      String(m.screenInches),
      String(m.year),
      m.tagline,
      ...m.colours,
      ...m.storageOptions,
      `m${m.chipGen.replace("M", "")}`,
      m.family === "Air" ? "mba" : "mbp",
    ]
      .join(" ")
      .toLowerCase();
    return {
      id: m.id,
      name: m.name,
      href: `/mac/${m.id}`,
      priceKes: m.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: m.family,
      chipGen: m.chipGen,
      chip: m.chip,
      screenInches: m.screenInches,
      year: m.year,
      searchable,
      kind: "mac" as const,
    };
  });
}

export type MacSearchResult = {
  hits: MacSearchHit[];
  futureNotice: null | { queried: string };
  accessories: ReturnType<typeof accessoriesForMac>;
  top: MacSearchHit | null;
  monthly: number | null;
};

function chipGenRank(gen: string): number {
  const n = Number(String(gen).replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function searchMacs(query: string, index: MacSearchHit[]): MacSearchResult {
  const q = normalizeMacQuery(query);
  if (!q) {
    return { hits: [], futureNotice: null, accessories: [], top: null, monthly: null };
  }

  const tokens = q.split(" ").filter(Boolean);
  let futureNotice: MacSearchResult["futureNotice"] = null;

  const futureChip = q.match(/\bm([6-9]|[1-9]\d)\b/);
  if (futureChip) {
    futureNotice = { queried: `MacBook with M${futureChip[1]}` };
  }

  const wantsAir = /\bair\b/.test(q) && !/\bpro\b/.test(q);
  const wantsPro = /\bpro\b/.test(q) && !wantsAir;
  const wantsMax = /\bmax\b/.test(q);
  const sizeMatch = q.match(/\b(13|14|15|16)\b/);
  const size = sizeMatch ? Number(sizeMatch[1]) : null;
  const chipMatch = q.match(/\bm([1-5])\b/);
  let chipN = chipMatch ? Number(chipMatch[1]) : null;
  if (futureNotice) chipN = 5; // show newest meanwhile

  const scored = index
    .map((item) => {
      let score = 0;
      const itemChipN = chipGenRank(item.chipGen);

      if (wantsAir && item.family === "Air") score += 70;
      if (wantsPro && item.family === "Pro") score += 70;
      if (wantsMax && /\bmax\b/i.test(item.chip)) score += 40;
      else if (wantsPro && /\bpro\b/i.test(item.chip) && !/\bmax\b/i.test(item.chip)) score += 20;

      if (size != null) {
        if (item.screenInches === size) score += 50;
        else if (Math.abs(item.screenInches - size) === 1) score += 12;
      }

      if (chipN != null) {
        if (itemChipN === chipN) score += 90;
        else if (Math.abs(itemChipN - chipN) === 1) score += 28;
        else score += Math.max(0, 10 - Math.abs(itemChipN - chipN) * 3);
      } else if (tokens.length === 1 && (tokens[0] === "macbook" || tokens[0] === "mac")) {
        if (itemChipN >= 4) score += 60;
      }

      for (const t of tokens) {
        if (t === "macbook" || t === "mac" || /^m\d$/.test(t) || /^(13|14|15|16)$/.test(t)) continue;
        if (t === "air" || t === "pro" || t === "max") continue;
        if (item.searchable.includes(t)) score += 14;
      }

      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        chipGenRank(b.item.chipGen) - chipGenRank(a.item.chipGen) ||
        b.item.year - a.item.year,
    );

  const hits = scored.slice(0, 8).map((r) => r.item);
  const top = hits[0] || null;
  let accessories: ReturnType<typeof accessoriesForMac> = [];
  let monthly: number | null = null;
  if (top) {
    const m = macModels.find((x) => x.id === top.id);
    if (m) {
      accessories = accessoriesForMac(m)
        .filter((a) => a.category !== "cross")
        .slice(0, 4);
      monthly = lipaMonthly(m.basePriceKes).monthlyKes;
    }
  }

  return { hits, futureNotice, accessories, top, monthly };
}

export function searchMissLogKey() {
  return "gh-search-misses";
}

export { macConfig };
