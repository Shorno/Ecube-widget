"use client";

import { useCallback } from "react";
import type { AchievementQueueItem } from "@/types/achievement-event";
import { getMockDominationAchievement } from "./mockDominationAchievement";
import { getMockDropLootedAchievement } from "./mockDropLootedAchievement";
import { getMockFirstBloodAchievement } from "./mockFirstBloodAchievement";
import { getMockGrenadierAchievement } from "./mockGrenadierAchievement";
import { getMockRampageAchievement } from "./mockRampageAchievement";
import { getMockVehicleElimAchievement } from "./mockVehicleElimAchievement";
import { parseAchievementEvent } from "./parseAchievementEvent";
import { useAchievementQueue } from "./useAchievementQueue";
import {
  shouldResetForMatchBoundary,
  useTournamentSocket,
  type TournamentSocketMeta,
} from "./useTournamentSocket";

type Options = { preview?: boolean };

export function useAchievements(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useAchievementQueue();
  const { enqueue, isLocked, reset } = queue;

  const handleSocketMessage = useCallback(
    (parsed: { event?: string; data?: unknown }, meta: TournamentSocketMeta) => {
      if (shouldResetForMatchBoundary(parsed.event, meta)) {
        reset();
        return;
      }

      const item = parseAchievementEvent(parsed.event ?? "", parsed.data);
      if (item) enqueue(item);
    },
    [enqueue, reset],
  );

  useTournamentSocket(tournamentID, {
    preview,
    onMessage: handleSocketMessage,
  });

  const triggerPreview = useCallback(
    (item: AchievementQueueItem) => {
      if (!preview || isLocked) return;
      enqueue(item);
    },
    [preview, isLocked, enqueue],
  );

  const triggerRampagePreview = useCallback(() => {
    triggerPreview({
      kind: "player-achievement",
      data: getMockRampageAchievement(),
    });
  }, [triggerPreview]);

  const triggerDominationPreview = useCallback(() => {
    triggerPreview({
      kind: "player-achievement",
      data: getMockDominationAchievement(),
    });
  }, [triggerPreview]);

  const triggerFirstBloodPreview = useCallback(() => {
    triggerPreview({
      kind: "first-blood",
      data: getMockFirstBloodAchievement(),
    });
  }, [triggerPreview]);

  const triggerDropLootedPreview = useCallback(() => {
    triggerPreview({
      kind: "drop-looted",
      data: getMockDropLootedAchievement(),
    });
  }, [triggerPreview]);

  const triggerVehicleElimPreview = useCallback(() => {
    triggerPreview({
      kind: "vehicle-elim",
      data: getMockVehicleElimAchievement(),
    });
  }, [triggerPreview]);

  const triggerGrenadierPreview = useCallback(() => {
    triggerPreview({
      kind: "grenadier",
      data: getMockGrenadierAchievement(),
    });
  }, [triggerPreview]);

  return {
    ...queue,
    preview,
    triggerRampagePreview,
    triggerDominationPreview,
    triggerFirstBloodPreview,
    triggerDropLootedPreview,
    triggerVehicleElimPreview,
    triggerGrenadierPreview,
  };
}
