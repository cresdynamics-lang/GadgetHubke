/** MacBook colour keys → display name + swatch hex (UI only). */

export type MacColourMeta = {
  key: string;
  label: string;
  hex: string;
  light?: boolean;
};

export const macColourMeta: Record<string, MacColourMeta> = {
  "space-gray": { key: "space-gray", label: "Space Gray", hex: "#7d7e80" },
  spacegray: { key: "spacegray", label: "Space Gray", hex: "#7d7e80" },
  silver: { key: "silver", label: "Silver", hex: "#e3e4e5", light: true },
  gold: { key: "gold", label: "Gold", hex: "#f0e4d3", light: true },
  midnight: { key: "midnight", label: "Midnight", hex: "#2e3642" },
  starlight: { key: "starlight", label: "Starlight", hex: "#f0e4d3", light: true },
  skyblue: { key: "skyblue", label: "Sky Blue", hex: "#a8c7db", light: true },
  "sky-blue": { key: "sky-blue", label: "Sky Blue", hex: "#a8c7db", light: true },
  spaceblack: { key: "spaceblack", label: "Space Black", hex: "#2e2c2b" },
  "space-black": { key: "space-black", label: "Space Black", hex: "#2e2c2b" },
};

export function colourLabel(key: string): string {
  return macColourMeta[key]?.label ?? key.replace(/-/g, " ");
}

export function colourHex(key: string): string {
  return macColourMeta[key]?.hex ?? "#8e8e93";
}

export function isLightColour(key: string): boolean {
  return Boolean(macColourMeta[key]?.light);
}

/** Normalise filename colour tokens to our keys. */
export function normaliseColourToken(raw: string): string {
  const t = raw.toLowerCase().replace(/_/g, "-");
  if (t === "space-gray" || t === "spacegray" || t === "space-grey") return "space-gray";
  if (t === "space-black" || t === "spaceblack") return "space-black";
  if (t === "sky-blue" || t === "skyblue") return "sky-blue";
  return t;
}
