// Color token manifest for the v1 design bundle.
// Each entry declares one CSS custom property this design reads.
// The settings color picker reads this list to show only relevant color inputs.
//
// Standard tokens (shared across all designs) — set by the user in Settings > Colors.
// Custom tokens (exclusive to this design) — also editable in Settings > Colors when this design is active.
//
// CSS variable naming: --widget-* for standard, --widget-v1-* for design-specific extras.
// Tailwind utility: bg-widget-primary, bg-widget-v1-accent, etc.

export const COLOR_TOKENS = [
  // ── Standard tokens (every design shares these) ────────────────────────────
  { key: "primary",           label: "Primary",            css: "--widget-primary",           group: "Primary" },
  { key: "primary-bg",        label: "Primary Background", css: "--widget-primary-bg",        group: "Primary" },
  { key: "primary-border",    label: "Primary Border",     css: "--widget-primary-border",    group: "Primary" },
  { key: "primary-dark",      label: "Primary Dark",       css: "--widget-primary-dark",      group: "Primary" },

  { key: "secondary",         label: "Secondary",          css: "--widget-secondary",         group: "Secondary" },
  { key: "secondary-bg",      label: "Secondary Background",css: "--widget-secondary-bg",     group: "Secondary" },
  { key: "secondary-border",  label: "Secondary Border",   css: "--widget-secondary-border",  group: "Secondary" },
  { key: "secondary-dark",    label: "Secondary Dark",     css: "--widget-secondary-dark",    group: "Secondary" },

  { key: "status-alive",      label: "Alive",              css: "--widget-status-alive",      group: "Status" },
  { key: "status-knocked",    label: "Knocked",            css: "--widget-status-knocked",    group: "Status" },
  { key: "status-dead",       label: "Dead",               css: "--widget-status-dead",       group: "Status" },

  { key: "bg",                label: "Background",         css: "--widget-bg",                group: "Global" },
  { key: "text",              label: "Text",               css: "--widget-text",              group: "Global" },
  { key: "gradient-start",    label: "Gradient Start",     css: "--widget-gradient-start",    group: "Global" },
  { key: "gradient-end",      label: "Gradient End",       css: "--widget-gradient-end",      group: "Global" },

  // ── v1-specific tokens — add your design's unique colors below ─────────────
  // Example:
  // { key: "v1-accent",      label: "Accent",             css: "--widget-v1-accent",         group: "v1 Extras" },
  // { key: "v1-gold",        label: "Gold",               css: "--widget-v1-gold",           group: "v1 Extras" },
];

// Default values for v1-specific tokens (globals.css fallbacks).
// Add matching entries in globals.css :root when you add tokens above.
export const TOKEN_DEFAULTS = {
  // "--widget-v1-accent": "#ff6b35",
};
