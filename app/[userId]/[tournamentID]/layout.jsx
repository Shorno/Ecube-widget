import { notFound } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { buildThemeStyle, WIDGET_FONTS, VARIANT_FONT_DEFAULTS } from "@/themes/catalog";

export default async function TournamentLayout({ children, params }) {
  const { userId, tournamentID } = await params;
  const user = await getUser(userId);
  if (!user || !user.allowedTournamentIds.includes(tournamentID)) notFound();

  // Per-tournament design override → fallback to user default → "default"
  const variant =
    user.tournamentDesigns?.[tournamentID] ??
    user.themeConfig?.designVariant ??
    "default";

  const defaultFonts = VARIANT_FONT_DEFAULTS[variant] ?? VARIANT_FONT_DEFAULTS.default;

  const fontKey =
    user.tournamentFonts?.[tournamentID] ??
    user.themeConfig?.font ??
    defaultFonts.primary;
  const fontEntry =
    WIDGET_FONTS.find((f) => f.key === fontKey) ?? WIDGET_FONTS[0];

  const fontSecondaryKey =
    user.tournamentSecondaryFonts?.[tournamentID] ??
    user.themeConfig?.fontSecondary ??
    defaultFonts.secondary;
  const fontSecondaryEntry =
    WIDGET_FONTS.find((f) => f.key === fontSecondaryKey) ?? WIDGET_FONTS[1];

  // Per-tournament per-design colors → legacy tournamentColors → global colors
  const effectiveColors =
    user.tournamentDesignColors?.[tournamentID]?.[variant] ??
    user.tournamentColors?.[tournamentID] ??
    user.themeConfig?.colors ??
    {};

  const style = {
    ...buildThemeStyle(effectiveColors, variant),
    fontFamily: fontEntry.css,
    "--widget-font-primary": fontEntry.css,
    "--widget-font-secondary": fontSecondaryEntry.css,
  };

  const showTeamFlags = user.themeConfig?.showTeamFlags !== false;

  return (
    <div style={style} data-show-team-flags={showTeamFlags ? "1" : "0"}>
      {children}
    </div>
  );
}
