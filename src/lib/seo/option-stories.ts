/**
 * Plain text for each configuration of a Mac, iPad, Watch or other multi-option product:
 * its price, the Ex-UK saving, the cost of the next step up and the Lipa Mdogo Mdogo plan.
 */
import { lipaPlan } from "../pricing/lipa.ts";

export type OptionStory = { id: string; title: string; paragraphs: string[] };

const formatKes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

/** "16GB / 512GB" → "16gb-512gb" for in-page anchors. */
export function optionId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Plain stories for each configuration, so each one reads as the separate product it is. */
export function optionStories(
  name: string,
  rows: { label: string; priceKes: number; exUkKes?: number; inStock: boolean }[],
): OptionStory[] {
  if (rows.length < 2) return [];
  return rows.map((r, i) => {
    const price = r.priceKes || r.exUkKes!;
    const title = `${name} ${r.label}`;
    const p: string[] = [];
    p.push(
      r.priceKes
        ? `The ${title} costs ${formatKes(r.priceKes)} sealed new at Gadget Hub in Nairobi CBD.${r.exUkKes ? ` Ex-UK (UK-used) it is ${formatKes(r.exUkKes)}, ${formatKes(r.priceKes - r.exUkKes)} less.` : ""}`
        : `The ${title} costs ${formatKes(r.exUkKes!)} Ex-UK (UK-used) at Gadget Hub in Nairobi CBD.`,
    );
    const next = rows[i + 1];
    const prev = rows[i - 1];
    if (!prev) p.push(`It is the lowest-priced ${name} configuration we sell.`);
    if (!next) p.push(`It is the highest ${name} configuration we sell.`);
    if (next) p.push(`The next step up, ${next.label}, is ${formatKes((next.priceKes || next.exUkKes!) - price)} more.`);
    const plan = lipaPlan(price, 40, 6);
    p.push(`On Lipa Mdogo Mdogo: ${formatKes(plan.depositKes)} deposit, then ${formatKes(plan.monthlyKes)} a month for 6 months (${formatKes(plan.totalKes)} in total).${r.inStock ? " In stock." : " Ask on WhatsApp for stock."}`);
    return { id: optionId(r.label), title, paragraphs: p };
  });
}
