import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { buildThemeStyle, WIDGET_FONTS, VARIANT_DEFAULTS } from "@/lib/design/catalog";

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

  const fontKey =
    user.tournamentFonts?.[tournamentID] ??
    user.themeConfig?.font ??
    "oswald";

  const fontEntry = WIDGET_FONTS.find((f) => f.key === fontKey) ?? WIDGET_FONTS[0];

  const effectiveColors =
    user.tournamentColors?.[tournamentID] ??
    user.themeConfig?.colors ??
    {};

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
