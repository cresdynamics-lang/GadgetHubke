#!/usr/bin/env node
/** Resize Mac pack images → sibling .webp (product ~1400, hero frames ~1800). Originals untouched. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = [
  path.join(root, "public/Gadget_Hub_MacBook_1_Products_and_Colours"),
  path.join(root, "public/Gadget_Hub_MacBook_2_Air_page_animation_images"),
  path.join(root, "public/Gadget_Hub_MacBook_3_Pro_page_animation_images"),
];

function maxFor(name) {
  if (/hero|startframe|endframe|welcome|pv_hero/i.test(name)) return 1800;
  return 1400;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = dirs.flatMap((d) => walk(d));
let count = 0;
for (const src of files) {
  const name = path.basename(src).replace(/\.[^.]+$/, "");
  const dest = path.join(path.dirname(src), `${name}.webp`);
  try {
    await sharp(src)
      .rotate()
      .resize({
        width: maxFor(name),
        height: maxFor(name),
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(dest);
    count += 1;
    if (count % 40 === 0) console.log(`… ${count}/${files.length}`);
  } catch (err) {
    console.warn(`skip ${path.relative(root, src)}: ${err.message}`);
  }
}
console.log(`Wrote ${count} Mac WebP file(s) from ${files.length} source(s).`);
