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
  /** Set by lipaDeviceOptions: the colours in stock per condition, out of everything in `colours`. */
  colourStock?: { new: string[]; exUk: string[] };
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

/** Shop products share one catalogue group, so the MacBook among them needs its own. */
function pickerGroup(p: PricedProduct) {
  if (!p.group.includes("iPhone")) return p.group;
  return /macbook/i.test(p.name) ? "Mac" : "iPhone";
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
    const group = pickerGroup(p);
    if (skipGroups.includes(group) || !isListedForSale(p)) return [];
    const variants = variantOptions(p).filter((v) => v.newKes > 0 || v.exUkKes > 0);
    if (!variants.length) return [];
    const colours = filterColours(p.colours ?? [], p.coloursInStock).map(nameColour);
    return [{ id: p.id, name: p.name, group, colours, variants }];
  });
}

/**
 * The Lipa form lists sold-out options too, so a customer can be told and still ask.
 * Prices stay 0 for anything out of stock, so resolveDevice keeps refusing them.
 */
export function lipaDeviceOptions(
  catalog: PricedProduct[],
  nameColour: (key: string) => string = colourName,
): DeviceOption[] {
  return catalog.flatMap((p) => {
    if (p.showOnWebsite === false) return [];
    const flags = listedVariantPrices(p);
    const variants = variantOptions(p).filter((_, i) => {
      if (!p.variants.length) return (flags.showNew && p.priceKes > 0) || (flags.showEx && (p.exUkKes ?? 0) > 0);
      const listed = listedVariantPrices(p, p.variants[i]);
      return listed.newKes > 0 || listed.exUkKes > 0;
    });
    if (!variants.length) return [];
    const all = p.colours ?? [];
    const exUkTicks = p.exUkColoursInStock?.length ? p.exUkColoursInStock : p.coloursInStock;
    return [
      {
        id: p.id,
        name: p.name,
        group: pickerGroup(p),
        colours: all.map(nameColour),
        variants,
        colourStock: {
          new: filterColours(all, p.coloursInStock).map(nameColour),
          exUk: filterColours(all, exUkTicks).map(nameColour),
        },
      },
    ];
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
