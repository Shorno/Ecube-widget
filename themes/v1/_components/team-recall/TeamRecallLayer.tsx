"use client";

import { AnimatePresence } from "framer-motion";
import type { TeamRecallPayload } from "@/types/team-recall";
import TeamRecallOverlay from "./TeamRecallOverlay";
import TeamRecallPreviewPanel from "./TeamRecallPreviewPanel";

type Props = {
  currentRecall: TeamRecallPayload | null;
  isVisible: boolean;
  onExitComplete: () => void;
  preview?: boolean;
  isLocked?: boolean;
  onTriggerPreview?: (scenarioKey: string) => void;
  onResetPreview?: () => void;
  showFullTeamName?: boolean;
};

export default function TeamRecallLayer({
  currentRecall,
  isVisible,
  onExitComplete,
  preview = false,
  isLocked = false,
  onTriggerPreview,
  onResetPreview,
  showFullTeamName = false,
}: Props) {
  return (
    <>
      {preview && onTriggerPreview && onResetPreview && (
        <TeamRecallPreviewPanel
          isLocked={isLocked}
          onTrigger={onTriggerPreview}
          onReset={onResetPreview}
        />
      )}

      <div className="pointer-events-none fixed top-[176px] left-1/2 z-40 -translate-x-1/2">
        <AnimatePresence onExitComplete={onExitComplete}>
          {isVisible && currentRecall && (
            <TeamRecallOverlay
              key={currentRecall.id}
              data={currentRecall}
              showFullTeamName={showFullTeamName}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
