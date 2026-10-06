/** Product catalog - lineups shared by nav hover + category pages */

import { ghImages } from "./images";

export type Subcategory = {
  id: string;
  label: string;
  href: string;
  blurb?: string;
  badge?: "New" | "Pre-order" | "Coming soon";
  fromPriceKes?: number;
  image?: {
    src: string;
    srcWebp?: string;
    alt: string;
  };
};

export type ShopCategory = {
  id: string;
  label: string;
  href: string;
  children?: Subcategory[];
};

export const iphoneSubcategories: Subcategory[] = [
  {
    id: "iphone-duo",
    label: "iPhone Duo",
    href: "/shop/iphone/iphone-duo",
    blurb: "Fold",
    badge: "Pre-order",
    fromPriceKes: 259999,
    image: {
      src: ghImages.duo.foldTop,
      alt: "iPhone Duo",
    },
  },
  {
    id: "iphone-pro",
    label: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
    blurb: "6.3″",
    badge: "New",
    fromPriceKes: 154999,
    image: {
      src: ghImages.iphone.proBlue,
      alt: "iPhone 18 Pro",
    },
  },
  {
    id: "iphone-pro-max",
    label: "iPhone 18 Pro Max",
    href: "/shop/iphone/iphone-pro-max",
    blurb: "6.9″",
    badge: "New",
    fromPriceKes: 168999,
    image: {
      src: ghImages.iphone.proSilver,
      alt: "iPhone 18 Pro Max",
    },
  },
  {
    id: "iphone-air",
    label: "iPhone Air",
    href: "/shop/iphone/iphone-air",
    blurb: "Thin",
    badge: "New",
    fromPriceKes: 142999,
    image: {
      src: ghImages.iphone.thinSide,
      alt: "iPhone Air",
    },
  },
  {
    id: "iphone-17",
    label: "iPhone 17",
    href: "/shop/iphone/iphone-17",
    blurb: "New",
    badge: "New",
    fromPriceKes: 115999,
    image: {
      src: ghImages.iphone.fanColours,
      alt: "iPhone 17",
    },
  },
  {
    id: "iphone-17e",
    label: "iPhone 17e",
    href: "/shop/iphone/iphone-17e",
    blurb: "Value",
    fromPriceKes: 89999,
    image: {
      src: ghImages.iphone.singleCamPink,
      alt: "iPhone 17e",
    },
  },
  {
    id: "iphone-16",
    label: "iPhone 16",
    href: "/shop/iphone/iphone-16",
    blurb: "A18",
    fromPriceKes: 102999,
    image: {
      src: ghImages.iphone.cam2Pink,
      alt: "iPhone 16",
    },
  },
];

/** iPhone mega menu extras */
export const iphoneMegaColours = [
  { label: "Blue", hex: "#4A6FA5", href: "/shop/iphone/iphone-pro" },
  { label: "Silver", hex: "#E3E4E5", href: "/shop/iphone/iphone-pro-max" },
  { label: "Pink", hex: "#E8B4C8", href: "/shop/iphone/iphone-16" },
  { label: "Teal", hex: "#4A8B8B", href: "/shop/iphone/iphone-16" },
  { label: "Ultramarine", hex: "#3B5CDE", href: "/shop/iphone/iphone-16" },
  { label: "Green", hex: "#5B8F6B", href: "/shop/iphone/iphone-16" },
] as const;

export const iphoneMegaQuickLinks = [
  { label: "Help me choose", href: "/shop/iphone#choose" },
  { label: "Compare models", href: "/shop/iphone#compare" },
  { label: "Trade in your iPhone", href: "/trade-in" },
  { label: "Lipa Mdogo Mdogo", href: "/lipa-mdogo-mdogo" },
] as const;

export const iphoneMegaFeatured = {
  title: "iPhone Duo",
  body: "Apple's first foldable. Reserve with a deposit.",
  href: "/shop/iphone/iphone-duo",
  imageSrc: ghImages.duo.openCamera,
  imageAlt: "iPhone Duo",
  badge: "Pre-order",
} as const;

