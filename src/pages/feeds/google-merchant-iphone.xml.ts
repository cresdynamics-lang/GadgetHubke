import type { APIRoute } from "astro";
import { buildIphoneMerchantFeed, merchantFeedXml } from "../../lib/iphone/seo/merchant-feed";
import { applyLivePrices } from "../../lib/ads/catalog-feed";

export const prerender = false;

export const GET: APIRoute = async () => {
  const rows = await applyLivePrices(buildIphoneMerchantFeed().rows);
  return new Response(merchantFeedXml(rows), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
