import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { VARIANT_DEFAULTS, WIDGET_FONTS, PREDEFINED_THEMES } from "@/lib/design/catalog";
import SettingsClient from "./_components/SettingsClient";

export default async function SettingsPage() {
  const session = await requireSession();

  await connectDB();
  const user = await User.findById(session.userId, {
    themeConfig:          1,
    allowedDesignIds:     1,
    allowedTournamentIds: 1,
    tournamentDesigns:    1,
    tournamentNames:      1,
    tournamentColors:     1,
    tournamentFonts:      1,
  }).lean();
  if (!user) redirect("/api/auth/logout");

  const variant  = user?.themeConfig?.designVariant ?? "default";
  const defaults = VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default;

  return (
    <SettingsClient
      userId={session.userId}
      variant={variant}
      font={user?.themeConfig?.font ?? "oswald"}
      savedColors={user?.themeConfig?.colors ?? {}}
      defaults={defaults}
      allowedDesignIds={user?.allowedDesignIds ?? ["default"]}
      allowedTournamentIds={user?.allowedTournamentIds ?? []}
      tournamentDesigns={user?.tournamentDesigns ?? {}}
      tournamentNames={user?.tournamentNames ?? {}}
      tournamentColors={user?.tournamentColors ?? {}}
      tournamentFonts={user?.tournamentFonts ?? {}}
      widgetFonts={WIDGET_FONTS}
      predefinedThemes={PREDEFINED_THEMES}
    />
  );
}
