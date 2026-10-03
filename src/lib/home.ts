/** Homepage merchandising content - KES base prices */

import { latestPosts } from "./blog";

export type DealItem = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  badge?: string;
  image?: { src: string; srcWebp?: string; alt: string };
};

export type BlogTeaser = {
  id: string;
  title: string;
  href: string;
  excerpt: string;
  dateLabel: string;
};

export const homeCategories = [
  { label: "iPhone", href: "/shop/iphone" },
  { label: "Mac", href: "/shop/mac" },
  { label: "iPad", href: "/shop/ipad" },
  { label: "Watch", href: "/shop/watch" },
  { label: "AirPods", href: "/shop/airpods" },
  { label: "TV & Home", href: "/shop/tv-home" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Deals", href: "/deals" },
] as const;

export const homeDeals: DealItem[] = [
  {
    id: "iphone-duo",
    name: "iPhone Duo",
    href: "/shop/iphone/iphone-duo",
    priceKes: 259999,
    badge: "New",
    image: {
      src: "/iPhone-Duo/iphone-duo-digitalmat-gallery-1-202609.jpeg",
      alt: "iPhone Duo",
    },
  },
  {
    id: "iphone-pro",
    name: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
    priceKes: 154999,
    badge: "New",
    image: {
      src: "/iPhone-18/iphone-18pro-digitalmat-gallery-1-202609.jpeg",
      alt: "iPhone 18 Pro",
    },
  },
  {
    id: "iphone-pro-max",
    name: "iPhone 18 Pro Max",
    href: "/shop/iphone/iphone-pro-max",
    priceKes: 168999,
    badge: "New",
    image: {
      src: "/iPhone-18/iphone-18pro-digitalmat-gallery-2-202609.jpeg",
      alt: "iPhone 18 Pro Max",
    },
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    href: "/shop/mac/macbook-air",
    priceKes: 164999,
    badge: "Popular",
    image: {
      src: "/images/mac/macbook-air-card.jpg",
      srcWebp: "/images/mac/macbook-air-card.webp",
      alt: "MacBook Air",
    },
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    href: "/shop/ipad/ipad-air",
    priceKes: 99999,
    image: {
      src: "/images/ipad/ipad-air-card.jpg",
      srcWebp: "/images/ipad/ipad-air-card.webp",
      alt: "iPad Air",
    },
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    href: "/shop/iphone/iphone-17",
    priceKes: 115999,
    badge: "New",
    image: {
      src: "/iPhone-17/iphone-17-digitalmat-gallery-1-202509_GEO_US.jpeg",
      alt: "iPhone 17",
    },
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    href: "/shop/mac/macbook-pro",
    priceKes: 249999,
    image: {
      src: "/images/mac/macbook-pro-card.jpg",
      srcWebp: "/images/mac/macbook-pro-card.webp",
      alt: "MacBook Pro",
    },
  },
];

export const homeBlog: BlogTeaser[] = latestPosts(3).map((post) => ({
  id: post.slug,
  title: post.title,
  href: `/blog/${post.slug}`,
  excerpt: post.excerpt,
  dateLabel: post.tags[0] ?? post.dateLabel,
}));
