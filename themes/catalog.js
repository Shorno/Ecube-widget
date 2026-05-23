import { h } from "./utils";
import {
  defaults as defaultDefaults,
  fontDefaults as defaultFontDefaults,
} from "./default/defaults";
import {
  defaults as v1Defaults,
  fontDefaults as v1FontDefaults,
} from "./v1/defaults";

// ── Fonts ─────────────────────────────────────────────────────────────────────
// key  → must match the CSS variable suffix loaded in app/layout.jsx
// label → shown in the settings UI
// sample → preview sentence rendered in that font
export const WIDGET_FONTS = [
  {
    key: "oswald",
    label: "Oswald",
    css: "var(--font-oswald)",
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "rajdhani",
    label: "Rajdhani",
    css: "var(--font-rajdhani)",
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "barlow-condensed",
    label: "Barlow Condensed",
    css: "var(--font-barlow-condensed)",
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "bebas-neue",
    label: "Bebas Neue",
    css: "var(--font-bebas-neue)",
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "exo-2",
    label: "Exo 2",
    css: "var(--font-exo-2)",
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "russo-one",
    label: "Russo One",
    css: "var(--font-russo-one)",
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "agency-fb",
    label: "Agency FB",
    css: '"Agency FB", sans-serif',
    sample: "TEAM ALPHA — 14 PTS",
  },
  {
    key: "american-captain",
    label: "American Captain",
    css: "var(--font-american-captain)",
    sample: "TEAM ALPHA — 14 PTS",
  },
];

// ── Token map ─────────────────────────────────────────────────────────────────
// Flat: one entry per CSS custom property.
// key  → field name in the flat colors object stored in MongoDB
// css  → CSS custom property injected by [tournamentID]/layout.jsx
// Tailwind usage: bg-widget-primary, text-widget-text-1, etc.
export const TOKEN_MAP = [
  { key: "primary", css: "--widget-primary" },
  { key: "primaryDark", css: "--widget-primary-dark" },
  { key: "primaryAccent", css: "--widget-primary-accent" },
  { key: "secondary", css: "--widget-secondary" },
  { key: "secondaryDark", css: "--widget-secondary-dark" },
  { key: "secondaryAccent", css: "--widget-secondary-accent" },
  { key: "text1", css: "--widget-text-1" },
  { key: "text2", css: "--widget-text-2" },
  { key: "text3", css: "--widget-text-3" },
  { key: "bg", css: "--widget-bg" },
  { key: "gradientFrom", css: "--widget-gradient-from" },
  { key: "gradientTo", css: "--widget-gradient-to" },
  { key: "gradientAngle", css: "--widget-gradient-angle" },
  { key: "statusAlive", css: "--widget-status-alive" },
  { key: "statusKnocked", css: "--widget-status-knocked" },
  { key: "statusDead", css: "--widget-status-dead" },
  // v1-specific extras — injected for any user whose saved colors include them
  { key: "v1Forest", css: "--widget-v1-forest" },
];

// ── Variant font defaults ─────────────────────────────────────────────────────
// Default primary + secondary font key per design variant.
// Keys must exist in WIDGET_FONTS above.
export const VARIANT_FONT_DEFAULTS = {
  default: defaultFontDefaults,
  v1: v1FontDefaults,
  mythical: defaultFontDefaults,
};

// ── Variant defaults ──────────────────────────────────────────────────────────
// Used when a user has no saved colors (or saves an empty object).
// Also applied when the user resets colors in settings.
export const VARIANT_DEFAULTS = {
  default: defaultDefaults,
  v1: v1Defaults,
  mythical: {
    primary: h("#007570"),
    primaryDark: h("#005550"),
    primaryAccent: h("#009e98"),
    secondary: h("#00B194"),
    secondaryDark: h("#008f77"),
    secondaryAccent: h("#00c9a8"),
    text1: h("#e8f5f5"),
    text2: h("#0a1a1a"),
    text3: h("#e8f5f5"),
    bg: h("#0a1a1a"),
    gradientFrom: h("#007570"),
    gradientTo: h("#00B194"),
    gradientAngle: "135deg",
    statusAlive: "rgba(255,255,255,1)",
    statusKnocked: "rgba(244,63,94,1)",
    statusDead: "rgba(0,0,0,0.5)",
  },
};

