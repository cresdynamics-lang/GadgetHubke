/**
 * Check the Google Merchant Center feed against the live site.
 *
 *   node scripts/validate-merchant-feed.mjs [feed URL] [--fast]
 *   (default feed: https://gadgethubke.com/feeds/google-merchant.xml)
 *
 * Checks every row for:
 *   - a unique id and every required field (title ≤150, iPhone descriptions 500–1,500)
 *   - item_group_id: one model and one condition per group
 *   - image_link and additional_image_link: HTTP 200, at least 800×800
 *   - link: HTTP 200, the page preselects the row's colour, and the page's JSON-LD
 *     has a variant with sku = id at the same price, condition and availability
 *   - the page's JSON-LD: ProductGroup / Product shaped as Google's Rich Results Test expects
 * Also prints the row count by model, rows still missing gtin/mpn, and colours with no photo.
 * --fast skips image downloads. --origin=http://localhost:4321 fetches pages and images from a
 * local server instead of the live site (the feed's URLs keep the live domain).
 * Exits 1 when any error is found.
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const fast = args.includes("--fast");
const feedUrl = args.find((a) => !a.startsWith("--")) ?? "https://gadgethubke.com/feeds/google-merchant.xml";
const CONCURRENCY = 6;
const origin = args.find((a) => a.startsWith("--origin="))?.slice(9);
const local = (url) => (origin ? url.replace(/^https:\/\/gadgethubke\.com/, origin) : url);

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

function decode(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function parseFeed(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, body]) => {
    const row = { additional_image_link: [], product_highlight: [], product_detail: [] };
    for (const [, tag, value] of body.matchAll(/<g:(\w+)>([\s\S]*?)<\/g:\1>/g)) {
      if (tag === "product_detail") {
        const get = (t) => decode(value.match(new RegExp(`<g:${t}>([\\s\\S]*?)</g:${t}>`))?.[1] ?? "");
        row.product_detail.push({ section: get("section_name"), attribute: get("attribute_name"), value: get("attribute_value") });
      } else if (Array.isArray(row[tag])) row[tag].push(decode(value));
      else row[tag] = decode(value);
    }
    return row;
  });
}

async function pool(items, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(local(url), { redirect: "manual", headers: { "User-Agent": "GadgetHub feed check" } });
      return res;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

const imageCache = new Map();
function checkImage(url) {
  if (!imageCache.has(url))
    imageCache.set(
      url,
      (async () => {
        const res = await get(url);
        if (res.status !== 200) return `HTTP ${res.status}`;
        const type = res.headers.get("content-type") ?? "";
        if (!/image\/(jpeg|png|gif)/.test(type)) return `type ${type} (Google needs JPG, PNG or GIF)`;
        const { width = 0, height = 0 } = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
        if (width < 800 || height < 800) return `${width}×${height}, under 800×800`;
        return null;
      })().catch((e) => e.message),
    );
  return imageCache.get(url);
}

const pageCache = new Map();
function page(url) {
  if (!pageCache.has(url))
    pageCache.set(
      url,
      (async () => {
        const res = await get(url);
        return { status: res.status, location: res.headers.get("location"), html: res.status === 200 ? await res.text() : "" };
      })().catch((e) => ({ status: 0, html: "", error: e.message })),
    );
  return pageCache.get(url);
}

function jsonLdNodes(html) {
  const nodes = [];
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(raw);
      for (const n of Array.isArray(d) ? d : d["@graph"] ?? [d]) nodes.push(n);
    } catch {
      nodes.push({ "@type": "INVALID_JSON" });
    }
  }
  return nodes;
}

/** Google's required and recommended Product / Offer fields. */
function checkProductNode(id, n, where) {
  for (const f of ["name", "image", "offers"]) if (!n[f]) err(id, `${where}: Product without ${f}`);
  const offers = Array.isArray(n.offers) ? n.offers : n.offers ? [n.offers] : [];
  for (const o of offers) {
    for (const f of ["price", "priceCurrency", "availability"]) if (o[f] == null) err(id, `${where}: Offer without ${f}`);
    if (o.priceCurrency && o.priceCurrency !== "KES") err(id, `${where}: priceCurrency ${o.priceCurrency}`);
    if (!o.itemCondition) warn(id, `${where}: Offer without itemCondition`);
  }
  if (!n.brand) warn(id, `${where}: Product without brand`);
  if (!n.description) warn(id, `${where}: Product without description`);
}