/** Mac hover lineup */
export const macSubcategories: Subcategory[] = [
  {
    id: "macbook-air",
    label: "MacBook Air",
    href: "/shop/mac/macbook-air",
    blurb: "Everyday",
    badge: "New",
    fromPriceKes: 164999,
    image: {
      src: ghImages.mac.air,
      alt: "MacBook Air",
    },
  },
  {
    id: "macbook-pro",
    label: "MacBook Pro",
    href: "/shop/mac/macbook-pro",
    blurb: "Pro",
    fromPriceKes: 249999,
    image: {
      src: ghImages.mac.pro,
      alt: "MacBook Pro",
    },
  },
  {
    id: "imac",
    label: "iMac",
    href: "/shop/mac/imac",
    blurb: "All-in-one",
    fromPriceKes: 189999,
    image: {
      src: ghImages.mac.imac,
      alt: "iMac colour range",
    },
  },
  {
    id: "mac-mini",
    label: "Mac mini",
    href: "/shop/mac/mac-mini",
    blurb: "Compact",
    fromPriceKes: 99999,
    image: {
      src: ghImages.mac.mini,
      alt: "Mac mini",
    },
  },
  {
    id: "macbook-neo",
    label: "MacBook Neo",
    href: "/shop/mac",
    blurb: "Colour",
    badge: "Coming soon",
    image: {
      src: ghImages.mac.neo,
      alt: "MacBook Neo",
    },
  },
];

export const macMegaQuickLinks = [
  { label: "Help me choose", href: "/shop/mac#choose" },
  { label: "For school", href: "/shop/mac#school" },
  { label: "For work", href: "/shop/mac#work" },
  { label: "Notify me", href: "/shop/mac#notify" },
] as const;

export const macMegaFeatured = {
  title: "MacBook Air",
  body: "Light, fast, sealed stock in Nairobi.",
  href: "/shop/mac/macbook-air",
  imageSrc: ghImages.mac.air,
  imageAlt: "MacBook Air",
  badge: "Popular",
} as const;

export const ipadSubcategories: Subcategory[] = [
  {
    id: "ipad-pro",
    label: "iPad Pro",
    href: "/shop/ipad/ipad-pro",
    blurb: "Pro",
    badge: "New",
    fromPriceKes: 149999,
    image: {
      src: ghImages.ipad.pro,
      alt: "iPad Pro",
    },
  },
  {
    id: "ipad-air",
    label: "iPad Air",
    href: "/shop/ipad/ipad-air",
    blurb: "Air",
    fromPriceKes: 99999,
    image: {
      src: ghImages.ipad.air,
      alt: "iPad Air",
    },
  },
  {
    id: "ipad-mini",
    label: "iPad mini",
    href: "/shop/ipad/ipad-mini",
    blurb: "mini",
    fromPriceKes: 79999,
    image: {
      src: ghImages.ipad.mini,
      alt: "iPad mini",
    },
  },
  {
    id: "ipad",
    label: "iPad",
    href: "/shop/ipad/ipad",
    blurb: "Essential",
    fromPriceKes: 59999,
    image: {
      src: ghImages.ipad.air,
      alt: "iPad",
    },
  },
];

export const ipadMegaQuickLinks = [
  { label: "Help me choose", href: "/shop/ipad#choose" },
  { label: "Apple Pencil", href: "/shop/accessories/apple-pen" },
  { label: "Keyboards", href: "/shop/accessories/magic-keyboard" },
  { label: "Notify me", href: "/shop/ipad#notify" },
] as const;

export const ipadMegaFeatured = {
  title: "iPad Pro",
  body: "The most capable iPad. Pair with Apple Pencil.",
  href: "/shop/ipad/ipad-pro",
  imageSrc: ghImages.ipad.pro,
  imageAlt: "iPad Pro",
  badge: "New",
} as const;

