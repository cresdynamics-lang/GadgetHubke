#!/usr/bin/env node
/**
 * build-airpods-manifest
 * Scans pack 1 (01/02/04/05) + five Airpods3/03_AirPods_animation_images_* folders.
 * Keys: <page>/<section>/<readable-name>  (hash + size stripped)
 * Pairs: *_startframe + *_endframe → { start, end } under base key.
 * Preference: _large_2x > _large > raw. Ignore _xsmall*. Fail if 03 file count ≠ 236.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const outPath = path.join(root, "src/lib/airpods/generated-manifest.json");
const reportPath = path.join(root, "src/lib/airpods/manifest-report.json");

const PACK = "Gadget_Hub_AirPods_1_Product_photos_cases_and_compare";
const PRODUCT = `${PACK}/01_Product_photos`;
const SWATCH_DIR = `${PACK}/02_Colour_swatches`;
const COMPARE_DIR = `${PACK}/04_Compare_and_feature_images`;
const CASE_DIR = `${PACK}/05_Case_and_model_overviews_Apple_support`;
const ANIM_ROOT = "Airpods3";
const EXPECTED_03 = 236;

const ANIM_FOLDERS = [
  { dir: "03_AirPods_animation_images_AirPods_Pro_page_PART1of2", page: "pro" },
  { dir: "03_AirPods_animation_images_AirPods_Pro_page_PART2of2", page: "pro" },
  { dir: "03_AirPods_animation_images_AirPods_5_page", page: "airpods5" },
  { dir: "03_AirPods_animation_images_AirPods_Max_page", page: "max" },
  { dir: "03_AirPods_animation_images_AirPods_landing_page", page: "landing" },
];

const warnings = [];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function toPublic(abs) {
  return "/" + path.relative(publicRoot, abs).split(path.sep).join("/");
}

function scoreVariant(name) {
  if (/_xsmall(_2x)?\./i.test(name)) return -1;
  if (/_large_2x\./i.test(name)) return 500;
  if (/_large\./i.test(name)) return 300;
  if (/_small(_2x)?\./i.test(name)) return 50;
  return 100; // raw
}

function readableName(basename) {
  const noExt = basename.replace(/\.[^.]+$/, "");
  return noExt.split("__")[0].replace(/_+$/, "");
}

function isMetaOrIcon(relParts, basename) {
  if (relParts.includes("meta")) return true;
  if (/_og\./i.test(basename) || /_og__/i.test(basename)) return true;
  const readable = readableName(basename);
  if (/^icon_/i.test(readable) || /^logo_/i.test(readable)) return true;
  return false;
}

function sectionFromRel(relUnderOverview) {
  // relUnderOverview like "noise-control/gallery/file.jpg" or "hero_startframe__….jpg"
  const parts = relUnderOverview.split(path.sep);
  parts.pop(); // filename
  return parts.join("/");
}

function buildAnimPages() {
  /** @type {Record<string, { src: string; webp?: string; score: number; page: string; section: string; readable: string }>} */
  const singles = {};
  /** @type {Record<string, string>} */
  const icons = {};
  let count03 = 0;
  const perFolder = {};

  for (const { dir, page } of ANIM_FOLDERS) {
    const absRoot = path.join(publicRoot, ANIM_ROOT, dir);
    const files = walk(absRoot);
    perFolder[dir] = files.length;
    count03 += files.length;

    for (const abs of files) {
      const base = path.basename(abs);
      const score = scoreVariant(base);
      const rel = path.relative(absRoot, abs);
      const parts = rel.split(path.sep);

      // Strip leading overview/ if present
      let rest = rel;
      if (parts[0] === "overview") rest = parts.slice(1).join(path.sep);
      else if (parts[0] === "meta") {
        // meta og — skip for keys, still counted in 236
        continue;
      }

      const readable = readableName(base);
      if (/^icon_/i.test(readable) || /^logo_/i.test(readable)) {
        if (score > 0) {
          const iconKey = `${page}/${readable}`;
          if (!icons[iconKey] || score > (singles[iconKey]?.score || 0)) {
            icons[iconKey] = toPublic(abs);
          }
        }
        continue;
      }

      if (score < 0) continue; // xsmall
      if (/_og/i.test(base)) continue;

      const section = sectionFromRel(rest);
      const key = section ? `${page}/${section}/${readable}` : `${page}/${readable}`;
      const prev = singles[key];
      if (!prev || score > prev.score) {
        singles[key] = {
          src: toPublic(abs),
          score,
          page,
          section,
          readable,
        };
      }
    }
  }

  if (count03 !== EXPECTED_03) {
    console.error(`FAIL: folder 03 file count is ${count03}, expected ${EXPECTED_03}`);
    console.error("Per folder:", perFolder);
    process.exit(1);
  }

  // Build pairs
  /** @type {Record<string, { start?: string; end?: string; src?: string; webp?: string }>} */
  const pages = {};
  const pairBases = new Set();

  for (const [key, entry] of Object.entries(singles)) {
    const m = entry.readable.match(/^(.*)_(startframe|endframe)$/i);
    if (m) {
      const baseReadable = m[1];
      const which = m[2].toLowerCase() === "startframe" ? "start" : "end";
      const pairKey = entry.section
        ? `${entry.page}/${entry.section}/${baseReadable}`
        : `${entry.page}/${baseReadable}`;
      pairBases.add(pairKey);
      if (!pages[pairKey]) pages[pairKey] = {};
      pages[pairKey][which] = entry.src;
    }
    pages[key] = { ...(pages[key] || {}), src: entry.src };
  }

  for (const pairKey of pairBases) {
    const p = pages[pairKey];
    if (p?.start && !p?.end) {
      warnings.push(`PAIR MISSING END: ${pairKey}`);
    }
    if (p?.end && !p?.start) {
      warnings.push(`PAIR MISSING START: ${pairKey}`);
    }
  }

  // Known single-frame pairs (allowed without end)
  const knownSingles = [
    "airpods5/welcome/hero_airpods",
    "max/welcome/max-loop",
    "airpods5/bento-gallery/bento_force_sensor",
    "landing/airpods", // landing/airpods_startframe only
  ];
  for (const k of knownSingles) {
    const idx = warnings.findIndex((w) => w.includes(k));
    if (idx >= 0) warnings.splice(idx, 1);
  }

  return { pages, icons, count03, perFolder, singlesCount: Object.keys(singles).length };
}

