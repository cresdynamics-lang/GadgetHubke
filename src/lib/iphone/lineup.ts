/**
 * Unified iPhone generation display - latest shop lineup (17/18/Air/Duo)
 * plus catalog generations 11 - 16.
 */
import { listIphones, type IphoneListItem } from "../iphone-list";
import { modelsByFamily, newerModels, type IphoneModel } from "./models";
import { baseNewKes } from "../pricing/iphone-sheet";
import { colourLabel, colourHex } from "./colours";
import { availableColours } from "./images";
import { getImage, defaultColourForModel } from "./images";
import { formatKes } from "./pricing";

export const IPHONE_LEGACY_GENS = [16, 15, 14, 13, 12, 11] as const;
export const IPHONE_ALL_GENS = [18, 17, 16, 15, 14, 13, 12, 11] as const;

export type GenStripCard = {
  family: number;
  label: string;
  href: string;
  count: number;
  lowest: number;
  img: { src: string; srcWebp?: string; alt: string; width: number };
  highPriority?: boolean;
};

export function latestIphoneLineup(): IphoneListItem[] {
  return listIphones();
}

export function latestByFamily(family: 17 | 18): IphoneListItem[] {
  const items = listIphones();
  if (family === 18) {
    return items.filter((i) =>
      /iphone-pro|iphone-pro-max|iphone-air|iphone-duo/.test(i.id),
    );
  }
  // 17 Pro and 17 Pro Max have no shop page; their cards point at the model pages.
  const pros = ["iphone-17-pro", "iphone-17-pro-max"]
    .map((id) => newerModels.find((m) => m.id === id))
    .filter((m): m is IphoneModel => Boolean(m))
    .map((m): IphoneListItem => {
      const colour = defaultColourForModel(m.id, m.defaultColour ?? undefined);
      const img = getImage(m.id, colour, 1, m.name);
      return {
        id: m.id,
        name: m.name,
        href: `/iphone/${m.id}`,
        priceKes: baseNewKes(m.name) ?? m.basePriceKes,
        badge: "New",
        blurb: m.tagline,
        image: { src: img.srcWebp ?? img.src, alt: img.alt },
        colors: availableColours(m.id).map((c) => ({ id: c, label: colourLabel(c), hex: colourHex(c) })),
        storages: m.storage,
        stock: "in",
        tags: ["camera"],
      };
    });
  return [...pros, ...items.filter((i) => i.id === "iphone-17" || i.id === "iphone-17e")];
}

export function genHref(family: number): string {
  return `/iphone?family=${family}`;
}

export function iphoneGenStripCards(): GenStripCard[] {
  const cards: GenStripCard[] = [];

  const eighteen = latestByFamily(18);
  if (eighteen.length) {
    const rep = eighteen.find((i) => i.id === "iphone-pro") || eighteen[0];
    cards.push({
      family: 18,
      label: "iPhone 18",
      href: genHref(18),
      count: eighteen.length,
      lowest: Math.min(...eighteen.map((i) => i.priceKes)),
      img: { src: rep.image.src, alt: rep.image.alt, width: 480 },
      highPriority: true,
    });
  }

  const seventeen = latestByFamily(17);
  if (seventeen.length) {
    const rep = seventeen.find((i) => i.id === "iphone-17") || seventeen[0];
    cards.push({
      family: 17,
      label: "iPhone 17",
      href: genHref(17),
      count: seventeen.length,
      lowest: Math.min(...seventeen.map((i) => i.priceKes)),
      img: { src: rep.image.src, alt: rep.image.alt, width: 480 },
      highPriority: true,
    });
  }

  for (const g of IPHONE_LEGACY_GENS) {
    const family = modelsByFamily(g);
    if (!family.length) continue;
    const rep =
      family.find((m) => m.tier === "Pro") ||
      family.find((m) => m.tier === "Standard") ||
      family[0];
    const colour = defaultColourForModel(rep.id, rep.defaultColour ?? undefined);
    const img = getImage(rep.id, colour, 1, rep.name);
    cards.push({
      family: g,
      label: `iPhone ${g}`,
      href: genHref(g),
      count: family.length,
      lowest: Math.min(...family.map((m) => m.basePriceKes)),
      img: { src: img.src, srcWebp: img.srcWebp, alt: img.alt, width: img.width },
      highPriority: g === 16,
    });
  }

  return cards;
}

export function formatFromKes(kes: number): string {
  return `from ${formatKes(kes)}`;
}

export type MegaNewLink = {
  id: string;
  name: string;
  href: string;
  price: string;
  badge?: string;
  preview: {
    src: string;
    alt: string;
    tagline: string;
    priceKes: number;
    colours: string[];
  };
};

/** New mega/hamburger order: iPhone 18, then Duo, then the rest. */
const MEGA_NEW_ORDER = [
  "iphone-pro",
  "iphone-pro-max",
  "iphone-duo",
  "iphone-air",
  "iphone-17",
  "iphone-17e",
] as const;

export function megaNewIphones(): MegaNewLink[] {
  const rank = (id: string) => {
    const i = (MEGA_NEW_ORDER as readonly string[]).indexOf(id);
    return i === -1 ? 100 + id.length : i;
  };
  return listIphones()
    .filter((i) => i.id !== "iphone-16")
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map((i) => ({
      id: i.id,
      name: i.name,
      href: i.href,
      price: formatKes(i.priceKes),
      badge: i.badge,
      preview: {
        src: i.image.src,
        alt: i.image.alt,
        tagline: i.blurb,
        priceKes: i.priceKes,
        colours: i.colors.slice(0, 6).map((c) => c.hex),
      },
    }));
}

export function legacyModels(): IphoneModel[] {
  return IPHONE_LEGACY_GENS.flatMap((g) => modelsByFamily(g));
}
