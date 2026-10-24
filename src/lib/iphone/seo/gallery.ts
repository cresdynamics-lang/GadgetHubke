/**
 * Official Apple gallery images for iPhone models that have no colour gallery
 * in the legacy catalog. Used by the model page, cards and the Google / Meta feeds.
 */
export type SeoGalleryImage = { src: string; srcWebp: string; alt: string };

function gallery(folder: string, file: string, name: string, alts: string[]): SeoGalleryImage[] {
  return alts.map((alt, i) => {
    const base = `/${folder}/${file}-${i + 1}-202509`;
    return { src: `${base}.jpeg`, srcWebp: `${base}.webp`, alt: `${name} ${alt}` };
  });
}

const proAlts = [
  "front and back in Silver, Cosmic Orange and Deep Blue",
  "held in hand, showing the display",
  "in Deep Blue, back and display",
  "in Cosmic Orange, camera close-up",
  "in Silver, back and side profile",
  "with MagSafe cases and crossbody straps",
];

export const seoModelGallery: Record<string, SeoGalleryImage[]> = {
  "iphone-17-pro": gallery("iPhone-17-Pro", "iphone-17pro-digitalmat-gallery", "iPhone 17 Pro", proAlts),
  "iphone-17-pro-max": gallery("iPhone-17-Pro-Max", "iphone-17promax-digitalmat-gallery", "iPhone 17 Pro Max", proAlts),
};
