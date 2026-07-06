"use client";

import type { PlayerAchievementPayload } from "@/types/player-achievement";
import AchievementBanner from "../AchievementBanner";

type Props = {
  data: PlayerAchievementPayload;
};

// Kill-count achievements (Rampage, Domination, …) — same layout, different
// title/count. New count-based achievements need nothing here; the backend
// just sends a different `achievement` label.
export default function RampageAchievementOverlay({ data }: Props) {
  return (
    <AchievementBanner
      player={data.player}
      team={data.team}
      title={data.achievement}
      kills={data.kills ?? 0}
    />
  );
}
