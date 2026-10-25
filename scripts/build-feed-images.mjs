/**
 * Meta wants catalog images of at least 500×500. For every feed image smaller than
 * that, make a square copy (original pixels centred on white, never upscaled) in
 * public/feed-images/ and record it in src/lib/ads/feed-image-map.json.
 *   node scripts/build-feed-images.mjs [feed CSV URL]   (default: local server)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC, "feed-images");
const MAP = path.join(ROOT, "src", "lib", "ads", "feed-image-map.json");
const MIN = 500;
const feedUrl = process.argv[2] || "http://127.0.0.1:4399/feeds/meta-catalog.csv";

const csv = await (await fetch(feedUrl)).text();
const header = csv.split("\n")[0].split(",");
const col = header.indexOf("image_link");
const links = new Set();
for (const line of csv.split("\n").slice(1)) {
  const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
  if (cells?.[col]) links.add(cells[col]);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const map = {};
for (const link of links) {
  const pub = decodeURI(new URL(link).pathname);
  if (pub.startsWith("/feed-images/")) continue;
  const file = path.join(PUBLIC, pub);
  if (!fs.existsSync(file)) continue;
  const { width = 0, height = 0 } = await sharp(file).metadata();
  if (Math.min(width, height) >= MIN) continue;
  const side = Math.max(MIN, width, height);
  const name = `${path.basename(pub).replace(/\.[^.]+$/, "")}-${crypto.createHash("md5").update(pub).digest("hex").slice(0, 6)}.jpg`;
  await sharp(file)
    .flatten({ background: "#ffffff" })
    .extend({
      top: Math.floor((side - height) / 2),
      bottom: Math.ceil((side - height) / 2),
      left: Math.floor((side - width) / 2),
      right: Math.ceil((side - width) / 2),
      background: "#ffffff",
    })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(OUT_DIR, name));
  map[pub] = `/feed-images/${name}`;
  console.log(`${width}x${height} -> ${side}x${side}  ${pub.slice(-60)}`);
}
fs.writeFileSync(MAP, JSON.stringify(map, null, 1) + "\n");
console.log(`${Object.keys(map).length} square feed images`);
