#!/usr/bin/env node
/**
 * Scan Accesories packs → generated-manifest.json
 * Pencil 74, Keyboard 79, Mouse 29, Trackpad 41 — fail if any count changes.
 * Keys: <group>/<folder>/<name> e.g. mouse/gestures/magic_mouse-scroll
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const outPath = path.join(root, "src/lib/accessories/generated-manifest.json");
const reportPath = path.join(root, "src/lib/accessories/manifest-report.json");

const PENCIL_ROOT = "Accesories/ACC_Apple_Pencil_images";
const KEYBOARD_ROOT = "Accesories/ACC_Magic_Keyboard_images";
const MOUSE_ROOT = "Accesories/ACC_Magic_Mouse_images";
const TRACKPAD_ROOT = "Accesories/ACC_Magic_Trackpad_images";
const POWER_ROOT = "Accesories/ACC_Power_images";
const CASES_ROOTS = [
  "Accesories/ACC_Cases_1of5",
  "Accesories/ACC_Cases_2of5",
  "Accesories/ACC_Cases_3of5",
  "Accesories/ACC_Cases_4of5",
  "Accesories/ACC_Cases_5of5",
];
const EXPECTED_PENCIL = 74;
const EXPECTED_KEYBOARD = 79;
const EXPECTED_MOUSE = 29;
const EXPECTED_TRACKPAD = 41;
const EXPECTED_POWER = 57;
const EXPECTED_CASES = 375;

const PRODUCT_IDS = [
  "pencil-pro", "pencil-usbc", "pencil-2", "pencil-1",
  "keyboard-ipad-pro-11", "keyboard-ipad-pro-13", "keyboard-ipad-air-11", "keyboard-ipad-air-13",
  "keyboard-folio", "keyboard-mac-usbc", "keyboard-mac-touchid",
  "keyboard-mac-touchid-num-white", "keyboard-mac-touchid-num-black", "keyboard-mac-num-mq052",
  "mouse-usbc-white", "mouse-usbc-black", "mouse-earlier-space-gray",
  "trackpad-usbc-white", "trackpad-usbc-black", "trackpad-earlier-space-gray", "trackpad-earlier-white",
  "power-adapter-20w", "power-adapter-35w-dual", "power-adapter-40w-dynamic", "power-adapter-70w",
  "power-adapter-96w", "power-adapter-140w", "power-extension-cable",
  "magsafe-charger-1m", "magsafe-charger-2m", "watch-magnetic-charger-1m",
  "cable-usbc-60w-1m", "cable-usbc-240w-2m", "cable-magsafe3-2m",
  "cable-tb4-1-8m", "cable-tb4-3m", "cable-tb5-1m",
];

const PART_FOLDERS = [
  { folder: /Apple_Pencil_Pro/i, prefix: "MX2D3", id: "pencil-pro" },
  { folder: /Apple_Pencil_USB-C/i, prefix: "MUWA3", id: "pencil-usbc" },
  { folder: /Apple_Pencil_2nd_gen/i, prefix: "MU8F2", id: "pencil-2" },
  { folder: /Magic_Keyboard_iPad_Pro_11/i, prefix: "MWR03", id: "keyboard-ipad-pro-11" },
  { folder: /Magic_Keyboard_iPad_Pro_13/i, prefix: "MWR53", id: "keyboard-ipad-pro-13" },
  { folder: /Magic_Keyboard_iPad_Air_11/i, prefix: "MDFV4", id: "keyboard-ipad-air-11" },
  { folder: /Magic_Keyboard_iPad_Air_13/i, prefix: "MGYY4", id: "keyboard-ipad-air-13" },
  { folder: /Magic_Keyboard_Folio/i, prefix: "MQDP3", id: "keyboard-folio" },
  { folder: /Magic_Keyboard_Mac_USB-C/i, prefix: "MJLX4", id: "keyboard-mac-usbc" },
  { folder: /Magic_Keyboard_Mac_Touch_ID_numeric_white/i, prefix: "MJM64", id: "keyboard-mac-touchid-num-white" },
  { folder: /Magic_Keyboard_Mac_Touch_ID_numeric_black/i, prefix: "MJM74", id: "keyboard-mac-touchid-num-black" },
  { folder: /Magic_Keyboard_Mac_Touch_ID(?!_numeric)/i, prefix: "MJLY4", id: "keyboard-mac-touchid" },
  { folder: /Magic_Keyboard_Mac_numeric_keypad_silver_MQ052/i, prefix: "MQ052", id: "keyboard-mac-num-mq052" },
  { folder: /Magic_Mouse_USB-C_white/i, prefix: "MXK53", id: "mouse-usbc-white" },
  { folder: /Magic_Mouse_USB-C_black/i, prefix: "MXK63", id: "mouse-usbc-black" },
  { folder: /Earlier_generation_Magic_Mouse_Space_Gray_MRME2/i, prefix: "MRME2", id: "mouse-earlier-space-gray" },
  { folder: /Magic_Trackpad_USB-C_white/i, prefix: "MXK93", id: "trackpad-usbc-white" },
  { folder: /Magic_Trackpad_USB-C_black/i, prefix: "MXKA3", id: "trackpad-usbc-black" },
  { folder: /Earlier_generation_Magic_Trackpad_Space_Gray_MRMF2/i, prefix: "MRMF2", id: "trackpad-earlier-space-gray" },
  { folder: /Earlier_generation_Magic_Trackpad_white_MJ2R2/i, prefix: "MJ2R2", id: "trackpad-earlier-white" },
  { folder: /^20W_USB-C_Power_Adapter$/i, prefix: "MWVV3", id: "power-adapter-20w" },
  { folder: /35W_Dual_USB-C/i, prefix: "MW2H3", id: "power-adapter-35w-dual" },
  { folder: /40W_Dynamic_Power_Adapter/i, prefix: "MGKN4", id: "power-adapter-40w-dynamic" },
  { folder: /^70W_USB-C_Power_Adapter$/i, prefix: "MQLN3", id: "power-adapter-70w" },
  { folder: /^96W_USB-C_Power_Adapter$/i, prefix: "MW2L3", id: "power-adapter-96w" },
  { folder: /^140W_USB-C_Power_Adapter$/i, prefix: "MW2M3", id: "power-adapter-140w" },
  { folder: /Power_Adapter_Extension_Cable/i, prefix: "MK122", id: "power-extension-cable" },
  { folder: /^MagSafe_Charger_1m$/i, prefix: "MGD74", id: "magsafe-charger-1m" },
  { folder: /^MagSafe_Charger_2m$/i, prefix: "MGDM4", id: "magsafe-charger-2m" },
  { folder: /Apple_Watch_Magnetic_Fast_Charger/i, prefix: "ML434", id: "watch-magnetic-charger-1m" },
  { folder: /60W_USB-C_Charge_Cable/i, prefix: "MQKJ3", id: "cable-usbc-60w-1m" },
  { folder: /240W_USB-C_Charge_Cable/i, prefix: "MU2G3", id: "cable-usbc-240w-2m" },
  { folder: /USB-C_to_MagSafe_3_Cable/i, prefix: "MLYV3", id: "cable-magsafe3-2m" },
  { folder: /Thunderbolt_4_USB-C_Pro_Cable_1\.8m/i, prefix: "MW5J3", id: "cable-tb4-1-8m" },
  { folder: /Thunderbolt_4_USB-C_Pro_Cable_3m/i, prefix: "MWP02", id: "cable-tb4-3m" },
  { folder: /Thunderbolt_5_USB-C_Pro_Cable/i, prefix: "MDW94", id: "cable-tb5-1m" },
];

const FEATURE_SLUGS = {
  1: "precision", 2: "latency", 3: "tilt", 4: "pressure", 5: "magnetic", 6: "charging",
  7: "hover", 8: "doubletap", 9: "barrelroll", 10: "squeeze", 11: "haptic", 12: "findmy", 13: "engraving",
};

const warnings = [];

function countAllFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || /\.webp$/i.test(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) n += countAllFiles(full);
    else n += 1;
  }
  return n;
}

/** Image-only count (Power/Cases packs: READ_ME excluded from expected totals). */
function countImageFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) n += countImageFiles(full);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) n += 1;
  }
  return n;
}

