import type { APIRoute } from "astro";
import { buildIphoneMerchantFeed, merchantFeedXml } from "../../lib/iphone/seo/merchant-feed";
import { applyLiveIphoneDescriptions, applyLivePrices } from "../../lib/ads/catalog-feed";

export const prerender = false;

export const GET: APIRoute = async () => {
  const rows = await applyLiveIphoneDescriptions(await applyLivePrices(buildIphoneMerchantFeed().rows));
  return new Response(merchantFeedXml(rows), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Never stored by Cloudflare or any cache: Meta and Google must always fetch the live list.
      "Cache-Control": "no-store, max-age=0",
    },
  });
};
