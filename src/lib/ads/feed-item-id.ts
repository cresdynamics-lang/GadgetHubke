/**
 * Feed id for a cart or order line, so Google Ads and Meta can match sales to catalogue rows.
 * The cart keeps its own ids (checkout prices by them); this only maps them for tags:
 *   iPhone  IP-089 + Deep Blue      → IP-089-DEEPBLUE,  IP-090-EXUK + Black → IP-090-EXUK-BLACK
 *   Mac/iPad split by finish        → macbook-air-13-m5-SKY-BLUE
 * Anything else keeps its id. Safe for the browser: no catalogue data is imported.
 */
import { colourSku } from "./feed-ids.ts";
import { colourMetaByKey } from "../iphone/colours.ts";

export type FeedLine = { id?: string; catalogId?: string; sheetId?: string; colour?: string | null };

export function feedItemId(line: FeedLine, finishSplitIds: readonly string[] = []): string {
  const ref = String(line.catalogId || line.sheetId || line.id || "").trim();
  const colour = String(line.colour || "").trim().toLowerCase();
  const iphone = ref.match(/^(IP-\d+)(-EXUK)?$/i);
  if (iphone) {
    const key = Object.values(colourMetaByKey).find((c) => c.label.toLowerCase() === colour)?.key;
    return key ? colourSku(iphone[1].toUpperCase(), key, Boolean(iphone[2])) : ref;
  }
  if (colour && finishSplitIds.includes(ref)) return `${ref}-${colour.toUpperCase().replace(/\s+/g, "-")}`;
  return ref;
}
