// Maps design variants to default CSS token values.
// Generic color slots (color1–color5) map to CSS variables:
//   color1 → --primary
//   color2 → --primary-shade-one
//   color3 → --primary-shade-two
//   color4 → --custom-yellow
//   color5 → --custom-green

export const VARIANTS = {
  default: {
    color1: "#a54e26",
    color2: "#008e88",
    color3: "#007570",
    color4: "#ffdd75",
    color5: "#00473c",
  },
  mythical: {
    color1: "#007570",
    color2: "#00B194",
    color3: "#00473C",
    color4: "#ffdd75",
    color5: "#00473c",
  },
};

// Maps generic color slot → CSS variable name
export const COLOR_TO_CSS_VAR = {
  color1: "--primary",
  color2: "--primary-shade-one",
  color3: "--primary-shade-two",
  color4: "--custom-yellow",
  color5: "--custom-green",
};

/**
 * Build a CSS string of :root overrides from a themeConfig.
 * Falls back to the variant defaults for any missing slot.
 */
export function buildThemeCss(themeConfig) {
  const variant  = themeConfig?.designVariant ?? "default";
  const defaults = VARIANTS[variant] ?? VARIANTS.default;
  const colors   = themeConfig?.colors ?? {};

  const vars = Object.entries(COLOR_TO_CSS_VAR)
    .map(([slot, cssVar]) => {
      const value = colors[slot] || defaults[slot];
      return `${cssVar}: ${value};`;
    })
    .join(" ");

  return `:root { ${vars} }`;
}
