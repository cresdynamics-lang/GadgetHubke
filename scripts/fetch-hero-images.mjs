#!/usr/bin/env node
/**
 * Home hero tiles: downloads Apple store product shots and centres each whole
 * product on one rectangular canvas, so nothing is cut at any tile shape.
 * Writes public/images/home/hero/<id>-{1600,800}.webp. Re-run: node scripts/fetch-hero-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/home/hero");
const CDN = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/";
const CANVAS = { width: 1600, height: 1152 };
/** The shots are flattened on this. Decoded, it comes out as the `.sig-hero__tile` background in SignatureHero.astro. */
const BG = [245, 245, 247];
const FIT = { width: Math.round(CANVAS.width * 0.8), height: Math.round(CANVAS.height * 0.82) };

const shots = [
  { id: "iphone-18-pro", name: "iphone-18-pro-finish-select-202609" },
  { id: "macbook-pro", name: "mac-macbook-pro-size-unselect-202610-gallery-1", panel: [245, 245, 247] },
  { id: "watch-series-12", name: "s12-case-unselect-gallery-1-202609", panel: [250, 250, 250] },
  { id: "airpods-pro-3", name: "airpods-pro-3-hero-select-202509" },
];

async function download(name) {
  const res = await fetch(`${CDN}${name}?wid=3000&hei=3000&fmt=png-alpha`);
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`${name}: ${res.status} ${type}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Flatten onto BG (shifting any panel colour to BG exactly), then trim to the product. */
async function product(input, panel) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const out = Buffer.alloc(w * h * 3);
  let [x0, y0, x1, y1] = [w, h, -1, -1];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3] / 255;
      let delta = 0;
      for (let c = 0; c < 3; c++) {
        const shifted = panel ? Math.min(255, (data[i + c] * BG[c]) / panel[c]) : data[i + c];
        const v = Math.round(shifted * a + BG[c] * (1 - a));
        out[(y * w + x) * 3 + c] = v;
        delta = Math.max(delta, Math.abs(v - BG[c]));
      }
      // Soft shadows stay in the picture but do not pull the product off centre.
      if (delta > 18) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    }
  }
  if (x1 < 0) throw new Error("no product found");
  return { out, w, h, box: { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 } };
}

fs.mkdirSync(outDir, { recursive: true });
const background = { r: BG[0], g: BG[1], b: BG[2] };

for (const shot of shots) {
  const { out, w, h, box } = await product(await download(shot.name), shot.panel);
  const scale = Math.min(FIT.width / box.width, FIT.height / box.height);
  // Keep a margin around the trimmed box so soft shadows survive.
  const margin = Math.round(Math.min(box.width, box.height) * 0.04);
  const crop = {
    left: Math.max(0, box.left - margin),
    top: Math.max(0, box.top - margin),
    width: Math.min(w, box.left + box.width + margin) - Math.max(0, box.left - margin),
    height: Math.min(h, box.top + box.height + margin) - Math.max(0, box.top - margin),
  };
  const piece = await sharp(out, { raw: { width: w, height: h, channels: 3 } })
    .extract(crop)
    .resize(Math.round(crop.width * scale), Math.round(crop.height * scale), { kernel: "lanczos3" })
    .png()
    .toBuffer({ resolveWithObject: true });
  // Centre on the product's own box, not on the box plus shadow margin.
  const left = Math.round((CANVAS.width - box.width * scale) / 2 - (box.left - crop.left) * scale);
  const top = Math.round((CANVAS.height - box.height * scale) / 2 - (box.top - crop.top) * scale);
  const canvas = await sharp({ create: { ...CANVAS, channels: 3, background } })
    .composite([{ input: piece.data, left: Math.max(0, left), top: Math.max(0, top) }])
    .png()
    .toBuffer();
  for (const width of [1600, 800]) {
    const file = path.join(outDir, `${shot.id}-${width}.webp`);
    await sharp(canvas).resize(width).webp({ quality: 84, effort: 6 }).toFile(file);
    console.log(path.relative(root, file), fs.statSync(file).size, "scale", scale.toFixed(2));
  }
}
