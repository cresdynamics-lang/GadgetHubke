#!/usr/bin/env node
/** Resize iPad pack images → sibling .webp (product ~1400, hero frames ~1800). Originals untouched. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = [
  path.join(root, "public/Gadget_Hub_iPad_1_Product_photos"),
  path.join(root, "public/Gadget_Hub_iPad_2_Colour_overviews"),
  path.join(root, "public/Gadget_Hub_iPad_3_Pro_page_images_part1"),
  path.join(root, "public/Gadget_Hub_iPad_3_Pro_page_images_part2"),
  path.join(root, "public/Gadget_Hub_iPad_4_Air_page_images_part1"),
  path.join(root, "public/Gadget_Hub_iPad_4_Air_page_images_part2"),
  path.join(root, "public/Gadget_Hub_iPad_4_Air_page_images_part3"),
  path.join(root, "public/Gadget_Hub_iPad_5_mini_page_images_part1"),
  path.join(root, "public/Gadget_Hub_iPad_5_mini_page_images_part2"),
  path.join(root, "public/Gadget_Hub_iPad_6_iPad_page_images"),
];

function maxFor(name) {
  if (/hero|startframe|endframe/i.test(name)) return 1800;
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
console.log(`Wrote ${count} iPad WebP file(s) from ${files.length} source(s).`);
