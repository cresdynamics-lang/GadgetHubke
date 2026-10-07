import { existsSync } from "node:fs";
import path from "node:path";

/** Turn a public URL path into sibling variant URLs. */
export function heroVariantUrls(src: string) {
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  const cutout = ext.toLowerCase() === ".png";
  return {
    src,
    cutout,
    w1920: `${base}.w1920.webp`,
    w1400: `${base}.w1400.webp`,
    w1280: `${base}.w1280.webp`,
    w800: `${base}.w800.webp`,
    blur: `${base}.blur.webp`,
  };
}

export function publicFileExists(publicUrl: string): boolean {
  const rel = publicUrl.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", rel));
}

export function colourNameFromPath(src: string): string | null {
  const base = path.basename(src, path.extname(src));
  // e.g. P01_AirPods_Max_Blue -> Blue
  const m = base.match(/AirPods_Max_(.+)$/i);
  if (!m) return null;
  return m[1].replace(/_/g, " ");
}
