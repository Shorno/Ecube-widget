"use client";

import { useAchievements } from "@/hooks/widget-data";
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
