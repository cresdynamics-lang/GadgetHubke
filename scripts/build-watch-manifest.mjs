#!/usr/bin/env node
/**
 * Scan Watch image packs → src/lib/watch/generated-manifest.json
 * Page assets keyed by readable name before `__`, preferring `_large_2x`.
 * Ultra/SE year codes in filenames assign to generations.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");

const PRODUCT =
  "Gadget_Hub_Watch_1_Product_photos_and_swatches_part1/01_Product_photos";
const SWATCH_DIRS = [
  "Gadget_Hub_Watch_1_Product_photos_and_swatches_part1/02_Material_colour_swatches_close-ups",
  "Gadget_Hub_Watch_1_Product_photos_and_swatches_part2/02_Material_colour_swatches_close-ups",
];
const OVERVIEW =
  "Gadget_Hub_Watch_1_Product_photos_and_swatches_part2/05_Colour_overviews_Apple_support";
const COMPARE =
  "Gadget_Hub_Watch_1_Product_photos_and_swatches_part2/04_Compare_headers_and_swatches";
const PAGE_ROOT = "Gadget_Hub_Watch_3_Animation_and_page_images";

const YEAR_TO_GEN = {
  202609: { series: 12, ultra: 4, se: 3 },
  202509: { series: 11, ultra: 3, se: 3 },
  202409: { series: 10, ultra: 2, se: 2 },
  202309: { series: 9, ultra: 1, se: 2 },
  202209: { series: 8, ultra: 1, se: 2 },
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name) && !/\.webp$/i.test(entry.name))
      out.push(full);
  }
  return out;
}

function toPublic(abs) {
  return "/" + path.relative(publicRoot, abs).split(path.sep).join("/");
}

function scoreVariant(name) {
  if (/_large_2x\./i.test(name)) return 500;
  if (/_xlarge_2x\./i.test(name)) return 400;
  if (/_large\./i.test(name)) return 300;
  if (/_xlarge\./i.test(name)) return 200;
  return 100;
}

function pageKey(basename) {
  const noExt = basename.replace(/\.[^.]+$/, "");
  if (/^icon_/i.test(noExt)) return null;
  const before = noExt.split("__")[0];
  return before.replace(/_+$/, "");
}

function yearFromName(name) {
  const m = name.match(/-(20\d{4})\./);
  return m ? Number(m[1]) : null;
}

function buildProducts() {
  const abs = path.join(publicRoot, PRODUCT);
  /** @type {Record<string, { cases: string[]; bands: string[]; year?: number }>} */
  const byKey = {};

  for (const f of walk(abs)) {
    const base = path.basename(f);
    const folder = path.basename(path.dirname(f));
    const year = yearFromName(base);
    const src = toPublic(f);
    let key = folder;

    if (/^s12-/i.test(base) || /Series_12/i.test(folder)) key = "series-12";
    else if (/^s11-/i.test(base) || /Series_11/i.test(folder)) key = "series-11";
    else if (/^s10-/i.test(base) || /Series_10/i.test(folder)) key = "series-10";
    else if (/^s9-/i.test(base) || /Series_9/i.test(folder)) key = "series-9";
    else if (/^se-/i.test(base) || /^SE_/i.test(folder)) {
      const ymap = year ? YEAR_TO_GEN[year] : null;
      key = ymap?.se === 3 ? "se-3" : ymap?.se === 2 ? "se-2" : "se-mixed";
      if (year === 202609 || year === 202509) key = "se-3";
      else if (year === 202309 || year === 202209) key = "se-2";
    } else if (/^ultra-/i.test(base) || /Ultra_/i.test(folder)) {
      const ymap = year ? YEAR_TO_GEN[year] : null;
      if (year === 202609) key = "ultra-4";
      else if (year === 202509) key = "ultra-3";
      else if (year === 202409) key = "ultra-2";
      else if (year === 202309) key = "ultra-1";
      else key = ymap ? `ultra-${ymap.ultra}` : "ultra-mixed";
    }

    if (!byKey[key]) byKey[key] = { cases: [], bands: [], year: year || undefined };
    if (/case-unselect|case-gallery/i.test(base)) byKey[key].cases.push(src);
    else if (/band-unselect|band-gallery/i.test(base)) byKey[key].bands.push(src);
    else byKey[key].cases.push(src);
    if (year) byKey[key].year = year;
  }

  for (const k of Object.keys(byKey)) {
    byKey[k].cases = [...new Set(byKey[k].cases)].sort();
    byKey[k].bands = [...new Set(byKey[k].bands)].sort();
  }
  return byKey;
}