function walkImages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImages(full, out);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
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
  if (/_medium\./i.test(name)) return 200;
  if (/_small\./i.test(name)) return 50;
  return 100;
}

function readableName(basename) {
  return basename.replace(/\.[^.]+$/, "").split("__")[0].replace(/_+$/, "");
}

function ensureProduct(products, id) {
  if (!products[id]) products[id] = { angles: [], gestures: {} };
  return products[id];
}

function withWebpEntry(entry) {
  if (!entry || typeof entry !== "object") return entry;
  if (typeof entry.src === "string") entry.webp = entry.src.replace(/\.(jpe?g|png)$/i, ".webp");
  if (typeof entry.start === "string") entry.startWebp = entry.start.replace(/\.(jpe?g|png)$/i, ".webp");
  if (typeof entry.end === "string") entry.endWebp = entry.end.replace(/\.(jpe?g|png)$/i, ".webp");
  return entry;
}

function productIdFromPartFolder(folderName, fileBase) {
  for (const row of PART_FOLDERS) {
    if (row.folder.test(folderName) || fileBase.toUpperCase().startsWith(row.prefix)) return row.id;
  }
  return null;
}

function buildProductsFromPartPhotos(absRoot, products, pages, group) {
  for (const folderName of ["02_Product_photos_by_part_number", "01_Product_photos_by_part_number"]) {
    const partRoot = path.join(absRoot, folderName);
    if (!fs.existsSync(partRoot)) continue;
    for (const f of walkImages(partRoot)) {
      const folder = path.basename(path.dirname(f));
      const base = path.basename(f, path.extname(f));
      const id = productIdFromPartFolder(folder, base);
      if (!id) continue;
      const p = ensureProduct(products, id);
      const src = toPublic(f);
      pages[`${group}/${folder}/${base}`] = withWebpEntry({ src });
      if (/_SW_COLOR$/i.test(base)) p.swatch = src;
      else if (/_AV(\d+)$/i.test(base)) {
        const n = Number(RegExp.$1);
        p.angles[n - 1] = src;
      } else if (/^[A-Z0-9]+$/i.test(base)) p.hero = src;
      if (/Earlier_generation/i.test(folder)) {
        p.overviewOnly = true;
        p.earlierGeneration = true;
      }
    }
  }
  for (const id of Object.keys(products)) {
    products[id].angles = (products[id].angles || []).filter(Boolean);
  }
}

