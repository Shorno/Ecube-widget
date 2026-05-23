import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import {
  buildThemeStyle,
  WIDGET_FONTS,
  VARIANT_DEFAULTS,
  VARIANT_FONT_DEFAULTS,
} from "@/themes/catalog";

// Public — no auth. Widgets fetch their own effective theme (colors, font, variant).
export async function GET(_, { params }) {
  const { userId, tournamentID } = await params;

  const user = await getUser(userId);
  if (!user || !user.allowedTournamentIds?.includes(tournamentID)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const variant =
    user.tournamentDesigns?.[tournamentID] ??
    user.themeConfig?.designVariant ??
    "default";

  const variantFontDefaults =
    VARIANT_FONT_DEFAULTS[variant] ?? VARIANT_FONT_DEFAULTS.default;

  // Tournament font: explicit override → variant default (no global bleed)
  const fontKey =
    user.tournamentFonts?.[tournamentID] ?? variantFontDefaults.primary;

  const fontEntry =
    WIDGET_FONTS.find((f) => f.key === fontKey) ?? WIDGET_FONTS[0];

  // Colors: per-tournament per-design → variant defaults (no global bleed)
  const effectiveColors =
    user.tournamentDesignColors?.[tournamentID]?.[variant] ?? {};

  const cssVars = buildThemeStyle(effectiveColors, variant);

  return NextResponse.json({
    tournamentName: user.tournamentNames?.[tournamentID] ?? null,
    variant,
    fontKey,
    fontCss: fontEntry.css,
    colors: effectiveColors,
    cssVars,
  });
}
