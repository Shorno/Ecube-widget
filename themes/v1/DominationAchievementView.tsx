"use client";

import { useDominationAchievement } from "@/hooks/widget-data";
import DominationAchievementLayer from "./_components/achievements/domination/DominationAchievementLayer";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

export default function DominationAchievementView({
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
  } = useDominationAchievement(tournamentID, { preview });

  return (
    <div className="relative h-screen w-screen bg-transparent">
      {isPreview && (
        <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
          Preview mode
        </div>
      )}

      <DominationAchievementLayer
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
