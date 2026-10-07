#!/usr/bin/env node
/**
 * Build responsive WebP variants for CategoryHero scene sources.
 * Cinematic: 1920 / 1280 / 800 (+ keep original JPG).
 * Cutout: 1400 / 800 with alpha (+ keep original PNG).
 * Tiny 24px blur WebP alongside as .blur.webp.
 * Never upscales. Writes a size report to docs/hero-image-sizes.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Absolute paths of every source file used by heroScenes */
const SOURCES = [
  // iPhone
  "public/Hero/Gadget_Hub_Hero_Video_iPhone_part1of2/01_Cinematic_black_background_JPG/C01_iPhone_18_Pro_camera_hero.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_iPhone_part1of2/01_Cinematic_black_background_JPG/C07_iPhone_18_Pro_all_four_colours.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_iPhone_part2of2/02_Transparent_PNG_cutouts/P06_iPhone_Duo_Night_Sky_open.png",
  "public/Hero/Gadget_Hub_Hero_Video_iPhone_part1of2/01_Cinematic_black_background_JPG/C09_Camera_lens_macro.jpg",
  // MacBook
  "public/Hero/Gadget_Hub_Hero_Video_MacBook/01_Cinematic_black_background_JPG/C01_MacBook_Pro_open_hero.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_MacBook/02_Transparent_PNG_cutouts/P01_MacBook_Air_13_Midnight.png",
  "public/Hero/Gadget_Hub_Hero_Video_MacBook/01_Cinematic_black_background_JPG/C03_MacBook_Pro_two_sizes.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_MacBook/01_Cinematic_black_background_JPG/C06_Display_colour_hero.jpg",
  // iPad
  "public/Hero/Gadget_Hub_Hero_Video_iPad/01_Cinematic_black_background_JPG/C01_iPad_Pro_side_glow.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_iPad/02_Transparent_PNG_cutouts/P01_iPad_Air_Blue.png",
  "public/Hero/Gadget_Hub_Hero_Video_iPad/01_Cinematic_black_background_JPG/C02_iPad_Pro_with_Magic_Keyboard_black.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_iPad/01_Cinematic_black_background_JPG/C06_Apple_Pencil_Pro_drawing.jpg",
  // Watch
  "public/Hero/Gadget_Hub_Hero_Video_Watch/01_Cinematic_black_background_JPG/C01_Series_12_full_watch.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_Watch/01_Cinematic_black_background_JPG/C09_Series_12_bands_and_faces_collection.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_Watch/01_Cinematic_black_background_JPG/C05_Series_12_Titanium_Radiant_Gold.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_Watch/01_Cinematic_black_background_JPG/C12_Ultra_Black_Titanium.jpg",
  // AirPods
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P06_AirPods_Pro_3_with_case.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P07_AirPods_Max_hero.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P01_AirPods_Max_Blue.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P02_AirPods_Max_Midnight.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P03_AirPods_Max_Orange.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P04_AirPods_Max_Purple.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/02_Transparent_PNG_cutouts/P05_AirPods_Max_Starlight.png",
  "public/Hero/Gadget_Hub_Hero_Video_AirPods/01_Cinematic_black_background_JPG/C02_Sound_wave_glow_dark.jpg",
  // TV & Home
  "public/Hero/Gadget_Hub_Hero_Video_TV_and_Home/01_Cinematic_black_background_JPG/C01_HomePod_twins.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_TV_and_Home/02_Transparent_PNG_cutouts/P04_Apple_TV_4K_and_remote.png",
  "public/Hero/Gadget_Hub_Hero_Video_TV_and_Home/01_Cinematic_black_background_JPG/C03_Home_theatre_Apple_TV_and_HomePods.jpg",
  "public/Hero/Gadget_Hub_Hero_Video_TV_and_Home/01_Cinematic_black_background_JPG/C02_HomePod_handoff_from_iPhone.jpg",
  // Accessories
  "public/Hero/Gadget_Hub_Hero_Video_Accessories/02_Transparent_PNG_cutouts/P01_MagSafe_Clear_Case_iPhone_18_Pro_Burgundy.png",
  "public/Hero/Gadget_Hub_Hero_Video_Accessories/02_Transparent_PNG_cutouts/P04_MagSafe_Charger_front.png",
  "public/Hero/Gadget_Hub_Hero_Video_Accessories/02_Transparent_PNG_cutouts/P07_35W_Dual_USB-C_Power_Adapter_angle.png",
  "public/Hero/Gadget_Hub_Hero_Video_Accessories/02_Transparent_PNG_cutouts/P11_Apple_Pencil_Pro_upright.png",
];

