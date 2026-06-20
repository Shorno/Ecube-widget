"use client";

import { AnimatePresence } from "framer-motion";
import { useTeamElimination } from "@/hooks/widget-data";
import TeamEliminationOverlay from "./_components/team-elimination/TeamEliminationOverlay";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

export default function TeamEliminationView({
  tournamentID,
  preview = false,
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
        <>
          <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
            Preview mode
          </div>
          <div className="fixed top-5 right-5 z-50">
            <button
              type="button"
              onClick={triggerPreview}
              disabled={isLocked}
              className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trigger Elimination
            </button>
          </div>
        </>
      )}

      <div className="pointer-events-none fixed top-[12%] left-1/2 z-40 -translate-x-1/2">
        <AnimatePresence onExitComplete={onExitComplete}>
          {isVisible && currentElimination && (
            <TeamEliminationOverlay
              key={`${currentElimination.victimTeam.id}-${currentElimination.placement}`}
              data={currentElimination}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
