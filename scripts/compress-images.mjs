/**
 * Make public/ images lighter without visible quality loss.
 *  - JPEG ≥150 KB: re-encode (mozjpeg q82, progressive, no metadata), max 2560 px wide.
 *    Kept only if at least 15% smaller.
 *  - PNG ≥300 KB: lossless re-compression (transparency untouched). Kept only if smaller.
 *  - Any JPEG/PNG ≥100 KB without a .webp sibling gets one (q80, alpha kept, max 2560 px).
 * Skips videos, card thumbnails and already-optimised store angle sets.
 *   node scripts/compress-images.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public");
const DRY = process.argv.includes("--dry");
const MAXW = 2560;
const SKIP = [/\/images\/cards\//, /\/Gadget_Hub_Store_Angles\//, /\/Gadget_Hub_iPhone_Scroll_Scenes\//];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png)$/i.test(e.name) && !e.name.startsWith("._")) out.push(p);
  }
  return out;
}

const files = walk(ROOT).filter((p) => !SKIP.some((r) => r.test(p)));
let before = 0, after = 0, recoded = 0, webps = 0, webpBytes = 0;

async function processFile(p) {
  const size = fs.statSync(p).size;
  const isPng = /\.png$/i.test(p);
  const meta = await sharp(p).metadata();
  const wide = (meta.width || 0) > MAXW;
  // 1) re-encode in place
  if ((!isPng && size >= 150_000) || (isPng && size >= 300_000)) {
    let img = sharp(p).rotate();
    if (wide && !isPng) img = img.resize({ width: MAXW, withoutEnlargement: true });
    const buf = isPng
      ? await img.png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer()
      : await img.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();
    const good = isPng ? buf.length < size : buf.length <= size * 0.85;
    if (good) {
      before += size; after += buf.length; recoded++;
      if (!DRY) fs.writeFileSync(p, buf);
    }
  }
  // 2) WebP sibling
  const webp = p.replace(/\.(jpe?g|png)$/i, ".webp");
  if (size >= 100_000 && !fs.existsSync(webp)) {
    const buf = await sharp(p).rotate().resize({ width: MAXW, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toBuffer();
    webps++; webpBytes += buf.length;
    if (!DRY) fs.writeFileSync(webp, buf);
  }
}

const queue = [...files];
async function worker() {
  while (queue.length) {
    const p = queue.shift();
    try { await processFile(p); } catch (e) { console.warn("skip", path.relative(ROOT, p), e.message); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
const mb = (n) => (n / 1e6).toFixed(1);
console.log(`${DRY ? "[dry] " : ""}re-encoded ${recoded} files: ${mb(before)} MB -> ${mb(after)} MB (saved ${mb(before - after)} MB)`);
console.log(`${DRY ? "[dry] " : ""}new WebP siblings: ${webps} (${mb(webpBytes)} MB)`);
