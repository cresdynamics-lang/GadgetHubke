import type { APIRoute } from "astro";
import { site } from "../lib/site";
import { homeCategories } from "../lib/home";
import { productNav } from "../lib/catalog";
import { listPublishedJournalPosts } from "../lib/journal";
import { products } from "../lib/products";
import { tvHomeModels } from "../lib/tv-home";
import { listSeoModels, listSeriesHubs, getSeoModelByName } from "../lib/iphone/seo";
import { defaultPricedCatalog } from "../lib/pricing/live";

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
    urls.add(abs(`/iphone/${m.id}`));
    for (const c of m.compareWith) urls.add(abs(`/iphone/compare/${c}`));
  }
  for (const s of listSeriesHubs()) urls.add(abs(`/iphone/${s.slug}`));
  urls.add(abs("/iphone"));


  // Shop iPhone pages canonicalise to /iphone/<model>; keep duplicates out of the sitemap.
  for (const product of products) {
    if (getSeoModelByName(product.name)) urls.delete(abs(product.overviewHref));
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
