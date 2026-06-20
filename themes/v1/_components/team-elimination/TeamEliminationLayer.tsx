"use client";

import { AnimatePresence } from "framer-motion";
import type { TeamEliminationPayload } from "@/types/team-elimination";
import TeamEliminationOverlay from "./TeamEliminationOverlay";

type Props = {
  currentElimination: TeamEliminationPayload | null;
  isVisible: boolean;
  onExitComplete: () => void;
  preview?: boolean;
  isLocked?: boolean;
  onTriggerPreview?: () => void;
  showTriggerButton?: boolean;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
};

export default function TeamEliminationLayer({
  currentElimination,
  isVisible,
  onExitComplete,
  preview = false,
  isLocked = false,
  onTriggerPreview,
  showTriggerButton = false,
  showTeamFlags = true,
  showFullTeamName = false,
}: Props) {
  return (
    <>
      {preview && showTriggerButton && onTriggerPreview && (
        <div className="fixed top-5 right-5 z-50">
          <button
            type="button"
            onClick={onTriggerPreview}
            disabled={isLocked}
            className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trigger Elimination
          </button>
        </div>
      )}

      <div className="pointer-events-none fixed top-[12%] left-1/2 z-40 -translate-x-1/2">
        <AnimatePresence onExitComplete={onExitComplete}>
          {isVisible && currentElimination && (
            <TeamEliminationOverlay
              key={`${currentElimination.victimTeam.id}-${currentElimination.placement}`}
              data={currentElimination}
              showTeamFlags={showTeamFlags}
              showFullTeamName={showFullTeamName}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
