#!/usr/bin/env node
/**
 * Home "cinema" panels: downloads Apple's large overview images and writes
 * public/images/home/cinema-<id>-{1600,800}.webp. Re-run: node scripts/fetch-cinema-images.mjs
 * These skip optimize-home-images.mjs, whose 560px thumbs look soft in panels this wide.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/home");
const SIZES = [1600, 800];
const QUALITY = 84;

const shots = [
  { id: "iphone-18-pro", url: "https://www.apple.com/v/iphone-18-pro/e/images/overview/aio/hero__elo7tt0mnqy6_large_2x.jpg" },
  { id: "watch-series-12", url: "https://www.apple.com/v/apple-watch-series-12/b/images/overview/media-hero/hero_endframe__e3wgo83nx5ci_xlarge_2x.jpg" },
];

for (const { id, url } of shots) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`${id}: ${res.status} ${type}`);
  const input = Buffer.from(await res.arrayBuffer());
  for (const width of SIZES) {
    const file = path.join(outDir, `cinema-${id}-${width}.webp`);
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY, smartSubsample: true }).toFile(file);
    console.log(path.relative(root, file), Math.round(fs.statSync(file).size / 1024), "KB");
  }
}
