"use client";

import { useEffect } from "react";
import { useAchievements } from "@/hooks/widget-data";
import { ACHIEVEMENT_ICONS } from "./_components/achievements/achievementIcons";
import AchievementPreviewControls from "./_components/achievements/AchievementPreviewControls";
import AchievementsLayer from "./_components/achievements/AchievementsLayer";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

export default function AchievementsView({
  tournamentID,
  preview = false,
}: Props) {
  const {
    currentEvent,
    isVisible,
    isLocked,
    onExitComplete,
    preview: isPreview,
    triggerRampagePreview,
    triggerDominationPreview,
    triggerFirstBloodPreview,
    triggerDropLootedPreview,
    triggerVehicleElimPreview,
    triggerGrenadierPreview,
  } = useAchievements(tournamentID, { preview });

  // Warm the achievement header icons into the browser cache on mount. Overlays
  // only reference an icon once its event fires, so without this the first event
  // of each type fetches the icon from the network mid-animation and flashes a
  // blank slot. Syncing with an external system (the browser image cache).
  useEffect(() => {
    ACHIEVEMENT_ICONS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="relative h-screen w-screen bg-transparent">
      {isPreview && (
        <>
          <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
            Preview mode
          </div>
          <AchievementPreviewControls
            onTriggerRampage={triggerRampagePreview}
            onTriggerDomination={triggerDominationPreview}
            onTriggerFirstBlood={triggerFirstBloodPreview}
            onTriggerDropLooted={triggerDropLootedPreview}
            onTriggerVehicleElim={triggerVehicleElimPreview}
            onTriggerGrenadier={triggerGrenadierPreview}
            isLocked={isLocked}
          />
        </>
      )}

      <AchievementsLayer
        currentEvent={currentEvent}
        isVisible={isVisible}
        onExitComplete={onExitComplete}
      />
    </div>
  );
}
