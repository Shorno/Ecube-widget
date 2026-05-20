// Shared token definitions consumed by every design bundle.
// Each design's tokens.ts imports BASE_TOKENS and spreads it, then appends
// any design-specific extras. This ensures:
//   • Standard tokens are defined exactly once — add here, all designs get it.
//   • Each design only declares what makes it unique.

export interface TokenEntry {
  key: string; // flat key in User.themeConfig.colors
  label: string; // shown in Settings › Colors
  css: string; // CSS custom property injected by the layout
  group: string; // section heading in Settings › Colors
}

export const BASE_TOKENS: TokenEntry[] = [
  // ── Primary ──────────────────────────────────────────────────────────────
  {
    key: "primary",
    label: "Primary",
    css: "--widget-primary",
    group: "Primary",
  },
  {
    key: "primaryDark",
    label: "Primary Dark",
    css: "--widget-primary-dark",
    group: "Primary",
  },
  {
    key: "primaryAccent",
    label: "Primary Accent",
    css: "--widget-primary-accent",
    group: "Primary",
  },

  // ── Secondary ─────────────────────────────────────────────────────────────
  {
    key: "secondary",
    label: "Secondary",
    css: "--widget-secondary",
    group: "Secondary",
  },
  {
    key: "secondaryDark",
    label: "Secondary Dark",
    css: "--widget-secondary-dark",
    group: "Secondary",
  },
  {
    key: "secondaryAccent",
    label: "Secondary Accent",
    css: "--widget-secondary-accent",
    group: "Secondary",
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  { key: "text1", label: "Text 1", css: "--widget-text-1", group: "Text" },
  { key: "text2", label: "Text 2", css: "--widget-text-2", group: "Text" },
  { key: "text3", label: "Text 3", css: "--widget-text-3", group: "Text" },

  // ── Background ────────────────────────────────────────────────────────────
  { key: "bg", label: "Background", css: "--widget-bg", group: "Background" },

  // ── Gradient ──────────────────────────────────────────────────────────────
  {
    key: "gradientFrom",
    label: "Gradient From",
    css: "--widget-gradient-from",
    group: "Gradient",
  },
  {
    key: "gradientTo",
    label: "Gradient To",
    css: "--widget-gradient-to",
    group: "Gradient",
  },
  {
    key: "gradientAngle",
    label: "Angle (deg)",
    css: "--widget-gradient-angle",
    group: "Gradient",
  },

  // ── Status ────────────────────────────────────────────────────────────────
  {
    key: "statusAlive",
    label: "Alive",
    css: "--widget-status-alive",
    group: "Status",
  },
  {
    key: "statusKnocked",
    label: "Knocked",
    css: "--widget-status-knocked",
    group: "Status",
  },
  {
    key: "statusDead",
    label: "Dead",
    css: "--widget-status-dead",
    group: "Status",
  },
];
