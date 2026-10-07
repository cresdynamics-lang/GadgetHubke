/** Pilot product catalog for Overview + Specs templates */

export type ProductStorage = {
  id: string;
  label: string;
  priceKes: number;
};

export type ProductColor = {
  id: string;
  label: string;
  /** Greyscale-safe swatch */
  hex: string;
  /** Product photo for this finish - swaps the main display when selected */
  imageSrc?: string;
};

export type ProductHighlight = {
  label: string;
  value: string;
};

export type ProductStory = {
  title: string;
  body: string;
};

/** Interactive “how it feels” panels on the PDP */
export type ProductExperience = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Short sensory line under the title */
  cue?: string;
  image?: { src: string; alt: string };
};

export type SpecRow = { label: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };

export type Product = {
  id: string;
  name: string;
  tagline: string;
  categoryLabel: string;
  categoryHref: string;
  overviewHref: string;
  specsHref: string;
  image: { src: string; srcWebp?: string; alt: string };
  /** Extra product photography for gallery */
  gallery?: { src: string; alt: string }[];
  storages: ProductStorage[];
  colors: ProductColor[];
  /** e.g. "Available in 2 finishes" */
  finishesLabel?: string;
  highlights: ProductHighlight[];
  stories: ProductStory[];
  /** Interactive Design / Camera / Everyday / Mac panels */
  experiences?: ProductExperience[];
  /** Large battery callout */
  batteryStat?: { value: string; label: string };
  /** Show Lipa installment line (months) */
  lipaMonths?: number;
  /** Sibling model link (e.g. Pro ↔ Pro Max) */
  related?: { label: string; href: string };
  apps: string[];
  inTheBox: string[];
  specs: SpecGroup[];
};

type FeelShot = { src: string; alt: string };

/** Shared Continuity story - iPhone capture → Mac motion, buy stays on GadgetHub */
function continuityFeel(image?: FeelShot): ProductExperience {
  return {
    id: "continuity",
    label: "Mac & Continuity",
    title: "Stills on iPhone. Motion on Mac.",
    cue: "One library. Two screens. No cable ritual.",
    body: "Shoot on iPhone, then open the same Photos library on Mac. Turn a burst of stills into a short cinematic clip, refine it at a desk, and send it back to Messages or AirDrop - the handset starts the memory; the Mac finishes the story.",
    image,
  };
}

function buildIphoneFeel(input: {
  design: Omit<ProductExperience, "id" | "label">;
  camera: Omit<ProductExperience, "id" | "label">;
  everyday: Omit<ProductExperience, "id" | "label">;
  continuityImage?: FeelShot;
}): ProductExperience[] {
  return [
    { id: "design", label: "In hand", ...input.design },
    { id: "camera", label: "Capture", ...input.camera },
    { id: "everyday", label: "Everyday", ...input.everyday },
    continuityFeel(input.continuityImage),
  ];
}

const duoGallery = [
  "/iPhone-Duo/iphone-duo-digitalmat-gallery-1-202609.jpeg",
  "/iPhone-Duo/iphone-duo-digitalmat-gallery-2-202609.jpeg",
  "/iPhone-Duo/iphone-duo-digitalmat-gallery-3-202609.jpeg",
  "/iPhone-Duo/iphone-duo-digitalmat-gallery-4-202609.jpeg",
  "/iPhone-Duo/iphone-duo-digitalmat-gallery-5-202609.jpeg",
  "/iPhone-Duo/iphone-duo-digitalmat-gallery-6-202609.jpeg",
] as const;

const pro18Gallery = [
  "/iPhone-18/iphone-18pro-digitalmat-gallery-1-202609.jpeg",
  "/iPhone-18/iphone-18pro-digitalmat-gallery-2-202609.jpeg",
  "/iPhone-18/iphone-18pro-digitalmat-gallery-3-202609.jpeg",
  "/iPhone-18/iphone-18pro-digitalmat-gallery-4-202609.jpeg",
  "/iPhone-18/iphone-18pro-digitalmat-gallery-5-202609.jpeg",
  "/iPhone-18/iphone-18pro-digitalmat-gallery-6-202609.jpeg",
] as const;

const airGallery = [
  "/iPhone-Air/iphone-air-digitalmat-gallery-1-202509.jpeg",
  "/iPhone-Air/iphone-air-digitalmat-gallery-2-202509.jpeg",
  "/iPhone-Air/iphone-air-digitalmat-gallery-3-202509.jpeg",
  "/iPhone-Air/iphone-air-digitalmat-gallery-4-202509.jpeg",
  "/iPhone-Air/iphone-air-digitalmat-gallery-5-202509.jpeg",
  "/iPhone-Air/iphone-air-digitalmat-gallery-6-202509.jpeg",
  "/iPhone-Air/iphone-air-digitalmat-gallery-7-202509.jpeg",
] as const;

const seventeenGallery = [
  "/iPhone-17/iphone-17-digitalmat-gallery-1-202509_GEO_US.jpeg",
  "/iPhone-17/iphone-17-digitalmat-gallery-2-202509.jpeg",
  "/iPhone-17/iphone-17-digitalmat-gallery-3-202509_GEO_US.jpeg",
  "/iPhone-17/iphone-17-digitalmat-gallery-4-202509.jpeg",
  "/iPhone-17/iphone-17-digitalmat-gallery-5-202509.jpeg",
  "/iPhone-17/iphone-17-digitalmat-gallery-6-202603.jpeg",
] as const;

const seventeenEGallery = [
  "/iPhone-17e/iphone-17e-digitalmat-gallery-1-202603_GEO_US.jpeg",
  "/iPhone-17e/iphone-17e-digitalmat-gallery-2-202603.jpeg",
  "/iPhone-17e/iphone-17e-digitalmat-gallery-3-202603.jpeg",
  "/iPhone-17e/iphone-17e-digitalmat-gallery-4-202603.jpeg",
  "/iPhone-17e/iphone-17e-digitalmat-gallery-5-202603.jpeg",
  "/iPhone-17e/iphone-17e-digitalmat-gallery-6-202603.jpeg",
] as const;

const sixteenGallery = [
  "/iPhone-16/iphone16-digitalmat-gallery-1-202409_GEO_US.jpeg",
  "/iPhone-16/iphone16-digitalmat-gallery-2-202409.jpeg",
  "/iPhone-16/iphone16-digitalmat-gallery-3-202409.jpeg",
  "/iPhone-16/iphone16-digitalmat-gallery-4-202409.jpeg",
  "/iPhone-16/iphone16-digitalmat-gallery-5-202409.jpeg",
  "/iPhone-16/iphone16-digitalmat-gallery-6-202409.jpeg",
] as const;

const pro18Colors: ProductColor[] = [
  { id: "burgundy", label: "Burgundy", hex: "#5C1A2E" },
  { id: "glacier", label: "Glacier", hex: "#A8C5D4" },
  { id: "silver", label: "Silver", hex: "#E3E4E5" },
  { id: "black", label: "Black", hex: "#1C1C1E" },
];

