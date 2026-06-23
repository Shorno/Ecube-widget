"use client";

import { useFirstBloodAchievement } from "@/hooks/widget-data";
import FirstBloodAchievementLayer from "./_components/achievements/first-blood/FirstBloodAchievementLayer";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

export default function FirstBloodAchievementView({
  tournamentID,
  preview = false,
}: Props) {
  const {
    currentFirstBlood,
    isVisible,
    isLocked,
    triggerPreview,
    onExitComplete,
    preview: isPreview,
  } = useFirstBloodAchievement(tournamentID, { preview });

  return (
    <div className="relative h-screen w-screen bg-transparent">
      {isPreview && (
        <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
          Preview mode
        </div>
      )}

      <FirstBloodAchievementLayer
        currentFirstBlood={currentFirstBlood}
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
