#!/usr/bin/env node
/**
 * Create compact WebP thumbs for homepage-referenced images.
 * Writes to public/images/home/opt/<slug>.webp (max width 560, q=72).
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/home/opt");
const MAX_W = 560;
const QUALITY = 72;

function slugFor(publicPath) {
  const base = path.basename(publicPath).replace(/\.(jpe?g|png|webp)$/i, "");
  const hash = createHash("sha1").update(publicPath).digest("hex").slice(0, 8);
  const clean = base.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 48);
  return `${clean}.${hash}.webp`;
}

function pathLiterals(text) {
  const paths = new Set();
  for (const m of text.matchAll(/["'`](\/[^"'`]+\.(?:jpe?g|png|webp))["'`]/gi)) {
    paths.add(m[1]);
  }
  return paths;
}

/** Expand ${ROOT}/${MAC1} in images.ts, then collect every public image path. */
function pathsFromImagesTs() {
  const raw = fs.readFileSync(path.join(root, "src/lib/images.ts"), "utf8");
  const expanded = raw
    .replaceAll("${ROOT}", "/Gadget_Hub_Images")
    .replaceAll(
      "${MAC1}",
      "/Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos",
    );
  return pathLiterals(expanded);
}

function collectFromHomeTs() {
  const raw = fs.readFileSync(path.join(root, "src/lib/home.ts"), "utf8");
  const tvBase =
    "/Gadget_Hub_TV_and_Home_1_Product_photos_colours_and_compare/01_Product_photos";
  const text = raw.replaceAll("${tvHomePhotoBase}", tvBase);
  const paths = pathLiterals(text);
  for (const p of pathsFromImagesTs()) paths.add(p);
  // Lipa / trade-in strip assets
  paths.add("/images/home/lipa-mdogo-pro.jpg");
  paths.add("/images/home/trade-in-pro.jpg");
  paths.add("/images/home/hero-iphone-18-pro.jpg");
  paths.add("/images/home/hero-watch-series-12.jpg");
  const extraPath = path.join(root, "scripts/home-extra-paths.json");
  if (fs.existsSync(extraPath)) {
    for (const p of JSON.parse(fs.readFileSync(extraPath, "utf8"))) paths.add(p);
  }
  return [...paths];
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const sources = collectFromHomeTs();
  const map = {};
  let saved = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const pub of sources) {
    const abs = path.join(root, "public", pub.replace(/^\//, ""));
    if (!fs.existsSync(abs)) continue;
    const inStat = fs.statSync(abs);
    bytesIn += inStat.size;
    const name = slugFor(pub);
    const dest = path.join(outDir, name);
    const webpPub = `/images/home/opt/${name}`;

    if (!fs.existsSync(dest) || fs.statSync(dest).mtimeMs < inStat.mtimeMs) {
      await sharp(abs)
        .rotate()
        .resize({ width: MAX_W, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(dest);
    }
    const outStat = fs.statSync(dest);
    bytesOut += outStat.size;
    map[pub] = webpPub;
    saved += 1;
    const ratio = ((1 - outStat.size / inStat.size) * 100).toFixed(0);
    console.log(`${(inStat.size / 1024).toFixed(0)}KB → ${(outStat.size / 1024).toFixed(0)}KB (${ratio}%)  ${pub}`);
  }

  fs.writeFileSync(
    path.join(root, "scripts/home-image-opt-map.json"),
    JSON.stringify(map, null, 2) + "\n",
  );
  console.log(
    `\nOptimized ${saved} images: ${(bytesIn / 1024).toFixed(0)}KB → ${(bytesOut / 1024).toFixed(0)}KB`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
