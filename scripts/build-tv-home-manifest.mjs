#!/usr/bin/env node
/**
 * Scan TV & Home image packs → src/lib/tv-home/generated-manifest.json
 * Product pack + three animation roots under public/TV&Home/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");

const PACK = "Gadget_Hub_TV_and_Home_1_Product_photos_colours_and_compare";
const PRODUCT = `${PACK}/01_Product_photos`;
const SWATCH_DIR = `${PACK}/02_Colour_finish_swatches`;
const COMPARE_DIR = `${PACK}/04_Compare_images`;
const OVERVIEW_DIR = `${PACK}/05_Model_overviews_Apple_support`;

const ANIM_ROOTS = [
  "TV&Home/03_Animation_and_page_images_apple.com",
  "TV&Home/03_Animation_and_page_images_apple.com 2",
  "TV&Home/03_Animation_and_page_images_apple.com 3",
];

const PAGE_DIR_TO_FAMILY = {
  Apple_TV_4K: "AppleTV",
  Apple_TV_overview: "AppleTV",
  HomePod: "HomePod",
  HomePod_mini: "HomePodMini",
  TV_and_Home_landing: "Landing",
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name) && !/\.webp$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function toPublic(abs) {
  return "/" + path.relative(publicRoot, abs).split(path.sep).join("/");
}

function scoreVariant(name) {
  let score = 100;
  if (/_large_2x\./i.test(name)) score = 500;
  else if (/_xlarge_2x\./i.test(name)) score = 400;
  else if (/_large\./i.test(name)) score = 300;
  else if (/_xlarge\./i.test(name)) score = 200;
  if (/_fv1/i.test(name)) score -= 15;
  return score;
}

function assetKey(basename) {
  const noExt = basename.replace(/\.[^.]+$/, "");
  const before = noExt.split("__")[0];
  return before.replace(/_+$/, "");
}

function isIconOrLogo(basename) {
  const noExt = basename.replace(/\.[^.]+$/, "");
  return /^icon_/i.test(noExt) || /^logo_/i.test(noExt);
}

function familyFromPageDir(dirName) {
  const stem = dirName.replace(/_page(_alt)?$/i, "");
  return PAGE_DIR_TO_FAMILY[stem] || null;
}

function buildProducts() {
  const abs = path.join(publicRoot, PRODUCT);
  /** @type {Record<string, Record<string, unknown>>} */
  const products = {
    "apple-tv-4k": { gallery: [] },
    "homepod-2": { gallery: [], colours: {} },
    "homepod-mini": { gallery: [], colours: {} },
  };

  /** @type {Record<string, Record<string, { src: string; score: number }>>} */
  const colourPick = { "homepod-2": {}, "homepod-mini": {} };

  for (const f of walk(abs)) {
    const base = path.basename(f);
    const lower = base.toLowerCase();
    const src = toPublic(f);
    const folder = path.basename(path.dirname(f));

    if (/Apple_TV_4K/i.test(folder) || /apple-tv-4k|appletv-witb/i.test(lower)) {
      const p = products["apple-tv-4k"];
      if (/hero-select/.test(lower)) {
        p.hero = src;
        continue;
      }
      if (/witb-remote|with-remote|remote-witb/.test(lower) || /witb-remote/.test(lower)) {
        p.remote = src;
        continue;
      }
      if (/witb-tv/.test(lower)) {
        p.box = src;
        continue;
      }
      if (/gallery/.test(lower)) {
        p.gallery.push(src);
      }
      continue;
    }

    if (/HomePod_2nd/i.test(folder) || (/^homepod-/.test(lower) && !/mini/.test(lower))) {
      const p = products["homepod-2"];
      if (/gallery/.test(lower)) {
        p.gallery.push(src);
        continue;
      }
      const col = lower.match(/select-(midnight|white)(?:-|\.)/);
      if (col) {
        const c = col[1];
        const prev = colourPick["homepod-2"][c];
        const score = scoreVariant(base);
        if (!prev || score > prev.score) colourPick["homepod-2"][c] = { src, score };
        continue;
      }
      if (/select-/.test(lower) && !/select-(midnight|white)/.test(lower)) {
        if (!p.hero) p.hero = src;
        continue;
      }
      if (/select-202/.test(lower)) p.hero = src;
      continue;
    }

    if (/HomePod_mini/i.test(folder) || /homepod-mini/.test(lower)) {
      const p = products["homepod-mini"];
      if (/gallery/.test(lower)) {
        p.gallery.push(src);
        continue;
      }
      const col = lower.match(/select-(midnight|white|blue|orange|yellow)(?:-|\.|_)/);
      if (col) {
        const c = col[1];
        const prev = colourPick["homepod-mini"][c];
        const score = scoreVariant(base);
        if (!prev || score > prev.score) colourPick["homepod-mini"][c] = { src, score };
        continue;
      }
      if (/select-202/.test(lower) && !/select-(midnight|white|blue|orange|yellow)/.test(lower)) {
        p.hero = src;
      }
    }
  }

  for (const key of ["homepod-2", "homepod-mini"]) {
    const colours = colourPick[key];
    for (const [c, { src }] of Object.entries(colours)) {
      products[key].colours[c] = src;
    }
    products[key].gallery = [...new Set(products[key].gallery)].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }
  products["apple-tv-4k"].gallery = [...new Set(products["apple-tv-4k"].gallery)].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );

  return products;
}

