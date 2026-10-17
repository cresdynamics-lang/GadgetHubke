/**
 * Build tiny WebP shop-card thumbs for every iPhone + Mac model.
 * Output: public/images/cards/<id>.card.webp + scripts/card-image-map.json
 *
 *   npx tsx scripts/build-card-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { models as iphoneModels, getImage, defaultColourForModel } from "../src/lib/iphone/index.ts";
import { listIphones } from "../src/lib/iphone-list.ts";
import { macModels, getMacImage, defaultMacColour } from "../src/lib/mac/index.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/cards");
const mapPath = path.join(root, "scripts/card-image-map.json");
const MAX = 440;
const QUALITY = 68;

fs.mkdirSync(outDir, { recursive: true });

/** @type {Record<string, string>} */
const map = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, "utf8")) : {};

/** @type {{ id: string; src: string }[]} */
const jobs = [];

for (const i of listIphones()) {
  jobs.push({ id: i.id, src: i.image.src.startsWith("/images/cards/") ? "" : i.image.src });
}
// Prefer full-res sources for thumbs when pack already points at a card webp
const latestFull = {
  "iphone-duo": "/iPhone-Duo/iphone-duo-digitalmat-gallery-1-202609.jpeg",
  "iphone-pro": "/iPhone-18/iphone-18pro-digitalmat-gallery-1-202609.jpeg",
  "iphone-pro-max": "/iPhone-18/iphone-18pro-digitalmat-gallery-2-202609.jpeg",
  "iphone-air": "/iPhone-Air/iphone-air-digitalmat-gallery-1-202509.jpeg",
  "iphone-17": "/iPhone-17/iphone-17-digitalmat-gallery-5-202509.jpeg",
  "iphone-17e": "/iPhone-17e/iphone-17e-digitalmat-gallery-5-202603.jpeg",
};
for (const [id, src] of Object.entries(latestFull)) {
  jobs.push({ id, src });
}

for (const m of iphoneModels) {
  const c = defaultColourForModel(m.id, m.defaultColour ?? undefined);
  const img = getImage(m.id, c, 1, m.name);
  if (img.src && !img.src.includes("placeholder")) {
    jobs.push({ id: m.id, src: img.src });
  }
}

for (const m of macModels) {
  const img = getMacImage(m.id, defaultMacColour(m), "product", m.name);
  if (img.src && !img.src.includes("placeholder")) {
    jobs.push({ id: m.id, src: img.src });
  }
}

// Dedupe by id (last wins — prefer full-res latestFull over pack card path)
/** @type {Map<string, string>} */
const byId = new Map();
for (const j of jobs) {
  if (!j.src || j.src.startsWith("/images/cards/")) continue;
  byId.set(j.id, j.src);
}

let built = 0;
let skipped = 0;
for (const [id, src] of byId) {
  const abs = path.join(root, "public", src.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    console.warn("MISSING", id, src);
    skipped++;
    continue;
  }
  const destName = `${id}.card.webp`;
  const dest = path.join(outDir, destName);
  const inStat = fs.statSync(abs);
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= inStat.mtimeMs) {
    map[id] = `/images/cards/${destName}`;
    skipped++;
    continue;
  }
  await sharp(abs)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(dest);
  map[id] = `/images/cards/${destName}`;
  built++;
  console.log(
    `${(fs.statSync(dest).size / 1024).toFixed(1)} KB  ${id}  ← ${src}`,
  );
}

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + "\n");
console.log(`\nDone. built=${built} reused=${skipped} mapped=${Object.keys(map).length}`);
console.log(`Wrote ${path.relative(root, mapPath)}`);