// ── Predefined quick themes ───────────────────────────────────────────────────
// Shown in settings as one-click color presets.
// swatches: 2-3 hex values displayed as color dots in the card.
export const PREDEFINED_THEMES = [
  {
    key: "default-orange",
    label: "Default Orange",
    swatches: [h("#a54e26"), h("#008e88"), h("#0d0d0d")],
    colors: VARIANT_DEFAULTS.default,
  },
  {
    key: "mythical-teal",
    label: "Mythical Teal",
    swatches: [h("#007570"), h("#00B194"), h("#0a1a1a")],
    colors: VARIANT_DEFAULTS.mythical,
  },
  {
    key: "crimson-strike",
    label: "Crimson Strike",
    swatches: [h("#dc2626"), h("#b91c1c"), h("#0a0000")],
    colors: {
      primary: h("#dc2626"),
      primaryDark: h("#7f1d1d"),
      primaryAccent: h("#ef4444"),
      secondary: h("#b91c1c"),
      secondaryDark: h("#991b1b"),
      secondaryAccent: h("#dc2626"),
      text1: h("#fef2f2"),
      text2: h("#0a0000"),
      text3: h("#fef2f2"),
      bg: h("#0a0000"),
      gradientFrom: h("#dc2626"),
      gradientTo: h("#991b1b"),
      gradientAngle: "135deg",
      statusAlive: "rgba(255,255,255,1)",
      statusKnocked: "rgba(251,191,36,1)",
      statusDead: "rgba(0,0,0,0.6)",
    },
  },
  {
    key: "ocean-blue",
    label: "Ocean Blue",
    swatches: [h("#1d4ed8"), h("#0ea5e9"), h("#030d1a")],
    colors: {
      primary: h("#1d4ed8"),
      primaryDark: h("#1e3a8a"),
      primaryAccent: h("#2563eb"),
      secondary: h("#0ea5e9"),
      secondaryDark: h("#0369a1"),
      secondaryAccent: h("#38bdf8"),
      text1: h("#e0f2fe"),
      text2: h("#030d1a"),
      text3: h("#e0f2fe"),
      bg: h("#030d1a"),
      gradientFrom: h("#1d4ed8"),
      gradientTo: h("#0ea5e9"),
      gradientAngle: "135deg",
      statusAlive: "rgba(255,255,255,1)",
      statusKnocked: "rgba(251,191,36,1)",
      statusDead: "rgba(0,0,0,0.5)",
    },
  },
  {
    key: "neon-purple",
    label: "Neon Purple",
    swatches: [h("#7c3aed"), h("#a855f7"), h("#0d0014")],
    colors: {
      primary: h("#7c3aed"),
      primaryDark: h("#4c1d95"),
      primaryAccent: h("#8b5cf6"),
      secondary: h("#a855f7"),
      secondaryDark: h("#7e22ce"),
      secondaryAccent: h("#c084fc"),
      text1: h("#f5f3ff"),
      text2: h("#0d0014"),
      text3: h("#f5f3ff"),
      bg: h("#0d0014"),
      gradientFrom: h("#7c3aed"),
      gradientTo: h("#a855f7"),
      gradientAngle: "135deg",
      statusAlive: "rgba(255,255,255,1)",
      statusKnocked: "rgba(244,63,94,1)",
      statusDead: "rgba(0,0,0,0.5)",
    },
  },
  {
    key: "midnight-gold",
    label: "Midnight Gold",
    swatches: [h("#d97706"), h("#f59e0b"), h("#0a0800")],
    colors: {
      primary: h("#d97706"),
      primaryDark: h("#78350f"),
      primaryAccent: h("#f59e0b"),
      secondary: h("#b45309"),
      secondaryDark: h("#92400e"),
      secondaryAccent: h("#d97706"),
      text1: h("#fefce8"),
      text2: h("#0a0800"),
      text3: h("#fefce8"),
      bg: h("#0a0800"),
      gradientFrom: h("#d97706"),
      gradientTo: h("#f59e0b"),
      gradientAngle: "135deg",
      statusAlive: "rgba(255,255,255,1)",
      statusKnocked: "rgba(244,63,94,1)",
      statusDead: "rgba(0,0,0,0.5)",
    },
  },
  {
    key: "arctic-white",
    label: "Arctic White",
    swatches: [h("#0f172a"), h("#334155"), h("#f8fafc")],
    colors: {
      primary: h("#0f172a"),
      primaryDark: h("#1e293b"),
      primaryAccent: h("#475569"),
      secondary: h("#334155"),
      secondaryDark: h("#475569"),
      secondaryAccent: h("#94a3b8"),
      text1: h("#0f172a"),
      text2: h("#f8fafc"),
      text3: h("#0f172a"),
      bg: h("#f8fafc"),
      gradientFrom: h("#0f172a"),
      gradientTo: h("#334155"),
      gradientAngle: "135deg",
      statusAlive: "rgba(15,23,42,1)",
      statusKnocked: "rgba(220,38,38,1)",
      statusDead: "rgba(148,163,184,0.6)",
    },
  },
  {
    key: "ecube-blue",
    label: "ECube Blue",
    swatches: [h("#2e87e6"), h("#0d4a8a"), h("#07192d")],
    colors: {
      primary: h("#2e87e6"),
      primaryDark: h("#1a6dc9"),
      primaryAccent: h("#5ba3ed"),
      secondary: h("#0d4a8a"),
      secondaryDark: h("#083566"),
      secondaryAccent: h("#3d7fd4"),
      text1: h("#ffffff"),
      text2: h("#c8dff8"),
      text3: h("#90c4f7"),
      bg: h("#07192d"),
      gradientFrom: h("#2e87e6"),
      gradientTo: h("#0d4a8a"),
      gradientAngle: "135deg",
      statusAlive: "rgba(255,255,255,1)",
      statusKnocked: "rgba(244,63,94,1)",
      statusDead: "rgba(0,0,0,0.5)",
      v1Forest: h("#00332B"),
    },
  },
];

