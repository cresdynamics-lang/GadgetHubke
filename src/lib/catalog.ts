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
    id: "iphone-pro",
    label: "iPhone Pro",
    href: "/shop/iphone/iphone-pro",
    blurb: "Pro",
    image: {
      src: "/images/iphone/pro-card.jpg",
      srcWebp: "/images/iphone/pro-card.webp",
      alt: "iPhone Pro",
    },
  },
  {
    id: "iphone-air",
    label: "iPhone Air",
    href: "/shop/iphone/iphone-air",
    blurb: "Air",
    image: {
      src: "/images/iphone/air-card.jpg",
      srcWebp: "/images/iphone/air-card.webp",
      alt: "iPhone Air",
    },
  },
  {
    id: "iphone-se",
    label: "iPhone SE",
    href: "/shop/iphone/iphone-se",
    blurb: "SE",
    image: {
      src: "/images/iphone/se-card.jpg",
      srcWebp: "/images/iphone/se-card.webp",
      alt: "iPhone SE",
    },
  },
  {
    id: "iphone-standard",
    label: "iPhone Standard",
    href: "/shop/iphone/iphone-standard",
    blurb: "Standard",
    image: {
      src: "/images/iphone/standard-card.jpg",
      srcWebp: "/images/iphone/standard-card.webp",
      alt: "iPhone",
    },
  },
  {
    id: "iphone-plus",
    label: "Plus",
    href: "/shop/iphone/iphone-plus",
    blurb: "Plus",
    image: {
      src: "/images/iphone/plus-card.jpg",
      srcWebp: "/images/iphone/plus-card.webp",
      alt: "iPhone Plus",
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
