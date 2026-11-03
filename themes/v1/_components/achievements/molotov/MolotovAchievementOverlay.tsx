"use client";

import type { MolotovPayload } from "@/types/molotov";
import AchievementBanner from "../AchievementBanner";
import { MOLOTOV_ICON } from "../achievementIcons";

type Props = {
  data: MolotovPayload;
};

// No-kill-count achievement — the player who scored a molotov elimination.
// Renders the icon + title header, same layout as First Blood.
export default function MolotovAchievementOverlay({ data }: Props) {
  const causer = data.causer;
  return (
    <AchievementBanner
      player={causer.player}
      team={causer.team}
      title="MOLOTOV ELIM"
      icon={MOLOTOV_ICON}
    />
  );
}