const schemaAvailability = { in_stock: "InStock", out_of_stock: "OutOfStock", preorder: "PreOrder" };
const kesNumber = (p) => Number(String(p).replace(/[^\d.]/g, ""));

const feedRes = await fetch(feedUrl);
if (!feedRes.ok) {
  console.error(`Feed ${feedUrl}: HTTP ${feedRes.status}`);
  process.exit(1);
}
const rows = parseFeed(await feedRes.text());
console.log(`${rows.length} rows in ${feedUrl}\n`);

// --- ids and required fields ---
const seen = new Map();
const required = ["id", "title", "description", "link", "image_link", "availability", "condition", "price", "brand", "google_product_category"];
for (const r of rows) {
  if (seen.has(r.id)) err(r.id, "duplicate id");
  seen.set(r.id, r);
  for (const f of required) if (!r[f]) err(r.id, `missing ${f}`);
  if (!/^\d+(\.\d{2})? KES$/.test(r.price ?? "")) err(r.id, `price "${r.price}" is not like 234000.00 KES`);
  if ((r.title ?? "").length > 150) err(r.id, `title is ${r.title.length} characters (max 150)`);
  if (/\b[A-Z]{5,}\b/.test((r.title ?? "").replace(/\b(KES|USB|EXUK)\b/g, ""))) warn(r.id, "title has an all-caps word");
  const iphone = r.google_product_category === "267";
  const len = (r.description ?? "").length;
  if (iphone && (len < 500 || len > 1500)) err(r.id, `description is ${len} characters (500–1,500)`);
  if (!iphone && len > 5000) err(r.id, `description is ${len} characters (max 5,000)`);
  if (/https?:\/\/|www\.|\+254|\b07\d{2}\s?\d{3}\s?\d{3}\b/.test(r.description ?? "")) err(r.id, "description has a URL or phone number");
  if (!r.gtin && !r.mpn && r.identifier_exists !== "no") err(r.id, "no gtin or mpn, and identifier_exists is not no");
  if ((r.gtin || r.mpn) && r.identifier_exists) err(r.id, "identifier_exists set although gtin or mpn exists");
  if (iphone) {
    for (const f of ["item_group_id", "product_type", "custom_label_0", "custom_label_1", "custom_label_2"]) if (!r[f]) err(r.id, `missing ${f}`);
    if (r.product_highlight.length && (r.product_highlight.length < 4 || r.product_highlight.length > 6)) warn(r.id, `${r.product_highlight.length} product highlights`);
    if (r.additional_image_link.length > 10) err(r.id, "more than 10 additional images");
  }
}

// --- item_group_id consistency ---
const groups = new Map();
for (const r of rows.filter((r) => r.item_group_id)) {
  const model = r.title.replace(/^Apple\s+/, "").replace(/\s+\d+(GB|TB)\b.*$/, "");
  const g = groups.get(r.item_group_id) ?? { models: new Set(), conditions: new Set(), keys: new Set() };
  g.models.add(model);
  g.conditions.add(r.condition);
  const key = `${r.custom_label_2 ?? ""}|${r.color ?? ""}`;
  if (g.keys.has(key)) err(r.id, `group ${r.item_group_id} already has ${key.replace("|", " ")}`);
  g.keys.add(key);
  groups.set(r.item_group_id, g);
}
for (const [id, g] of groups) {
  if (g.models.size > 1) err(id, `item_group_id mixes models: ${[...g.models].join(", ")}`);
  if (g.conditions.size > 1) err(id, `item_group_id mixes conditions: ${[...g.conditions].join(", ")}`);
}

// --- images ---
if (!fast) {
  const urls = [...new Set(rows.flatMap((r) => [r.image_link, ...r.additional_image_link]).filter(Boolean))];
  process.stdout.write(`Checking ${urls.length} images… `);
  await pool(urls, checkImage);
  console.log("done");
  for (const r of rows)
    for (const u of [r.image_link, ...r.additional_image_link]) {
      const problem = await imageCache.get(u);
      if (problem) err(r.id, `image ${u}: ${problem}`);
    }
}

