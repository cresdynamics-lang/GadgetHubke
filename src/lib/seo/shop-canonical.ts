/**
 * /shop/... pages repeat a full product page. Point Google at that page instead.
 */
import { getSeoModelByName } from "../iphone/seo";

const NON_IPHONE: Record<string, string> = {
  "macbook-pro": "/mac/macbook-pro-14-m5",
  "ipad-pro": "/ipad/ipad-pro-11-m5",
};

export function shopCanonical(product: { id: string; name: string }): string | undefined {
  const seo = getSeoModelByName(product.name);
  return seo ? `/iphone/${seo.id}` : NON_IPHONE[product.id];
}
