"use client";

import { AnimatePresence } from "framer-motion";
import type { FirstBloodPayload } from "@/types/first-blood";
import FirstBloodAchievementOverlay from "./FirstBloodAchievementOverlay";

type Props = {
  currentFirstBlood: FirstBloodPayload | null;
  isVisible: boolean;
  onExitComplete: () => void;
  preview?: boolean;
  isLocked?: boolean;
  onTriggerPreview?: () => void;
  showTriggerButton?: boolean;
};

export default function FirstBloodAchievementLayer({
  currentFirstBlood,
  isVisible,
  onExitComplete,
  preview = false,
  isLocked = false,
  onTriggerPreview,
  showTriggerButton = false,
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
            Trigger First Blood
          </button>
        </div>
      )}

      <div className="pointer-events-none fixed top-[12%] left-1/2 z-40 -translate-x-1/2">
        <AnimatePresence onExitComplete={onExitComplete}>
          {isVisible && currentFirstBlood && (
            <FirstBloodAchievementOverlay
              key={`${currentFirstBlood.causer.player.id}-${currentFirstBlood.placement}`}
              data={currentFirstBlood}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
