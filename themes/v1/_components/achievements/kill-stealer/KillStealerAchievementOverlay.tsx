"use client";

import type { PlayerAchievementPayload } from "@/types/player-achievement";
import AchievementBanner from "../AchievementBanner";
import { KILL_STEALER_ICON } from "../achievementIcons";

type Props = {
  data: PlayerAchievementPayload;
};

// No-kill-count achievement — the player who finished a knock their team didn't
// make (another team's, the zone's, a fall's, or a self/teammate grenade's).
// Renders the icon + title header, same layout as First Blood.
export default function KillStealerAchievementOverlay({ data }: Props) {
  return (
    <AchievementBanner
      player={data.player}
      team={data.team}
      title="KILL STEALER"
      icon={KILL_STEALER_ICON}
    />
  );
}
