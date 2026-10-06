#!/usr/bin/env node
/**
 * Scan MacBook image packs → write src/lib/mac/generated-manifest.json
 * Folder 03 files are keyed by the readable name before `__`, preferring `_large_2x`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");

const PRODUCT =
  "Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos";
const OVERVIEW =
  "Gadget_Hub_MacBook_1_Products_and_Colours/02_Colour_overviews_Apple_support";
const AIR_PAGE =
  "Gadget_Hub_MacBook_2_Air_page_animation_images/03_Animation_and_page_images_apple.com/MacBook_Air_page";
const PRO_PAGE =
  "Gadget_Hub_MacBook_3_Pro_page_animation_images/03_Animation_and_page_images_apple.com/MacBook_Pro_page";

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
  // Prefer large_2x > xlarge_2x > large > xlarge > plain
  if (/_large_2x\./i.test(name)) return 500;
  if (/_xlarge_2x\./i.test(name)) return 400;
  if (/_large\./i.test(name)) return 300;
  if (/_xlarge\./i.test(name)) return 200;
  return 100;
}

function pageKey(basename) {
  // hero_startframe__hash_large_2x.png → hero_startframe
  const noExt = basename.replace(/\.[^.]+$/, "");
  const before = noExt.split("__")[0];
  return before.replace(/_+$/, "");
}

function buildPageAssets(absDir, family) {
  const files = walk(absDir);
  /** @type {Record<string, { src: string; score: number; section: string }>} */
  const best = {};
  for (const abs of files) {
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
  const out = {};
  for (const [k, v] of Object.entries(best)) {
    out[k] = { src: v.src, section: v.section, family };
  }
  return out;
}

function colourFromProductName(name) {
  const n = name.toLowerCase();
  const tokens = [
    "space-gray",
    "spacegray",
    "space-black",
    "spaceblack",
    "skyblue",
    "sky-blue",
    "midnight",
    "starlight",
    "silver",
    "gold",
  ];
  for (const t of tokens) {
    if (n.includes(t)) {
      if (t.includes("gray") || t === "spacegray") return "space-gray";
      if (t.includes("black") || t === "spaceblack") return "space-black";
      if (t.includes("sky")) return "sky-blue";
      return t;
    }
  }
  return null;
}

function buildProducts() {
  const abs = path.join(publicRoot, PRODUCT);
  const files = walk(abs);
  /** @type {Record<string, Record<string, string>>} */
  const byFolder = {};
  for (const f of files) {
    const rel = path.relative(path.join(publicRoot, PRODUCT), f);
    const parts = rel.split(path.sep);
    const folder = parts.slice(0, -1).join("/");
    const colour = colourFromProductName(path.basename(f));
    if (!colour) {
      // size comparison etc.
      if (!byFolder[folder]) byFolder[folder] = {};
      byFolder[folder]._misc = byFolder[folder]._misc || [];
      byFolder[folder]._misc.push(toPublic(f));
      continue;
    }
    if (!byFolder[folder]) byFolder[folder] = {};
    // Prefer -select- over -cto-hero-
    const isHero = /cto-hero/i.test(path.basename(f));
    if (byFolder[folder][colour] && isHero) continue;
    byFolder[folder][colour] = toPublic(f);
  }
  return byFolder;
}

function buildOverviews() {
  const abs = path.join(publicRoot, OVERVIEW);
  const files = walk(abs);
  const out = {};
  for (const f of files) {
    const base = path.basename(f).replace(/\.[^.]+$/, "");
    out[base] = toPublic(f);
  }
  return out;
}

const manifest = {
  generatedAt: new Date().toISOString(),
  productsByFolder: buildProducts(),
  overviews: buildOverviews(),
  airPage: buildPageAssets(path.join(publicRoot, AIR_PAGE), "air"),
  proPage: buildPageAssets(path.join(publicRoot, PRO_PAGE), "pro"),
  sizeComparison:
    "/Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos/MacBook_Air/Size_comparison/macbook-air-size-unselect-202601-gallery-1.jpg",
};

const outPath = path.join(root, "src/lib/mac/generated-manifest.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(
  `Wrote ${outPath}\n  product folders: ${Object.keys(manifest.productsByFolder).length}\n  overviews: ${Object.keys(manifest.overviews).length}\n  air page keys: ${Object.keys(manifest.airPage).length}\n  pro page keys: ${Object.keys(manifest.proPage).length}`,
);
