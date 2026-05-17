// Predefined widget fonts available to users.
// key  → must match the CSS variable suffix loaded in app/layout.jsx
// label → shown in the settings UI
// sample → preview sentence in that font
export const WIDGET_FONTS = [
  { key: "oswald",           label: "Oswald",           css: "var(--font-oswald)",           sample: "TEAM ALPHA — 14 PTS" },
  { key: "rajdhani",         label: "Rajdhani",         css: "var(--font-rajdhani)",         sample: "TEAM ALPHA — 14 PTS" },
  { key: "barlow-condensed", label: "Barlow Condensed", css: "var(--font-barlow-condensed)", sample: "TEAM ALPHA — 14 PTS" },
  { key: "bebas-neue",       label: "Bebas Neue",       css: "var(--font-bebas-neue)",       sample: "TEAM ALPHA — 14 PTS" },
  { key: "exo-2",            label: "Exo 2",            css: "var(--font-exo-2)",            sample: "TEAM ALPHA — 14 PTS" },
  { key: "russo-one",        label: "Russo One",        css: "var(--font-russo-one)",        sample: "TEAM ALPHA — 14 PTS" },
];

// Predefined color themes users can one-click apply.
// Clicking a theme populates the color editor client-side — no DB field needed.
export const PREDEFINED_THEMES = [
  {
    key: "default-orange", label: "Default Orange",
    swatches: ["#a54e26", "#008e88", "#0d0d0d"],
    colors: {
      primary:    { DEFAULT: "#a54e26", background: "#7a3a1c", border: "#5c2c14", dark: "#c45e30" },
      secondary:  { DEFAULT: "#008e88", background: "#006e69", border: "#005550", dark: "#00a89f" },
      status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(244,63,94,1)", dead: "rgba(0,0,0,0.5)" },
      background: "#0d0d0d", text: "#f5f5f5",
      gradient:   { start: "#a54e26", end: "#c45e30" },
    },
  },
  {
    key: "mythical-teal", label: "Mythical Teal",
    swatches: ["#007570", "#00B194", "#0a1a1a"],
    colors: {
      primary:    { DEFAULT: "#007570", background: "#005550", border: "#003d3a", dark: "#009e98" },
      secondary:  { DEFAULT: "#00B194", background: "#008f77", border: "#006b5a", dark: "#00c9a8" },
      status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(244,63,94,1)", dead: "rgba(0,0,0,0.5)" },
      background: "#0a1a1a", text: "#e8f5f5",
      gradient:   { start: "#007570", end: "#00B194" },
    },
  },
  {
    key: "crimson-strike", label: "Crimson Strike",
    swatches: ["#dc2626", "#7f1d1d", "#0a0000"],
    colors: {
      primary:    { DEFAULT: "#dc2626", background: "#7f1d1d", border: "#450a0a", dark: "#ef4444" },
      secondary:  { DEFAULT: "#b91c1c", background: "#991b1b", border: "#7f1d1d", dark: "#dc2626" },
      status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(251,191,36,1)", dead: "rgba(0,0,0,0.6)" },
      background: "#0a0000", text: "#fef2f2",
      gradient:   { start: "#dc2626", end: "#991b1b" },
    },
  },
  {
    key: "ocean-blue", label: "Ocean Blue",
    swatches: ["#1d4ed8", "#0ea5e9", "#030d1a"],
    colors: {
      primary:    { DEFAULT: "#1d4ed8", background: "#1e3a8a", border: "#1e3a5f", dark: "#2563eb" },
      secondary:  { DEFAULT: "#0ea5e9", background: "#0369a1", border: "#075985", dark: "#38bdf8" },
      status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(251,191,36,1)", dead: "rgba(0,0,0,0.5)" },
      background: "#030d1a", text: "#e0f2fe",
      gradient:   { start: "#1d4ed8", end: "#0ea5e9" },
    },
  },
  {
    key: "neon-purple", label: "Neon Purple",
    swatches: ["#7c3aed", "#a855f7", "#0d0014"],
    colors: {
      primary:    { DEFAULT: "#7c3aed", background: "#4c1d95", border: "#2e1065", dark: "#8b5cf6" },
      secondary:  { DEFAULT: "#a855f7", background: "#7e22ce", border: "#6b21a8", dark: "#c084fc" },
      status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(244,63,94,1)", dead: "rgba(0,0,0,0.5)" },
      background: "#0d0014", text: "#f5f3ff",
      gradient:   { start: "#7c3aed", end: "#a855f7" },
    },
  },
  {
    key: "midnight-gold", label: "Midnight Gold",
    swatches: ["#d97706", "#f59e0b", "#0a0800"],
    colors: {
      primary:    { DEFAULT: "#d97706", background: "#78350f", border: "#451a03", dark: "#f59e0b" },
      secondary:  { DEFAULT: "#b45309", background: "#92400e", border: "#78350f", dark: "#d97706" },
      status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(244,63,94,1)", dead: "rgba(0,0,0,0.5)" },
      background: "#0a0800", text: "#fefce8",
      gradient:   { start: "#d97706", end: "#f59e0b" },
    },
  },
  {
    key: "arctic-white", label: "Arctic White",
    swatches: ["#0f172a", "#334155", "#f8fafc"],
    colors: {
      primary:    { DEFAULT: "#0f172a", background: "#1e293b", border: "#334155", dark: "#475569" },
      secondary:  { DEFAULT: "#334155", background: "#475569", border: "#64748b", dark: "#94a3b8" },
      status:     { alive: "rgba(15,23,42,1)", knocked: "rgba(220,38,38,1)", dead: "rgba(148,163,184,0.6)" },
      background: "#f8fafc", text: "#0f172a",
      gradient:   { start: "#0f172a", end: "#334155" },
    },
  },
];