// ── Theme builders ────────────────────────────────────────────────────────────
// All three accept a flat userColors object and a variant string.
// Missing keys fall back to VARIANT_DEFAULTS[variant].
//
// resolve() only accepts string values from userColors — guards against old
// nested DB data (objects) that pre-date the flat token system.
function resolve(userColors, key, defaults) {
  const saved = userColors?.[key];
  return typeof saved === "string" && saved !== "" ? saved : defaults[key];
}

// Returns a React style object — pass as `style` prop on the layout wrapper.
// CSS vars cascade to all children.
export function buildThemeStyle(userColors, variant = "default") {
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;
  return Object.fromEntries(
    TOKEN_MAP.map(({ key, css }) => {
      const value = resolve(userColors, key, defaults);
      return value ? [css, value] : null;
    }).filter(Boolean),
  );
}

// Returns a CSS :root block string — used for SSR <style> injection.
export function buildThemeCss(userColors, variant = "default") {
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;
  const vars = TOKEN_MAP.map(({ key, css }) => {
    const value = resolve(userColors, key, defaults);
    return value ? `${css}: ${value};` : null;
  })
    .filter(Boolean)
    .join(" ");
  return `:root { ${vars} }`;
}

// Returns the full flat color object with all defaults resolved.
// Used by the /api/theme endpoint and settings live preview.
export function buildThemeJson(userColors, variant = "default") {
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;
  return Object.fromEntries(
    TOKEN_MAP.map(({ key }) => [key, resolve(userColors, key, defaults)]),
  );
}
