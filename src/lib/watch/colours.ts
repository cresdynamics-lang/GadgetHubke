/** Watch finish / colour metadata. */

export type WatchColourMeta = {
  key: string;
  label: string;
  hex: string;
  material: "aluminum" | "titanium" | "ceramic" | "stainless";
  light?: boolean;
};

export const watchColourMeta: Record<string, WatchColourMeta> = {
  "dark-bronze": { key: "dark-bronze", label: "Dark Bronze", hex: "#5c4a3a", material: "aluminum" },
  "light-gold": { key: "light-gold", label: "Light Gold", hex: "#e8d5b5", material: "aluminum", light: true },
  black: { key: "black", label: "Black", hex: "#1d1d1f", material: "aluminum" },
  "space-gray": { key: "space-gray", label: "Space Gray", hex: "#7d7e80", material: "aluminum" },
  "jet-black": { key: "jet-black", label: "Jet Black", hex: "#0a0a0a", material: "aluminum" },
  "rose-gold": { key: "rose-gold", label: "Rose Gold", hex: "#e8c4b8", material: "aluminum", light: true },
  silver: { key: "silver", label: "Silver", hex: "#e3e4e5", material: "aluminum", light: true },
  midnight: { key: "midnight", label: "Midnight", hex: "#1a2530", material: "aluminum" },
  starlight: { key: "starlight", label: "Starlight", hex: "#f0e4d0", material: "aluminum", light: true },
  pink: { key: "pink", label: "Pink", hex: "#f2c4c8", material: "aluminum", light: true },
  red: { key: "red", label: "(PRODUCT)RED", hex: "#bf0013", material: "aluminum" },
  blue: { key: "blue", label: "Blue", hex: "#5b8def", material: "aluminum" },
  green: { key: "green", label: "Green", hex: "#3e6b4f", material: "aluminum" },
  "radiant-gold": { key: "radiant-gold", label: "Radiant Gold", hex: "#d4a84b", material: "titanium" },
  natural: { key: "natural", label: "Natural", hex: "#c8c2b4", material: "titanium", light: true },
  gold: { key: "gold", label: "Gold", hex: "#c9a86c", material: "titanium" },
  slate: { key: "slate", label: "Slate", hex: "#5a5c60", material: "titanium" },
  "pearl-white": { key: "pearl-white", label: "Pearl White", hex: "#f5f2ea", material: "ceramic", light: true },
  "night-blue": { key: "night-blue", label: "Night Blue", hex: "#1a2744", material: "ceramic" },
  "ss-silver": { key: "ss-silver", label: "Silver", hex: "#d8d8d8", material: "stainless", light: true },
  "ss-gold": { key: "ss-gold", label: "Gold", hex: "#c9a86c", material: "stainless" },
  "ss-graphite": { key: "ss-graphite", label: "Graphite", hex: "#535353", material: "stainless" },
};

export function colourLabel(key: string): string {
  return watchColourMeta[key]?.label || key.replace(/-/g, " ");
}

export function colourHex(key: string): string {
  return watchColourMeta[key]?.hex || "#86868b";
}

export function isLightColour(key: string): boolean {
  return Boolean(watchColourMeta[key]?.light);
}

export function colourMaterial(key: string): WatchColourMeta["material"] | null {
  return watchColourMeta[key]?.material || null;
}
