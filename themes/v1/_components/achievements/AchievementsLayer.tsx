"use client";

import { AnimatePresence } from "framer-motion";
import type { AchievementQueueItem } from "@/types/achievement-event";
import { ACHIEVEMENT_OVERLAY_POSITION_CLASS } from "./achievementPlacement";
import FirstBloodAchievementOverlay from "./first-blood/FirstBloodAchievementOverlay";
import RampageAchievementOverlay from "./rampage/RampageAchievementOverlay";

type Props = {
  currentEvent: AchievementQueueItem | null;
  isVisible: boolean;
  onExitComplete: () => void;
};

function queueItemKey(item: AchievementQueueItem): string {
  if (item.kind === "first-blood") {
    return `first-blood-${item.data.causer.player.id}-${item.data.placement}`;
  }
  return `player-achievement-${item.data.player.id}-${item.data.kills}-${item.data.achievement}`;
}

export default function AchievementsLayer({
  currentEvent,
  isVisible,
  onExitComplete,
}: Props) {
  return (
    <div className={ACHIEVEMENT_OVERLAY_POSITION_CLASS}>
      <div style={{ transform: "scale(0.7)", transformOrigin: "left center" }}>
        <AnimatePresence onExitComplete={onExitComplete}>
          {isVisible && currentEvent && (
            <>
              {currentEvent.kind === "player-achievement" && (
                <RampageAchievementOverlay
                  key={queueItemKey(currentEvent)}
                  data={currentEvent.data}
                />
              )}
              {currentEvent.kind === "first-blood" && (
                <FirstBloodAchievementOverlay
                  key={queueItemKey(currentEvent)}
                  data={currentEvent.data}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
