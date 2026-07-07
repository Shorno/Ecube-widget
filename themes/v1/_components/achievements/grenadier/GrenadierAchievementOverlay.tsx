"use client";

import type { GrenadierPayload } from "@/types/grenadier";
import AchievementBanner from "../AchievementBanner";
import { GRENADE_ICON } from "../achievementIcons";

type Props = {
  data: GrenadierPayload;
};

// No-kill-count achievement — the player who scored a grenade elimination.
// Renders the icon + title header, same layout as First Blood.
export default function GrenadierAchievementOverlay({ data }: Props) {
  const causer = data.causer;
  return (
    <AchievementBanner
      player={causer.player}
      team={causer.team}
      title="GRENADIER"
      icon={GRENADE_ICON}
    />
  );
}
