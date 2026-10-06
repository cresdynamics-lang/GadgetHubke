/** Homepage merchandising content - KES base prices */

import { latestPosts } from "./blog";
import { ghImages } from "./images";

export type HeroPhone = {
  src: string;
  alt: string;
  href: string;
};

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

/** Signature hero - four phones for corner animation (pack imagery) */
export const heroPhones: [HeroPhone, HeroPhone, HeroPhone, HeroPhone] = [
  {
    src: ghImages.iphone.proBlue,
    alt: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
  },
  {
    src: ghImages.duo.openCamera,
    alt: "iPhone Duo",
    href: "/shop/iphone/iphone-duo",
  },
  {
    src: ghImages.iphone.thinSide,
    alt: "iPhone Air",
    href: "/shop/iphone/iphone-air",
  },
  {
    src: ghImages.iphone.cam2Pink,
    alt: "iPhone 16",
    href: "/shop/iphone/iphone-16",
  },
];

/** Latest iPhone row under launch band */
export const homeLatestIphones = [
  {
    name: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
    priceKes: 154999,
    badge: "New" as const,
    blurb: "Pro camera system",
    image: {
      src: ghImages.iphone.proBlue,
      alt: "iPhone 18 Pro in blue",
    },
    colors: [
      { id: "blue", label: "Blue", hex: "#4A6FA5", imageSrc: ghImages.iphone.proBlue },
      { id: "silver", label: "Silver", hex: "#E3E4E5", imageSrc: ghImages.iphone.proSilver },
    ],
  },
  {
    name: "iPhone 18 Pro Max",
    href: "/shop/iphone/iphone-pro-max",
    priceKes: 168999,
    badge: "New" as const,
    blurb: "Biggest Pro display",
    image: {
      src: ghImages.iphone.proSilver,
      alt: "iPhone 18 Pro Max in silver",
    },
  },
  {
    name: "iPhone Air",
    href: "/shop/iphone/iphone-air",
    priceKes: 142999,
    badge: "New" as const,
    blurb: "Ultralight titanium",
    image: {
      src: ghImages.iphone.thinSide,
      alt: "iPhone Air thin profile",
    },
  },
  {
    name: "iPhone 16",
    href: "/shop/iphone/iphone-16",
    priceKes: 102999,
    blurb: "Camera Control",
    image: {
      src: ghImages.iphone.cam2Pink,
      alt: "iPhone 16 in pink",
    },
    colors: [
      {
        id: "pink",
        label: "Pink",
        hex: "#E8B4C8",
        imageSrc: ghImages.iphone.cam2Pink,
      },
      {
        id: "teal",
        label: "Teal",
        hex: "#4A8B8B",
        imageSrc: ghImages.iphone.cam2Teal,
      },
      {
        id: "blue",
        label: "Blue",
        hex: "#3B5CDE",
        imageSrc: ghImages.iphone.cam2Blue,
      },
      {
        id: "green",
        label: "Green",
        hex: "#5B8F6B",
        imageSrc: ghImages.iphone.cam2Green,
      },
    ],
  },
];

/** Six core Apple product families for the home category strip */
export const homeAppleProducts = [
  { label: "iPhone", href: "/iphone" },
  { label: "Mac", href: "/mac" },
  { label: "iPad", href: "/ipad" },
  { label: "Watch", href: "/watch" },
  { label: "AirPods", href: "/airpods" },
  { label: "TV & Home", href: "/tv-home" },
  { label: "Accessories", href: "/accessories" },
] as const;

export const homeCategories = [
  ...homeAppleProducts,
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
      src: ghImages.duo.foldTop,
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
      src: ghImages.iphone.proBlue,
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
      src: ghImages.iphone.proSilver,
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
      src: ghImages.mac.air,
      alt: "MacBook Air",
    },
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    href: "/shop/ipad/ipad-air",
    priceKes: 99999,
    image: {
      src: ghImages.ipad.air,
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
      src: ghImages.iphone.fanColours,
      alt: "iPhone 17",
    },
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    href: "/shop/mac/macbook-pro",
    priceKes: 249999,
    image: {
      src: ghImages.mac.pro,
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

/** Accessories strip — Pencil/Keyboard, Pointers, Power, Cases */
export const homeAccessories = [
  {
    name: "Apple Pencil Pro",
    href: "/accessories/pencil-pro",
    priceKes: 18000,
    blurb: "Squeeze, barrel roll, Find My",
    image: {
      src: "/Accesories/ACC_Apple_Pencil_images/02_Product_photos_by_part_number/Apple_Pencil_Pro/MX2D3.jpg",
      alt: "Apple Pencil Pro, front view",
    },
  },
  {
    name: "Magic Keyboard for iPad Pro 13″",
    href: "/accessories/keyboard-ipad-pro-13",
    priceKes: 45000,
    blurb: "Function row, trackpad, floating design",
    image: {
      src: "/Accesories/ACC_Magic_Keyboard_images/02_Product_photos_by_part_number/Magic_Keyboard_iPad_Pro_13/MWR53.jpg",
      alt: "Magic Keyboard for iPad Pro 13-inch",
    },
  },
  {
    name: "Power",
    href: "/accessories/power",
    priceKes: 3500,
    blurb: "Adapters, MagSafe and cables",
    image: {
      src: "/Accesories/ACC_Power_images/01_Power_adapters/70W_USB-C_Power_Adapter/MQLN3_GEO_US.jpg",
      alt: "70W USB-C Power Adapter",
    },
  },
  {
    name: "Cases",
    href: "/accessories/cases",
    priceKes: 6500,
    blurb: "Made for your exact iPhone or iPad",
    image: {
      src: "/Accesories/ACC_Cases_1of5/01_iPhone_cases/iPhone_17_Pro_Silicone_Case_with_MagSafe/MGFK4_Black.jpg",
      alt: "iPhone 17 Pro Silicone Case in Black",
    },
  },
] as const;

export const homeMacBand = {
  eyebrow: "Mac",
  title: "MacBook Air.",
  body: "Light, fast, and ready for school or work. Genuine sealed stock in Nairobi.",
  href: "/shop/mac",
  ctaLabel: "Shop Mac",
  imageSrc: ghImages.mac.air,
  imageAlt: "MacBook Air",
} as const;

export const homeIpadBand = {
  eyebrow: "iPad",
  title: "iPad Air.",
  body: "Draw, note, and stream on a bright display. Pair with Apple Pencil when you need it.",
  href: "/shop/ipad",
  ctaLabel: "Shop iPad",
  imageSrc: ghImages.ipad.air,
  imageAlt: "iPad Air in blue",
  reverse: true,
  tone: "dark" as const,
};

export const homeDuoLaunch = {
  title: "iPhone Duo.",
  body: "Apple's first foldable. Reserve yours with a deposit before it lands.",
  href: "/shop/iphone/iphone-duo",
  learnHref: "/shop/iphone/iphone-duo",
  imageSrc: ghImages.duo.openCamera,
  imageAlt: "iPhone Duo open",
  launchAt: "2026-10-23T00:00:00+03:00",
} as const;
