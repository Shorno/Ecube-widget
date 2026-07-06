import type { DropLootedPayload } from "@/types/drop-looted";
import type { FirstBloodPayload } from "@/types/first-blood";
import type { GrenadierPayload } from "@/types/grenadier";
import type { PlayerAchievementPayload } from "@/types/player-achievement";
import type { VehicleElimPayload } from "@/types/vehicle-elim";

export type PlayerAchievementQueueItem = {
  kind: "player-achievement";
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

export type AchievementQueueItem =
  | PlayerAchievementQueueItem
  | FirstBloodQueueItem
  | DropLootedQueueItem
  | VehicleElimQueueItem
  | GrenadierQueueItem;
