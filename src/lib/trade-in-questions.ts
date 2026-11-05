/** Questions on the Trade-In form. Staff use the answers to quote on WhatsApp. */
export type TradeInQuestion = { id: string; label: string; options: readonly string[] };

/** What a customer can trade in. */
export const TRADE_IN_TYPES = ["iPhone", "Samsung", "iPad", "Mac"] as const;

/** The device a customer wants must be a phone, a Mac or an iPad. */
export const TRADE_IN_SKIP_GROUPS = ["Accessories", "Watch", "AirPods", "TV & Home"] as const;

export const BATTERY_LABEL = "Battery health";

export const tradeInQuestions: readonly TradeInQuestion[] = [
  { id: "screen", label: "Is the screen cracked?", options: ["No", "Yes"] },
  { id: "extras", label: "Do you have the box and receipt?", options: ["Box and receipt", "Box only", "Receipt only", "None"] },
];

/** A whole percentage from 1 to 100, or null if it was left empty or makes no sense. */
export function cleanBattery(raw: unknown): number | null {
  const text = String(raw ?? "").trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const pct = Number(text);
  return pct >= 1 && pct <= 100 ? pct : null;
}

/** Keeps known questions and options only, with the battery after the screen. */
export function cleanAnswers(raw: unknown): { question: string; answer: string }[] {
  const given = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rows = tradeInQuestions.flatMap((q) => {
    const answer = String(given[q.id] ?? "");
    return q.options.includes(answer) ? [{ question: q.label, answer }] : [];
  });
  const battery = cleanBattery(given.battery);
  rows.splice(1, 0, { question: BATTERY_LABEL, answer: battery === null ? "Not given" : `${battery}%` });
  return rows;
}

/** National ID or passport: letters and digits only, the length of real documents. */
export function cleanIdNumber(raw: unknown): string | null {
  const text = String(raw ?? "").replace(/\s/g, "").toUpperCase();
  return /^[A-Z0-9]{6,12}$/.test(text) ? text : null;
}
