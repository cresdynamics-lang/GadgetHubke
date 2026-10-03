/** Product catalog — lineups shared by nav hover + category pages */

export type Subcategory = {
  id: string;
  label: string;
  href: string;
  blurb?: string;
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
    image: {
      src: "/iPhone-Duo/iphone-duo-digitalmat-gallery-1-202609.jpeg",
      alt: "iPhone Duo",
    },
  },
  {
    id: "iphone-pro",
    label: "iPhone 18 Pro",
    href: "/shop/iphone/iphone-pro",
    blurb: "6.3″",
    image: {
      src: "/iPhone-18/iphone-18pro-digitalmat-gallery-1-202609.jpeg",
      alt: "iPhone 18 Pro",
    },
  },
  {
    id: "iphone-pro-max",
    label: "iPhone 18 Pro Max",
    href: "/shop/iphone/iphone-pro-max",
    blurb: "6.9″",
    image: {
      src: "/iPhone-18/iphone-18pro-digitalmat-gallery-1-202609.jpeg",
      alt: "iPhone 18 Pro Max",
    },
  },
  {
    id: "iphone-air",
    label: "iPhone Air",
    href: "/shop/iphone/iphone-air",
    blurb: "Thin",
    image: {
      src: "/iPhone-Air/iphone-air-digitalmat-gallery-1-202509.jpeg",
      alt: "iPhone Air",
    },
  },
  {
    id: "iphone-17",
    label: "iPhone 17",
    href: "/shop/iphone/iphone-17",
    blurb: "New",
    image: {
      src: "/iPhone-17/iphone-17-digitalmat-gallery-1-202509_GEO_US.jpeg",
      alt: "iPhone 17",
    },
  },
  {
    id: "iphone-17e",
    label: "iPhone 17e",
    href: "/shop/iphone/iphone-17e",
    blurb: "Value",
    image: {
      src: "/iPhone-17e/iphone-17e-digitalmat-gallery-1-202603_GEO_US.jpeg",
      alt: "iPhone 17e",
    },
  },
  {
    id: "iphone-16",
    label: "iPhone 16",
    href: "/shop/iphone/iphone-16",
    blurb: "A18",
    image: {
      src: "/iPhone-16/iphone16-digitalmat-gallery-1-202409_GEO_US.jpeg",
      alt: "iPhone 16",
    },
  },
];

/** Mac hover lineup */
export const macSubcategories: Subcategory[] = [
  {
    id: "macbook-air",
    label: "MacBook Air",
    href: "/shop/mac/macbook-air",
    blurb: "Air",
    image: {
      src: "/images/mac/macbook-air-card.jpg",
      srcWebp: "/images/mac/macbook-air-card.webp",
      alt: "MacBook Air",
    },
  },
  {
    id: "macbook-pro",
    label: "MacBook Pro",
    href: "/shop/mac/macbook-pro",
    blurb: "Pro",
    image: {
      src: "/images/mac/macbook-pro-card.jpg",
      srcWebp: "/images/mac/macbook-pro-card.webp",
      alt: "MacBook Pro",
    },
  },
  {
    id: "imac",
    label: "iMac",
    href: "/shop/mac/imac",
    blurb: "All-in-one",
  },
  {
    id: "mac-mini",
    label: "Mac mini",
    href: "/shop/mac/mac-mini",
    blurb: "Compact",
  },
  {
    id: "mac-studio",
    label: "Mac Studio",
    href: "/shop/mac/mac-studio",
    blurb: "Power",
  },
  {
    id: "mac-pro",
    label: "Mac Pro",
    href: "/shop/mac/mac-pro",
    blurb: "Pro desktop",
  },
];

export const ipadSubcategories: Subcategory[] = [
  {
    id: "ipad",
    label: "iPad",
    href: "/shop/ipad/ipad",
    blurb: "iPad",
    image: {
      src: "/images/ipad/ipad-card.jpg",
      srcWebp: "/images/ipad/ipad-card.webp",
      alt: "iPad",
    },
  },
  {
    id: "ipad-mini",
    label: "iPad mini",
    href: "/shop/ipad/ipad-mini",
    blurb: "mini",
    image: {
      src: "/images/ipad/ipad-mini-card.jpg",
      srcWebp: "/images/ipad/ipad-mini-card.webp",
      alt: "iPad mini",
    },
  },
  {
    id: "ipad-air",
    label: "iPad Air",
    href: "/shop/ipad/ipad-air",
    blurb: "Air",
    image: {
      src: "/images/ipad/ipad-air-card.jpg",
      srcWebp: "/images/ipad/ipad-air-card.webp",
      alt: "iPad Air",
    },
  },
  {
    id: "ipad-pro",
    label: "iPad Pro",
    href: "/shop/ipad/ipad-pro",
    blurb: "Pro",
    image: {
      src: "/images/ipad/ipad-pro-card.jpg",
      srcWebp: "/images/ipad/ipad-pro-card.webp",
      alt: "iPad Pro",
    },
  },
];

export const accessoriesSubcategories: Subcategory[] = [
  {
    id: "apple-pen",
    label: "Apple Pen",
    href: "/shop/accessories/apple-pen",
    blurb: "Pencil",
  },
  {
    id: "magic-keyboard",
    label: "Magic Keyboard",
    href: "/shop/accessories/magic-keyboard",
    blurb: "Keyboard",
  },
  {
    id: "mouse",
    label: "Mouse",
    href: "/shop/accessories/mouse",
    blurb: "Mouse",
  },
  {
    id: "trackpad",
    label: "Trackpad",
    href: "/shop/accessories/trackpad",
    blurb: "Trackpad",
  },
  {
    id: "power",
    label: "Power",
    href: "/shop/accessories/power",
    blurb: "Charging",
  },
  {
    id: "cases",
    label: "Cases",
    href: "/shop/accessories/cases",
    blurb: "Protection",
  },
];

/** Top product categories that open a hover panel */
export const productNav: ShopCategory[] = [
  {
    id: "iphone",
    label: "iPhone",
    href: "/shop/iphone",
    children: iphoneSubcategories,
  },
  {
    id: "mac",
    label: "Mac",
    href: "/shop/mac",
    children: macSubcategories,
  },
  {
    id: "ipad",
    label: "iPad",
    href: "/shop/ipad",
    children: ipadSubcategories,
  },
  {
    id: "watch",
    label: "Watch",
    href: "/shop/watch",
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/shop/accessories",
    children: accessoriesSubcategories,
  },
];

/** Secondary links after product categories */
export const secondaryNav = [
  { label: "Deals", href: "/deals" },
  { label: "Trade-In", href: "/trade-in" },
  { label: "Lipa Mdogo Mdogo", href: "/lipa-mdogo-mdogo" },
] as const;