function buildOverviews() {
  const abs = path.join(publicRoot, OVERVIEW);
  /** @type {Record<string, string>} */
  const map = {};
  for (const f of walk(abs)) {
    const base = path.basename(f).toLowerCase();
    const src = toPublic(f);
    const keys = [];
    if (/series-12|series12/.test(base)) keys.push("series-12");
    if (/series-11|series11/.test(base)) keys.push("series-11");
    if (/series-10|series10/.test(base)) keys.push("series-10");
    if (/series-9|series9/.test(base)) keys.push("series-9");
    if (/series8|series-8|fall-2022-watch-series8/.test(base)) keys.push("series-8");
    if (/series7|series-7|2021-apple-watch-series7/.test(base)) keys.push("series-7");
    if (/series6|series-6/.test(base)) keys.push("series-6");
    if (/watch-se-3|se-3/.test(base)) keys.push("se-3");
    if (/series8-se|se-gps|watch-se(?!-3)/.test(base)) keys.push("se-2", "se-1");
    if (/ultra-4/.test(base)) keys.push("ultra-4");
    if (/ultra-3/.test(base)) keys.push("ultra-3");
    if (/ultra-2/.test(base)) keys.push("ultra-2");
    if (/ultra\.png|fall-2022-apple-watch-ultra/.test(base)) keys.push("ultra-1");
    if (/hermes/.test(base)) keys.push("hermes");
    if (/nike/.test(base)) keys.push("nike");
    for (const k of keys) {
      if (!map[k] || /aluminum-gps\.png|ultra-4\.png|se-3\.png/.test(base)) map[k] = src;
    }
  }
  return map;
}

function buildSwatches() {
  /** @type {Record<string, string[]>} */
  const byGen = {};
  for (const dir of SWATCH_DIRS) {
    const abs = path.join(publicRoot, dir);
    for (const f of walk(abs)) {
      const base = path.basename(f).toLowerCase();
      const src = toPublic(f);
      let gen = "swatch";
      if (/s12|_s12/.test(base)) gen = "series-12";
      else if (/s11|_s11/.test(base)) gen = "series-11";
      else if (/s10|_s10/.test(base)) gen = "series-10";
      else if (/s9|_s9/.test(base)) gen = "series-9";
      else if (/se3|_se3/.test(base)) gen = "se-3";
      else if (/_se_/.test(base) || /-se_/.test(base)) gen = "se-2";
      else if (/ultra4/.test(base)) gen = "ultra-4";
      else if (/ultra3/.test(base)) gen = "ultra-3";
      else if (/ultra2/.test(base)) gen = "ultra-2";
      else if (/ultra/.test(base)) gen = "ultra-1";
      if (!byGen[gen]) byGen[gen] = [];
      byGen[gen].push(src);
    }
  }
  return byGen;
}

function buildPages() {
  const abs = path.join(publicRoot, PAGE_ROOT);
  /** @type {Record<string, Record<string, { src: string; section: string; score: number }>>} */
  const pages = {};
  if (!fs.existsSync(abs)) return pages;

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pageName = entry.name.replace(/_page$/i, "");
    const pageAbs = path.join(abs, entry.name);
    const bucket = {};
    for (const f of walk(pageAbs)) {
      const base = path.basename(f);
      const key = pageKey(base);
      if (!key) continue;
      const score = scoreVariant(base);
      const rel = path.relative(pageAbs, f);
      const section = rel.split(path.sep)[1] || rel.split(path.sep)[0] || "overview";
      const prev = bucket[key];
      if (!prev || score > prev.score) {
        bucket[key] = { src: toPublic(f), section, score };
      }
    }
    pages[pageName] = bucket;
  }
  return pages;
}

function buildCompare() {
  const abs = path.join(publicRoot, COMPARE);
  const list = walk(abs).map(toPublic);
  return list;
}

const manifest = {
  generatedAt: new Date().toISOString(),
  products: buildProducts(),
  overviews: buildOverviews(),
  swatches: buildSwatches(),
  pages: buildPages(),
  compareHeaders: buildCompare(),
};

const out = path.join(root, "src/lib/watch/generated-manifest.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log(
  `Wrote ${out}\n  products=${Object.keys(manifest.products).length} overviews=${Object.keys(manifest.overviews).length} pages=${Object.keys(manifest.pages).length} swatch-groups=${Object.keys(manifest.swatches).length}`,
);
