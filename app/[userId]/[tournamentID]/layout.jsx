import { notFound } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { buildThemeStyle, WIDGET_FONTS } from "@/lib/design/catalog";

export default async function TournamentLayout({ children, params }) {
  const { userId, tournamentID } = await params;
  const user = await getUser(userId);
  if (!user || !user.allowedTournamentIds.includes(tournamentID)) notFound();

  // Per-tournament design override → fallback to user default → "default"
  const variant =
    user.tournamentDesigns?.[tournamentID] ??
    user.themeConfig?.designVariant ??
    "default";

  const fontKey =
    user.tournamentFonts?.[tournamentID] ?? user.themeConfig?.font ?? "oswald";
  const fontEntry =
    WIDGET_FONTS.find((f) => f.key === fontKey) ?? WIDGET_FONTS[0];

  // Per-tournament color override → fallback to user's global colors
  const effectiveColors =
    user.tournamentColors?.[tournamentID] ?? user.themeConfig?.colors ?? {};

  const style = {
    ...buildThemeStyle(effectiveColors, variant),
    fontFamily: fontEntry.css,
  };

  return <div style={style}>{children}</div>;
}
