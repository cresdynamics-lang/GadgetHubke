/**
 * Keep <title> within ~60 characters so Google shows it whole.
 * Drops the brand suffix first (Google adds the site name itself), then
 * shortens long comparison phrasing. Titles that already fit are untouched.
 */
const MAX = 60;
const SUFFIXES = [" | Gadget Hub Nairobi", " | Gadget Hub", " - GadgetHub Journal", " - GadgetHub", " | GadgetHub"];
const SHORTER: [RegExp, string][] = [
  [/: Price in Kenya & Specs$/, ": Kenya Price & Specs"],
  [/: Kenya Price & Specs$/, " Kenya Price"],
  [/ \(earlier\)/, ""],
  [/ with MagSafe/, ""],
  [/ \(USB-C\)/, ""],
  [/ Fast Charger to USB-C/, " Charger"],
  [/ with 60W Max/, ""],
  [/ and Numeric Keypad/, " + Numeric Keypad"],
  [/Magic Keyboard with Touch ID \+ Numeric Keypad/, "Magic Keyboard Touch ID + Keypad"],
];

export function tidyTitle(title: string): string {
  let t = title.trim();
  if (t.length <= MAX) return t;
  // Prefer the short brand over none at all.
  if (t.endsWith(" | Gadget Hub Nairobi") && t.length - 8 <= MAX) return t.slice(0, -8);
  for (const s of SUFFIXES) {
    if (t.endsWith(s)) {
      t = t.slice(0, -s.length);
      break;
    }
  }
  for (const [re, to] of SHORTER) {
    if (t.length <= MAX) break;
    t = t.replace(re, to);
  }
  return t;
}
