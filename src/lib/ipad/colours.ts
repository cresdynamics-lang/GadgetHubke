/** Colour keys → display labels and swatch hex for iPad finishes. */

export type IpadColourMeta = {
  key: string;
  label: string;
  hex: string;
  light?: boolean;
};

export const ipadColourMeta: Record<string, IpadColourMeta> = {
  silver: { key: "silver", label: "Silver", hex: "#E3E4E5", light: true },
  "space-black": { key: "space-black", label: "Space Black", hex: "#1C1C1E" },
  "space-gray": { key: "space-gray", label: "Space Gray", hex: "#52574A" },
  starlight: { key: "starlight", label: "Starlight", hex: "#F0E4D3", light: true },
  blue: { key: "blue", label: "Blue", hex: "#5B7CAD" },
  purple: { key: "purple", label: "Purple", hex: "#A78BBE" },
  pink: { key: "pink", label: "Pink", hex: "#E8B4BC", light: true },
  yellow: { key: "yellow", label: "Yellow", hex: "#F5D76E", light: true },
  gold: { key: "gold", label: "Gold", hex: "#F5D6B0", light: true },
  "rose-gold": { key: "rose-gold", label: "Rose Gold", hex: "#E8C4B8", light: true },
  green: { key: "green", label: "Green", hex: "#A8C5A0" },
  "sky-blue": { key: "sky-blue", label: "Sky Blue", hex: "#7BA4C9" },
};

export function colourLabel(key: string): string {
  return ipadColourMeta[key]?.label || key.replace(/-/g, " ");
}

export function colourHex(key: string): string {
  return ipadColourMeta[key]?.hex || "#8E8E93";
}

export function isLightColour(key: string): boolean {
  return Boolean(ipadColourMeta[key]?.light);
}

export function normaliseColourToken(raw: string): string {
  const n = raw.toLowerCase().replace(/\s+/g, "-");
  if (n === "spacegray" || n === "space-grey" || n === "spacegrey") return "space-gray";
  if (n === "spaceblack") return "space-black";
  if (n === "skyblue") return "sky-blue";
  if (n === "rosegold") return "rose-gold";
  return n;
}
