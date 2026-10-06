/** Searchable catalog slice for the site search overlay */

import { products } from "./products";
import { whatsappUrl } from "./site";

export type SearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  category: string;
  stock: "In stock" | "Pre-order" | "Coming soon";
};

export const popularSearches = [
  "iPhone 18 Pro",
  "iPhone Duo",
  "MacBook Air",
  "iPad Air",
  "AirPods Pro",
  "Cases",
] as const;

export function buildSearchIndex(): SearchHit[] {
  return products.map((p) => {
    const priceKes = p.storage?.[0]?.priceKes ?? 0;
    let stock: SearchHit["stock"] = "In stock";
    if (p.id.includes("duo")) stock = "Pre-order";
    return {
      id: p.id,
      name: p.name,
      href: p.overviewHref,
      priceKes,
      imageSrc: p.image.src,
      imageAlt: p.image.alt,
      category: p.categoryLabel,
      stock,
    };
  });
}

export function searchWhatsAppFallback(query: string): string {
  const q = query.trim() || "a product";
  return whatsappUrl(`Hi GadgetHub - I searched for "${q}" and need help finding it.`);
}
