"use client";

import { useRampageAchievement } from "@/hooks/widget-data";
import RampageAchievementLayer from "./_components/achievements/rampage/RampageAchievementLayer";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

export default function RampageAchievementView({
  tournamentID,
  preview = false,
}: Props) {
  const {
    currentAchievement,
    isVisible,
    isLocked,
    triggerPreview,
    onExitComplete,
    preview: isPreview,
  } = useRampageAchievement(tournamentID, { preview });

  return (
    <div className="relative h-screen w-screen bg-transparent">
      {isPreview && (
        <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
          Preview mode
        </div>
      )}

      <RampageAchievementLayer
        currentAchievement={currentAchievement}
        isVisible={isVisible}
        onExitComplete={onExitComplete}
        preview={isPreview}
        isLocked={isLocked}
        onTriggerPreview={triggerPreview}
        showTriggerButton
      />
    </div>
  );
}