function buildProducts() {
  const abs = path.join(publicRoot, PRODUCT);
  /** @type {Record<string, any>} */
  const products = {};

  function ensure(key) {
    if (!products[key]) products[key] = { gallery: [], colours: {} };
    return products[key];
  }

  for (const f of walk(abs)) {
    if (/\.webp$/i.test(f)) continue;
    const base = path.basename(f);
    const folder = path.basename(path.dirname(f));
    const src = toPublic(f);
    const b = base.toLowerCase();

    let key = null;
    if (/pro_3|pro-3/.test(folder + b) || /airpods-pro-3/.test(b)) key = "pro-3";
    else if (/pro-2|pro_2/.test(b) || (/pro/i.test(folder) && /pro-2/.test(b))) key = "pro-2";
    else if (/airpods_5|airpods-5/.test(folder + b)) key = "airpods-5";
    else if (/airpods-4/.test(b) || /airpods_4/.test(folder)) key = "airpods-4";
    else if (/max/i.test(folder) || /airpods-max/.test(b)) key = "max";
    if (!key) continue;

    const p = ensure(key);
    if (/hero-select|hero_select/.test(b)) p.hero = src;
    else if (/gallery[-_]?(\d)/.test(b)) {
      const n = Number(b.match(/gallery[-_]?(\d)/)[1]);
      p.gallery[n - 1] = src;
    } else if (/select.*_fv1|wcc-select|select-202/.test(b) && /max/.test(key)) {
      const colour = b.match(/-(blue|midnight|orange|purple|starlight)_fv1/)?.[1];
      if (colour) p.colours[colour] = src;
      else if (!p.earbuds) p.earbuds = src;
    } else if (/wcc-select/.test(b)) p.caseWireless = src;
    else if (/select/.test(b) && !/hero/.test(b)) p.earbuds = src;
    else if (/hearing/.test(b)) {
      p.hearing = p.hearing || {};
      if (/test/.test(b)) p.hearing.test = src;
      else if (/aid/.test(b)) p.hearing.aid = src;
      else if (/protection/.test(b)) p.hearing.protection = src;
    }
  }

  for (const k of Object.keys(products)) {
    products[k].gallery = (products[k].gallery || []).filter(Boolean);
  }
  return products;
}

