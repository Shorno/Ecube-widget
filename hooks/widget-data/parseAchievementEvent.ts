import type { AchievementQueueItem } from "@/types/achievement-event";
import type { FirstBloodPayload } from "@/types/first-blood";
import type { PlayerAchievementPayload } from "@/types/player-achievement";

function isPlayerAchievementPayload(
  data: unknown,
): data is PlayerAchievementPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as PlayerAchievementPayload;
  return (
    typeof payload.achievement === "string" &&
    Boolean(payload.player) &&
    Boolean(payload.team)
  );
}

function isFirstBloodPayload(data: unknown): data is FirstBloodPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as FirstBloodPayload;
  return Boolean(payload.causer?.player && payload.victim?.player);
}

export function parseAchievementEvent(
  eventName: string,
  data: unknown,
): AchievementQueueItem | null {
  if (eventName === "PLAYER_ACHIEVEMENT" && isPlayerAchievementPayload(data)) {
    return { kind: "player-achievement", data };
  }

  if (eventName === "FIRST_BLOOD" && isFirstBloodPayload(data)) {
    return { kind: "first-blood", data };
  }

  return null;
}
