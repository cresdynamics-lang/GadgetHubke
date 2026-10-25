/**
 * Model-aware iPhone search: normalize, rank, iPhone 18+ alert path.
 */

import { models, getModel, type IphoneModel } from "./models";
import { getImage, defaultColourForModel, isOverviewOnly } from "./images";
import { accessoriesFor } from "./accessories";
import { lipaMonthly } from "./pricing";
import { iphoneConfig } from "./config";
import { listIphones } from "../iphone-list";
import { listSeoModels, resolveSeoModelFromQuery } from "./seo";

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
  "iPhone 18 Pro",
  "iPhone 17",
  "iPhone Air",
  "iPhone 16 Pro",
  "iPhone 15 Pro Max",
  "iPhone 14",
  "iPhone 13 mini",
  "iPhone 11 Pro",
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
  /** Prefer SEO catalog (sheet prices + aliases) as the search source of truth. */
  const byId = new Map<string, IphoneSearchHit>();

  for (const seo of listSeoModels()) {
    const legacy = getModel(seo.id);
    const colour = legacy
      ? defaultColourForModel(legacy.id, legacy.defaultColour ?? undefined)
      : null;
    const img = legacy
      ? getImage(legacy.id, colour, isOverviewOnly(legacy.id) ? "overview" : 1, legacy.name)
      : { src: "/images/logo.png", alt: seo.name };
    const tier = /pro max/i.test(seo.name)
      ? "Pro Max"
      : /\bpro\b/i.test(seo.name)
        ? "Pro"
        : /plus/i.test(seo.name)
          ? "Plus"
          : /mini/i.test(seo.name)
            ? "mini"
            : /duo/i.test(seo.name)
              ? "Duo"
              : /\bair\b/i.test(seo.name)
                ? "Air"
                : /e$/i.test(seo.name)
                  ? "e"
                  : "Standard";
    const searchable = [seo.name, seo.id, ...seo.aliases, seo.series, ...seo.variants.map((v) => v.storage)]
      .join(" ")
      .toLowerCase();
    byId.set(seo.id, {
      id: seo.id,
      name: seo.name,
      href: `/iphone/${seo.id}`,
      priceKes: seo.fromKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      family: seo.family,
      tier,
      chip: seo.specs.find((s) => s.label === "Chip")?.value ?? "",
      searchable,
      cameras: 0,
      battery: 0,
      display: 0,
      port: legacy?.port ?? "USB-C",
    });
  }

  // Keep any shop-only list items not already covered
  for (const i of listIphones()) {
    if (byId.has(i.id) || byId.has(i.id.replace(/^iphone-pro$/, "iphone-18-pro"))) continue;
    const family = /17/.test(i.id) ? 17 : 18;
    byId.set(i.id, {
      id: i.id,
      name: i.name,
      href: `/iphone/${i.id.startsWith("iphone-pro") ? i.id.replace("iphone-pro-max", "iphone-18-pro-max").replace("iphone-pro", "iphone-18-pro") : i.id}`,
      priceKes: i.priceKes,
      imageSrc: i.image.src,
      imageAlt: i.image.alt,
      family,
      tier: "Standard",
      chip: "",
      searchable: `${i.name} ${i.id}`.toLowerCase(),
      cameras: 0,
      battery: 0,
      display: 0,
      port: "USB-C",
    });
  }

  return [...byId.values()].sort((a, b) => b.family - a.family || a.name.localeCompare(b.name));
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

  /** Exact / alias hit wins — never show an unrelated product as the match. */
  const aliasHit = resolveSeoModelFromQuery(query);
  if (aliasHit) {
    const top =
      index.find((i) => i.id === aliasHit.id) ||
      ({
        id: aliasHit.id,
        name: aliasHit.name,
        href: `/iphone/${aliasHit.id}`,
        priceKes: aliasHit.fromKes,
        imageSrc: "/images/logo.png",
        imageAlt: aliasHit.name,
        family: aliasHit.family,
        tier: "Standard",
        chip: "",
        searchable: aliasHit.aliases.join(" "),
        cameras: 0,
        battery: 0,
        display: 0,
        port: "USB-C",
      } satisfies IphoneSearchHit);
    const related = index
      .filter((i) => aliasHit.related.includes(i.id) || i.family === aliasHit.family)
      .filter((i) => i.id !== top.id)
      .slice(0, 7);
    const m = models.find((x) => x.id === top.id);
    return {
      hits: [top, ...related],
      futureNotice: null,
      accessories: m ? accessoriesFor(m).slice(0, 4) : [],
      top,
      monthly: lipaMonthly(top.priceKes).monthlyKes,
    };
  }

  const tokens = q.split(" ").filter(Boolean);
  const genMatch = q.match(/\b(1[1-9]|[2-9]\d)\b/);
  let gen = genMatch ? Number(genMatch[1]) : null;
  let futureNotice: SearchResult["futureNotice"] = null;

  if (gen != null && gen > 18) {
    futureNotice = { queried: `iPhone ${gen}`, suggestFamily: 18 };
    gen = 18;
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
        if (item.family === 18 || item.family === 17) score += 80;
        else if (item.family === 16) score += 40;
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
