export type HeroMotion =
  | "push-in"
  | "zoom-out"
  | "rise"
  | "slide-left"
  | "slide-right"
  | "tilt"
  | "pan"
  | "rise-tilt"
  | "rise-from-below"
  | "tilt-8"
  | "drift-down"
  | "colour-swap";

export type HeroSceneType = "cinematic" | "cutout";

export type HeroFocus = { x: number; y: number };

export type HeroScene = {
  id: string;
  /** Public URL path to the source JPG/PNG (leading slash, under /Hero/...) */
  src: string;
  type: HeroSceneType;
  title: string;
  subtitle: string;
  motion: HeroMotion;
  focus: HeroFocus;
  alt: string;
  /** Extra cutout sources for AirPods colour scene */
  swap?: string[];
  /** Degrees for tilt variants */
  tiltDeg?: number;
};

export type HeroCategory = {
  slug: string;
  displayName: string;
  eyebrow: string;
  shopHref: string;
  shopLabel: string;
  whatsappMessage: string;
  /** Optional later MP4/WebM drop-in; unused for now */
  videoSrc?: string;
  scenes: HeroScene[];
};

export const HERO_SCENE_MS = 4000;
export const HERO_CROSSFADE_MS = 900;
export const HERO_COLOUR_SWAP_MS = 800;
export const HERO_COLOUR_FADE_MS = 250;
