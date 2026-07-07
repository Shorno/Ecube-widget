"use client";

import type { VehicleElimPayload } from "@/types/vehicle-elim";
import AchievementBanner from "../AchievementBanner";
import { VEHICLE_ICON } from "../achievementIcons";

type Props = {
  data: VehicleElimPayload;
};

// No-kill-count achievement — the player who scored a vehicle elimination.
// Renders the icon + title header, same layout as First Blood.
export default function VehicleElimAchievementOverlay({ data }: Props) {
  const causer = data.causer;
  return (
    <AchievementBanner
      player={causer.player}
      team={causer.team}
      title="VEHICLE ELIM"
      icon={VEHICLE_ICON}
    />
  );
}
