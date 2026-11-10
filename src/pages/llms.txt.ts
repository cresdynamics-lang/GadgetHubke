import type { APIRoute } from "astro";
import { policy, site } from "../lib/site";
import { listSeoModels, storagePath, EX_UK_CONDITION_LABEL } from "../lib/iphone/seo";
import { withLiveSeoPrices } from "../lib/iphone/seo/live";
import { availableColours, colourLabel, textOnlyColours } from "../lib/iphone";
import { iphoneLiveId, isShownOnWebsite, livePricedCatalog } from "../lib/pricing/live";
import { listedVariantPrices } from "../lib/listing-offers";
import { lipaPlan } from "../lib/pricing/lipa";

export const prerender = false;

const kes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;
const abs = (path: string) => new URL(path, site.url).href;

/**
 * /llms.txt: a plain-text guide for AI assistants (ChatGPT, Claude, Perplexity, Gemini).
 * Who we are, how to buy, and every product on the live list with its exact options,
 * prices and page link. Rebuilt from live admin prices on every request.
 */
export const GET: APIRoute = async () => {
  const live = await livePricedCatalog();
  const byId = new Map(live.map((p) => [p.id, p]));
  const today = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" }).format(new Date());
  const lines: string[] = [];

  lines.push(
    `# ${site.legalName} (Gadget Hub Kenya)`,
    "",
    `> Apple Authorised Reseller in Nairobi CBD, Kenya, selling iPhone, MacBook, iPad, Apple Watch, AirPods and accessories, sealed new and Ex-UK (UK-used). Prices below are the live shop prices on ${today}, in Kenyan shillings.`,
    "",
    "## Shop",
    `- Address: ${site.address}, ${site.landmark}, Nairobi, Kenya`,
    `- Phone and WhatsApp: ${site.phoneDisplay} (${site.phoneE164})`,
    `- Email: ${site.email}`,
    `- Opening hours: ${site.hours.short}`,
    `- Website: ${site.url}`,
    "",
    "## How to buy",
    "- Order on WhatsApp or visit the shop. Payment by M-Pesa or in store.",
    `- Lipa Mdogo Mdogo (pay in instalments, run by ${site.legalName}): pay 40% or more today, then the balance over 1 to 6 months. The balance is multiplied by 1.3 (1 month) up to 1.8 (6 months), rounded to the nearest KES 100. Details: ${abs("/lipa-mdogo-mdogo")}`,
    `- Trade-in: iPhone, iPad and Mac accepted as part payment. ${abs("/trade-in")}`,
    `- New devices: sealed, ${site.warranty.years}-year warranty, Gadget Hub invoice. ${EX_UK_CONDITION_LABEL}: genuine UK-used Apple devices, condition and warranty stated on the invoice.`,
    `- Delivery across Kenya from ${kes(policy.deliveryFromKes)}, priced by town. Faulty or damaged items: report within ${policy.returnWindowDays} days. ${abs("/shipping-delivery")}`,
    "",
  );

  // iPhone: every listed storage option is its own page.
  lines.push("## iPhone prices in Kenya", "");
  const models = listSeoModels()
    .map((m) => withLiveSeoPrices(m, byId.get(iphoneLiveId(m.id))))
    .filter((m) => {
      const p = byId.get(iphoneLiveId(m.id));
      return (!p || isShownOnWebsite(p)) && m.variants.some((v) => v.newKes > 0 || v.exUkKes > 0);
    })
    .sort((a, b) => b.year - a.year || b.fromKes - a.fromKes);
  for (const m of models) {
    const colours = [...availableColours(m.id), ...textOnlyColours(m.id)].map(colourLabel);
    lines.push(`### ${m.name}`, `Page: ${abs(`/iphone/${m.id}`)}${colours.length ? ` · Colours: ${colours.join(", ")}` : ""}`);
    for (const v of m.variants) {
      if (!v.newKes && !v.exUkKes) continue;
      const parts = [
        v.newKes ? `${kes(v.newKes)} new` : "",
        v.exUkKes ? `${kes(v.exUkKes)} ${EX_UK_CONDITION_LABEL}` : "",
      ].filter(Boolean);
      const plan = lipaPlan(v.newKes || v.exUkKes, 40, 6);
      lines.push(
        `- [${m.name} ${v.storage}](${abs(storagePath(m.id, v.storage))}): ${parts.join(", ")}. Lipa Mdogo Mdogo ${kes(plan.depositKes)} deposit then ${kes(plan.monthlyKes)} a month for 6 months.${v.stockStatus === "out_of_stock" ? " Out of stock." : ""}`,
      );
    }
    lines.push("");
  }

  // Everything else on the live list, grouped as on the site.
  const groups: [string, string][] = [
    ["Mac", "MacBook and Mac prices in Kenya"],
    ["iPad", "iPad prices in Kenya"],
    ["Watch", "Apple Watch prices in Kenya"],
    ["AirPods", "AirPods prices in Kenya"],
    ["TV & Home", "Apple TV and HomePod prices in Kenya"],
    ["Accessories", "Apple accessories prices in Kenya"],
  ];
  for (const [group, heading] of groups) {
    const items = live.filter((p) => p.group === group && isShownOnWebsite(p));
    if (!items.length) continue;
    lines.push(`## ${heading}`, "");
    for (const p of items) {
      const rows = (p.variants.length ? p.variants : [undefined]).flatMap((v) => {
        const l = listedVariantPrices(p, v ?? { key: "base", label: "Standard", priceKes: p.priceKes, exUkKes: p.exUkKes, inStock: p.inStock });
        if (!l.newKes && !l.exUkKes) return [];
        const parts = [l.newKes ? `${kes(l.newKes)} new` : "", l.exUkKes ? `${kes(l.exUkKes)} ${EX_UK_CONDITION_LABEL}` : ""].filter(Boolean);
        return [`${v && v.label !== "Standard" ? `${v.label}: ` : ""}${parts.join(", ")}`];
      });
      if (!rows.length) continue;
      lines.push(rows.length === 1 ? `- [${p.name}](${abs(p.href)}): ${rows[0]}` : `- [${p.name}](${abs(p.href)}):`);
      if (rows.length > 1) for (const r of rows) lines.push(`  - ${r}`);
    }
    lines.push("");
  }

  lines.push(
    "## Useful pages",
    `- All iPhones: ${abs("/iphone")}`,
    `- Mac: ${abs("/mac")} · iPad: ${abs("/ipad")} · Apple Watch: ${abs("/watch")} · AirPods: ${abs("/airpods")}`,
    `- Deals: ${abs("/deals")} · Shop location: ${abs("/locations")} · FAQs: ${abs("/faqs")}`,
    `- Buying guides: ${abs("/journal")}`,
    `- Sitemap: ${abs("/sitemap.xml")}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
};
