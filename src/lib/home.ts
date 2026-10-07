/** Homepage merchandising content - KES base prices */

import { latestPosts } from "./blog";
import { ghImages, macProductPhotos } from "./images";

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

/** Signature hero - four devices across the Apple lineup */
export const heroPhones: [HeroPhone, HeroPhone, HeroPhone, HeroPhone] = [
  {
    src: ghImages.iphone.proBlue,
    alt: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
  },
  {
    src: ghImages.mac.air,
    alt: "MacBook Air",
    href: "/shop/mac/macbook-air",
  },
  {
    src: ghImages.watchAirPods.watch,
    alt: "Apple Watch",
    href: "/watch",
  },
  {
    src: ghImages.watchAirPods.airpodsPro,
    alt: "AirPods Pro",
    href: "/airpods",
  },
];

/** Latest iPhone row under launch band */
export const homeLatestIphones = [
  {
    name: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
    priceKes: 184999,
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
    priceKes: 199999,
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
    priceKes: 154999,
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
    priceKes: 99999,
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
    priceKes: 279999,
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
    priceKes: 129999,
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

/** Accessories strip - Pencil or Keyboard, Pointers, Power, Cases */
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
    name: "Pointers",
    href: "/accessories/magic-mouse",
    priceKes: 14000,
    blurb: "Magic Mouse and Magic Trackpad",
    image: {
      src: "/Accesories/ACC_Magic_Mouse_images/01_Product_photos_by_part_number/Magic_Mouse_USB-C_black/MXK63.jpg",
      alt: "Magic Mouse USB-C black",
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
  href: "/mac",
  ctaLabel: "Shop Mac",
  imageSrc: macProductPhotos.air13M4.skyBlue,
  imageAlt: "MacBook Air 13-inch M4 in Sky Blue",
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
  badge: "In stock",
  title: "iPhone Duo.",
  body: "Apple's foldable - in the shop now. Colours, storage, and sealed stock ready in Nairobi.",
  href: "/shop/iphone/iphone-duo",
  learnHref: "/shop/iphone/iphone-duo",
  imageSrc: ghImages.duo.openCamera,
  imageAlt: "iPhone Duo open",
  ctaLabel: "Shop iPhone Duo",
} as const;

const tvHomePhotoBase =
  "/Gadget_Hub_TV_and_Home_1_Product_photos_colours_and_compare/01_Product_photos";

/** New In - mixed Apple products just arrived / featured */
export const homeNewIn: DealItem[] = [
  {
    id: "new-duo",
    name: "iPhone Duo",
    href: "/shop/iphone/iphone-duo",
    priceKes: 279999,
    badge: "New",
    image: { src: ghImages.duo.foldTop, alt: "iPhone Duo" },
  },
  {
    id: "new-pro",
    name: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
    priceKes: 184999,
    badge: "New",
    image: { src: ghImages.iphone.proBlue, alt: "iPhone 18 Pro" },
  },
  {
    id: "new-mac-air",
    name: "MacBook Air 13″ M4",
    href: "/mac/macbook-air-13-m4",
    priceKes: 135000,
    badge: "New",
    image: {
      src: macProductPhotos.air13M4.skyBlue,
      alt: "MacBook Air 13-inch M4 in Sky Blue",
    },
  },
  {
    id: "new-ipad-pro",
    name: "iPad Pro",
    href: "/shop/ipad/ipad-pro",
    priceKes: 154999,
    badge: "New",
    image: { src: ghImages.ipad.pro, alt: "iPad Pro" },
  },
  {
    id: "new-watch",
    name: "Apple Watch",
    href: "/watch",
    priceKes: 54999,
    badge: "New",
    image: { src: ghImages.watchAirPods.watch, alt: "Apple Watch" },
  },
  {
    id: "new-airpods",
    name: "AirPods Pro",
    href: "/airpods",
    priceKes: 39999,
    badge: "New",
    image: { src: ghImages.watchAirPods.airpodsPro, alt: "AirPods Pro" },
  },
];

export type HomeCategoryRow = {
  id: string;
  title: string;
  lede: string;
  href: string;
  items: DealItem[];
};

/** Scrollable category rows - full Apple storefront on the home page */
export const homeCategoryRows: HomeCategoryRow[] = [
  {
    id: "iphone",
    title: "iPhone",
    lede: "Duo, Pro, Air, and everyday models - sealed stock.",
    href: "/iphone",
    items: [
      {
        id: "iphone-duo",
        name: "iPhone Duo",
        href: "/shop/iphone/iphone-duo",
        priceKes: 279999,
        badge: "New",
        image: { src: ghImages.duo.foldTop, alt: "iPhone Duo" },
      },
      ...homeLatestIphones.map((p, i) => ({
        id: `iphone-${i}`,
        name: p.name,
        href: p.href,
        priceKes: p.priceKes,
        badge: p.badge,
        image: p.image,
      })),
    ],
  },
  {
    id: "mac",
    title: "Mac",
    lede: "MacBook Air and MacBook Pro - select shots from the product pack.",
    href: "/mac",
    items: [
      {
        id: "mba-13-m4",
        name: "MacBook Air 13″ M4",
        href: "/mac/macbook-air-13-m4",
        priceKes: 135000,
        badge: "New",
        image: {
          src: macProductPhotos.air13M4.skyBlue,
          alt: "MacBook Air 13-inch M4 in Sky Blue",
        },
      },
      {
        id: "mba-15-m4",
        name: "MacBook Air 15″ M4",
        href: "/mac/macbook-air-15-m4",
        priceKes: 165000,
        badge: "New",
        image: {
          src: macProductPhotos.air15M4.midnight,
          alt: "MacBook Air 15-inch M4 in Midnight",
        },
      },
      {
        id: "mba-13-m3",
        name: "MacBook Air 13″ M3",
        href: "/mac/macbook-air-13-m3",
        priceKes: 120000,
        image: {
          src: macProductPhotos.air13M3.midnight,
          alt: "MacBook Air 13-inch M3 in Midnight",
        },
      },
      {
        id: "mba-15-m2",
        name: "MacBook Air 15″ M2",
        href: "/mac/macbook-air-15-m2",
        priceKes: 125000,
        image: {
          src: macProductPhotos.air15M2.starlight,
          alt: "MacBook Air 15-inch M2 in Starlight",
        },
      },
      {
        id: "mbp-14-m4",
        name: "MacBook Pro 14″ M4",
        href: "/mac/macbook-pro-14-m4",
        priceKes: 190000,
        badge: "Popular",
        image: {
          src: macProductPhotos.pro14M4.spaceBlack,
          alt: "MacBook Pro 14-inch M4 in Space Black",
        },
      },
      {
        id: "mbp-16-m4",
        name: "MacBook Pro 16″ M4",
        href: "/mac/macbook-pro-16-m4-pro",
        priceKes: 360000,
        image: {
          src: macProductPhotos.pro16M4.spaceBlack,
          alt: "MacBook Pro 16-inch M4 in Space Black",
        },
      },
      {
        id: "mbp-14-m3",
        name: "MacBook Pro 14″ M3",
        href: "/mac/macbook-pro-14-m3",
        priceKes: 175000,
        image: {
          src: macProductPhotos.pro14M3.silver,
          alt: "MacBook Pro 14-inch M3 in Silver",
        },
      },
      {
        id: "mbp-13-m2",
        name: "MacBook Pro 13″ M2",
        href: "/mac/macbook-pro-13-m2",
        priceKes: 125000,
        image: {
          src: macProductPhotos.pro13M2.spaceGray,
          alt: "MacBook Pro 13-inch M2 in Space Gray",
        },
      },
    ],
  },
  {
    id: "ipad",
    title: "iPad",
    lede: "Draw, note, stream - pair with Apple Pencil.",
    href: "/ipad",
    items: [
      {
        id: "ipad-pro",
        name: "iPad Pro",
        href: "/shop/ipad/ipad-pro",
        priceKes: 154999,
        badge: "New",
        image: { src: ghImages.ipad.pro, alt: "iPad Pro" },
      },
      {
        id: "ipad-air",
        name: "iPad Air",
        href: "/shop/ipad/ipad-air",
        priceKes: 99999,
        badge: "Popular",
        image: { src: ghImages.ipad.air, alt: "iPad Air" },
      },
      {
        id: "ipad-mini",
        name: "iPad mini",
        href: "/ipad",
        priceKes: 79999,
        image: { src: ghImages.ipad.mini, alt: "iPad mini" },
      },
    ],
  },
  {
    id: "watch",
    title: "Apple Watch",
    lede: "Health, fitness, and everyday style on your wrist.",
    href: "/watch",
    items: [
      {
        id: "watch-s12",
        name: "Apple Watch Series 12",
        href: "/watch",
        priceKes: 54999,
        badge: "New",
        image: { src: ghImages.watchAirPods.watch, alt: "Apple Watch" },
      },
      {
        id: "watch-shop",
        name: "Shop Apple Watch",
        href: "/watch/shop",
        priceKes: 44999,
        image: { src: ghImages.watchAirPods.watch, alt: "Apple Watch styles" },
      },
    ],
  },
  {
    id: "airpods",
    title: "AirPods",
    lede: "Pro, everyday, and Max - sealed and ready.",
    href: "/airpods",
    items: [
      {
        id: "ap-pro",
        name: "AirPods Pro",
        href: "/airpods",
        priceKes: 39999,
        badge: "Popular",
        image: { src: ghImages.watchAirPods.airpodsPro, alt: "AirPods Pro" },
      },
      {
        id: "ap-4",
        name: "AirPods",
        href: "/airpods",
        priceKes: 24999,
        image: { src: ghImages.watchAirPods.airpods4, alt: "AirPods" },
      },
      {
        id: "ap-max",
        name: "AirPods Max",
        href: "/airpods",
        priceKes: 79999,
        image: { src: ghImages.watchAirPods.airpodsMax, alt: "AirPods Max" },
      },
      {
        id: "ap-family",
        name: "AirPods family",
        href: "/airpods",
        priceKes: 24999,
        image: { src: ghImages.watchAirPods.airpodsFamily, alt: "AirPods family" },
      },
    ],
  },
  {
    id: "tv-home",
    title: "TV & Home",
    lede: "Apple TV 4K and HomePod for the room.",
    href: "/tv-home",
    items: [
      {
        id: "tv-4k",
        name: "Apple TV 4K",
        href: "/tv-home",
        priceKes: 24000,
        badge: "New",
        image: {
          src: `${tvHomePhotoBase}/Apple_TV_4K/apple-tv-4k-hero-select-202210.jpg`,
          alt: "Apple TV 4K",
        },
      },
      {
        id: "homepod",
        name: "HomePod",
        href: "/tv-home",
        priceKes: 42000,
        image: {
          src: `${tvHomePhotoBase}/HomePod_2nd_gen/homepod-select-202210.jpg`,
          alt: "HomePod",
        },
      },
      {
        id: "homepod-mini",
        name: "HomePod mini",
        href: "/tv-home",
        priceKes: 14000,
        image: {
          src: `${tvHomePhotoBase}/HomePod_mini/homepod-mini-select-202210.jpg`,
          alt: "HomePod mini",
        },
      },
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    lede: "Pencil, pointers, power, and cases made for your device.",
    href: "/accessories",
    items: homeAccessories.map((a, i) => ({
      id: `acc-${i}`,
      name: a.name,
      href: a.href,
      priceKes: a.priceKes,
      image: { src: a.image.src, alt: a.image.alt },
    })),
  },
];