function buildSwatches() {
  const abs = path.join(publicRoot, SWATCH_DIR);
  /** @type {Record<string, string>} */
  const map = {};
  for (const f of walk(abs)) {
    if (/\.webp$/i.test(f)) continue;
    const b = path.basename(f).toLowerCase();
    const colour = b.match(/two-tone-(blue|midnight|orange)/)?.[1];
    if (colour) map[colour] = toPublic(f);
  }
  return map;
}

function buildCases() {
  const abs = path.join(publicRoot, CASE_DIR);
  /** @type {Record<string, string>} */
  const map = {};
  for (const f of walk(abs)) {
    if (/\.webp$/i.test(f)) continue;
    const stem = path.basename(f).replace(/\.[^.]+$/, "");
    map[stem] = toPublic(f);
  }
  return map;
}

function buildCompare() {
  const abs = path.join(publicRoot, COMPARE_DIR);
  /** @type {Record<string, string>} */
  const map = {};
  for (const f of walk(abs)) {
    if (/\.webp$/i.test(f)) continue;
    const stem = path.basename(f).replace(/\.[^.]+$/, "").replace(/-\d{6}$/, "");
    map[stem] = toPublic(f);
  }
  return map;
}

function main() {
  const { pages, icons, count03, perFolder, singlesCount } = buildAnimPages();
  const products = buildProducts();
  const swatches = buildSwatches();
  const cases = buildCases();
  const compare = buildCompare();

  // Attach webp sibling paths
  function withWebp(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (typeof obj.src === "string") {
      obj.webp = obj.src.replace(/\.(jpe?g|png)$/i, ".webp");
    }
    if (typeof obj.start === "string") {
      obj.startWebp = obj.start.replace(/\.(jpe?g|png)$/i, ".webp");
    }
    if (typeof obj.end === "string") {
      obj.endWebp = obj.end.replace(/\.(jpe?g|png)$/i, ".webp");
    }
    return obj;
  }
  for (const k of Object.keys(pages)) pages[k] = withWebp(pages[k]);

  const keysPerPage = {};
  for (const k of Object.keys(pages)) {
    const page = k.split("/")[0];
    keysPerPage[page] = (keysPerPage[page] || 0) + 1;
  }

  const manifest = {
    version: 2,
    generatedAt: new Date().toISOString(),
    count03,
    products,
    swatches,
    cases,
    compare,
    pages,
    icons,
    marketing: {
      pro: "/Gadget_Hub_Images/06_Watch_and_AirPods/airpods-pro.jpg",
      airpods4: "/Gadget_Hub_Images/06_Watch_and_AirPods/airpods-4.png",
      max: "/Gadget_Hub_Images/06_Watch_and_AirPods/airpods-max_colourful.png",
      family: "/Gadget_Hub_Images/06_Watch_and_AirPods/airpods_family.jpg",
    },
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

  const report = {
    count03,
    expected03: EXPECTED_03,
    perFolder,
    totalKeys: Object.keys(pages).length,
    singlesPreferred: singlesCount,
    keysPerPage,
    iconCount: Object.keys(icons).length,
    productKeys: Object.keys(products),
    caseCount: Object.keys(cases).length,
    compareCount: Object.keys(compare).length,
    warnings,
    deletedStale: [
      "public/03_Animation_and_page_images_apple.com",
      "public/03_Animation_and_page_images_apple.com 2",
      "public/03_Animation_and_page_images_apple.com 3",
    ],
    kept: ["public/03_Animation_and_page_images_apple.com 4 (Watch)"],
    animRoot: `public/${ANIM_ROOT}`,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("AirPods manifest OK");
  console.log(`  03 files: ${count03} (expected ${EXPECTED_03})`);
  console.log(`  keys: ${report.totalKeys}`, keysPerPage);
  console.log(`  products: ${report.productKeys.join(", ")}`);
  if (warnings.length) {
    console.warn("  warnings:");
    for (const w of warnings) console.warn("   -", w);
  } else {
    console.log("  warnings: none");
  }
  console.log(`  wrote ${path.relative(root, outPath)}`);
  console.log(`  report ${path.relative(root, reportPath)}`);
}

main();
