import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import {
  VARIANT_DEFAULTS,
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
  }).lean();
  if (!user) redirect("/api/auth/logout");

  const variant = user?.themeConfig?.designVariant ?? "default";
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;
  const designExtras = getDesignExtras(variant);

  return (
    <SettingsClient
      userId={session.userId}
      userName={user?.name ?? ""}
      variant={variant}
      font={user?.themeConfig?.font ?? "oswald"}
      fontSecondary={user?.themeConfig?.fontSecondary ?? "rajdhani"}
      savedColors={user?.themeConfig?.colors ?? {}}
      defaults={defaults}
      allowedDesignIds={user?.allowedDesignIds ?? ["default"]}
      allowedTournamentIds={user?.allowedTournamentIds ?? []}
      tournamentDesigns={user?.tournamentDesigns ?? {}}
      tournamentNames={user?.tournamentNames ?? {}}
      tournamentColors={user?.tournamentColors ?? {}}
      tournamentFonts={user?.tournamentFonts ?? {}}
      tournamentSecondaryFonts={user?.tournamentSecondaryFonts ?? {}}
      widgetFonts={WIDGET_FONTS}
      predefinedThemes={PREDEFINED_THEMES}
      designExtras={designExtras}
    />
  );
}
