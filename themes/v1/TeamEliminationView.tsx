"use client";

import { useTeamElimination } from "@/hooks/widget-data";
import TeamEliminationLayer from "./_components/team-elimination/TeamEliminationLayer";

type Props = {
  tournamentID: string;
  preview?: boolean;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
};

export default function TeamEliminationView({
  tournamentID,
  preview = false,
  showTeamFlags = true,
  showFullTeamName = false,
}: Props) {
  const {
    currentElimination,
    isVisible,
    isLocked,
    triggerPreview,
    onExitComplete,
    preview: isPreview,
  } = useTeamElimination(tournamentID, { preview });

  return (
    <div className="relative h-screen w-screen bg-transparent">
      {isPreview && (
        <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
          Preview mode
        </div>
      )}

      <TeamEliminationLayer
        currentElimination={currentElimination}
        isVisible={isVisible}
        onExitComplete={onExitComplete}
        preview={isPreview}
        isLocked={isLocked}
        onTriggerPreview={triggerPreview}
        showTriggerButton
        showTeamFlags={showTeamFlags}
        showFullTeamName={showFullTeamName}
      />
    </div>
  );
}