export const watchSubcategories: Subcategory[] = [
  {
    id: "apple-watch",
    label: "Shop Apple Watch",
    href: "/watch/shop",
    blurb: "Health",
    badge: "New",
    fromPriceKes: 54999,
    image: {
      src: ghImages.watchAirPods.watch,
      alt: "Apple Watch",
    },
  },
];

export const watchMegaFeatured = {
  title: "Apple Watch Series 12",
  body: "The watch that looks after you.",
  href: "/watch",
  imageSrc: ghImages.watchAirPods.watch,
  imageAlt: "Apple Watch styles",
  badge: "New",
} as const;

export const airpodsSubcategories: Subcategory[] = [
  {
    id: "airpods-pro",
    label: "AirPods Pro",
    href: "/airpods/shop?family=Pro",
    blurb: "ANC",
    badge: "New",
    fromPriceKes: 39999,
    image: {
      src: ghImages.watchAirPods.airpodsPro,
      alt: "AirPods Pro",
    },
  },
  {
    id: "airpods-4",
    label: "AirPods",
    href: "/airpods/shop?family=AirPods",
    blurb: "Everyday",
    fromPriceKes: 24999,
    image: {
      src: ghImages.watchAirPods.airpods4,
      alt: "AirPods",
    },
  },
  {
    id: "airpods-max",
    label: "AirPods Max",
    href: "/airpods/shop?family=Max",
    blurb: "Over-ear",
    fromPriceKes: 79999,
    image: {
      src: ghImages.watchAirPods.airpodsMax,
      alt: "AirPods Max",
    },
  },
];

export const airpodsMegaFeatured = {
  title: "AirPods Pro 3",
  body: "Active Noise Cancellation. Sealed and ready.",
  href: "/airpods/airpods-pro-3",
  imageSrc: ghImages.watchAirPods.airpodsPro,
  imageAlt: "AirPods Pro",
  badge: "Popular",
} as const;

const tvHomePhotoBase =
  "/Gadget_Hub_TV_and_Home_1_Product_photos_colours_and_compare/01_Product_photos";

export const tvHomeSubcategories: Subcategory[] = [
  {
    id: "apple-tv-4k",
    label: "Apple TV 4K",
    href: "/tv-home/shop?family=Apple%20TV",
    blurb: "4K HDR",
    badge: "New",
    fromPriceKes: 24000,
    image: {
      src: `${tvHomePhotoBase}/Apple_TV_4K/apple-tv-4k-hero-select-202210.jpg`,
      alt: "Apple TV 4K",
    },
  },
  {
    id: "homepod",
    label: "HomePod",
    href: "/tv-home/shop?family=HomePod",
    blurb: "Room-filling",
    fromPriceKes: 42000,
    image: {
      src: `${tvHomePhotoBase}/HomePod_2nd_gen/homepod-select-202210.jpg`,
      alt: "HomePod",
    },
  },
  {
    id: "homepod-mini",
    label: "HomePod mini",
    href: "/tv-home/shop?family=HomePod%20mini",
    blurb: "Compact",
    fromPriceKes: 14000,
    image: {
      src: `${tvHomePhotoBase}/HomePod_mini/homepod-mini-select-202210.jpg`,
      alt: "HomePod mini",
    },
  },
];

export const tvHomeMegaFeatured = {
  title: "Apple TV 4K",
  body: "Cinema at home — on the TV you already own.",
  href: "/tv-home/apple-tv-4k-3",
  imageSrc: `${tvHomePhotoBase}/Apple_TV_4K/apple-tv-4k-hero-select-202210.jpg`,
  imageAlt: "Apple TV 4K",
  badge: "New",
} as const;

