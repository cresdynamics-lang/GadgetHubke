/**
 * Square ad images for the Meta (Instagram / Facebook) and Google feeds.
 *
 * Instagram shows catalog ads square or 4:5, so a wide or tall photo either gets cut
 * or shows the product as a thin strip, and Meta cannot use WebP or SVG files at all.
 * For every image in the feeds this writes a 1080×1080 JPEG: background trimmed, the
 * whole product centred with a margin, padded in the photo's own background colour.
 * Output goes to public/feed-images/ and src/lib/ads/feed-image-map.json.
 *
 *   node scripts/build-feed-images.mjs [feed CSV URL ...] [/public/image/path ...]
 *   (default: the live feed and a local server on 4399, merged; paths starting
 *   with "/" add images not in either feed yet, e.g. a new product's photo)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC, "feed-images");
const MAP = path.join(ROOT, "src", "lib", "ads", "feed-image-map.json");
const SIDE = 1080;
/** The product fills at most this share of the square, leaving a margin on every side. */
const FILL = 0.84;
/** Small originals are enlarged at most this much, so they stay sharp. */
const MAX_UPSCALE = 2;
const args = process.argv.slice(2);
const extraPaths = args.filter((a) => a.startsWith("/"));
const feedArgs = args.filter((a) => !a.startsWith("/"));
const feeds = feedArgs.length
  ? feedArgs
  : ["https://gadgethubke.com/feeds/meta-catalog.csv", "http://127.0.0.1:4399/feeds/meta-catalog.csv"];

function imageLinks(csv) {
  const lines = csv.split("\n");
  const col = lines[0].split(",").indexOf("image_link");
  const links = [];
  for (const line of lines.slice(1)) {
    const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
    if (cells?.[col]) links.push(cells[col]);
  }
  return links;
}

const links = new Set();
for (const url of feeds) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    for (const l of imageLinks(await res.text())) links.add(l);
    console.log(`read ${url}`);
  } catch (e) {
    console.log(`skipped ${url}: ${e.message}`);
  }
}

for (const p of extraPaths) links.add(`https://gadgethubke.com${encodeURI(p)}`);

// Start from the existing map so a source found in neither feed today keeps its square copy.
const previous = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, "utf8")) : {};
const sourceOf = Object.fromEntries(Object.entries(previous).map(([src, out]) => [out, src]));
for (const src of Object.keys(previous)) links.add(`https://gadgethubke.com${encodeURI(src)}`);
const map = {};
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const link of links) {
  let pub = decodeURI(new URL(link).pathname);
  // A link that is already a square copy: rebuild it from its original.
  if (pub.startsWith("/feed-images/")) pub = sourceOf[pub] ?? "";
  if (!pub || /\.svg$/i.test(pub)) continue;
  const file = path.join(PUBLIC, pub);
  if (!fs.existsSync(file)) continue;

  // Background = top-left pixel after flattening any transparency onto white.
  const flat = await sharp(file).flatten({ background: "#ffffff" }).toBuffer();
  const { data } = await sharp(flat).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  const bg = { r: data[0], g: data[1], b: data[2] };
  let product = flat;
  try {
    product = await sharp(flat).trim({ background: bg, threshold: 12 }).toBuffer();
  } catch {}
  const { width = 1, height = 1 } = await sharp(product).metadata();
  const scale = Math.min((SIDE * FILL) / width, (SIDE * FILL) / height, MAX_UPSCALE);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const resized = await sharp(product).resize(w, h, { kernel: "lanczos3" }).toBuffer();
  const name = `${path.basename(pub).replace(/\.[^.]+$/, "")}-${crypto.createHash("md5").update(pub).digest("hex").slice(0, 6)}.jpg`;
  await sharp({ create: { width: SIDE, height: SIDE, channels: 3, background: bg } })
    .composite([{ input: resized, left: Math.round((SIDE - w) / 2), top: Math.round((SIDE - h) / 2) }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUT_DIR, name));
  map[pub] = `/feed-images/${name}`;
  console.log(`${width}x${height} -> ${SIDE}x${SIDE} (x${scale.toFixed(2)})  ${pub.slice(-70)}`);
}

// Remove square copies nothing points at any more.
const keep = new Set(Object.values(map).map((p) => path.basename(p)));
for (const f of fs.readdirSync(OUT_DIR)) if (!keep.has(f)) fs.unlinkSync(path.join(OUT_DIR, f));

fs.writeFileSync(MAP, JSON.stringify(Object.fromEntries(Object.entries(map).sort()), null, 1) + "\n");
console.log(`${Object.keys(map).length} square feed images`);
