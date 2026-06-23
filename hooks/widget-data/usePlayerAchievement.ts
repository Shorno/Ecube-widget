"use client";

import { useEffect } from "react";
import type { PlayerAchievementPayload } from "@/types/player-achievement";
import { useAchievementQueue } from "./useAchievementQueue";

type Options = {
  preview?: boolean;
  achievement: string;
  getMock: () => PlayerAchievementPayload;
};

function matchesAchievement(
  data: unknown,
  achievement: string,
): data is PlayerAchievementPayload {
  if (!data || typeof data !== "object") return false;
  const value = (data as PlayerAchievementPayload).achievement;
  return (
    typeof value === "string" &&
    value.toUpperCase() === achievement.toUpperCase()
  );
}

export function usePlayerAchievement(
  tournamentID: string,
  { preview = false, achievement, getMock }: Options,
) {
  const queue = useAchievementQueue({ preview, getMock });

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

      if (
        parsed.event === "PLAYER_ACHIEVEMENT" &&
        matchesAchievement(parsed.data, achievement)
      ) {
        queue.enqueue(parsed.data);
      }
    };

    return () => ws.close();
  }, [tournamentID, preview, achievement, queue.enqueue]);

  return { ...queue, preview };
}