const pro18GalleryShots = (name: "iPhone 18 Pro" | "iPhone 18 Pro Max") =>
  [
    {
      src: pro18Gallery[0],
      alt: `${name} in Black, Silver, Glacier, and Burgundy finishes`,
    },
    {
      src: pro18Gallery[1],
      alt: `A hand holds ${name}, all-screen design with Dynamic Island centered near the top`,
    },
    {
      src: pro18Gallery[2],
      alt: `${name} in Black - Pro Fusion camera system, Apple logo, and all-screen front with Dynamic Island`,
    },
    {
      src: pro18Gallery[3],
      alt: `${name} in Glacier - Pro Fusion camera system with three lenses, flash, microphone, and LiDAR Scanner`,
    },
    {
      src: pro18Gallery[4],
      alt: `${name} in Silver - thin construction with side button, Camera Control, and raised Pro Fusion camera system`,
    },
    {
      src: pro18Gallery[5],
      alt: "iPhone 18 Pro Max with MagSafe Charger in Glacier, FineWoven Wallet in navy, and Crossbody Strap in burgundy on a magenta Silicone Case with burgundy iPhone 18 Pro",
    },
  ] as const;

export const products: Product[] = [
  {
    id: "iphone-duo",
    name: "iPhone Duo",
    tagline:
      "7.6-inch Super Retina XDR folding display. Reimagined for productivity, multitasking, and immersive viewing.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-duo",
    specsHref: "/shop/iphone/iphone-duo/specs",
    image: {
      src: duoGallery[0],
      alt: "iPhone Duo",
    },
    gallery: duoGallery.map((src, i) => ({
      src,
      alt: `iPhone Duo - gallery ${i + 1}`,
    })),
    finishesLabel: "Available in 2 finishes",
    storages: [
      { id: "256", label: "256GB", priceKes: 279999 },
      { id: "512", label: "512GB", priceKes: 319999 },
      { id: "1tb", label: "1TB", priceKes: 369999 },
    ],
    colors: [
      { id: "star-white", label: "Star White", hex: "#F4F1EA" },
      { id: "night-sky", label: "Night Sky", hex: "#0C0C0E" },
    ],
    lipaMonths: 24,
    highlights: [
      { label: "Inner display", value: "7.6″ XDR" },
      { label: "Outer display", value: "5.4″ XDR" },
      { label: "Chip", value: "A20 Pro" },
      { label: "Camera", value: "48MP Dual Fusion" },
      { label: "Design", value: "Grade 5 titanium" },
      { label: "Battery", value: "Dual-battery" },
    ],
    stories: [
      {
        title: "Folding Super Retina XDR",
        body: "A 7.6-inch Super Retina XDR folding display with nano-texture, paired with a 5.4-inch Super Retina XDR outer display - built for immersive viewing and everyday reach.",
      },
      {
        title: "Durability by design",
        body: "Grade 5 titanium frame and hinge cover, Ceramic Shield 2 front, and Ceramic Shield back. Engineered to take on the day.",
      },
      {
        title: "Reimagined iOS",
        body: "Experiences tuned for enhanced productivity, multitasking, and immersive viewing across the inner and outer displays.",
      },
      {
        title: "48MP Dual Fusion camera",
        body: "A Dual Fusion camera system with all-new ways to shoot - including Smart Take that captures pictures automatically.",
      },
      {
        title: "A20 Pro. Vapor-cooled.",
        body: "Vapor-cooled for pro performance. The A20 Pro chip is purpose-built for AI workloads.",
      },
    ],
    batteryStat: {
      value: "Up to 44 hrs",
      label:
        "video playback on the outer display. Up to 31 hours when using the inner display. Dual-battery system. All-day power.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone Duo", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          { label: "Colors", value: "Star White, Night Sky" },
          {
            label: "Materials",
            value: "Grade 5 titanium frame and hinge cover; Ceramic Shield 2 front; Ceramic Shield back",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Inner",
            value: "7.6-inch Super Retina XDR folding display with nano-texture",
          },
          { label: "Outer", value: "5.4-inch Super Retina XDR display" },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A20 Pro" },
          { label: "Cooling", value: "Vapor-cooled for pro performance" },
        ],
      },
      {
        title: "Camera",
        rows: [
          { label: "System", value: "48MP Dual Fusion camera system" },
          { label: "Features", value: "Smart Take and advanced capture modes" },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          {
            label: "System",
            value: "Dual-battery system - all-day power",
          },
          {
            label: "Video playback",
            value:
              "Up to 31 hours (inner display); up to 44 hours (outer display)",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB, 1TB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone Duo, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Gadget Hub Investments does not provide any additional warranty beyond the manufacturer’s terms.",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-pro",
    name: "iPhone 18 Pro",
    tagline:
      "6.3‑inch ProMotion display. Ultimate Pro camera system. A20 Pro chip - total AI powerhouse.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-pro",
    specsHref: "/shop/iphone/iphone-pro/specs",
    image: {
      src: pro18Gallery[0],
      alt: "iPhone 18 Pro in four finishes",
    },
    gallery: [...pro18GalleryShots("iPhone 18 Pro")],
    finishesLabel: "Available in 4 finishes",
    storages: [
      { id: "256", label: "256GB", priceKes: 184999 },
      { id: "512", label: "512GB", priceKes: 209999 },
      { id: "1tb", label: "1TB", priceKes: 239999 },
    ],
    colors: pro18Colors,
    lipaMonths: 24,
    related: {
      label: "iPhone 18 Pro Max",
      href: "/shop/iphone/iphone-pro-max",
    },
    experiences: buildIphoneFeel({
      design: {
        title: "Forged aluminum. Solid in the hand.",
        cue: "Weight that reads premium - not heavy.",
        body: "The unibody settles into your grip with Ceramic Shield 2 up front. Side button, Camera Control, and Action button sit where your thumb expects them - pro tools without a bulky chassis.",
        image: {
          src: pro18Gallery[0],
          alt: "iPhone 18 Pro finishes in hand context",
        },
      },
      camera: {
        title: "Variable aperture. Pro on demand.",
        cue: "Low light. Depth. Reach - without hunting menus.",
        body: "48MP Fusion with variable aperture and 8x optical‑quality zoom. Center Stage on the front expands the frame for groups. Shoot now; refine later with Apple Intelligence tools.",
        image: {
          src: pro18Gallery[3],
          alt: "iPhone 18 Pro camera system close-up",
        },
      },
      everyday: {
        title: "A20 Pro through a full Nairobi day.",
        cue: "Games, maps, WhatsApp - still responsive at dusk.",
        body: "Vapor‑cooled performance and Apple Intelligence keep Writing Tools, Clean Up, and Siri AI ready when you are. Dynamic Island keeps Live Activities glancing‑distance away.",
        image: {
          src: pro18Gallery[1],
          alt: "iPhone 18 Pro in everyday use",
        },
      },
      continuityImage: {
        src: pro18Gallery[5],
        alt: "iPhone 18 Pro with MagSafe accessories",
      },
    }),
    highlights: [
      { label: "Display", value: "6.3″ ProMotion" },
      { label: "Chip", value: "A20 Pro" },
      { label: "Camera", value: "48MP Fusion" },
      { label: "Front", value: "18MP Center Stage" },
      { label: "Design", value: "Forged aluminum" },
      { label: "Battery", value: "Up to 36 hrs" },
    ],
    stories: [
      {
        title: "Design. Our finest unibody.",
        body: "Forged aluminum unibody with Ceramic Shield 2 front and Ceramic Shield back. Four finishes - Burgundy, Glacier, Silver, Black - with color-matched back glass. Camera Control and Action button keep your favorites one press away.",
      },
      {
        title: "6.3″ Super Retina XDR",
        body: "Brilliant ProMotion display up to 120Hz. Redesigned Dynamic Island shows up to three Live Activities at once - sports, navigation, music - without leaving the moment.",
      },
      {
        title: "Ultimate Pro camera system",
        body: "48MP Fusion Main with variable aperture (ƒ/1.48-ƒ/4.0) for low light and depth of field. 48MP Ultra Wide and Telephoto. Up to 8x optical‑quality zoom. 18MP Center Stage front camera frames more people, more flexibly.",
      },
      {
        title: "A20 Pro. Total AI powerhouse.",
        body: "Next‑generation vapor chamber. Dual 16‑core Neural Engine. Apple Intelligence and Siri AI - more personal, more powerful.",
      },
    ],
    batteryStat: {
      value: "Up to 36 hrs",
      label:
        "of video playback. Faster wired charging - up to 50% in around 15 minutes with a compatible adapter.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone 18 Pro", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          { label: "Colors", value: "Burgundy, Glacier, Silver, Black" },
          {
            label: "Materials",
            value:
              "Forged aluminum unibody; Ceramic Shield 2 front; Ceramic Shield back",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Size",
            value: "6.3‑inch Super Retina XDR with ProMotion up to 120Hz",
          },
          {
            label: "Dynamic Island",
            value: "Up to three Live Activities at once",
          },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A20 Pro" },
          { label: "Neural Engine", value: "Dual 16‑core" },
          { label: "Cooling", value: "Next‑generation vapor chamber" },
        ],
      },
      {
        title: "Camera",
        rows: [
          {
            label: "Main",
            value:
              "48MP Fusion with variable aperture ƒ/1.48-ƒ/4.0; 24/48 mm (1x/2x)",
          },
          {
            label: "Ultra Wide",
            value: "48MP Fusion Ultra Wide; 13 mm (.5x/macro)",
          },
          {
            label: "Telephoto",
            value: "48MP Fusion Telephoto; 100/200 mm (4x/8x optical‑quality)",
          },
          {
            label: "Front",
            value: "18MP Center Stage front camera",
          },
        ],
      },
      {
        title: "Controls",
        rows: [
          { label: "Camera Control", value: "Capture, record, and adjust settings" },
          {
            label: "Action button",
            value: "Customizable - Silent, Translate, Shortcut, and more",
          },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          { label: "Video playback", value: "Up to 36 hours" },
          {
            label: "Charging",
            value:
              "Faster wired charging - up to 50% in around 15 minutes with a compatible adapter; MagSafe / Qi wireless where supported",
          },
        ],
      },
      {
        title: "Apple Intelligence",
        rows: [
          {
            label: "Features",
            value: "Apple Intelligence and Siri AI - more personal, more powerful",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB, 1TB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone 18 Pro, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Claims follow manufacturer terms and GadgetHub’s Return & Refund Policy - not AppleCare retail terms.",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-pro-max",
    name: "iPhone 18 Pro Max",
    tagline:
      "6.9‑inch ProMotion display. Longest battery life in an iPhone. Ultimate Pro camera system.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-pro-max",
    specsHref: "/shop/iphone/iphone-pro-max/specs",
    image: {
      src: pro18Gallery[0],
      alt: "iPhone 18 Pro Max in four finishes",
    },
    gallery: [...pro18GalleryShots("iPhone 18 Pro Max")],
    finishesLabel: "Available in 4 finishes",
    storages: [
      { id: "256", label: "256GB", priceKes: 199999 },
      { id: "512", label: "512GB", priceKes: 224999 },
      { id: "1tb", label: "1TB", priceKes: 254999 },
    ],
    colors: pro18Colors,
    lipaMonths: 24,
    related: {
      label: "iPhone 18 Pro",
      href: "/shop/iphone/iphone-pro",
    },
    experiences: buildIphoneFeel({
      design: {
        title: "The larger Pro canvas.",
        cue: "6.9″ that still feels one‑handed at the edges.",
        body: "A bigger Super Retina XDR with ProMotion up to 120Hz. Forged aluminum, Ceramic Shield 2, Camera Control under the thumb - immersive without tipping into awkward.",
        image: {
          src: pro18Gallery[1],
          alt: "Hand holding iPhone 18 Pro Max",
        },
      },
      camera: {
        title: "Ultimate Pro capture.",
        cue: "ƒ/1.48 light to ƒ/4.0 depth - then 8x reach.",
        body: "All‑48MP rear system with variable aperture, Ultra Wide, and Telephoto. Dual Capture and ProRes‑class tools when you need cinema energy after the fact.",
        image: {
          src: pro18Gallery[3],
          alt: "iPhone 18 Pro Max Pro Fusion camera",
        },
      },
      everyday: {
        title: "Longest battery. Quiet confidence.",
        cue: "Up to 45 hours of video - leave the power bank at home.",
        body: "A20 Pro and a next‑gen vapor chamber keep gaming and on‑device AI smooth. Apple Intelligence drafts, cleans, and frames while you stay in the conversation.",
        image: {
          src: pro18Gallery[2],
          alt: "iPhone 18 Pro Max in Black",
        },
      },
      continuityImage: {
        src: pro18Gallery[5],
        alt: "iPhone 18 Pro Max MagSafe accessories",
      },
    }),
    highlights: [
      { label: "Display", value: "6.9″ ProMotion" },
      { label: "Chip", value: "A20 Pro" },
      { label: "Camera", value: "48MP Fusion" },
      { label: "Front", value: "18MP Center Stage" },
      { label: "Design", value: "Forged aluminum" },
      { label: "Battery", value: "Up to 45 hrs" },
    ],
    stories: [
      {
        title: "Design. Our finest unibody.",
        body: "Forged aluminum unibody with Ceramic Shield 2 front and Ceramic Shield back. Four gorgeous finishes - Burgundy, Glacier, Silver, Black - with color-matched back glass. Camera Control captures in an instant; Action button launches Silent mode, Translate, Shortcut, and more.",
      },
      {
        title: "6.9″ Super Retina XDR",
        body: "The larger Pro canvas - brilliant Super Retina XDR with ProMotion up to 120Hz. Redesigned Dynamic Island shows up to three Live Activities at once so scores, turns, and tracks stay in view.",
      },
      {
        title: "Ultimate Pro camera system",
        body: "All 48MP rear cameras. Variable aperture on the Fusion Main (ƒ/1.48 maximum light through ƒ/4.0 maximum depth) for low-light photos, video, and depth of field. Ultra Wide for landscapes and macro. Telephoto with 8x optical‑quality zoom - 16x total optical zoom range. 18MP Center Stage front camera for flexible framing.",
      },
      {
        title: "Pro controls. Photographic Styles.",
        body: "Bring aperture, shutter speed, white balance, and histogram to the top of Camera. Customize texture and grain. Intelligent editing with Spatial Reframing, Extend, and Clean Up - powered by Apple Intelligence.",
      },
      {
        title: "A20 Pro. Vapor-cooled.",
        body: "Next‑generation vapor chamber with far more surface area to dissipate heat. Dual 16‑core Neural Engine. Built for intensive AI workloads, gaming, and pro video - including ProRes RAW, Apple Log 2, and Dual Capture.",
      },
      {
        title: "Apple Intelligence and Siri AI",
        body: "More personal. More powerful. Conversational assistance, personal context across your apps, and systemwide writing help - rolling out in English.",
      },
    ],
    batteryStat: {
      value: "Up to 45 hrs",
      label:
        "of video playback - the longest battery life in an iPhone. Up to 30 hours of use per charge. Faster wired charging - up to 50% in around 15 minutes with a compatible adapter.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone 18 Pro Max", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          { label: "Colors", value: "Burgundy, Glacier, Silver, Black" },
          {
            label: "Materials",
            value:
              "Forged aluminum unibody; Ceramic Shield 2 front; Ceramic Shield back",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Size",
            value: "6.9‑inch Super Retina XDR with ProMotion up to 120Hz",
          },
          {
            label: "Dynamic Island",
            value: "Up to three Live Activities at once",
          },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A20 Pro" },
          { label: "Neural Engine", value: "Dual 16‑core" },
          {
            label: "Cooling",
            value: "Next‑generation vapor chamber for sustained pro performance",
          },
        ],
      },
      {
        title: "Camera",
        rows: [
          {
            label: "Main",
            value:
              "48MP Fusion with variable aperture ƒ/1.48, ƒ/1.8, ƒ/2.8, ƒ/4.0; 24/48 mm (1x/2x)",
          },
          {
            label: "Ultra Wide",
            value: "48MP Fusion Ultra Wide; 13 mm (.5x/macro); ƒ/2.2",
          },
          {
            label: "Telephoto",
            value:
              "48MP Fusion Telephoto; 100/200 mm (4x/8x optical‑quality); ƒ/2.8",
          },
          {
            label: "Front",
            value: "18MP Center Stage front camera",
          },
          {
            label: "Video",
            value:
              "ProRes RAW, Apple Log 2, Dual Capture, 4K Dolby Vision up to 120 fps",
          },
        ],
      },
      {
        title: "Controls",
        rows: [
          { label: "Camera Control", value: "Capture, record, and adjust settings" },
          {
            label: "Action button",
            value: "Customizable - Silent, Translate, Shortcut, and more",
          },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          {
            label: "Video playback",
            value: "Up to 45 hours - longest battery life in an iPhone",
          },
          {
            label: "Use per charge",
            value: "Up to 30 hours of typical use",
          },
          {
            label: "Charging",
            value:
              "Faster wired charging - up to 50% in around 15 minutes with a compatible adapter; MagSafe / Qi wireless where supported",
          },
        ],
      },
      {
        title: "Apple Intelligence",
        rows: [
          {
            label: "Features",
            value: "Apple Intelligence and Siri AI - more personal, more powerful",
          },
        ],
      },
      {
        title: "Connectivity",
        rows: [
          { label: "Wireless", value: "Wi‑Fi 7, Bluetooth, 5G, eSIM" },
          {
            label: "Safety",
            value:
              "Messages via satellite, Emergency SOS via satellite, Crash Detection (where available)",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB, 1TB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone 18 Pro Max, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Claims follow manufacturer terms and GadgetHub’s Return & Refund Policy - not AppleCare retail terms.",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-air",
    name: "iPhone Air",
    tagline:
      "Superthin, ultralight titanium. 6.5‑inch ProMotion display. Pro performance in an incredibly light design.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-air",
    specsHref: "/shop/iphone/iphone-air/specs",
    image: {
      src: airGallery[0],
      alt: "iPhone Air in Sky Blue - thin titanium profile",
    },
    gallery: [
      {
        src: airGallery[0],
        alt: "Hand holds iPhone Air from the bottom - very thin titanium side profile in Sky Blue with Side button, Camera Control, and raised camera lens",
      },
      {
        src: airGallery[1],
        alt: "iPhone Air in Sky Blue - Fusion camera, all-screen front with Dynamic Island, titanium sides, Action button, volume, Side button, and Camera Control",
      },
      {
        src: airGallery[2],
        alt: "iPhone Air in Cloud White - Fusion camera system with transparent housing, single lens, microphone, and flash",
      },
      {
        src: airGallery[3],
        alt: "iPhone Air in Light Gold - Fusion camera at top, Apple logo centered, titanium side exterior, Side button, Camera Control, and raised camera lens",
      },
      {
        src: airGallery[4],
        alt: "iPhone Air in Light Gold - back exterior with Fusion camera and thin side profile with Side button and Camera Control",
      },
      {
        src: airGallery[5],
        alt: "iPhone Air with MagSafe Battery attached from below the Fusion camera to the bottom of the phone",
      },
      {
        src: airGallery[6],
        alt: "iPhone Air in Sky Blue with clear case and matching Sky Blue Crossbody strap",
      },
    ],
    finishesLabel: "Available in 4 finishes",
    storages: [
      { id: "256", label: "256GB", priceKes: 154999 },
      { id: "512", label: "512GB", priceKes: 174999 },
      { id: "1tb", label: "1TB", priceKes: 199999 },
    ],
    colors: [
      { id: "sky-blue", label: "Sky Blue", hex: "#A8C8E0" },
      { id: "cloud-white", label: "Cloud White", hex: "#F5F5F0" },
      { id: "space-black", label: "Space Black", hex: "#1C1C1E" },
      { id: "light-gold", label: "Light Gold", hex: "#E8D5B5" },
    ],
    lipaMonths: 24,
    related: {
      label: "iPhone 18 Pro",
      href: "/shop/iphone/iphone-pro",
    },
    experiences: buildIphoneFeel({
      design: {
        title: "Almost disappears. Still present.",
        cue: "5.6 mm. 165 grams. Titanium that feels inevitable.",
        body: "Hold it at the edge and the thinness reads first - then the 6.5″ ProMotion display fills your field. Grade 5 titanium, Ceramic Shield 2, Camera Control and Action button exactly where muscle memory wants them.",
        image: {
          src: airGallery[0],
          alt: "Hand holds thin iPhone Air profile",
        },
      },
      camera: {
        title: "Center Stage and Fusion in one pocket.",
        cue: "Group selfies that expand. Dual Capture that tells both sides.",
        body: "18MP Center Stage up front, 48MP Fusion with 2x optical‑quality zoom on the back. Frame, rotate, and shoot without wrestling the phone - then finish the edit with Intelligence tools.",
        image: {
          src: airGallery[2],
          alt: "iPhone Air Fusion camera",
        },
      },
      everyday: {
        title: "Pro within thin.",
        cue: "A19 Pro for games and streams - without the brick.",
        body: "All‑day battery, MagSafe when you want a top‑up, and Apple Intelligence that drafts and cleans while you stay light on your feet.",
        image: {
          src: airGallery[1],
          alt: "iPhone Air everyday front and back",
        },
      },
      continuityImage: {
        src: airGallery[5],
        alt: "iPhone Air with MagSafe Battery",
      },
    }),
    highlights: [
      { label: "Display", value: "6.5″ ProMotion" },
      { label: "Chip", value: "A19 Pro" },
      { label: "Camera", value: "48MP Fusion" },
      { label: "Front", value: "18MP Center Stage" },
      { label: "Design", value: "Titanium · 5.6 mm" },
      { label: "Battery", value: "Up to 27 hrs" },
    ],
    stories: [
      {
        title: "So this is what the future feels like.",
        body: "At 5.6 mm and just 165 grams, iPhone Air nearly disappears in your hand - even with a large 6.5‑inch Super Retina XDR display and A19 Pro inside. Grade 5 titanium frame with 80 percent recycled titanium. Ceramic Shield 2 front with 3x better scratch resistance; Ceramic Shield back for crack resistance.",
      },
      {
        title: "Immersive pro display",
        body: "6.5‑inch Super Retina XDR with ProMotion up to 120Hz, up to 3000 nits peak brightness, and better anti‑reflection. Dynamic Island keeps Live Activities in view without breaking the all-screen design.",
      },
      {
        title: "18MP Center Stage front camera",
        body: "Flexible ways to frame your shot. Expand the field of view and rotate from portrait to landscape without moving your iPhone. Smarter group selfies. Dual Capture for simultaneous front and rear video. Ultra‑stabilized 4K 60 fps Dolby Vision.",
      },
      {
        title: "48MP Fusion Main camera",
        body: "The power of two high‑end cameras in one - shoot in 48MP for detail or 24MP by default, with 2x optical‑quality Telephoto zoom. Next‑generation portraits, Photographic Styles, Night mode, and Camera Control for the shot you need, faster.",
      },
      {
        title: "A19 Pro. Pro within thin.",
        body: "A19 Pro with a 5‑core GPU delivers pro performance for demanding tasks and advanced gaming - without giving up the ultralight design.",
      },
      {
        title: "iOS and Apple Intelligence",
        body: "A thoughtfully refined software experience with smarter everyday features - from Writing Tools and Clean Up to visual intelligence - so thin never means less capable.",
      },
    ],
    batteryStat: {
      value: "Up to 27 hrs",
      label:
        "of video playback. All‑day battery life in a superthin design. Pair with MagSafe Battery when you want even more power on the go.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone Air", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          {
            label: "Colors",
            value: "Sky Blue, Cloud White, Space Black, Light Gold",
          },
          {
            label: "Materials",
            value:
              "Grade 5 titanium frame; Ceramic Shield 2 front; Ceramic Shield back",
          },
          {
            label: "Size and weight",
            value: "5.6 mm thin; 165 grams",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Size",
            value:
              "6.5‑inch Super Retina XDR with ProMotion up to 120Hz; up to 3000 nits peak brightness",
          },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A19 Pro" },
          { label: "GPU", value: "5‑core GPU" },
        ],
      },
      {
        title: "Camera",
        rows: [
          {
            label: "Main",
            value:
              "48MP Fusion Main with 2x optical‑quality zoom (24MP default / 48MP)",
          },
          {
            label: "Front",
            value:
              "18MP Center Stage - flexible framing, group selfies, Dual Capture",
          },
          {
            label: "Video",
            value: "Up to 4K 60 fps Dolby Vision; Action mode; Audio Mix",
          },
        ],
      },
      {
        title: "Controls",
        rows: [
          { label: "Camera Control", value: "Capture, record, and adjust settings" },
          {
            label: "Action button",
            value: "Customizable - Silent, Translation, Shortcuts, and more",
          },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          {
            label: "Video playback",
            value: "Up to 27 hours",
          },
          {
            label: "Charging",
            value: "USB-C; MagSafe / Qi wireless where supported",
          },
        ],
      },
      {
        title: "Apple Intelligence",
        rows: [
          {
            label: "Features",
            value:
              "Apple Intelligence - Writing Tools, Clean Up, visual intelligence, and more",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB, 1TB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone Air, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Claims follow manufacturer terms and GadgetHub’s Return & Refund Policy - not AppleCare retail terms.",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    tagline:
      "6.3‑inch ProMotion display. 48MP Dual Fusion cameras. A19 chip - all‑day power in aluminum and glass.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-17",
    specsHref: "/shop/iphone/iphone-17/specs",
    image: {
      src: seventeenGallery[0],
      alt: "iPhone 17 with all-screen display and Dynamic Island",
    },
    gallery: [
      {
        src: seventeenGallery[0],
        alt: "A hand holds iPhone 17 - all-screen display, Dynamic Island centered near the top, rounded corners",
      },
      {
        src: seventeenGallery[1],
        alt: "iPhone 17 in Lavender - Dual Fusion camera, all-screen front with Dynamic Island, Action button, volume, Side button, and Camera Control",
      },
      {
        src: seventeenGallery[2],
        alt: "iPhone 17 in Mist Blue - Dual Fusion camera system with two lenses, microphone, transparent housing, and flash",
      },
      {
        src: seventeenGallery[3],
        alt: "iPhone 17 in Sage - Dual Fusion camera in top left, Apple logo centered, thin side profile with Side button, Camera Control, and raised camera system",
      },
      {
        src: seventeenGallery[4],
        alt: "iPhone 17 in Sage - back exterior with Dual Fusion camera and thin side profile with Side button and Camera Control",
      },
      {
        src: seventeenGallery[5],
        alt: "iPhone 17 accessories - vanilla Silicone Case on White, moss Silicone Case with FineWoven Wallet on Sage, and anchor blue Silicone Case with Crossbody Strap on Mist Blue",
      },
    ],
    finishesLabel: "Available in 5 finishes",
    storages: [
      { id: "256", label: "256GB", priceKes: 129999 },
      { id: "512", label: "512GB", priceKes: 149999 },
    ],
    colors: [
      { id: "lavender", label: "Lavender", hex: "#C8B8D8" },
      { id: "mist-blue", label: "Mist Blue", hex: "#A8C4D4" },
      { id: "white", label: "White", hex: "#F5F5F7" },
      { id: "sage", label: "Sage", hex: "#A8B89A" },
      { id: "black", label: "Black", hex: "#1C1C1E" },
    ],
    lipaMonths: 24,
    related: {
      label: "iPhone Air",
      href: "/shop/iphone/iphone-air",
    },
    experiences: buildIphoneFeel({
      design: {
        title: "Contoured. Contained. Comfortable.",
        cue: "Thinner borders. Ceramic Shield 2 that shrugs off the day.",
        body: "Aluminum and glass in five finishes. Action button and Camera Control under the fingers - the phone feels finished the first time you unlock it.",
        image: {
          src: seventeenGallery[0],
          alt: "Hand holds iPhone 17",
        },
      },
      camera: {
        title: "Dual Fusion. Double the starting clarity.",
        cue: "48MP Main and Ultra Wide - detail by default.",
        body: "Center Stage expands for group selfies. Dual Capture records you and the room. 2x optical‑quality zoom keeps subjects close without the soft crop.",
        image: {
          src: seventeenGallery[2],
          alt: "iPhone 17 Dual Fusion camera",
        },
      },
      everyday: {
        title: "A19 through work and weekend.",
        cue: "Up to 30 hours of video - maps, Matatu playlists, late calls.",
        body: "Apple Intelligence helps draft replies and clean photos while ProMotion keeps scrolling smooth. It feels quick without asking you to think about the chip.",
        image: {
          src: seventeenGallery[1],
          alt: "iPhone 17 in Lavender everyday angles",
        },
      },
      continuityImage: {
        src: seventeenGallery[5],
        alt: "iPhone 17 with MagSafe accessories",
      },
    }),
    highlights: [
      { label: "Display", value: "6.3″ ProMotion" },
      { label: "Chip", value: "A19" },
      { label: "Camera", value: "48MP Dual Fusion" },
      { label: "Front", value: "18MP Center Stage" },
      { label: "Design", value: "Aluminum & glass" },
      { label: "Battery", value: "Up to 30 hrs" },
    ],
    stories: [
      {
        title: "Looks - and stays - beautiful.",
        body: "Contoured edges, thinner borders, and Ceramic Shield 2 on the front with 3x better scratch resistance. Aluminum and glass design in five finishes - Lavender, Mist Blue, White, Sage, and Black. Camera Control and Action button keep capture and shortcuts close at hand.",
      },
      {
        title: "6.3″ Super Retina XDR",
        body: "Our best everyday ProMotion display up to 120Hz - smoother scrolling, more immersive gaming, up to 3000 nits peak brightness, and fewer reflections. Dynamic Island brings Live Activities and alerts forward.",
      },
      {
        title: "18MP Center Stage front camera",
        body: "Flexible ways to frame your shot. Expand the field of view and rotate from portrait to landscape without moving your iPhone. Smarter group selfies. Dual Capture for simultaneous front and rear video.",
      },
      {
        title: "48MP Dual Fusion camera system",
        body: "Super‑high‑resolution shots by default. Fusion Main with 2x optical‑quality zoom, plus a 48MP Fusion Ultra Wide - stunning detail up close or far away, indoors and out.",
      },
      {
        title: "A19 chip. All‑day battery.",
        body: "A19 with a 5‑core GPU powers everything you do on iPhone. Up to 30 hours of video playback so the day doesn’t outlast the battery.",
      },
      {
        title: "iOS and Apple Intelligence",
        body: "A new look with smarter everyday features - Writing Tools, Clean Up, visual intelligence, and more - so your iPhone stays helpful from morning to night.",
      },
    ],
    batteryStat: {
      value: "Up to 30 hrs",
      label: "of video playback. All‑day battery life for streaming, gaming, and browsing.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone 17", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          {
            label: "Colors",
            value: "Lavender, Mist Blue, White, Sage, Black",
          },
          {
            label: "Materials",
            value: "Aluminum and glass; Ceramic Shield 2 front",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Size",
            value:
              "6.3‑inch Super Retina XDR with ProMotion up to 120Hz; up to 3000 nits peak brightness",
          },
          {
            label: "Dynamic Island",
            value: "Live Activities and alerts",
          },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A19" },
          { label: "GPU", value: "5‑core GPU" },
        ],
      },
      {
        title: "Camera",
        rows: [
          {
            label: "Main",
            value: "48MP Fusion Main with 2x optical‑quality zoom",
          },
          {
            label: "Ultra Wide",
            value: "48MP Fusion Ultra Wide (24MP by default)",
          },
          {
            label: "Front",
            value:
              "18MP Center Stage - flexible framing, group selfies, Dual Capture",
          },
          {
            label: "Video",
            value: "Up to 4K 60 fps Dolby Vision; ultra‑stabilized video",
          },
        ],
      },
      {
        title: "Controls",
        rows: [
          { label: "Camera Control", value: "Capture, record, and adjust settings" },
          {
            label: "Action button",
            value: "Customizable - Silent, Translation, Shortcuts, and more",
          },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          { label: "Video playback", value: "Up to 30 hours" },
          {
            label: "Charging",
            value: "USB-C; MagSafe / Qi wireless where supported",
          },
        ],
      },
      {
        title: "Apple Intelligence",
        rows: [
          {
            label: "Features",
            value:
              "Apple Intelligence - Writing Tools, Clean Up, visual intelligence, and more",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone 17, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Claims follow manufacturer terms and GadgetHub’s Return & Refund Policy - not AppleCare retail terms.",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-17e",
    name: "iPhone 17e",
    tagline:
      "6.1‑inch Super Retina XDR. A19 chip. 48MP Fusion camera. A whole lot of iPhone - for a lot less.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-17e",
    specsHref: "/shop/iphone/iphone-17e/specs",
    image: {
      src: seventeenEGallery[0],
      alt: "iPhone 17e in Soft Pink, White, and Black",
    },
    gallery: [
      {
        src: seventeenEGallery[0],
        alt: "iPhone 17e in Black, White, and Soft Pink - back and front views",
      },
      {
        src: seventeenEGallery[1],
        alt: "A hand holds iPhone 17e in Soft Pink - Super Retina XDR display with notch",
      },
      {
        src: seventeenEGallery[2],
        alt: "iPhone 17e in Soft Pink - front Super Retina XDR display and back with 48MP Fusion camera",
      },
      {
        src: seventeenEGallery[3],
        alt: "iPhone 17e in White - close-up of 48MP Fusion camera, flash, and microphone",
      },
      {
        src: seventeenEGallery[4],
        alt: "iPhone 17e in Black - back exterior with Fusion camera and thin side profile with Side button",
      },
      {
        src: seventeenEGallery[5],
        alt: "iPhone 17e accessories - midnight purple FineWoven Wallet on Soft Pink, MagSafe charger on Black, and Clear Case with MagSafe on White",
      },
    ],
    finishesLabel: "Available in 3 finishes",
    storages: [
      { id: "256", label: "256GB", priceKes: 94999 },
      { id: "512", label: "512GB", priceKes: 109999 },
    ],
    colors: [
      { id: "soft-pink", label: "Soft Pink", hex: "#F2D6D8" },
      { id: "white", label: "White", hex: "#F5F5F7" },
      { id: "black", label: "Black", hex: "#1C1C1E" },
    ],
    lipaMonths: 24,
    related: {
      label: "iPhone 17",
      href: "/shop/iphone/iphone-17",
    },
    experiences: buildIphoneFeel({
      design: {
        title: "A good buy you still want to hold.",
        cue: "Soft Pink, White, or Black - aluminum that feels finished.",
        body: "Ceramic Shield 2, Face ID, Action button, USB‑C, and MagSafe. It doesn’t shout “budget” - it just fits the day.",
        image: {
          src: seventeenEGallery[0],
          alt: "iPhone 17e in three finishes",
        },
      },
      camera: {
        title: "48MP Fusion. Portraits that pop.",
        cue: "2x Telephoto quality without a second body.",
        body: "Next‑generation portraits and a 12MP front camera for clear calls and selfies. Snap on MagSafe accessories when you want wallet or juice with you.",
        image: {
          src: seventeenEGallery[3],
          alt: "iPhone 17e Fusion camera close-up",
        },
      },
      everyday: {
        title: "A19 for games, streams, and space.",
        cue: "256GB from the start - room for what matters.",
        body: "Up to 26 hours of video playback. Fast USB‑C and MagSafe charging. Apple Intelligence for drafting and cleanup when you’re mid‑commute.",
        image: {
          src: seventeenEGallery[1],
          alt: "Hand holds iPhone 17e Soft Pink",
        },
      },
      continuityImage: {
        src: seventeenEGallery[5],
        alt: "iPhone 17e MagSafe accessories",
      },
    }),
    highlights: [
      { label: "Display", value: "6.1″ XDR" },
      { label: "Chip", value: "A19" },
      { label: "Camera", value: "48MP Fusion" },
      { label: "Front", value: "12MP" },
      { label: "Storage", value: "From 256GB" },
      { label: "Battery", value: "Up to 26 hrs" },
    ],
    stories: [
      {
        title: "Designed to go the distance.",
        body: "Durable aluminum frame with Ceramic Shield 2 on the front - 3x better scratch resistance. Stunning 6.1‑inch Super Retina XDR display with a seven‑layer antireflective coating. Face ID, Action button, USB‑C, and MagSafe wireless charging up to 15W.",
      },
      {
        title: "48MP Fusion camera",
        body: "Capture frame‑worthy shots with next‑generation portraits. Optical‑quality 2x Telephoto zoom. 12MP front camera for clear selfies and video calls.",
      },
      {
        title: "A19 chip. Blasts and lasts.",
        body: "Latest‑generation A19 with a 4‑core GPU - powerful AAA gaming, 4K streaming, and more. C1X modem for fast, efficient connectivity. Up to 26 hours of video playback.",
      },
      {
        title: "256GB starting storage",
        body: "More space for what matters - photos, videos, apps, and downloads - right from the base model.",
      },
      {
        title: "iOS and Apple Intelligence",
        body: "A new look with smarter everyday features - Writing Tools, Clean Up, visual intelligence, and more - so your iPhone stays helpful all day.",
      },
    ],
    batteryStat: {
      value: "Up to 26 hrs",
      label:
        "of video playback. Fast charging with USB‑C - and now with MagSafe. Up to 50% charge in 30 minutes with a compatible 20W adapter or higher.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone 17e", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          { label: "Colors", value: "Soft Pink, White, Black" },
          {
            label: "Materials",
            value: "Aluminum frame; Ceramic Shield 2 front",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Size",
            value:
              "6.1‑inch Super Retina XDR with seven‑layer antireflective coating",
          },
          { label: "Security", value: "Face ID" },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A19" },
          { label: "GPU", value: "4‑core GPU" },
          { label: "Modem", value: "C1X" },
        ],
      },
      {
        title: "Camera",
        rows: [
          {
            label: "Main",
            value: "48MP Fusion with optical‑quality 2x Telephoto",
          },
          { label: "Front", value: "12MP front camera" },
          {
            label: "Features",
            value: "Next‑generation portraits",
          },
        ],
      },
      {
        title: "Controls",
        rows: [
          {
            label: "Action button",
            value:
              "Customizable - Silent, Translation, visual intelligence, and more",
          },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          { label: "Video playback", value: "Up to 26 hours" },
          {
            label: "Charging",
            value:
              "USB‑C; MagSafe wireless up to 15W; up to 50% in 30 minutes with a compatible 20W adapter or higher",
          },
        ],
      },
      {
        title: "Apple Intelligence",
        rows: [
          {
            label: "Features",
            value:
              "Apple Intelligence - Writing Tools, Clean Up, visual intelligence, and more",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone 17e, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Claims follow manufacturer terms and GadgetHub’s Return & Refund Policy - not AppleCare retail terms.",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    tagline:
      "6.1‑inch aerospace‑grade aluminum. Camera Control. A18 chip. All‑day battery - built for Apple Intelligence.",
    categoryLabel: "iPhone",
    categoryHref: "/shop/iphone",
    overviewHref: "/shop/iphone/iphone-16",
    specsHref: "/shop/iphone/iphone-16/specs",
    image: {
      src: sixteenGallery[0],
      alt: "iPhone 16 in Black, White, Pink, Teal, and Ultramarine",
    },
    gallery: [
      {
        src: sixteenGallery[0],
        alt: "iPhone 16 in Black, White, Pink, Teal, and Ultramarine finishes",
      },
      {
        src: sixteenGallery[1],
        alt: "A hand holds iPhone 16 in Pink - all-screen display with Dynamic Island",
      },
      {
        src: sixteenGallery[2],
        alt: "iPhone 16 in Ultramarine - Dual camera back and all-screen front with Dynamic Island",
      },
      {
        src: sixteenGallery[3],
        alt: "iPhone 16 in Pink - close-up of vertical Dual camera system and flash",
      },
      {
        src: sixteenGallery[4],
        alt: "iPhone 16 in Teal - back exterior with Camera Control button on the side",
      },
      {
        src: sixteenGallery[5],
        alt: "MagSafe accessories - FineWoven Wallet in Deep Blue on Ultramarine, MagSafe Charger on black Silicone Case, Clear Case on Teal",
      },
    ],
    finishesLabel: "Available in 5 finishes",
    storages: [
      { id: "128", label: "128GB", priceKes: 99999 },
      { id: "256", label: "256GB", priceKes: 112999 },
      { id: "512", label: "512GB", priceKes: 129999 },
    ],
    colors: [
      { id: "ultramarine", label: "Ultramarine", hex: "#3B5CDE" },
      { id: "teal", label: "Teal", hex: "#4A8B8B" },
      { id: "pink", label: "Pink", hex: "#E8B4C8" },
      { id: "white", label: "White", hex: "#F5F5F7" },
      { id: "black", label: "Black", hex: "#1C1C1E" },
    ],
    lipaMonths: 24,
    related: {
      label: "iPhone 17",
      href: "/shop/iphone/iphone-17",
    },
    experiences: buildIphoneFeel({
      design: {
        title: "Color you notice. Edges you forget.",
        cue: "Ultramarine to Black - aluminum that feels precise.",
        body: "Aerospace‑grade design with Ceramic Shield, Action button, and Camera Control recessed into the side. Unlock, scroll, pocket - it disappears until you need it.",
        image: {
          src: sixteenGallery[0],
          alt: "iPhone 16 in five finishes",
        },
      },
      camera: {
        title: "Camera Control under the thumb.",
        cue: "Tools without unlocking a maze of menus.",
        body: "Light-press into camera tools, capture spatial photos and video for Vision Pro later, and keep MagSafe wallet or charger snapped on when you’re out.",
        image: {
          src: sixteenGallery[3],
          alt: "iPhone 16 camera system",
        },
      },
      everyday: {
        title: "A18 for Apple Intelligence days.",
        cue: "Console‑level games. All‑day battery feel.",
        body: "Up to 22 hours of video playback. Intelligence that drafts, cleans, and surfaces what you need - so the phone feels like a partner, not a chore.",
        image: {
          src: sixteenGallery[1],
          alt: "Hand holds iPhone 16 Pink",
        },
      },
      continuityImage: {
        src: sixteenGallery[5],
        alt: "iPhone 16 MagSafe accessories",
      },
    }),
    highlights: [
      { label: "Display", value: "6.1″ XDR" },
      { label: "Chip", value: "A18" },
      { label: "Control", value: "Camera Control" },
      { label: "Design", value: "Aluminum" },
      { label: "Battery", value: "Up to 22 hrs" },
      { label: "AI", value: "Apple Intelligence" },
    ],
    stories: [
      {
        title: "Aerospace‑grade aluminum.",
        body: "A 6.1‑inch design with durable Ceramic Shield front, Action button, and USB‑C. Five finishes - Ultramarine, Teal, Pink, White, and Black.",
      },
      {
        title: "Camera Control",
        body: "An easier way to quickly access camera tools - so you never miss the moment. Capture magical spatial photos and videos, then relive them on Apple Vision Pro.",
      },
      {
        title: "A18 chip",
        body: "Enables Apple Intelligence and console‑level gaming with exceptional power efficiency - fast for everything you do, every day.",
      },
      {
        title: "iOS and Apple Intelligence",
        body: "A new look with smarter features - Writing Tools, Clean Up, visual intelligence, and more - so your iPhone stays helpful from morning to night.",
      },
    ],
    batteryStat: {
      value: "Up to 22 hrs",
      label: "of video playback. All‑day battery life for streaming, gaming, and browsing.",
    },
    apps: [
      "Camera",
      "Photos",
      "Messages",
      "Mail",
      "Safari",
      "Maps",
      "Wallet",
      "Health",
    ],
    inTheBox: ["iPhone 16", "USB-C Charge Cable", "Documentation"],
    specs: [
      {
        title: "Finish",
        rows: [
          {
            label: "Colors",
            value: "Ultramarine, Teal, Pink, White, Black",
          },
          {
            label: "Materials",
            value: "Aerospace‑grade aluminum; Ceramic Shield front",
          },
        ],
      },
      {
        title: "Display",
        rows: [
          {
            label: "Size",
            value: "6.1‑inch Super Retina XDR",
          },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "A18" },
          {
            label: "Capabilities",
            value: "Apple Intelligence; console‑level gaming",
          },
        ],
      },
      {
        title: "Camera",
        rows: [
          {
            label: "System",
            value: "Advanced dual camera system with Camera Control",
          },
          {
            label: "Spatial",
            value: "Spatial photos and videos for Apple Vision Pro",
          },
        ],
      },
      {
        title: "Controls",
        rows: [
          {
            label: "Camera Control",
            value: "Quick access to camera tools",
          },
          {
            label: "Action button",
            value: "Customizable shortcut",
          },
        ],
      },
      {
        title: "Battery and Power",
        rows: [
          { label: "Video playback", value: "Up to 22 hours" },
          {
            label: "Charging",
            value: "USB‑C; MagSafe / Qi wireless where supported",
          },
        ],
      },
      {
        title: "Apple Intelligence",
        rows: [
          {
            label: "Features",
            value:
              "Apple Intelligence - Writing Tools, Clean Up, visual intelligence, and more",
          },
        ],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "128GB, 256GB, 512GB" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPhone 16, USB-C Charge Cable, documentation",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. Claims follow manufacturer terms and GadgetHub’s Return & Refund Policy - not AppleCare retail terms.",
          },
        ],
      },
    ],
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro 14\"",
    tagline: "Pro performance in a portable chassis. New stock only.",
    categoryLabel: "Mac",
    categoryHref: "/shop/mac",
    overviewHref: "/shop/mac/macbook-pro",
    specsHref: "/shop/mac/macbook-pro/specs",
    image: {
      src: "/Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp14-spaceblack-select-202410.jpg",
      alt: "MacBook Pro 14-inch M4 in Space Black",
    },
    storages: [
      { id: "512", label: "512GB", priceKes: 249999 },
      { id: "1tb", label: "1TB", priceKes: 289999 },
      { id: "2tb", label: "2TB", priceKes: 349999 },
    ],
    colors: [
      {
        id: "space-black",
        label: "Space Black",
        hex: "#1D1D1F",
        imageSrc:
          "/Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp14-spaceblack-select-202410.jpg",
      },
      {
        id: "silver",
        label: "Silver",
        hex: "#E3E4E5",
        imageSrc:
          "/Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp14-silver-select-202410.jpg",
      },
    ],
    highlights: [
      { label: "Chip", value: "M-series Pro" },
      { label: "Display", value: "Liquid Retina XDR" },
      { label: "Ports", value: "Thunderbolt / HDMI" },
      { label: "Battery", value: "All-day" },
    ],
    stories: [
      {
        title: "Chip",
        body: "M-series Pro silicon for editors, developers, and creators who need sustained performance without a desk.",
      },
      {
        title: "Display",
        body: "Liquid Retina XDR with extreme dynamic range for color-critical work and bright rooms.",
      },
    ],
    batteryStat: {
      value: "Up to 18 hrs",
      label: "video playback class battery life - depends on configuration and use.",
    },
    apps: ["Safari", "Mail", "Photos", "Messages", "FaceTime", "Notes", "Freeform"],
    inTheBox: ['MacBook Pro 14"', "USB-C Power Adapter", "USB-C Charge Cable"],
    specs: [
      {
        title: "Finish",
        rows: [
          { label: "Colors", value: "Space Black, Silver" },
        ],
      },
      {
        title: "Chip",
        rows: [
          { label: "Chip", value: "Apple M-series Pro" },
        ],
      },
      {
        title: "Memory & Storage",
        rows: [
          { label: "Storage options", value: "512GB, 1TB, 2TB" },
        ],
      },
      {
        title: "Display",
        rows: [
          { label: "Size", value: "14-inch Liquid Retina XDR" },
        ],
      },
      {
        title: "Ports / Connectivity",
        rows: [
          { label: "Ports", value: "Thunderbolt, HDMI, MagSafe, headphone jack" },
          { label: "Wireless", value: "Wi‑Fi 6E, Bluetooth 5.3" },
        ],
      },
      {
        title: "In the Box",
        rows: [
          { label: "Included", value: "MacBook Pro, power adapter, charge cable" },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty via GadgetHub proof of purchase. See Warranty & Repairs and Returns policies.",
          },
        ],
      },
    ],
  },
  {
    id: "ipad-pro",
    name: "iPad Pro",
    tagline: "Thin, powerful, ready for Apple Pencil and Magic Keyboard.",
    categoryLabel: "iPad",
    categoryHref: "/shop/ipad",
    overviewHref: "/shop/ipad/ipad-pro",
    specsHref: "/shop/ipad/ipad-pro/specs",
    image: {
      src: "/Gadget_Hub_iPad_1_Product_photos/01_Product_photos/iPad_Pro_11in_and_13in_M4_M5_(same_design)/ipad-pro-11-select-wificell-spaceblack-202405.jpg",
      alt: "iPad Pro in Space Black",
    },
    storages: [
      { id: "256", label: "256GB", priceKes: 159999 },
      { id: "512", label: "512GB", priceKes: 189999 },
      { id: "1tb", label: "1TB", priceKes: 229999 },
    ],
    colors: [
      {
        id: "space-black",
        label: "Space Black",
        hex: "#1D1D1F",
        imageSrc:
          "/Gadget_Hub_iPad_1_Product_photos/01_Product_photos/iPad_Pro_11in_and_13in_M4_M5_(same_design)/ipad-pro-11-select-wificell-spaceblack-202405.jpg",
      },
      {
        id: "silver",
        label: "Silver",
        hex: "#E3E4E5",
        imageSrc:
          "/Gadget_Hub_iPad_1_Product_photos/01_Product_photos/iPad_Pro_11in_and_13in_M4_M5_(same_design)/ipad-pro-11-select-wificell-silver-202405.jpg",
      },
    ],
    highlights: [
      { label: "Chip", value: "M-series" },
      { label: "Display", value: "Ultra Retina" },
      { label: "Pencil", value: "Apple Pencil Pro" },
      { label: "Keyboard", value: "Magic Keyboard" },
    ],
    stories: [
      {
        title: "Chip",
        body: "Desktop-class M-series performance for design, note-taking, and multitasking on the go.",
      },
      {
        title: "Display",
        body: "Ultra Retina clarity for reading, drawing, and media - indoors and out.",
      },
    ],
    batteryStat: {
      value: "All-day",
      label: "battery for mixed Wi‑Fi use - actual results vary.",
    },
    apps: ["Safari", "Files", "Notes", "Freeform", "Photos", "Stage Manager"],
    inTheBox: ["iPad Pro", "USB-C Charge Cable", "20W USB-C Power Adapter"],
    specs: [
      {
        title: "Finish",
        rows: [{ label: "Colors", value: "Space Black, Silver" }],
      },
      {
        title: "Chip",
        rows: [{ label: "Chip", value: "Apple M-series" }],
      },
      {
        title: "Storage",
        rows: [{ label: "Capacity", value: "256GB, 512GB, 1TB" }],
      },
      {
        title: "Display",
        rows: [{ label: "Type", value: "Ultra Retina" }],
      },
      {
        title: "In the Box",
        rows: [
          {
            label: "Included",
            value: "iPad Pro, USB-C charge cable, USB-C power adapter",
          },
        ],
      },
      {
        title: "Warranty and Service",
        rows: [
          {
            label: "Warranty",
            value:
              "Manufacturer’s standard warranty. GadgetHub handles intake via WhatsApp and proof of purchase.",
          },
        ],
      },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
