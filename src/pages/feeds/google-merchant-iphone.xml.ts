import type { APIRoute } from "astro";
import { buildIphoneMerchantFeed, merchantFeedXml } from "../../lib/iphone/seo/merchant-feed";

export const GET: APIRoute = () => {
  const { rows } = buildIphoneMerchantFeed();
  return new Response(merchantFeedXml(rows), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
