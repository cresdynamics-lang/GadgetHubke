/**
 * Model-aware iPad search: typos/abbrev, chip+size+gen tokens, M6 alert.
 */

import { accessoriesForIpad } from "./accessories";
import { ipadConfig } from "./config";
import { getIpadImage, defaultIpadColour } from "./images";
import { lipaMonthly } from "./pricing";
import { ipadModels, type IpadFamily } from "./models";

export type IpadSearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  family: IpadFamily;
  chipGen: string;
  chip: string;
  screenInches: number;
  year: number;
  searchable: string;
  kind: "ipad";
};

export const ipadPopularSearches = [
  "iPad Pro M4",
  "iPad Air 11",
  "iPad mini",
  "iPad 10",
  "Pencil Pro",
  "iPad Pro 13",
  "M5",
] as const;

const VOCAB = [
  "ipad",
  "pro",
  "air",
  "mini",
  "pencil",
  "keyboard",
  "magic",
  "folio",
  "space",
  "black",
  "silver",
  "blue",
  "purple",
  "starlight",
  "pink",
  "yellow",
  "green",
  "cellular",
  "wifi",
  "wifi",
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

export function normalizeIpadQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

  q = q
    .replace(/\bi\s*pad\b/g, "ipad")
    .replace(/\b(ipd|ipaad|ipade|aipad)\b/g, "ipad");

  q = q.replace(/\bipad(\d)/g, "ipad $1");
  q = q.replace(/\bipadpro\b/g, "ipad pro");
  q = q.replace(/\bipadair\b/g, "ipad air");
  q = q.replace(/\bipadmini\b/g, "ipad mini");

  q = q.replace(/\bm([1-9])\s*pro\b/g, "m$1 pro");
  q = q.replace(/\bm([1-9])pro\b/g, "m$1 pro");
  q = q.replace(/\ba(\d+)\s*pro\b/g, "a$1 pro");

  q = q.replace(/\b(1[0-3]|8|9)\s*(inch|in|")\b/g, "$1");
  q = q.replace(/\b(11|12\.9|13|10\.9|8\.3)\b/g, (m) => m.replace(".", ""));

  q = q.replace(/(\d+)\s*gb\b/g, "$1gb");
  q = q.replace(/\bwifi\b/g, "wifi").replace(/\bwi-fi\b/g, "wifi");
  q = q.replace(/\bcell(ular)?\b/g, "cellular");

  q = q
    .split(" ")
    .map((w) => {
      if (VOCAB.includes(w) || /^m[1-9]$/.test(w) || /^a\d+$/.test(w)) return w;
      const hit = VOCAB.find((v) => editDistance1(w, v));
      return hit || w;
    })
    .join(" ");

  return q.replace(/\s+/g, " ").trim();
}

export function looksLikeIpadQuery(raw: string): boolean {
  const q = normalizeIpadQuery(raw);
  if (!q) return false;
  if (/\biphone\b/.test(q) || /\bmacbook\b/.test(q)) return false;
  return (
    /\bipad\b/.test(q) ||
    /\bpencil\b/.test(q) ||
    (/\b(air|mini|pro)\b/.test(q) && /\b(m[1-5]|a1[2-7])\b/.test(q)) ||
    /\bmini\b/.test(q)
  );
}

export function buildIpadSearchIndex(): IpadSearchHit[] {
  return ipadModels.map((m) => {
    const colour = defaultIpadColour(m);
    const img = getIpadImage(m.id, colour, "product", m.name);
    const searchable = [
      m.name,
      m.id,
      m.family,
      m.chip,
      m.chipGen,
      String(m.screenInches),
      String(m.year),
      m.generation || "",
      ...m.colours,
      ...m.storageOptions,
      ...m.pencils,
      m.family.toLowerCase(),
      "ipad",
    ]
      .join(" ")
      .toLowerCase();
    return {
      id: m.id,
      name: m.name,
      href: `/ipad/${m.id}`,
      priceKes: m.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: m.family,
      chipGen: m.chipGen,
      chip: m.chip,
      screenInches: m.screenInches,
      year: m.year,
      searchable,
      kind: "ipad" as const,
    };
  });
}

function chipGenRank(gen: string): number {
  if (/^M/i.test(gen)) return 100 + (Number(String(gen).replace(/\D/g, "")) || 0);
  if (/^A/i.test(gen)) return Number(String(gen).replace(/\D/g, "")) || 0;
  return 0;
}

export type IpadSearchResult = {
  hits: IpadSearchHit[];
  futureNotice: null | { queried: string };
  accessories: ReturnType<typeof accessoriesForIpad>;
  top: IpadSearchHit | null;
  monthly: number | null;
};

export function searchIpads(query: string, index: IpadSearchHit[]): IpadSearchResult {
  const q = normalizeIpadQuery(query);
  if (!q) {
    return { hits: [], futureNotice: null, accessories: [], top: null, monthly: null };
  }

  const tokens = q.split(" ").filter(Boolean);
  let futureNotice: IpadSearchResult["futureNotice"] = null;

  const futureChip = q.match(/\bm([6-9]|[1-9]\d)\b/);
  if (futureChip) {
    futureNotice = { queried: `iPad with M${futureChip[1]}` };
  }

  const wantsPro = /\bpro\b/.test(q) && !/\bair\b/.test(q) && !/\bmini\b/.test(q);
  const wantsAir = /\bair\b/.test(q);
  const wantsMini = /\bmini\b/.test(q);
  const wantsStd = /\bipad\b/.test(q) && !wantsPro && !wantsAir && !wantsMini && !/\bm[1-9]\b/.test(q);

  const sizeMatch = q.match(/\b(13|11|129|109|83|10)\b/);
  let size: number | null = null;
  if (sizeMatch) {
    const raw = sizeMatch[1];
    if (raw === "129") size = 12.9;
    else if (raw === "109") size = 10.9;
    else if (raw === "83") size = 8.3;
    else size = Number(raw);
  }

  const chipMatch = q.match(/\bm([1-5])\b/) || q.match(/\ba(1[2-7]|1[3-6])\b/);
  let chipToken = chipMatch ? chipMatch[0].toUpperCase().replace("A", "A") : null;
  if (chipMatch && /^m/i.test(chipMatch[0])) chipToken = `M${chipMatch[1]}`;
  if (chipMatch && /^a/i.test(chipMatch[0])) chipToken = `A${chipMatch[1]}`;
  if (futureNotice) chipToken = "M5";

  const scored = index
    .map((item) => {
      let score = 0;
      if (wantsPro && item.family === "Pro") score += 70;
      if (wantsAir && item.family === "Air") score += 70;
      if (wantsMini && item.family === "mini") score += 70;
      if (wantsStd && item.family === "iPad") score += 50;

      if (size != null) {
        if (item.screenInches === size) score += 50;
        else if (Math.abs(item.screenInches - size) <= 0.2) score += 40;
        else if (Math.abs(item.screenInches - size) <= 1) score += 12;
      }

      if (chipToken) {
        if (item.chipGen.toUpperCase().startsWith(chipToken)) score += 90;
        else if (item.chip.toUpperCase().includes(chipToken)) score += 70;
      } else if (tokens.length === 1 && tokens[0] === "ipad") {
        if (chipGenRank(item.chipGen) >= 104) score += 60;
      }

      for (const t of tokens) {
        if (t === "ipad" || /^m\d$/.test(t) || /^a\d+$/.test(t)) continue;
        if (t === "pro" || t === "air" || t === "mini") continue;
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
  let accessories: ReturnType<typeof accessoriesForIpad> = [];
  let monthly: number | null = null;
  if (top) {
    const m = ipadModels.find((x) => x.id === top.id);
    if (m) {
      accessories = accessoriesForIpad(m)
        .filter((a) => a.category !== "cross")
        .slice(0, 4);
      monthly = lipaMonthly(m.basePriceKes).monthlyKes;
    }
  }

  return { hits, futureNotice, accessories, top, monthly };
}

export { ipadConfig };
