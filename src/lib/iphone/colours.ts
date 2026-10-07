/**
 * Colour display labels + swatch hex for iPhone 11 - 16.
 * Light swatches need a thin border in the UI.
 */

export type ColourMeta = {
  key: string;
  label: string;
  hex: string;
  /** draw inner border for very light finishes */
  light?: boolean;
};

const C = (key: string, label: string, hex: string, light = false): ColourMeta => ({
  key,
  label,
  hex,
  light,
});

/** Shared colour key → meta (union of all generations) */
export const colourMetaByKey: Record<string, ColourMeta> = {
  blacktitanium: C("blacktitanium", "Black Titanium", "#2C2C2E"),
  whitetitanium: C("whitetitanium", "White Titanium", "#F5F5F7", true),
  naturaltitanium: C("naturaltitanium", "Natural Titanium", "#C4B7A5"),
  deserttitanium: C("deserttitanium", "Desert Titanium", "#C4A484"),
  bluetitanium: C("bluetitanium", "Blue Titanium", "#3B4A5C"),
  black: C("black", "Black", "#1C1C1E"),
  white: C("white", "White", "#F5F5F7", true),
  pink: C("pink", "Pink", "#E8B4C8"),
  teal: C("teal", "Teal", "#4A8B8B"),
  ultramarine: C("ultramarine", "Ultramarine", "#3B5CDE"),
  blue: C("blue", "Blue", "#4A90C8"),
  green: C("green", "Green", "#5B8F6B"),
  yellow: C("yellow", "Yellow", "#F5D76E"),
  spaceblack: C("spaceblack", "Space Black", "#1C1C1E"),
  silver: C("silver", "Silver", "#E3E4E5", true),
  gold: C("gold", "Gold", "#D4B896"),
  deeppurple: C("deeppurple", "Deep Purple", "#5B4B6E"),
  midnight: C("midnight", "Midnight", "#1C2333"),
  purple: C("purple", "Purple", "#8B7BA8"),
  red: C("red", "Red", "#C41E3A"),
  starlight: C("starlight", "Starlight", "#F5EDE0", true),
  graphite: C("graphite", "Graphite", "#54524F"),
  "product-red": C("product-red", "Product Red", "#C41E3A"),
  "sierra-blue": C("sierra-blue", "Sierra Blue", "#A7C1D9"),
  space: C("space", "Space Grey", "#535353"),
  "midnight-green": C("midnight-green", "Midnight Green", "#3E4A3D"),
};

export function colourLabel(key: string): string {
  return colourMetaByKey[key]?.label ?? key.replace(/-/g, " ");
}

export function colourHex(key: string): string {
  return colourMetaByKey[key]?.hex ?? "#86868B";
}

export function isLightColour(key: string): boolean {
  return Boolean(colourMetaByKey[key]?.light);
}
