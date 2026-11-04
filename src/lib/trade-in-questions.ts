/** Questions on the Trade-In form. Staff use the answers to quote on WhatsApp. */
export type TradeInQuestion = { id: string; label: string; options: readonly string[] };

export const tradeInQuestions: readonly TradeInQuestion[] = [
  {
    id: "battery",
    label: "Battery health (Settings › Battery)",
    options: ["90% or above", "80% to 89%", "Below 80%", "Not sure"],
  },
  {
    id: "screen",
    label: "Screen",
    options: ["Like new", "Light scratches", "Cracked", "Lines, spots or not working"],
  },
  {
    id: "body",
    label: "Back and frame",
    options: ["Like new", "Light marks", "Dents or deep scratches", "Cracked back"],
  },
  { id: "biometrics", label: "Does Face ID, Touch ID or the fingerprint sensor work?", options: ["Yes", "No", "Phone has none"] },
  { id: "cameras", label: "Do all the cameras work?", options: ["Yes", "No"] },
  {
    id: "repairs",
    label: "Has it been opened or had parts replaced?",
    options: ["No", "Screen replaced", "Battery replaced", "Other repair", "Not sure"],
  },
  { id: "water", label: "Has it ever had water damage?", options: ["No", "Yes", "Not sure"] },
  {
    id: "lock",
    label: "Can you sign out of iCloud or Google and erase it?",
    options: ["Yes", "No", "Not sure"],
  },
  { id: "extras", label: "What do you still have?", options: ["Box and cable", "Box only", "Cable only", "Neither"] },
  { id: "balance", label: "How would you pay any balance?", options: ["M-Pesa or cash", "Lipa Mdogo Mdogo", "Not sure yet"] },
];

/** Keeps known questions and options only. */
export function cleanAnswers(raw: unknown): { question: string; answer: string }[] {
  const given = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return tradeInQuestions.flatMap((q) => {
    const answer = String(given[q.id] ?? "");
    return q.options.includes(answer) ? [{ question: q.label, answer }] : [];
  });
}
