#!/usr/bin/env node
/**
 * Resize iPhone pack images and write sibling .webp files.
 * view1 / overview → max 760px · view2 / view3 / camera → max 900px
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = [
  path.join(root, "public/Gadget_Hub_iPhone_11-13_Images"),
  path.join(root, "public/Gadget_Hub_iPhone_14-16_Images"),
];

function maxFor(name) {
  const lower = name.toLowerCase();
  if (/view2|view3|camera|close/.test(lower)) return 900;
  return 760;
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
  const base = path.basename(src);
  const name = base.replace(/\.[^.]+$/, "");
  const dest = path.join(path.dirname(src), `${name}.webp`);
  const max = maxFor(name);
  try {
    await sharp(src)
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest);
    count += 1;
    if (count % 25 === 0) console.log(`… ${count}/${files.length}`);
  } catch (err) {
    console.warn(`skip ${path.relative(root, src)}: ${err.message}`);
  }
}

console.log(`Wrote ${count} WebP file(s) from ${files.length} source(s).`);
