import type { APIRoute } from "astro";
import { site } from "../lib/site";
import { homeCategories } from "../lib/home";
import { productNav } from "../lib/catalog";
import { listPublishedJournalPosts } from "../lib/journal";
import { products } from "../lib/products";
import { tvHomeModels } from "../lib/tv-home";
import { listSeoModels, listSeriesHubs } from "../lib/iphone/seo";

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
  "/cart",
  "/account",
  "/sitemap",
  "/terms",
  "/privacy",
  "/returns",
  "/cookies",
  "/warranty-repairs",
  "/shipping-delivery",
  "/track-order",
  "/corporate-bulk",
  "/shop/watch",
  "/shop/airpods",
  "/tv-home",
  "/tv-home/shop",
  "/tv-home/compare",
] as const;

function abs(path: string) {
  return new URL(path, site.url).href;
}

export const GET: APIRoute = async () => {
  const urls = new Set<string>();

  for (const p of staticPaths) urls.add(abs(p));
  for (const c of homeCategories) urls.add(abs(c.href));
  for (const cat of productNav) {
    urls.add(abs(cat.href));
    for (const child of cat.children ?? []) urls.add(abs(child.href));
  }
  for (const post of await listPublishedJournalPosts()) {
    urls.add(abs(`/journal/${post.slug}`));
  }
  for (const product of products) {
    urls.add(abs(product.overviewHref));
    urls.add(abs(product.specsHref));
  }
  for (const m of tvHomeModels) urls.add(abs(`/tv-home/${m.id}`));
  for (const m of listSeoModels()) {
    urls.add(abs(`/iphone/${m.id}`));
    for (const c of m.compareWith) urls.add(abs(`/iphone/compare/${c}`));
  }
  for (const s of listSeriesHubs()) urls.add(abs(`/iphone/${s.slug}`));
  urls.add(abs("/iphone"));
  urls.add(abs("/feeds/google-merchant-iphone.xml"));
  urls.add(abs("/feeds/google-merchant.xml"));
  urls.add(abs("/feeds/meta-catalog.csv"));


  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls]
  .sort()
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
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
