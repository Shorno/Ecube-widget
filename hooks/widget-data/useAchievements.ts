"use client";

import { useCallback, useEffect } from "react";
import type { AchievementQueueItem } from "@/types/achievement-event";
import { getMockDominationAchievement } from "./mockDominationAchievement";
import { getMockFirstBloodAchievement } from "./mockFirstBloodAchievement";
import { getMockRampageAchievement } from "./mockRampageAchievement";
import { parseAchievementEvent } from "./parseAchievementEvent";
import { useAchievementQueue } from "./useAchievementQueue";

type Options = { preview?: boolean };

export function useAchievements(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useAchievementQueue();

  useEffect(() => {
    if (preview || !tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;

    const wsBase = apiBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const ws = new WebSocket(`${wsBase}/tournament?id=${tournamentID}`);

    ws.onmessage = (event) => {
      let parsed: { event?: string; data?: unknown };
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }

      const item = parseAchievementEvent(parsed.event ?? "", parsed.data);
      if (item) queue.enqueue(item);
    };

    return () => ws.close();
  }, [tournamentID, preview, queue.enqueue]);

  const triggerPreview = useCallback(
    (item: AchievementQueueItem) => {
      if (!preview || queue.isLocked) return;
      queue.enqueue(item);
    },
    [preview, queue.isLocked, queue.enqueue],
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

  return {
    ...queue,
    preview,
    triggerRampagePreview,
    triggerDominationPreview,
    triggerFirstBloodPreview,
  };
}
