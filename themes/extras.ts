// Maps each design variant to its design-specific color tokens (extras beyond BASE_TOKENS).
// Import here when adding a new design bundle that has its own color tokens.
// Used by the settings page to show the right color inputs for the active design.

import { BASE_TOKENS, type TokenEntry } from "./tokens";
import { COLOR_TOKENS as V1_TOKENS } from "@/themes/v1/tokens";

const baseKeys = new Set(BASE_TOKENS.map((t) => t.key));

const DESIGN_EXTRAS: Record<string, TokenEntry[]> = {
  v1: V1_TOKENS.filter((t) => !baseKeys.has(t.key)),
  // Add future designs here:
  // mythical: MYTHICAL_TOKENS.filter(t => !baseKeys.has(t.key)),
};

export function getDesignExtras(variant: string): TokenEntry[] {
  return DESIGN_EXTRAS[variant] ?? [];
}
