/** iPhone category listing helpers */

import { products, type Product } from "./products";
import { ghImages } from "./images";
import { iphoneSubcategories } from "./catalog";
import { cardImageSrc } from "./card-images";

export type IphoneListItem = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  badge?: "New" | "Pre-order" | "Coming soon";
  blurb: string;
  image: { src: string; alt: string };
  colors: { id: string; label: string; hex: string; imageSrc?: string }[];
  storages: string[];
  stock: "in" | "preorder";
  /** Chooser tags */
  tags: ("camera" | "thin" | "value" | "fold" | "size")[];
};

/**
 * Card art: tiny WebP thumbs from card-image-map (build-card-images.mjs).
 * Full-res galleries stay on PDPs.
 */
const packById: Record<string, { src: string; alt: string }> = {
  "iphone-duo": { src: cardImageSrc("iphone-duo", "/iPhone-Duo/iphone-duo-digitalmat-gallery-1-202609.jpeg"), alt: "iPhone Duo" },
  "iphone-pro": { src: cardImageSrc("iphone-pro", "/iPhone-18/iphone-18pro-digitalmat-gallery-1-202609.jpeg"), alt: "iPhone 18 Pro" },
  "iphone-pro-max": {
    src: cardImageSrc("iphone-pro-max", "/iPhone-18/iphone-18pro-digitalmat-gallery-2-202609.jpeg"),
    alt: "iPhone 18 Pro Max",
  },
  "iphone-air": { src: cardImageSrc("iphone-air", "/iPhone-Air/iphone-air-digitalmat-gallery-1-202509.jpeg"), alt: "iPhone Air" },
  "iphone-17": { src: cardImageSrc("iphone-17", "/iPhone-17/iphone-17-digitalmat-gallery-5-202509.jpeg"), alt: "iPhone 17" },
  "iphone-17e": { src: cardImageSrc("iphone-17e", "/iPhone-17e/iphone-17e-digitalmat-gallery-5-202603.jpeg"), alt: "iPhone 17e" },
  "iphone-16": { src: cardImageSrc("iphone-16", ghImages.iphone.cam2Pink), alt: "iPhone 16" },
};

const tagsById: Record<string, IphoneListItem["tags"]> = {
  "iphone-duo": ["fold", "camera"],
  "iphone-pro": ["camera", "size"],
  "iphone-pro-max": ["camera", "size"],
  "iphone-air": ["thin"],
  "iphone-17": ["camera"],
  "iphone-17e": ["value"],
  "iphone-16": ["value", "camera"],
};

function badgeFor(id: string, subBadge?: string): IphoneListItem["badge"] {
  if (subBadge === "New" || subBadge === "Pre-order" || subBadge === "Coming soon") {
    return subBadge;
  }
  if (id.includes("duo") || id.includes("pro") || id.includes("air") || id.includes("17")) {
    return "New";
  }
  return undefined;
}

export function listIphones(): IphoneListItem[] {
  const byId = new Map(iphoneSubcategories.map((s) => [s.id, s]));
  const iphones = products.filter((p) => p.categoryLabel === "iPhone");

  // Prefer catalog order (newest first)
  const order = iphoneSubcategories.map((s) => s.id);
  const sorted = [...iphones].sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return sorted.map((p: Product) => {
    const sub = byId.get(p.id);
    const pack = packById[p.id];
    return {
      id: p.id,
      name: p.name,
      href: p.overviewHref,
      priceKes: p.storages[0]?.priceKes ?? sub?.fromPriceKes ?? 0,
      badge: badgeFor(p.id, sub?.badge),
      blurb: p.tagline,
      image: pack ?? { src: p.image.src, alt: p.image.alt },
      colors: p.colors.map((c) => ({ id: c.id, label: c.label, hex: c.hex })),
      storages: p.storages.map((s) => s.label),
      stock: "in",
      tags: tagsById[p.id] ?? [],
    };
  });
}