// --- landing pages and JSON-LD ---
const links = [...new Set(rows.map((r) => r.link))];
process.stdout.write(`Checking ${links.length} landing pages… `);
await pool(links, page);
console.log("done\n");
for (const r of rows) {
  const p = await pageCache.get(r.link);
  if (p.status !== 200) {
    err(r.id, `link ${r.link}: HTTP ${p.status}${p.location ? ` → ${p.location}` : ""}${p.error ? ` ${p.error}` : ""}`);
    continue;
  }
  const html = p.html;
  const colourKey = new URL(r.link).searchParams.get("colour");
  if (colourKey) {
    const active = html.match(/<button[^>]*data-colour="([^"]+)"[^>]*aria-selected="true"|<button[^>]*aria-selected="true"[^>]*data-colour="([^"]+)"/);
    const activeKey = active?.[1] ?? active?.[2];
    const shownName = html.match(/data-colour-name[^>]*>([^<]*)</)?.[1]?.trim();
    if (activeKey !== colourKey) err(r.id, `page preselects colour ${activeKey ?? "none"}, not ${colourKey}`);
    if (r.color && shownName !== r.color) err(r.id, `page shows colour "${shownName}", feed says "${r.color}"`);
  }
  const nodes = jsonLdNodes(html);
  if (nodes.some((n) => n["@type"] === "INVALID_JSON")) err(r.id, "page JSON-LD does not parse");
  const groupNodes = nodes.filter((n) => n["@type"] === "ProductGroup");
  const productNodes = nodes.filter((n) => n["@type"] === "Product");
  const variants = [...productNodes, ...groupNodes.flatMap((g) => g.hasVariant ?? [])];
  for (const g of groupNodes) {
    if (!g.name) err(r.id, "ProductGroup without name");
    if (!g.productGroupID) warn(r.id, "ProductGroup without productGroupID");
    if (!g.variesBy?.length) err(r.id, "ProductGroup without variesBy");
    if (!g.hasVariant?.length) err(r.id, "ProductGroup without hasVariant");
  }
  for (const v of variants) checkProductNode(r.id, v, `JSON-LD ${v.sku ?? v.name}`);
  const feedKes = kesNumber(r.price);
  const mine = variants.find((v) => v.sku === r.id);
  if (r.google_product_category === "267") {
    if (!mine) {
      err(r.id, "no JSON-LD variant with this sku on the landing page");
      continue;
    }
    const o = Array.isArray(mine.offers) ? mine.offers[0] : mine.offers;
    if (Number(o.price) !== feedKes) err(r.id, `price ${feedKes} in feed, ${o.price} on page`);
    const wantAvail = schemaAvailability[r.availability];
    if (!String(o.availability).endsWith(wantAvail)) err(r.id, `availability ${r.availability} in feed, ${o.availability} on page`);
    const wantCond = r.condition === "used" ? "UsedCondition" : "NewCondition";
    if (!String(o.itemCondition).endsWith(wantCond)) err(r.id, `condition ${r.condition} in feed, ${o.itemCondition} on page`);
    if (r.color && mine.color !== r.color) err(r.id, `color ${r.color} in feed, ${mine.color} in JSON-LD`);
    if (r.gtin && mine.gtin !== r.gtin) err(r.id, "gtin differs from JSON-LD");
    const shown = html.match(/data-price-display[^>]*>([^<]*)</)?.[1] ?? "";
    if (kesNumber(shown) !== feedKes) err(r.id, `page price shows "${shown.trim()}", feed ${feedKes}`);
  } else {
    if (!variants.length) warn(r.id, "landing page has no Product JSON-LD");
    const shownKes = feedKes.toLocaleString("en-KE");
    if (!html.includes(shownKes)) err(r.id, `price KES ${shownKes} not found on the landing page`);
  }
}

// --- report ---
const byModel = new Map();
for (const r of rows) {
  const key = r.google_product_category === "267" ? `${r.title.replace(/^Apple\s+/, "").replace(/\s+\d+(GB|TB)\b.*$/, "")} (${r.custom_label_1})` : "Other products";
  byModel.set(key, (byModel.get(key) ?? 0) + 1);
}
console.log("Rows by model:");
for (const [k, n] of byModel) console.log(`  ${String(n).padStart(4)}  ${k}`);

const noIds = rows.filter((r) => !r.gtin || !r.mpn);
console.log(`\nRows missing gtin or mpn: ${noIds.length} of ${rows.length} (fill in src/lib/ads/product-identifiers.json)`);

if (warnings.length) {
  console.log(`\n${warnings.length} warnings:`);
  for (const w of [...new Set(warnings)].slice(0, 60)) console.log(`  ${w}`);
}
if (errors.length) {
  console.log(`\n${errors.length} errors:`);
  for (const e of errors.slice(0, 200)) console.log(`  ${e}`);
  process.exit(1);
}
console.log("\nNo errors.");
