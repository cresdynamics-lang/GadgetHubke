/**
 * Full-resolution WebP for every /public JPEG/PNG, plus the map the middleware
 * uses to serve them (src/lib/webp-map.json).
 *  - An existing .webp sibling is used only if it has the same pixel size.
 *  - Otherwise <name>.full.webp is made at the original size
 *    (JPEG q82, PNG q90 with full-quality alpha) and kept only if ≥15% smaller.
 *   node scripts/build-webp-map.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public");
const OUT = path.join(ROOT, "..", "src", "lib", "webp-map.json");
const DRY = process.argv.includes("--dry");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png)$/i.test(e.name) && !e.name.startsWith("._")) out.push(p);
  }
  return out;
}

const url = (p) => "/" + path.relative(ROOT, p).split(path.sep).join("/");
const map = {};
let reused = 0, made = 0, madeBytes = 0, savedBytes = 0, skipped = 0;

for (const file of walk(ROOT)) {
  const size = fs.statSync(file).size;
  if (size < 20_000) { skipped++; continue; }
  const meta = await sharp(file).metadata();
  const sib = file.replace(/\.(jpe?g|png)$/i, ".webp");
  if (fs.existsSync(sib)) {
    const m = await sharp(sib).metadata();
    if (m.width === meta.width && m.height === meta.height && fs.statSync(sib).size < size) {
      map[url(file)] = url(sib); reused++; savedBytes += size - fs.statSync(sib).size; continue;
    }
  }
  const full = file.replace(/\.(jpe?g|png)$/i, ".full.webp");
  let bytes;
  if (fs.existsSync(full)) bytes = fs.statSync(full).size;
  else {
    const png = /\.png$/i.test(file);
    const buf = await sharp(file).rotate().webp(png ? { quality: 90, alphaQuality: 100, effort: 5 } : { quality: 82, effort: 5 }).toBuffer();
    bytes = buf.length;
    if (bytes > size * 0.85) { skipped++; continue; }
    if (!DRY) fs.writeFileSync(full, buf);
    made++; madeBytes += bytes;
  }
  map[url(file)] = url(full); savedBytes += size - bytes;
}

if (!DRY) fs.writeFileSync(OUT, JSON.stringify(map) + "\n");
console.log(`${DRY ? "[dry] " : ""}reused ${reused} same-size .webp, made ${made} full-size .webp (${(madeBytes / 1e6).toFixed(1)} MB), skipped ${skipped}; bytes saved per full set ${(savedBytes / 1e6).toFixed(1)} MB; map ${Object.keys(map).length}`);
