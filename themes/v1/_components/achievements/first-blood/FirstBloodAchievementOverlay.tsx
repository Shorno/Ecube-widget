"use client";

import type { FirstBloodPayload } from "@/types/first-blood";
import AchievementBanner from "../AchievementBanner";

type Props = {
  data: FirstBloodPayload;
};

// No-kill achievement — the causer of the first elimination. Renders the
// icon + title header (no count block).
export default function FirstBloodAchievementOverlay({ data }: Props) {
  const causer = data.causer;
  return (
    <AchievementBanner
      player={causer.player}
      team={causer.team}
      title="FIRST BLOOD"
    />
  );
}