function buildGestures(absRoot, group, products, pages, gestures) {
  const dir = path.join(absRoot, "02_Gesture_images_Apple_support");
  if (!fs.existsSync(dir)) return;
  for (const f of walkImages(dir)) {
    const base = path.basename(f, path.extname(f));
    const src = toPublic(f);
    const slug = base.replace(/^magic_mouse-/i, "").replace(/^trackpad2-/i, "").replace(/_/g, "-");
    pages[`${group}/gestures/${base}`] = withWebpEntry({ src });
    gestures[`${group}/${slug}`] = src;
    gestures[slug] = src;
    const prefix = group === "mouse" ? "mouse-" : "trackpad-";
    for (const id of Object.keys(products)) {
      if (id.startsWith(prefix)) ensureProduct(products, id).gestures[slug] = src;
    }
  }
}

function buildMouseFeatureCards(absRoot, pages, store) {
  const dir = path.join(absRoot, "03_Store_feature_cards");
  if (!fs.existsSync(dir)) return;
  const best = {};
  for (const f of walkImages(dir)) {
    const base = path.basename(f);
    const score = scoreVariant(base);
    if (score < 0) continue;
    const readable = readableName(base).replace(/-large|-medium|-small$/i, "");
    const key = `mouse/featurecards/${readable}`;
    if (!best[key] || score > best[key].score) best[key] = { src: toPublic(f), score };
  }
  for (const [key, entry] of Object.entries(best)) {
    pages[key] = withWebpEntry({ src: entry.src });
    for (const id of ["mouse-usbc-white", "mouse-usbc-black", "mouse-earlier-space-gray"]) {
      store[id] = store[id] || { gallery: [], cards: [] };
      store[id].cards.push(entry.src);
      store[id].inUse = entry.src;
    }
  }
}

function buildOverviews(absRoot, overviews) {
  const ovDir = path.join(absRoot, "03_Model_overviews_Apple_support");
  if (!fs.existsSync(ovDir)) return;
  for (const f of walkImages(ovDir)) {
    const base = path.basename(f).toLowerCase();
    const src = toPublic(f);
    if (/first-gen/.test(base)) overviews["pencil-1"] = src;
    else if (/second-gen/.test(base)) overviews["pencil-2"] = src;
    else if (/pencil-pro/.test(base)) overviews["pencil-pro"] = src;
    else if (/new-apple-pencil|usb-c/.test(base)) overviews["pencil-usbc"] = src;
  }
}

