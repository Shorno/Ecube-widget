import type { FirstBloodPayload } from "@/types/first-blood";
import type { PlayerAchievementPayload } from "@/types/player-achievement";

export type PlayerAchievementQueueItem = {
  kind: "player-achievement";
  data: PlayerAchievementPayload;
};

export type FirstBloodQueueItem = {
  kind: "first-blood";
  data: FirstBloodPayload;
};

export type AchievementQueueItem =
  | PlayerAchievementQueueItem
  | FirstBloodQueueItem;
