import type { DropLootedPayload } from "@/types/drop-looted";
import type { FirstBloodPayload } from "@/types/first-blood";
import type { GrenadierPayload } from "@/types/grenadier";
import type { MolotovPayload } from "@/types/molotov";
import type { PlayerAchievementPayload } from "@/types/player-achievement";
import type { VehicleElimPayload } from "@/types/vehicle-elim";

export type PlayerAchievementQueueItem = {
  kind: "player-achievement";
  data: PlayerAchievementPayload;
};

// PLAYER_ACHIEVEMENT with achievement "KILL_STEALER" — not a kill-count
// milestone, so it gets its own icon banner instead of the count banner.
export type KillStealerQueueItem = {
  kind: "kill-stealer";
  data: PlayerAchievementPayload;
};

export type FirstBloodQueueItem = {
  kind: "first-blood";
  data: FirstBloodPayload;
};

export type DropLootedQueueItem = {
  kind: "drop-looted";
  data: DropLootedPayload;
};

export type VehicleElimQueueItem = {
  kind: "vehicle-elim";
  data: VehicleElimPayload;
};

export type GrenadierQueueItem = {
  kind: "grenadier";
  data: GrenadierPayload;
};

export type MolotovQueueItem = {
  kind: "molotov";
  data: MolotovPayload;
};

export type AchievementQueueItem =
  | PlayerAchievementQueueItem
  | KillStealerQueueItem
  | FirstBloodQueueItem
  | DropLootedQueueItem
  | VehicleElimQueueItem
  | GrenadierQueueItem
  | MolotovQueueItem;
