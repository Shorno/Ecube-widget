"use client";

import { useTeamRecall } from "@/hooks/widget-data";
import TeamRecallLayer from "./_components/team-recall/TeamRecallLayer";

type Props = {
  tournamentID: string;
  preview?: boolean;
  showFullTeamName?: boolean;
};

export default function TeamRecallView({
  tournamentID,
  preview = false,
  showFullTeamName = false,
}: Props) {
  const {
    currentRecall,
    isVisible,
    isLocked,
    triggerPreview,
    enqueue,
    reset,
    onExitComplete,
    preview: isPreview,
  } = useTeamRecall(tournamentID, { preview });

  return (
    <div className="relative h-screen w-screen bg-transparent">
      {isPreview && (
        <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
          Preview mode
        </div>
      )}

      <TeamRecallLayer
        currentRecall={currentRecall}
        isVisible={isVisible}
        onExitComplete={onExitComplete}
        preview={isPreview}
        isLocked={isLocked}
        onTriggerPreview={triggerPreview}
        onResetPreview={reset}
        onEnqueuePreview={enqueue}
        showFullTeamName={showFullTeamName}
      />
    </div>
  );
}
