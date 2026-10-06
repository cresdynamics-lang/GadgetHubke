#!/usr/bin/env node
/**
 * Scan iPad image packs → write src/lib/ipad/generated-manifest.json
 * Page assets keyed by readable name before `__`, preferring `_large_2x`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");

const PRODUCT = "Gadget_Hub_iPad_1_Product_photos/01_Product_photos";
const OVERVIEW = "Gadget_Hub_iPad_2_Colour_overviews/02_Colour_overviews_Apple_support";

const PAGE_ROOTS = [
  {
    family: "Pro",
    dirs: [
      "Gadget_Hub_iPad_3_Pro_page_images_part1/03_Animation_and_page_images_apple.com/iPad_Pro_page",
      "Gadget_Hub_iPad_3_Pro_page_images_part2/03_Animation_and_page_images_apple.com/iPad_Pro_page",
    ],
  },
  {
    family: "Air",
    dirs: [
      "Gadget_Hub_iPad_4_Air_page_images_part1/03_Animation_and_page_images_apple.com/iPad_Air_page",
      "Gadget_Hub_iPad_4_Air_page_images_part2/03_Animation_and_page_images_apple.com/iPad_Air_page",
      "Gadget_Hub_iPad_4_Air_page_images_part3/03_Animation_and_page_images_apple.com/iPad_Air_page",
    ],
  },
  {
    family: "mini",
    dirs: [
      "Gadget_Hub_iPad_5_mini_page_images_part1/03_Animation_and_page_images_apple.com/iPad_mini_page",
      "Gadget_Hub_iPad_5_mini_page_images_part2/03_Animation_and_page_images_apple.com/iPad_mini_page",
    ],
  },
  {
    family: "iPad",
    dirs: [
      "Gadget_Hub_iPad_6_iPad_page_images/03_Animation_and_page_images_apple.com/iPad_standard_page",
    ],
  },
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
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
  if (/_large_2x\./i.test(name)) return 500;
  if (/_xlarge_2x\./i.test(name)) return 400;
  if (/_large\./i.test(name)) return 300;
  if (/_xlarge\./i.test(name)) return 200;
  return 100;
}

function pageKey(basename) {
  const noExt = basename.replace(/\.[^.]+$/, "");
  const before = noExt.split("__")[0];
  return before.replace(/_+$/, "");
}

function colourFromName(name) {
  const n = name.toLowerCase();
  const map = [
    ["space-black", "space-black"],
    ["spaceblack", "space-black"],
    ["space-gray", "space-gray"],
    ["spacegray", "space-gray"],
    ["starlight", "starlight"],
    ["rose-gold", "rose-gold"],
    ["rosegold", "rose-gold"],
    ["sky-blue", "sky-blue"],
    ["skyblue", "sky-blue"],
    ["silver", "silver"],
    ["purple", "purple"],
    ["yellow", "yellow"],
    ["blue", "blue"],
    ["pink", "pink"],
    ["gold", "gold"],
    ["green", "green"],
  ];
  for (const [tok, key] of map) {
    if (n.includes(tok)) return key;
  }
  return null;
}

function buildProducts() {
  const abs = path.join(publicRoot, PRODUCT);
  const files = walk(abs);
  /** @type {Record<string, Record<string, string|string[]>>} */
  const byFolder = {};
  for (const f of files) {
    const rel = path.relative(abs, f);
    const parts = rel.split(path.sep);
    const folder = parts.slice(0, -1).join("/");
    const base = path.basename(f);
    const colour = colourFromName(base);
    if (!byFolder[folder]) byFolder[folder] = {};

    const kind = /witb/i.test(base)
      ? "box"
      : /finish/i.test(base)
        ? "swatch"
        : /gallery|unselect/i.test(base)
          ? "gallery"
          : /select/i.test(base)
            ? "product"
            : "misc";

    if (kind === "gallery" || kind === "misc" || !colour) {
      const bucket = kind === "gallery" ? "_gallery" : "_misc";
      if (!byFolder[folder][bucket]) byFolder[folder][bucket] = [];
      byFolder[folder][bucket].push(toPublic(f));
      continue;
    }

    const slotKey = `${kind}:${colour}`;
    const isCell = /cell|wificell/i.test(base);
    const isNano = /nano/i.test(base);
    // Prefer wifi (non-cell) for product; prefer non-nano for default box
    const prev = byFolder[folder][slotKey];
    if (typeof prev === "string") {
      if (kind === "product" && isCell && !/cell|wificell/i.test(prev)) continue;
      if (kind === "box" && isNano && !/nano/i.test(prev)) continue;
    }
    byFolder[folder][slotKey] = toPublic(f);
  }
  return byFolder;
}

function buildOverviews() {
  const abs = path.join(publicRoot, OVERVIEW);
  const files = walk(abs);
  /** @type {Record<string, string>} */
  const out = {};
  for (const f of files) {
    const key = path.basename(f).replace(/\.[^.]+$/, "");
    out[key] = toPublic(f);
  }
  return out;
}

function buildPageAssets(dirs, family) {
  /** @type {Record<string, { src: string; score: number; section: string }>} */
  const best = {};
  for (const relDir of dirs) {
    const absDir = path.join(publicRoot, relDir);
    for (const abs of walk(absDir)) {
      const rel = path.relative(absDir, abs);
      const section = rel.split(path.sep)[1] || rel.split(path.sep)[0] || "misc";
      const base = path.basename(abs);
      const key = pageKey(base);
      if (!key) continue;
      const score = scoreVariant(base);
      const prev = best[key];
      if (!prev || score > prev.score) {
        best[key] = { src: toPublic(abs), score, section };
      }
    }
  }
  const out = {};
  for (const [k, v] of Object.entries(best)) {
    out[k] = { src: v.src, section: v.section, family };
  }
  return out;
}

const productsByFolder = buildProducts();
const overviews = buildOverviews();
const pages = {};
for (const pack of PAGE_ROOTS) {
  pages[pack.family] = buildPageAssets(pack.dirs, pack.family);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  productsByFolder,
  overviews,
  pages,
};

const outPath = path.join(root, "src/lib/ipad/generated-manifest.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(
  `Wrote ${outPath}\n  product folders: ${Object.keys(productsByFolder).length}\n  overviews: ${Object.keys(overviews).length}\n  Pro keys: ${Object.keys(pages.Pro || {}).length}\n  Air keys: ${Object.keys(pages.Air || {}).length}\n  mini keys: ${Object.keys(pages.mini || {}).length}\n  iPad keys: ${Object.keys(pages.iPad || {}).length}`,
);
