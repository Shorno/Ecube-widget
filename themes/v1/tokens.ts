import { BASE_TOKENS, type TokenEntry } from "@/themes/tokens";

// v1 design token manifest.
// BASE_TOKENS covers all standard colors (primary, secondary, text, gradient, status).
// Only list what makes v1 unique — extras go at the bottom.
export const COLOR_TOKENS: TokenEntry[] = [
  ...BASE_TOKENS,

  // ── v1 Extras ─────────────────────────────────────────────────────────────
  // Design-specific tokens. User can change these in Settings › Colors › v1 Extras.
  // To add more: add entry here + CSS var in globals.css + Tailwind alias in globals.css.
  {
    key: "v1Forest",
    label: "Forest",
    css: "--widget-v1-forest",
    group: "v1 Extras",
  },
  {
    key: "v1WwcdFrom",
    label: "WWCD From",
    css: "--widget-v1-wwcd-from",
    group: "v1 Extras",
  },
  {
    key: "v1WwcdTo",
    label: "WWCD To",
    css: "--widget-v1-wwcd-to",
    group: "v1 Extras",
  },
];

// Default CSS var values for v1-specific tokens.
// Standard token defaults live in lib/design/catalog.ts → VARIANT_DEFAULTS.
export const TOKEN_DEFAULTS: Record<string, string> = {
  // "--widget-v1-gold": "#fbbf24",
};
