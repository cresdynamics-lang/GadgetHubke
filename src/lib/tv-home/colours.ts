/** TV & Home colour metadata. */

export type TvHomeColourMeta = {
  key: string;
  label: string;
  hex: string;
};

export const tvHomeColourMeta: Record<string, TvHomeColourMeta> = {
  black: { key: "black", label: "Black", hex: "#1d1d1f" },
  midnight: { key: "midnight", label: "Midnight", hex: "#1d1d1f" },
  white: { key: "white", label: "White", hex: "#f5f5f7" },
  blue: { key: "blue", label: "Blue", hex: "#5b8def" },
  orange: { key: "orange", label: "Orange", hex: "#e8834a" },
  yellow: { key: "yellow", label: "Yellow", hex: "#f5d76e" },
};

export function colourLabel(key: string): string {
  return tvHomeColourMeta[key]?.label || key.replace(/-/g, " ");
}

export function colourHex(key: string): string {
  return tvHomeColourMeta[key]?.hex || "#86868b";
}
