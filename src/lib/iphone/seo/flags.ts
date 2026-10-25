/**
 * Single switch for Ex-UK offers site-wide. Gadget Hub sells both sealed new and
 * Ex-UK (UK-used) stock, so product pages show a New | Ex-UK price toggle.
 */
export const SHOW_EX_UK = true;

/**
 * Warranty line shown only on used (ex-UK) offers when SHOW_EX_UK is true.
 * Must be replaced by the owner before enabling the switch — placeholder fails the build.
 */
export const EX_UK_WARRANTY =
  "Ex-UK units are UK-used stock. Condition and warranty terms are stated on your Gadget Hub invoice — ask us on WhatsApp before you buy.";

export const EX_UK_CONDITION_LABEL = "Ex-UK";

/** Call from build paths when SHOW_EX_UK is true. */
export function assertExUkWarrantyConfigured(): void {
  if (!SHOW_EX_UK) return;
  if (EX_UK_WARRANTY.includes("[OWNER TO CONFIRM]") || !EX_UK_WARRANTY.trim()) {
    throw new Error(
      "SHOW_EX_UK is on but EX_UK_WARRANTY is still [OWNER TO CONFIRM]. Supply warranty wording before enabling used stock.",
    );
  }
}