function buildSwatches() {
  const abs = path.join(publicRoot, SWATCH_DIR);
  /** @type {Record<string, string>} */
  const swatches = {};
  for (const f of walk(abs)) {
    const base = path.basename(f).toLowerCase();
    const src = toPublic(f);
    if (/mini-finish-blue|finish-blue/.test(base)) swatches.blue = src;
    if (/finish-midnight|finish-midnight/.test(base)) {
      if (/mini/.test(base)) swatches.midnight = swatches.midnight || src;
      else if (!swatches.midnight || /mini/.test(swatches.midnight)) swatches.midnight = src;
    }
    if (/finish-white/.test(base) && !/mini/.test(base)) swatches.white = swatches.white || src;
    if (/mini-finish-white/.test(base)) swatches.white = src;
    if (/mini-finish-orange/.test(base)) swatches.orange = src;
    if (/mini-finish-yellow/.test(base)) swatches.yellow = src;
    if (/homepod-finish-midnight/.test(base)) swatches.midnight = src;
    if (/homepod-finish-white/.test(base)) swatches.white = src;
    if (/mini-finish-midnight/.test(base)) swatches.midnight = src;
  }
  return swatches;
}

function buildOverviews() {
  const abs = path.join(publicRoot, OVERVIEW_DIR);
  /** @type {Record<string, string>} */
  const overviews = {};
  for (const f of walk(abs)) {
    const base = path.basename(f).toLowerCase();
    const src = toPublic(f);
    if (/4k-1gen/.test(base)) overviews["1gen"] = src;
    if (/4k-2gen/.test(base)) overviews["2gen"] = src;
    if (/4k-3gen/.test(base)) overviews["3gen"] = src;
    if (/4gen-hd|apple-tv-hd/.test(base)) overviews.hd = src;
  }
  return overviews;
}

function buildCompare() {
  const abs = path.join(publicRoot, COMPARE_DIR);
  /** @type {Record<string, string>} */
  const compare = {};
  for (const f of walk(abs)) {
    const base = path.basename(f).toLowerCase();
    const src = toPublic(f);
    if (/mini/.test(base)) compare.mini = src;
    else if (/homepod/.test(base)) compare.homepod = src;
  }
  return compare;
}

function buildPagesAndIcons() {
  /** @type {Record<string, Record<string, { src: string; section: string; score: number }>>} */
  const pages = {
    AppleTV: {},
    HomePod: {},
    HomePodMini: {},
    Landing: {},
  };
  /** @type {Record<string, { src: string; score: number; page: string }>} */
  const icons = {};

  for (const animRel of ANIM_ROOTS) {
    const animAbs = path.join(publicRoot, animRel);
    if (!fs.existsSync(animAbs)) continue;

    for (const entry of fs.readdirSync(animAbs, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pageFam = familyFromPageDir(entry.name);
      if (!pageFam) continue;
      const pageAbs = path.join(animAbs, entry.name);
      const bucket = pages[pageFam];

      for (const f of walk(pageAbs)) {
        if (/\/meta\//i.test(f)) continue;
        const base = path.basename(f);
        const key = assetKey(base);
        if (!key) continue;
        const score = scoreVariant(base);
        const rel = path.relative(pageAbs, f);
        const section = rel.split(path.sep).find((s) => s !== "overview" && s !== "welcome") || "overview";

        if (isIconOrLogo(base)) {
          const prev = icons[key];
          if (!prev || score > prev.score) {
            icons[key] = { src: toPublic(f), score, page: pageFam };
          }
          continue;
        }

        const prev = bucket[key];
        if (!prev || score > prev.score) {
          bucket[key] = { src: toPublic(f), section, score };
        }
      }
    }
  }

  const iconsOut = {};
  for (const [k, v] of Object.entries(icons)) {
    iconsOut[k] = v.src;
  }

  return { pages, icons: iconsOut };
}

function fillPageFallbacks(pages, products, overviews) {
  const add = (fam, kind, src) => {
    if (!src || pages[fam][kind]) return;
    pages[fam][kind] = { src, section: "fallback", score: 50 };
  };

  const atv = products["apple-tv-4k"];
  add("AppleTV", "hero_startframe", atv?.hero);
  add("AppleTV", "hero_tv_hw", atv?.hero);
  add("AppleTV", "remote_startframe", atv?.remote);
  add("AppleTV", "remote_hand", atv?.remote);
  add("Landing", "hero", atv?.hero || overviews["3gen"]);

  const hp = products["homepod-2"];
  add("HomePod", "hero_startframe", hp?.hero);
  add("HomePod", "ar_midnight", hp?.colours?.midnight || hp?.hero);

  const mini = products["homepod-mini"];
  add("HomePodMini", "hero_startframe", mini?.hero);
  add("HomePodMini", "hero", mini?.hero);

  return pages;
}

const products = buildProducts();
const overviews = buildOverviews();
const { pages, icons } = buildPagesAndIcons();
fillPageFallbacks(pages, products, overviews);

const manifest = {
  generatedAt: new Date().toISOString(),
  products,
  swatches: buildSwatches(),
  overviews,
  compare: buildCompare(),
  pages,
  icons,
};

const out = path.join(root, "src/lib/tv-home/generated-manifest.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));

function countUrls(obj) {
  let n = 0;
  const visit = (v) => {
    if (typeof v === "string" && v.startsWith("/")) n += 1;
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === "object") Object.values(v).forEach(visit);
  };
  visit(obj);
  return n;
}

console.log(
  `Wrote ${out}\n  products=${Object.keys(manifest.products).length} swatches=${Object.keys(manifest.swatches).length} overviews=${Object.keys(manifest.overviews).length} compare=${Object.keys(manifest.compare).length} page-families=${Object.keys(manifest.pages).length} icons=${Object.keys(manifest.icons).length} total-urls=${countUrls(manifest)}`,
);
