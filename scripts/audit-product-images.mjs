/**
 * Resolve primary card image for every catalog product and check local + live.
 * Usage: node scripts/audit-product-images.mjs
 * (requires npx tsx to load the TS lib — invoked via the shell wrapper below)
 */
import { existsSync, writeFileSync } from "node:fs";
import { listIphones } from "../src/lib/iphone-list.ts";
import { models as iphoneModels, getImage, defaultColourForModel } from "../src/lib/iphone/index.ts";
import { watchModels, getWatchImage } from "../src/lib/watch/index.ts";
import { macModels, getMacImage, defaultMacColour } from "../src/lib/mac/index.ts";
import { ipadModels, getIpadImage, defaultIpadColour } from "../src/lib/ipad/index.ts";
import { tvHomeModels, getTvHomeImage } from "../src/lib/tv-home/index.ts";
import { airpodsModels, getAirpodsImage } from "../src/lib/airpods/index.ts";
import { accessories, getAccessoryImage } from "../src/lib/accessories/index.ts";

const rows = [];

for (const i of listIphones()) {
  rows.push({ cat: "iphone-latest", id: i.id, name: i.name, src: i.image.src });
}
for (const m of iphoneModels) {
  const c = defaultColourForModel(m.id, m.defaultColour ?? undefined);
  const img = getImage(m.id, c, 1, m.name);
  rows.push({
    cat: "iphone-legacy",
    id: m.id,
    name: m.name,
    src: img.src,
    fallback: img.fallback,
  });
}
for (const m of watchModels) {
  const img = getWatchImage(m.id, "main", m.name);
  rows.push({ cat: "watch", id: m.id, name: m.name, src: img.src, fallback: img.fallback });
}
for (const m of macModels) {
  const img = getMacImage(m.id, defaultMacColour(m), "product", m.name);
  rows.push({ cat: "mac", id: m.id, name: m.name, src: img.src, fallback: img.fallback });
}
for (const m of ipadModels) {
  const img = getIpadImage(m.id, defaultIpadColour(m), "product", m.name);
  rows.push({ cat: "ipad", id: m.id, name: m.name, src: img.src, fallback: img.fallback });
}
for (const m of tvHomeModels) {
  const img = getTvHomeImage(m.id, "hero", m.name);
  rows.push({ cat: "tv-home", id: m.id, name: m.name, src: img.src, fallback: img.fallback });
}
for (const m of airpodsModels) {
  const img = getAirpodsImage(m.id, "hero", m.name);
  rows.push({ cat: "airpods", id: m.id, name: m.name, src: img.src, fallback: img.fallback });
}
for (const m of accessories) {
  const img = getAccessoryImage(m.id, "hero");
  rows.push({
    cat: "accessories",
    id: m.id,
    name: m.name,
    src: img.src,
    fallback: img.fallback,
  });
}

writeFileSync("/tmp/resolved-card-images.json", JSON.stringify(rows, null, 2));

const by = {};
for (const r of rows) (by[r.cat] ||= []).push(r);

for (const cat of Object.keys(by)) {
  const items = by[cat];
  console.log(`\n${cat}: ${items.length} products`);
  let issues = 0;
  for (const r of items) {
    const local = r.src ? existsSync("public" + r.src.split("?")[0]) : false;
    const bad =
      !r.src ||
      !local ||
      /placeholder/i.test(r.src) ||
      r.src.startsWith("/Gadget_Hub_Images/") ||
      r.fallback;
    if (bad) {
      issues++;
      console.log(
        `  ISSUE ${r.id} | local=${local} fallback=${!!r.fallback} | ${r.src || "(none)"}`,
      );
    }
  }
  if (!issues) console.log("  all resolved paths exist locally (no placeholder / Gadget_Hub_Images)");
}
console.log("\nTOTAL", rows.length);
