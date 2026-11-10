import type { APIRoute } from "astro";
import { site } from "../lib/site";
import { homeCategories } from "../lib/home";
import { productNav } from "../lib/catalog";
import { listPublishedJournalPosts } from "../lib/journal";
import { products } from "../lib/products";
import { tvHomeModels } from "../lib/tv-home";
import { listSeoModels, listSeriesHubs, getSeoModel, getSeoModelByName, storagePath } from "../lib/iphone/seo";
import { withLiveSeoPrices } from "../lib/iphone/seo/live";
import { defaultPricedCatalog, iphoneLiveId, isShownOnWebsite, livePricedCatalog } from "../lib/pricing/live";
import { caseProducts, keyboards, mice, pencils, powerProducts, trackpads } from "../lib/accessories";

const staticPaths = [
  "/",
  "/shop",
  "/deals",
  "/trade-in",
  "/lipa-mdogo-mdogo",
  "/journal",
  "/support",
  "/about",
  "/contact",
  "/faqs",
  "/locations",
  "/authenticity",
  "/careers",
  "/newsletter",
  "/compare",
  "/sitemap",
  "/terms",
  "/privacy",
  "/returns",
  "/cookies",
  "/warranty-repairs",
  "/shipping-delivery",
  "/corporate-bulk",
  "/tv-home",
  "/tv-home/shop",
  "/ipad/shop",
  "/mac/shop",
  "/airpods/shop",
  "/tv-home/compare",
] as const;

function abs(path: string) {
  return new URL(path, site.url).href;
}

export const prerender = false;

export const GET: APIRoute = async () => {
  const urls = new Set<string>();
  const lastmod = new Map<string, string>();
  const live = await livePricedCatalog();
  const onList = new Set(live.filter(isShownOnWebsite).map((p) => p.id));
  const known = new Set(live.map((p) => p.id));
  const listed = (id: string) => !known.has(id) || onList.has(id);
  const anyListed = (items: { id: string }[]) => items.some((item) => listed(item.id));
  const iphoneListed = (id: string) => listed(iphoneLiveId(id));

  for (const p of staticPaths) urls.add(abs(p));
  for (const c of homeCategories) urls.add(abs(c.href));
  for (const cat of productNav) {
    urls.add(abs(cat.href));
    for (const child of cat.children ?? []) urls.add(abs(child.href));
  }
  for (const post of await listPublishedJournalPosts()) {
    const loc = abs(`/journal/${post.slug}`);
    urls.add(loc);
    const mod = (post.updatedAt || post.date || "").slice(0, 10);
    if (mod) lastmod.set(loc, mod);
  }
  for (const product of products) {
    // iPhone shop pages point Google at /iphone/<model>; list only the main page.
    if (!getSeoModelByName(product.name)) urls.add(abs(product.overviewHref));
    urls.add(abs(product.specsHref));
  }
  // Every product page: iPad, Mac, Watch, AirPods, TV & Home, accessories, iPhone models.
  for (const p of defaultPricedCatalog()) {
    if (p.group === "Shop iPhone") continue;
    urls.add(abs(p.href));
  }
  for (const m of tvHomeModels) urls.add(abs(`/tv-home/${m.id}`));
  for (const m of listSeoModels()) {
    if (!iphoneListed(m.id)) continue;
    urls.add(abs(`/iphone/${m.id}`));
    // Each listed storage option is its own page (iPhone 18 Pro Max 256GB, 512GB, ...).
    const liveModel = live.find((p) => p.id === iphoneLiveId(m.id));
    const priced = withLiveSeoPrices(m, liveModel);
    const changed = (liveModel?.updatedAt || "").slice(0, 10);
    for (const v of priced.variants) {
      if (!(v.newKes > 0 || v.exUkKes > 0)) continue;
      const loc = abs(storagePath(m.id, v.storage));
      urls.add(loc);
      // A storage page changes when its model's prices or stock change in admin.
      if (changed) lastmod.set(loc, changed);
    }
    for (const c of m.compareWith) {
      if (c.split("-vs-").every((id) => getSeoModel(id) && iphoneListed(id))) urls.add(abs(`/iphone/compare/${c}`));
    }
  }
  for (const s of listSeriesHubs()) {
    if (s.models.some((m) => iphoneListed(m.id))) urls.add(abs(`/iphone/${s.slug}`));
  }
  urls.add(abs("/iphone"));


  // Only the live list goes to Google: off-list product pages redirect to their section.
  for (const p of live) {
    if (!onList.has(p.id)) urls.delete(abs(p.href));
  }
  const emptyHubs: [string, { id: string }[]][] = [
    ["/accessories/apple-pencil", pencils()],
    ["/accessories/magic-keyboard", keyboards()],
    ["/accessories/magic-mouse", mice()],
    ["/accessories/magic-trackpad", trackpads()],
    ["/accessories/power", powerProducts()],
    ["/accessories/cases", caseProducts()],
    ["/tv-home", tvHomeModels],
    ["/tv-home/shop", tvHomeModels],
    ["/tv-home/compare", tvHomeModels],
  ];
  for (const [path, items] of emptyHubs) {
    if (!anyListed(items)) urls.delete(abs(path));
  }

  // Product pages: the date the listing last really changed.
  for (const p of live) {
    const loc = abs(p.href);
    const changed = (p.updatedAt || "").slice(0, 10);
    if (urls.has(loc) && changed) lastmod.set(loc, changed);
  }

  // /shop/<category>/<item> pages (and their specs) point Google at the model
  // pages, so only the model pages are listed. Shop category lists stay.
  for (const loc of [...urls]) {
    if (/^\/shop\/[^/]+\/.+/.test(new URL(loc).pathname) || loc.includes("?")) urls.delete(loc);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls]
  .sort()
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>${lastmod.has(loc) ? `\n    <lastmod>${lastmod.get(loc)}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
