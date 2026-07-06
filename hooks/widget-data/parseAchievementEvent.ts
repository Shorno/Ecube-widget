import type { AchievementQueueItem } from "@/types/achievement-event";
import type { DropLootedPayload } from "@/types/drop-looted";
import type { FirstBloodPayload } from "@/types/first-blood";
import type { GrenadierPayload } from "@/types/grenadier";
import type { PlayerAchievementPayload } from "@/types/player-achievement";
import type { VehicleElimPayload } from "@/types/vehicle-elim";

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

function isDropLootedPayload(data: unknown): data is DropLootedPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as DropLootedPayload;
  return Boolean(payload.player && payload.team);
}

// PLAYER_ELIMINATION fires on every kill; only vehicle kills become an
// achievement, so require the weapon type to be "vehicle".
function isVehicleElimPayload(data: unknown): data is VehicleElimPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as VehicleElimPayload;
  return Boolean(
    payload.causer?.player &&
      payload.victim?.player &&
      payload.weapon?.type === "vehicle",
  );
}

// Same PLAYER_ELIMINATION event, gated to grenade kills.
function isGrenadierPayload(data: unknown): data is GrenadierPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as GrenadierPayload;
  return Boolean(
    payload.causer?.player &&
      payload.victim?.player &&
      payload.weapon?.type === "grenade",
  );
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

  if (eventName === "DROP_LOOTED" && isDropLootedPayload(data)) {
    return { kind: "drop-looted", data };
  }

  if (eventName === "PLAYER_ELIMINATION" && isVehicleElimPayload(data)) {
    return { kind: "vehicle-elim", data };
  }

  if (eventName === "PLAYER_ELIMINATION" && isGrenadierPayload(data)) {
    return { kind: "grenadier", data };
  }

  return null;
}