function storeTargetIds(filename) {
  const l = filename.toLowerCase();
  const ids = [];
  if (/pencil-pro|pro-select|pro-splitter|compare-icon-pencil-pro/.test(l)) ids.push("pencil-pro");
  if (/pencil-usbc|usbc-select|usbc-splitter/.test(l) && /pencil|usbc/.test(l)) ids.push("pencil-usbc");
  if (/gen2|2nd-gen|gen-2/.test(l) && /pencil/.test(l)) ids.push("pencil-2");
  if (/ipad-pro-magic-keyboard|pro-accessory-magic-keyboard|magic-keyboard-pro-splitter|compare-icon-magickeyboard-m4/.test(l)) {
    ids.push("keyboard-ipad-pro-11", "keyboard-ipad-pro-13");
  }
  if (/ipad-air-keyboard|magic-keyboard-ipad-air|ipadair-accessory-magickeyboard|compare-icon-magickeyboard-ipad-air/.test(l)) {
    ids.push("keyboard-ipad-air-11", "keyboard-ipad-air-13");
  }
  if (/folio|compare-icon-magickeyboard-folio/.test(l)) ids.push("keyboard-folio");
  if (/compare-icon-keyboard-bluetooth/.test(l)) ids.push("keyboard-mac-usbc", "keyboard-mac-touchid");
  return [...new Set(ids)];
}

function buildStoreAndFeatures(absRoot, store, features) {
  const storeDir = path.join(absRoot, "01_Store_gallery_and_feature_images");
  if (!fs.existsSync(storeDir)) return;
  for (const f of walkImages(storeDir)) {
    const base = path.basename(f);
    const lower = base.toLowerCase();
    const src = toPublic(f);
    const featNum = lower.match(/apple-pencil-features-(\d+)-/);
    if (featNum) {
      const slug = FEATURE_SLUGS[Number(featNum[1])];
      if (slug) features[slug] = src;
      continue;
    }
    if (/apple-pencil-features-pro/.test(lower)) { features["pro-overview"] = src; continue; }
    if (/apple-pencil-features-usbc/.test(lower)) { features["usbc-overview"] = src; continue; }
    const galleryN = lower.match(/gallery-(\d)/);
    const ids = storeTargetIds(base);
    if (!ids.length && /compare-icon/.test(lower)) continue;
    for (const id of ids) {
      if (!store[id]) store[id] = { gallery: [], cards: [] };
      if (/card[123]/.test(lower)) store[id].cards.push(src);
      else if (galleryN) store[id].gallery[Number(galleryN[1]) - 1] = src;
      else if (/splitter/.test(lower)) store[id].splitter = src;
    }
  }
  for (const id of Object.keys(store)) store[id].gallery = (store[id].gallery || []).filter(Boolean);
}

function buildAnimPages(absRoot, group, pageDirName) {
  const singles = {};
  const animRoot = path.join(absRoot, "04_Animation_and_page_images_apple.com", pageDirName);
  if (!fs.existsSync(animRoot)) return {};
  for (const f of walkImages(animRoot)) {
    const base = path.basename(f);
    const score = scoreVariant(base);
    if (score < 0) continue;
    const rel = path.relative(animRoot, f);
    const parts = rel.split(path.sep);
    if (parts.includes("meta") || /_og/i.test(base)) continue;
    let restParts = [...parts];
    const ovIdx = restParts.indexOf("overview");
    if (ovIdx >= 0) restParts = restParts.slice(ovIdx + 1);
    else if (restParts[0]?.endsWith("_page")) restParts = restParts.slice(1);
    const fileName = restParts.pop();
    const folder = restParts.join("/") || "root";
    const readable = readableName(fileName);
    const key = `${group}/${folder}/${readable}`;
    if (!singles[key] || score > singles[key].score) singles[key] = { src: toPublic(f), score, readable };
  }
  const pages = {};
  for (const [key, entry] of Object.entries(singles)) {
    const m = entry.readable.match(/^(.*)_(startframe|endframe)$/i);
    if (m) {
      const which = m[2].toLowerCase() === "startframe" ? "start" : "end";
      const folder = key.slice(`${group}/`.length, key.lastIndexOf("/"));
      const pairKey = `${group}/${folder}/${m[1]}`;
      if (!pages[pairKey]) pages[pairKey] = {};
      pages[pairKey][which] = entry.src;
    }
    if (!pages[key]) pages[key] = {};
    pages[key].src = entry.src;
  }
  for (const k of Object.keys(pages)) pages[k] = withWebpEntry(pages[k]);
  return pages;
}