const CINEMATIC_WIDTHS = [1920, 1280, 800];
const CUTOUT_WIDTHS = [1400, 800];

function isCutout(file) {
  return /\.png$/i.test(file);
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1);
}

const rows = [];
let wrote = 0;
const missing = [];

for (const rel of SOURCES) {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) {
    missing.push(rel);
    console.error(`MISSING: ${rel}`);
    continue;
  }

  const dir = path.dirname(src);
  const base = path.basename(src).replace(/\.[^.]+$/, "");
  const cutout = isCutout(src);
  const widths = cutout ? CUTOUT_WIDTHS : CINEMATIC_WIDTHS;
  const meta = await sharp(src).metadata();
  const srcW = meta.width || 0;
  const srcBytes = fs.statSync(src).size;
  const line = {
    file: path.basename(src),
    type: cutout ? "cutout" : "cinematic",
    sourceKb: kb(srcBytes),
    sourceW: srcW,
    variants: {},
  };

  for (const w of widths) {
    const dest = path.join(dir, `${base}.w${w}.webp`);
    // Always write the named variant; withoutEnlargement keeps small sources at native size.
    const pipeline = sharp(src).rotate().resize({
      width: w,
      fit: "inside",
      withoutEnlargement: true,
    });
    if (cutout) {
      await pipeline.webp({ quality: 85, alphaQuality: 90 }).toFile(dest);
    } else {
      await pipeline.webp({ quality: 80 }).toFile(dest);
    }
    const note = srcW && srcW < w ? ` (native ${srcW}px)` : "";
    line.variants[`w${w}`] = `${kb(fs.statSync(dest).size)} KB${note}`;
    wrote += 1;
  }

  const blurDest = path.join(dir, `${base}.blur.webp`);
  await sharp(src)
    .rotate()
    .resize({ width: 24, fit: "inside" })
    .blur()
    .webp({ quality: 40 })
    .toFile(blurDest);
  line.variants.blur = `${kb(fs.statSync(blurDest).size)} KB`;
  wrote += 1;

  rows.push(line);
  console.log(`✓ ${path.basename(src)}`);
}

if (missing.length) {
  console.error(`\nStopped: ${missing.length} source(s) missing.`);
  process.exit(1);
}

const md = [
  "# Hero image size report",
  "",
  `Generated by \`scripts/process-hero-webp.mjs\` · ${wrote} variant file(s).`,
  "",
  "AVIF: skipped (project Sharp pipeline uses WebP only).",
  "",
  "| File | Type | Source | Source W | w1920 / w1400 | w1280 | w800 | blur |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((r) => {
    const a = r.type === "cutout" ? r.variants.w1400 || "—" : r.variants.w1920 || "—";
    const b = r.type === "cutout" ? "—" : r.variants.w1280 || "—";
    const c = r.variants.w800 || "—";
    return `| \`${r.file}\` | ${r.type} | ${r.sourceKb} KB | ${r.sourceW} | ${a} | ${b} | ${c} | ${r.variants.blur} |`;
  }),
  "",
  "## Phone budget check (scene 1 ≈ 800px WebP)",
  "",
  "Target: scene 1 ≤ ~150 KB; whole hero (3 scenes on phone) ≤ ~1.2 MB.",
  "",
];

fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/hero-image-sizes.md"), md.join("\n"));
console.log(`\nWrote ${wrote} variants. Report: docs/hero-image-sizes.md`);