// Default color values per design variant.
// These are used when a user has no custom colors saved.
// Structure matches User.themeConfig.colors (Tournalink-style nested tokens).

export const VARIANT_DEFAULTS = {
  default: {
    primary:    { DEFAULT: "#a54e26", background: "#7a3a1c", border: "#5c2c14", dark: "#c45e30" },
    secondary:  { DEFAULT: "#008e88", background: "#006e69", border: "#005550", dark: "#00a89f" },
    status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(244,63,94,1)", dead: "rgba(0,0,0,0.5)" },
    background: "#0d0d0d",
    text:       "#f5f5f5",
    gradient:   { start: "#a54e26", end: "#c45e30" },
  },
  mythical: {
    primary:    { DEFAULT: "#007570", background: "#005550", border: "#003d3a", dark: "#009e98" },
    secondary:  { DEFAULT: "#00B194", background: "#008f77", border: "#006b5a", dark: "#00c9a8" },
    status:     { alive: "rgba(255,255,255,1)", knocked: "rgba(244,63,94,1)", dead: "rgba(0,0,0,0.5)" },
    background: "#0a1a1a",
    text:       "#e8f5f5",
    gradient:   { start: "#007570", end: "#00B194" },
  },
};

// Maps nested color token path → CSS custom property name.
// Used by buildThemeCss() and the /api/theme/[userId] endpoint.
// CSS custom property names injected per-user by the tournament layout.
// Use --widget-* prefix to avoid collisions with Tailwind's own --color-* namespace.
// New design components consume these via Tailwind utilities: bg-widget-primary, etc.
export const TOKEN_MAP = [
  { path: ["primary",   "DEFAULT"],    css: "--widget-primary"         },
  { path: ["primary",   "background"], css: "--widget-primary-bg"      },
  { path: ["primary",   "border"],     css: "--widget-primary-border"  },
  { path: ["primary",   "dark"],       css: "--widget-primary-dark"    },
  { path: ["secondary", "DEFAULT"],    css: "--widget-secondary"       },
  { path: ["secondary", "background"], css: "--widget-secondary-bg"    },
  { path: ["secondary", "border"],     css: "--widget-secondary-border"},
  { path: ["secondary", "dark"],       css: "--widget-secondary-dark"  },
  { path: ["status",    "alive"],      css: "--widget-status-alive"    },
  { path: ["status",    "knocked"],    css: "--widget-status-knocked"  },
  { path: ["status",    "dead"],       css: "--widget-status-dead"     },
  { path: ["background"],              css: "--widget-bg"              },
  { path: ["text"],                    css: "--widget-text"            },
  { path: ["gradient",  "start"],      css: "--widget-gradient-start"  },
  { path: ["gradient",  "end"],        css: "--widget-gradient-end"    },
];

function getIn(obj, path) {
  return path.reduce((cur, key) => cur?.[key], obj);
}

// Returns a CSS :root block injecting all theme tokens.
// userColors: User.themeConfig.colors (partial or full — missing keys fall back to variant defaults)
// variant: User.themeConfig.designVariant
export function buildThemeCss(userColors, variant = "default") {
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;

  const vars = TOKEN_MAP.map(({ path, css }) => {
    const value = getIn(userColors, path) || getIn(defaults, path);
    return value ? `${css}: ${value};` : null;
  }).filter(Boolean).join(" ");

  return `:root { ${vars} }`;
}

// Returns a React style object with all theme tokens as CSS custom properties.
// Safe to pass as the `style` prop on a wrapper element — CSS vars cascade to all children.
export function buildThemeStyle(userColors, variant = "default") {
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;

  return Object.fromEntries(
    TOKEN_MAP.map(({ path, css }) => {
      const value = getIn(userColors, path) || getIn(defaults, path);
      return value ? [css, value] : null;
    }).filter(Boolean),
  );
}

// Returns the full Tournalink-compatible theme JSON for a user.
// Used by GET /api/theme/[userId] and the settings live preview.
export function buildThemeJson(userColors, variant = "default") {
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;

  function resolve(path) {
    return getIn(userColors, path) || getIn(defaults, path);
  }

  return {
    primary: {
      DEFAULT:    resolve(["primary", "DEFAULT"]),
      background: resolve(["primary", "background"]),
      border:     resolve(["primary", "border"]),
      dark:       resolve(["primary", "dark"]),
    },
    secondary: {
      DEFAULT:    resolve(["secondary", "DEFAULT"]),
      background: resolve(["secondary", "background"]),
      border:     resolve(["secondary", "border"]),
      dark:       resolve(["secondary", "dark"]),
    },
    status: {
      alive:   resolve(["status", "alive"]),
      knocked: resolve(["status", "knocked"]),
      dead:    resolve(["status", "dead"]),
    },
    background: resolve(["background"]),
    text:       resolve(["text"]),
    gradient: {
      start: resolve(["gradient", "start"]),
      end:   resolve(["gradient", "end"]),
    },
  };
}