/** Power packs: map by folder under 01_/02_/03_ subgroups. */
function buildPowerPack(absRoot, products, pages) {
  const subgroups = [
    "01_Power_adapters",
    "02_MagSafe_and_wireless_charging",
    "03_Charge_and_Thunderbolt_cables",
  ];
  for (const sub of subgroups) {
    const subAbs = path.join(absRoot, sub);
    if (!fs.existsSync(subAbs)) continue;
    for (const entry of fs.readdirSync(subAbs, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const folder = entry.name;
      const folderAbs = path.join(subAbs, folder);
      for (const f of walkImages(folderAbs)) {
        const base = path.basename(f, path.extname(f));
        const byFolder = PART_FOLDERS.find((row) => row.folder.test(folder));
        if (!byFolder) {
          warnings.push(`POWER UNMAPPED: ${folder}/${base}`);
          continue;
        }
        const pid = byFolder.id;
        const p = ensureProduct(products, pid);
        const src = toPublic(f);
        const clean = base.replace(/_GEO_US$/i, "");
        pages[`power/${sub}/${folder}/${base}`] = withWebpEntry({ src, geoUs: /_GEO_US/i.test(base) });
        if (/_GEO_US/i.test(base)) p.geoUs = true;
        if (/_AV(\d+)/i.test(clean)) {
          const n = Number(RegExp.$1);
          p.angles[n - 1] = src;
          if (/_GEO_US/i.test(base)) {
            p.angleGeoUs = p.angleGeoUs || {};
            p.angleGeoUs[n - 1] = true;
          }
        } else if (/_SW_COLOR$/i.test(clean)) {
          p.swatch = src;
        } else {
          const isGeo = /_GEO_US/i.test(base);
          if (!p.hero) {
            p.hero = src;
            if (isGeo) p.geoUs = true;
          } else if (p.geoUs && !isGeo) {
            p.hero = src;
            p.geoUs = false;
          }
        }
      }
    }
  }
  for (const id of Object.keys(products)) {
    if (!id.startsWith("power-") && !id.startsWith("magsafe-") && !id.startsWith("watch-") && !id.startsWith("cable-")) continue;
    products[id].angles = (products[id].angles || []).filter(Boolean);
  }
}

/**
 * Case packs: variant index per family folder.
 * File: <PART>_<Colour>[_AVN|_SW_COLOR].jpg or <PART>[_AVN].jpg
 */
function slugFamily(folder) {
  return folder
    .replace(/^iPhone_/i, "case-iphone-")
    .replace(/^Smart_Folio_for_/i, "folio-")
    .replace(/^Crossbody_Strap$/i, "strap-crossbody")
    .replace(/^Wrist_Strap$/i, "strap-wrist")
    .toLowerCase()
    .replace(/_case_with_magsafe$/i, "")
    .replace(/_with_magsafe$/i, "")
    .replace(/_silicone$/i, "-silicone")
    .replace(/_clear$/i, "-clear")
    .replace(/_techwoven$/i, "-techwoven")
    .replace(/_finewoven_wallet$/i, "-finewoven-wallet")
    .replace(/_air_bumper$/i, "-air-bumper")
    .replace(/_air_case$/i, "-air-case")
    .replace(/_duo_case$/i, "-duo-case")
    .replace(/_duo_folio_with_kickstand$/i, "-duo-folio")
    .replace(/_bumper$/i, "-bumper")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCaseFile(base) {
  // PART_Colour_SW_COLOR | PART_Colour_AVN | PART_Colour | PART_AVN | PART
  let m = base.match(/^([A-Za-z0-9]+)_(.+)_SW_COLOR$/i);
  if (m) return { part: m[1].toUpperCase(), colour: m[2].replace(/_/g, " "), kind: "swatch" };
  m = base.match(/^([A-Za-z0-9]+)_(.+)_AV(\d+)$/i);
  if (m) return { part: m[1].toUpperCase(), colour: m[2].replace(/_/g, " "), kind: "angle", n: Number(m[3]) };
  m = base.match(/^([A-Za-z0-9]+)_AV(\d+)$/i);
  if (m) return { part: m[1].toUpperCase(), colour: null, kind: "angle", n: Number(m[2]) };
  m = base.match(/^([A-Za-z0-9]+)_(.+)$/i);
  if (m && !/^AV\d+$/i.test(m[2]) && m[2].toUpperCase() !== "SW_COLOR") {
    return { part: m[1].toUpperCase(), colour: m[2].replace(/_/g, " "), kind: "main" };
  }
  m = base.match(/^([A-Za-z0-9]+)$/i);
  if (m) return { part: m[1].toUpperCase(), colour: null, kind: "main" };
  return null;
}

function buildCasesPacks(caseRoots, products, pages, caseVariants) {
  const GROUP_DIRS = ["01_iPhone_cases", "02_iPhone_straps", "03_iPad_Smart_Folio"];
  for (const rel of caseRoots) {
    const absRoot = path.join(publicRoot, rel);
    if (!fs.existsSync(absRoot)) {
      warnings.push(`MISSING CASES ROOT: ${rel}`);
      continue;
    }
    for (const g of GROUP_DIRS) {
      const gAbs = path.join(absRoot, g);
      if (!fs.existsSync(gAbs)) continue;
      for (const entry of fs.readdirSync(gAbs, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const folder = entry.name;
        const folderAbs = path.join(gAbs, folder);
        let familyId = slugFamily(folder);
        // normalize known folders
        const map = {
          "case-iphone-17-silicone": "case-iphone-17-silicone",
          "case-iphone-17-pro-silicone": "case-iphone-17-pro-silicone",
          "case-iphone-17-pro-max-silicone": "case-iphone-17-pro-max-silicone",
          "case-iphone-17e-silicone": "case-iphone-17e-silicone",
          "case-iphone-18-pro-silicone": "case-iphone-18-pro-silicone",
          "case-iphone-18-pro-max-silicone": "case-iphone-18-pro-max-silicone",
          "case-iphone-17-clear": "case-iphone-17-clear",
          "case-iphone-17-pro-clear": "case-iphone-17-pro-clear",
          "case-iphone-17-pro-max-clear": "case-iphone-17-pro-max-clear",
          "case-iphone-17e-clear": "case-iphone-17e-clear",
          "case-iphone-18-pro-clear": "case-iphone-18-pro-clear",
          "case-iphone-18-pro-max-clear": "case-iphone-18-pro-max-clear",
          "case-iphone-18-pro-techwoven": "case-iphone-18-pro-techwoven",
          "case-iphone-18-pro-max-techwoven": "case-iphone-18-pro-max-techwoven",
          "case-iphone-air-bumper": "case-iphone-air-bumper",
          "case-iphone-air-case": "case-iphone-air-case",
          "case-iphone-finewoven-wallet": "case-iphone-finewoven-wallet",
          "case-iphone-duo-case": "case-iphone-duo-case",
          "case-iphone-duo-folio": "case-iphone-duo-folio",
          "strap-crossbody": "strap-crossbody",
          "strap-wrist": "strap-wrist",
          "folio-ipad-a16": "folio-ipad-a16",
          "folio-ipad-mini-a17-pro": "folio-ipad-mini-a17-pro",
          "folio-ipad-air-11-inch-m4": "folio-ipad-air-11-m4",
          "folio-ipad-air-13-inch-m4": "folio-ipad-air-13-m4",
          "folio-ipad-pro-11-inch-m5": "folio-ipad-pro-11-m5",
          "folio-ipad-pro-13-inch-m5": "folio-ipad-pro-13-m5",
        };
        // rebuild slug more carefully from folder name
        if (/iPhone_17_Silicone/i.test(folder)) familyId = "case-iphone-17-silicone";
        else if (/iPhone_17_Pro_Max_Silicone/i.test(folder)) familyId = "case-iphone-17-pro-max-silicone";
        else if (/iPhone_17_Pro_Silicone/i.test(folder)) familyId = "case-iphone-17-pro-silicone";
        else if (/iPhone_17e_Silicone/i.test(folder)) familyId = "case-iphone-17e-silicone";
        else if (/iPhone_18_Pro_Max_Silicone/i.test(folder)) familyId = "case-iphone-18-pro-max-silicone";
        else if (/iPhone_18_Pro_Silicone/i.test(folder)) familyId = "case-iphone-18-pro-silicone";
        else if (/iPhone_17_Pro_Max_Clear/i.test(folder)) familyId = "case-iphone-17-pro-max-clear";
        else if (/iPhone_17_Pro_Clear/i.test(folder)) familyId = "case-iphone-17-pro-clear";
        else if (/iPhone_17e_Clear/i.test(folder)) familyId = "case-iphone-17e-clear";
        else if (/iPhone_17_Clear/i.test(folder)) familyId = "case-iphone-17-clear";
        else if (/iPhone_18_Pro_Max_Clear/i.test(folder)) familyId = "case-iphone-18-pro-max-clear";
        else if (/iPhone_18_Pro_Clear/i.test(folder)) familyId = "case-iphone-18-pro-clear";
        else if (/iPhone_18_Pro_Max_TechWoven/i.test(folder)) familyId = "case-iphone-18-pro-max-techwoven";
        else if (/iPhone_18_Pro_TechWoven/i.test(folder)) familyId = "case-iphone-18-pro-techwoven";
        else if (/iPhone_Air_Bumper/i.test(folder)) familyId = "case-iphone-air-bumper";
        else if (/iPhone_Air_Case/i.test(folder)) familyId = "case-iphone-air-case";
        else if (/FineWoven_Wallet/i.test(folder)) familyId = "case-iphone-finewoven-wallet";
        else if (/Duo_Folio/i.test(folder)) familyId = "case-iphone-duo-folio";
        else if (/Duo_Case/i.test(folder)) familyId = "case-iphone-duo-case";
        else if (/Crossbody_Strap/i.test(folder)) familyId = "strap-crossbody";
        else if (/Wrist_Strap/i.test(folder)) familyId = "strap-wrist";
        else if (/Smart_Folio_for_iPad_A16/i.test(folder)) familyId = "folio-ipad-a16";
        else if (/Smart_Folio_for_iPad_mini/i.test(folder)) familyId = "folio-ipad-mini-a17-pro";
        else if (/Smart_Folio_for_iPad_Air_11/i.test(folder)) familyId = "folio-ipad-air-11-m4";
        else if (/Smart_Folio_for_iPad_Air_13/i.test(folder)) familyId = "folio-ipad-air-13-m4";
        else if (/Smart_Folio_for_iPad_Pro_11/i.test(folder)) familyId = "folio-ipad-pro-11-m5";
        else if (/Smart_Folio_for_iPad_Pro_13/i.test(folder)) familyId = "folio-ipad-pro-13-m5";

        if (!caseVariants[familyId]) {
          caseVariants[familyId] = {
            id: familyId,
            folder,
            group: g,
            variants: {},
          };
        }
        const fam = caseVariants[familyId];
        const p = ensureProduct(products, familyId);
        p.caseFamily = true;
        p.folder = folder;

        for (const f of walkImages(folderAbs)) {
          const base = path.basename(f, path.extname(f));
          const parsed = parseCaseFile(base);
          if (!parsed) {
            warnings.push(`CASE UNPARSED: ${folder}/${base}`);
            continue;
          }
          const src = toPublic(f);
          pages[`cases/${g}/${folder}/${parsed.part}/${base}`] = withWebpEntry({ src });
          if (!fam.variants[parsed.part]) {
            fam.variants[parsed.part] = {
              partNumber: parsed.part,
              colour: parsed.colour || ( /Clear/i.test(folder) ? "Clear" : "Default"),
              mainImage: null,
              swatchImage: null,
              angleImages: [],
            };
          }
          const v = fam.variants[parsed.part];
          if (parsed.colour) v.colour = parsed.colour;
          if (parsed.kind === "main") v.mainImage = src;
          else if (parsed.kind === "swatch") v.swatchImage = src;
          else if (parsed.kind === "angle") {
            v.angleImages[parsed.n - 1] = src;
          }
        }
      }
    }
  }

  // finalize variants arrays + product heroes
  for (const [familyId, fam] of Object.entries(caseVariants)) {
    const list = Object.values(fam.variants).map((v) => ({
      ...v,
      angleImages: (v.angleImages || []).filter(Boolean),
    }));
    // lead = first with most angles, else first with main
    list.sort((a, b) => (b.angleImages.length - a.angleImages.length) || a.colour.localeCompare(b.colour));
    fam.variants = list;
    fam.colourCount = list.length;
    fam.leadPartNumber = list[0]?.partNumber || null;
    const p = ensureProduct(products, familyId);
    p.hero = list[0]?.mainImage || list[0]?.swatchImage || null;
    p.swatch = list[0]?.swatchImage || null;
    p.angles = list[0]?.angleImages || [];
    p.variants = list;
    if (!PRODUCT_IDS.includes(familyId)) PRODUCT_IDS.push(familyId);
  }
}

function applyPencil1OverviewOnly(products, overviews, pages) {
  const p = ensureProduct(products, "pencil-1");
  if (overviews["pencil-1"]) { p.hero = overviews["pencil-1"]; p.overviewOnly = true; }
  const sel = pages["pencil/selector/apple_pencil_1st_gen"];
  if (sel?.src && !p.hero) p.hero = sel.src;
}

function main() {
  const pencilAbs = path.join(publicRoot, PENCIL_ROOT);
  const keyboardAbs = path.join(publicRoot, KEYBOARD_ROOT);
  const mouseAbs = path.join(publicRoot, MOUSE_ROOT);
  const trackpadAbs = path.join(publicRoot, TRACKPAD_ROOT);
  const powerAbs = path.join(publicRoot, POWER_ROOT);

  const countPencil = countAllFiles(pencilAbs);
  const countKeyboard = countAllFiles(keyboardAbs);
  const countMouse = countAllFiles(mouseAbs);
  const countTrackpad = countAllFiles(trackpadAbs);
  const countPower = countImageFiles(powerAbs);
  let countCases = 0;
  for (const rel of CASES_ROOTS) countCases += countImageFiles(path.join(publicRoot, rel));

  if (countPencil !== EXPECTED_PENCIL) { console.error(`FAIL: pencil=${countPencil} expected ${EXPECTED_PENCIL}`); process.exit(1); }
  if (countKeyboard !== EXPECTED_KEYBOARD) { console.error(`FAIL: keyboard=${countKeyboard} expected ${EXPECTED_KEYBOARD}`); process.exit(1); }
  if (countMouse !== EXPECTED_MOUSE) { console.error(`FAIL: mouse=${countMouse} expected ${EXPECTED_MOUSE}`); process.exit(1); }
  if (countTrackpad !== EXPECTED_TRACKPAD) { console.error(`FAIL: trackpad=${countTrackpad} expected ${EXPECTED_TRACKPAD}`); process.exit(1); }
  if (countPower !== EXPECTED_POWER) { console.error(`FAIL: power=${countPower} expected ${EXPECTED_POWER}`); process.exit(1); }
  if (countCases !== EXPECTED_CASES) { console.error(`FAIL: cases=${countCases} expected ${EXPECTED_CASES}`); process.exit(1); }

  const products = {};
  for (const id of PRODUCT_IDS) ensureProduct(products, id);
  const overviews = {};
  const features = {};
  const gestures = {};
  const store = {};
  const pages = {};
  const caseVariants = {};

  buildProductsFromPartPhotos(pencilAbs, products, pages, "pencil");
  buildProductsFromPartPhotos(keyboardAbs, products, pages, "keyboard");
  buildProductsFromPartPhotos(mouseAbs, products, pages, "mouse");
  buildProductsFromPartPhotos(trackpadAbs, products, pages, "trackpad");
  buildPowerPack(powerAbs, products, pages);
  buildCasesPacks(CASES_ROOTS, products, pages, caseVariants);
  buildOverviews(pencilAbs, overviews);
  buildStoreAndFeatures(pencilAbs, store, features);
  buildStoreAndFeatures(keyboardAbs, store, features);
  buildGestures(mouseAbs, "mouse", products, pages, gestures);
  buildGestures(trackpadAbs, "trackpad", products, pages, gestures);
  buildMouseFeatureCards(mouseAbs, pages, store);
  Object.assign(pages, buildAnimPages(pencilAbs, "pencil", "Apple_Pencil_page"), buildAnimPages(keyboardAbs, "keyboard", "iPad_keyboards_page"));
  applyPencil1OverviewOnly(products, overviews, pages);

  for (const id of PRODUCT_IDS) {
    const p = products[id];
    if (!p) continue;
    if (!p.hero && overviews[id]) p.hero = overviews[id];
    if (!p.hero) warnings.push(`MISSING HERO: ${id}`);
  }

  const caseFamilySummary = Object.values(caseVariants).map((f) => ({
    id: f.id, folder: f.folder, colours: f.colourCount, lead: f.leadPartNumber,
  })).sort((a, b) => a.id.localeCompare(b.id));

  const report = {
    countPencil, countKeyboard, countMouse, countTrackpad, countPower, countCases,
    expectedPencil: EXPECTED_PENCIL, expectedKeyboard: EXPECTED_KEYBOARD,
    expectedMouse: EXPECTED_MOUSE, expectedTrackpad: EXPECTED_TRACKPAD,
    expectedPower: EXPECTED_POWER, expectedCases: EXPECTED_CASES,
    productIds: PRODUCT_IDS,
    productsWithHero: PRODUCT_IDS.filter((id) => Boolean(products[id]?.hero)),
    pageKeyCount: Object.keys(pages).length,
    featureCount: Object.keys(features).length,
    gestureCount: Object.keys(gestures).length,
    storeProductCount: Object.keys(store).length,
    overviewCount: Object.keys(overviews).length,
    caseFamilyCount: caseFamilySummary.length,
    caseColourTotal: caseFamilySummary.reduce((n, f) => n + f.colours, 0),
    caseFamilySummary,
    warnings,
    samplePageKeys: Object.keys(pages).filter((k) => k.startsWith("power/") || k.startsWith("cases/")).slice(0, 20),
  };

  const manifest = {
    version: 3, generatedAt: new Date().toISOString(),
    countPencil, countKeyboard, countMouse, countTrackpad, countPower, countCases,
    products, pages, features, gestures, store, overviews, caseVariants, report,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("Accessories manifest OK");
  console.log(`  pencil=${countPencil} keyboard=${countKeyboard} mouse=${countMouse} trackpad=${countTrackpad} power=${countPower} cases=${countCases}`);
  console.log(`  page keys: ${report.pageKeyCount} case families: ${report.caseFamilyCount} colours: ${report.caseColourTotal}`);
  if (warnings.length) for (const w of warnings) console.warn("  -", w);
}

main();
