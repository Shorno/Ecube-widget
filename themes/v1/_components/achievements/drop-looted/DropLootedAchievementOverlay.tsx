"use client";

import type { DropLootedPayload } from "@/types/drop-looted";
import AchievementBanner from "../AchievementBanner";

const AIRDROP_ICON = "/assets/match-summary/airdrop.svg";

type Props = {
  data: DropLootedPayload;
};

// No-kill achievement — the player who looted an air drop. Renders the
// icon + title header (no count block), same layout as First Blood.
export default function DropLootedAchievementOverlay({ data }: Props) {
  return (
    <AchievementBanner
      player={data.player}
      team={data.team}
      title="AIR DROP LOOTED"
      icon={AIRDROP_ICON}
    />
  );
}
