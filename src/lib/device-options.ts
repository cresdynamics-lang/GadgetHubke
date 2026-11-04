/**
 * The devices a customer can pick on the Trade-In and Lipa Mdogo Mdogo forms:
 * only what is on the live list, at listed prices that are in stock.
 */
import { filterColours, isListedForSale, listedVariantPrices } from "./listing-offers.ts";
import type { PricedProduct } from "./pricing/live.ts";

export type DeviceChannel = "new" | "ex-uk";

export type DeviceVariantOption = { key: string; label: string; newKes: number; exUkKes: number };

export type DeviceOption = {
  id: string;
  name: string;
  group: string;
  colours: string[];
  variants: DeviceVariantOption[];
};

export type ChosenDevice = {
  productId: string;
  name: string;
  variant: string;
  colour: string;
  channel: DeviceChannel;
  priceKes: number;
  /** One line for staff and WhatsApp, e.g. "iPhone 17 Pro · 256GB · Silver · New". */
  summary: string;
};

function colourName(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function variantOptions(p: PricedProduct): DeviceVariantOption[] {
  const newOpen = p.inStock !== false;
  const exOpen = p.exUkInStock !== false;
  if (!p.variants.length) {
    const flags = listedVariantPrices(p);
    return [
      {
        key: "",
        label: "Standard",
        newKes: flags.showNew && newOpen ? p.priceKes : 0,
        exUkKes: flags.showEx && exOpen ? (p.exUkKes ?? 0) : 0,
      },
    ];
  }
  return p.variants.map((v) => {
    const listed = listedVariantPrices(p, v);
    return {
      key: v.key,
      label: v.label,
      newKes: newOpen && v.inStock ? listed.newKes : 0,
      exUkKes: exOpen && v.exUkInStock !== false ? listed.exUkKes : 0,
    };
  });
}

export function deviceOptions(
  catalog: PricedProduct[],
  skipGroups: readonly string[] = [],
  nameColour: (key: string) => string = colourName,
): DeviceOption[] {
  return catalog.flatMap((p) => {
    const group = p.group.includes("iPhone") ? "iPhone" : p.group;
    if (skipGroups.includes(group) || !isListedForSale(p)) return [];
    const variants = variantOptions(p).filter((v) => v.newKes > 0 || v.exUkKes > 0);
    if (!variants.length) return [];
    const colours = filterColours(p.colours ?? [], p.coloursInStock).map(nameColour);
    return [{ id: p.id, name: p.name, group, colours, variants }];
  });
}

/** Looks the choice up on the server, so the price is always the listed one. */
export function resolveDevice(
  options: DeviceOption[],
  choice: { productId?: unknown; variantKey?: unknown; channel?: unknown; colour?: unknown },
): ChosenDevice | null {
  const product = options.find((o) => o.id === String(choice.productId || ""));
  if (!product) return null;
  const variant = product.variants.find((v) => v.key === String(choice.variantKey || ""));
  if (!variant) return null;
  const channel: DeviceChannel = choice.channel === "ex-uk" ? "ex-uk" : "new";
  const priceKes = channel === "ex-uk" ? variant.exUkKes : variant.newKes;
  if (!priceKes) return null;
  const colour = product.colours.find((c) => c === String(choice.colour || "")) ?? "";
  const label = variant.label === "Standard" ? "" : variant.label;
  return {
    productId: product.id,
    name: product.name,
    variant: label,
    colour,
    channel,
    priceKes,
    summary: [product.name, label, colour, channel === "ex-uk" ? "Ex-UK" : "New"].filter(Boolean).join(" · "),
  };
}