export const accessoriesSubcategories: Subcategory[] = [
  {
    id: "apple-pencil",
    label: "Apple Pencil",
    href: "/accessories/apple-pencil",
    blurb: "Four Pencils",
    fromPriceKes: 11000,
  },
  {
    id: "magic-keyboard",
    label: "Magic Keyboard",
    href: "/accessories/magic-keyboard",
    blurb: "iPad and Mac",
    fromPriceKes: 14000,
  },
  {
    id: "mouse",
    label: "Mouse",
    href: "/accessories/magic-mouse",
    blurb: "Multi-Touch surface",
    fromPriceKes: 12000,
  },
  {
    id: "trackpad",
    label: "Trackpad",
    href: "/accessories/magic-trackpad",
    blurb: "Force Touch",
    fromPriceKes: 14000,
  },
  { id: "power", label: "Power", href: "/accessories/power", blurb: "Adapters, MagSafe and cables" },
  { id: "cases", label: "Cases", href: "/accessories/cases", blurb: "iPhone cases and Smart Folio" },
];

export const accessoriesMegaQuickLinks = [
  { label: "Which Pencil fits my iPad?", href: "/accessories/apple-pencil#finder" },
  { label: "Which keyboard fits my iPad?", href: "/accessories/magic-keyboard#finder" },
  { label: "Compare Pencils", href: "/accessories/compare?group=pencil" },
  { label: "Compare keyboards", href: "/accessories/compare?group=keyboard" },
] as const;

export const accessoriesMegaFeatured = {
  title: "Apple Pencil Pro",
  body: "Squeeze, barrel roll and Find My — check it fits your iPad first.",
  href: "/accessories/pencil-pro",
  imageSrc:
    "/Accesories/ACC_Apple_Pencil_images/02_Product_photos_by_part_number/Apple_Pencil_Pro/MX2D3.jpg",
  imageAlt: "Apple Pencil Pro",
  badge: "New",
} as const;

/** Mega panel extras keyed by productNav id */
export const megaExtras: Record<
  string,
  {
    featured?: {
      title: string;
      body: string;
      href: string;
      imageSrc: string;
      imageAlt: string;
      badge?: string;
    };
    quickLinks?: { label: string; href: string }[];
    colours?: { label: string; hex: string; href: string }[];
  }
> = {
  iphone: {
    featured: iphoneMegaFeatured,
    quickLinks: [...iphoneMegaQuickLinks],
    colours: [...iphoneMegaColours],
  },
  mac: {
    featured: macMegaFeatured,
    quickLinks: [...macMegaQuickLinks],
  },
  ipad: {
    featured: ipadMegaFeatured,
    quickLinks: [...ipadMegaQuickLinks],
  },
  watch: {
    featured: watchMegaFeatured,
  },
  airpods: {
    featured: airpodsMegaFeatured,
  },
  "tv-home": {
    featured: tvHomeMegaFeatured,
  },
  accessories: {
    featured: accessoriesMegaFeatured,
    quickLinks: [...accessoriesMegaQuickLinks],
  },
};

/** Top product categories that open a hover panel */
export const productNav: ShopCategory[] = [
  {
    id: "iphone",
    label: "iPhone",
    href: "/iphone",
    children: iphoneSubcategories,
  },
  {
    id: "mac",
    label: "Mac",
    href: "/mac",
    children: macSubcategories,
  },
  {
    id: "ipad",
    label: "iPad",
    href: "/ipad",
    children: ipadSubcategories,
  },
  {
    id: "watch",
    label: "Watch",
    href: "/watch",
    children: watchSubcategories,
  },
  {
    id: "airpods",
    label: "AirPods",
    href: "/airpods",
    children: airpodsSubcategories,
  },
  {
    id: "tv-home",
    label: "TV & Home",
    href: "/tv-home",
    children: tvHomeSubcategories,
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/accessories",
    children: accessoriesSubcategories,
  },
];

/** Secondary links after product categories */
export const secondaryNav = [
  { label: "Deals", href: "/deals" },
  { label: "Trade-In", href: "/trade-in" },
  { label: "Lipa Mdogo Mdogo", href: "/lipa-mdogo-mdogo" },
] as const;
