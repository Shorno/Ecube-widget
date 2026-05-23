import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import {
  VARIANT_DEFAULTS,
  VARIANT_FONT_DEFAULTS,
  WIDGET_FONTS,
  PREDEFINED_THEMES,
} from "@/themes/catalog";
import { getDesignExtras } from "@/themes/extras";
import SettingsClient from "./_components/SettingsClient";

export default async function SettingsPage() {
  const session = await requireSession();

  await connectDB();
  const user = await User.findById(session.userId, {
    name: 1,
    themeConfig: 1,
    allowedDesignIds: 1,
    allowedTournamentIds: 1,
    tournamentDesigns: 1,
    tournamentNames: 1,
    tournamentColors: 1,
    tournamentFonts: 1,
    tournamentSecondaryFonts: 1,
    tournamentDesignColors: 1,
  }).lean();
  if (!user) redirect("/api/auth/logout");

  const variant = user?.themeConfig?.designVariant ?? "default";
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;

  // Compute extras for every design the user has access to so the client
  // can show the right extras regardless of which tournament is scoped.
  const allowedDesignIds = user?.allowedDesignIds ?? ["default"];
  const designExtrasMap = Object.fromEntries(
    allowedDesignIds.map((id) => [id, getDesignExtras(id)]),
  );

  // Only use saved colors if they were saved for the current design.
  // If design changed, show new design's defaults instead.
  const colorDesignVariant = user?.themeConfig?.colorDesignVariant ?? "";
  const savedColors =
    colorDesignVariant === variant ? (user?.themeConfig?.colors ?? {}) : {};

  return (
    <SettingsClient
      userId={session.userId}
      userName={user?.name ?? ""}
      variant={variant}
      font={
        user?.themeConfig?.font ??
        VARIANT_FONT_DEFAULTS[variant]?.primary ??
        "oswald"
      }
      fontSecondary={
        user?.themeConfig?.fontSecondary ??
        VARIANT_FONT_DEFAULTS[variant]?.secondary ??
        "rajdhani"
      }
      savedColors={savedColors}
      defaults={defaults}
      allowedDesignIds={allowedDesignIds}
      allowedTournamentIds={user?.allowedTournamentIds ?? []}
      tournamentDesigns={user?.tournamentDesigns ?? {}}
      tournamentNames={user?.tournamentNames ?? {}}
      tournamentColors={user?.tournamentColors ?? {}}
      tournamentFonts={user?.tournamentFonts ?? {}}
      tournamentSecondaryFonts={user?.tournamentSecondaryFonts ?? {}}
      tournamentDesignColors={user?.tournamentDesignColors ?? {}}
      widgetFonts={WIDGET_FONTS}
      predefinedThemes={PREDEFINED_THEMES}
      designExtrasMap={designExtrasMap}
    />
  );
}
