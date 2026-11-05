import type { PlayerAchievementPayload } from "@/types/player-achievement";
import { getMockRampageAchievement } from "./mockRampageAchievement";

// Same sample player as the Rampage preview, finishing someone else's knock.
export function getMockKillStealerAchievement(): PlayerAchievementPayload {
  return {
    ...getMockRampageAchievement(),
    kills: 2,
    achievement: "KILL_STEALER",
    weapon: { id: "101004", name: "M416", type: "weapon" },
  };
}
