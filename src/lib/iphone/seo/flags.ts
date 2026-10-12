/**
 * Single switch for EX-UK offers site-wide on SEO product surfaces.
 * Keep false until the owner confirms UK-used stock will be sold.
 */
export const SHOW_EX_UK = false;

/**
 * Warranty line shown only on used (ex-UK) offers when SHOW_EX_UK is true.
 * Must be replaced by the owner before enabling the switch — placeholder fails the build.
 */
export const EX_UK_WARRANTY = "[OWNER TO CONFIRM]";

export const EX_UK_CONDITION_LABEL = "Used (ex-UK)";

/** Call from build paths when SHOW_EX_UK is true. */
export function assertExUkWarrantyConfigured(): void {
  if (!SHOW_EX_UK) return;
  if (EX_UK_WARRANTY.includes("[OWNER TO CONFIRM]") || !EX_UK_WARRANTY.trim()) {
    throw new Error(
      "SHOW_EX_UK is on but EX_UK_WARRANTY is still [OWNER TO CONFIRM]. Supply warranty wording before enabling used stock.",
    );
  }
}
