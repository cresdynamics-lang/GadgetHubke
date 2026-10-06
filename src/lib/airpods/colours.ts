/** AirPods colour metadata. Max purple/starlight dots are approximate CSS. */

export type AirpodsColourMeta = {
  key: string;
  label: string;
  hex: string;
  approx?: boolean;
};

export const airpodsColourMeta: Record<string, AirpodsColourMeta> = {
  white: { key: "white", label: "White", hex: "#f5f5f7" },
  midnight: { key: "midnight", label: "Midnight", hex: "#1d1d1f" },
  blue: { key: "blue", label: "Blue", hex: "#5b8def" },
  orange: { key: "orange", label: "Orange", hex: "#e8834a" },
  purple: { key: "purple", label: "Purple", hex: "#B8A9C9", approx: true },
  starlight: { key: "starlight", label: "Starlight", hex: "#E3D8CC", approx: true },
  "space-gray": { key: "space-gray", label: "Space Gray", hex: "#7d7e80" },
  silver: { key: "silver", label: "Silver", hex: "#e3e4e5" },
  "sky-blue": { key: "sky-blue", label: "Sky Blue", hex: "#90b4ce" },
  green: { key: "green", label: "Green", hex: "#3e6b4f" },
  pink: { key: "pink", label: "Pink", hex: "#f2c4c8" },
};

export function colourLabel(key: string): string {
  return airpodsColourMeta[key]?.label || key.replace(/-/g, " ");
}

export function colourHex(key: string): string {
  return airpodsColourMeta[key]?.hex || "#86868b";
}

export function colourApprox(key: string): boolean {
  return Boolean(airpodsColourMeta[key]?.approx);
}
