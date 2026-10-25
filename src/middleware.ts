/**
 * Faster first images on every page:
 *  - Point /public JPEG/PNG URLs at their .webp sibling when one exists
 *    (same pixels and resolution, a fraction of the bytes). Meta and icon
 *    tags keep the original for social previews.
 *  - Preload the first image in <main> and give it top fetch priority, so the
 *    product photo starts downloading with the HTML instead of after the CSS.
 */
import { defineMiddleware } from "astro:middleware";
import webpMap from "./lib/webp-map.json";

/** Same-size WebP only (scripts/build-webp-map.mjs), so resolution never drops. */
const webp = webpMap as Record<string, string>;

function webpUrl(url: string): string | null {
  let key = url.replace(/&amp;/g, "&");
  try {
    key = decodeURI(key);
  } catch {}
  const hit = webp[key];
  if (!hit) return null;
  return url.replace(/\.(jpe?g|png)$/i, hit.endsWith(".full.webp") ? ".full.webp" : ".webp");
}

const IMAGE_URL = /\/[^"'\s(),<>]+?\.(?:jpe?g|png)(?=["'\s),&])/gi;
const KEEP = /<meta\b[^>]*>|<link\b[^>]*rel="(?:icon|apple-touch-icon|shortcut icon)"[^>]*>|<script type="application\/ld\+json"[\s\S]*?<\/script>/gi;

function swapToWebp(html: string): string {
  let out = "";
  let last = 0;
  for (const m of html.matchAll(KEEP)) {
    out += html.slice(last, m.index).replace(IMAGE_URL, (u) => webpUrl(u) ?? u);
    out += m[0];
    last = m.index! + m[0].length;
  }
  return out + html.slice(last).replace(IMAGE_URL, (u) => webpUrl(u) ?? u);
}

function preloadHero(html: string): string {
  const main = html.indexOf("<main");
  if (main < 0) return html;
  const imgMatch = /<img\b[^>]*>/i.exec(html.slice(main));
  if (!imgMatch) return html;
  const tag = imgMatch[0];
  const src = /\ssrc="([^"]+)"/.exec(tag)?.[1];
  if (!src || src.startsWith("data:")) return html;
  let hero = tag.replace(/\sloading="lazy"/, ' loading="eager"');
  if (!/\sfetchpriority=/.test(hero)) hero = hero.replace(/^<img/, '<img fetchpriority="high"');
  const at = main + imgMatch.index;
  html = html.slice(0, at) + hero + html.slice(at + tag.length);
  if (html.includes(`rel="preload" as="image" href="${src}"`)) return html;
  const link = `<link rel="preload" as="image" href="${src}" fetchpriority="high">`;
  return html.replace("</head>", `${link}</head>`);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html") || context.url.pathname.startsWith("/management") || context.url.pathname.startsWith("/api/")) {
    return response;
  }
  const html = preloadHero(swapToWebp(await response.text()));
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
});
