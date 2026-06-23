"use client";

import { useEffect } from "react";
import type { PlayerAchievementPayload } from "@/types/player-achievement";
import { useAchievementQueue } from "./useAchievementQueue";

type Options = { preview?: boolean };

function isRampagePayload(data: unknown): data is PlayerAchievementPayload {
  if (!data || typeof data !== "object") return false;
  const achievement = (data as PlayerAchievementPayload).achievement;
  return (
    typeof achievement === "string" && achievement.toUpperCase() === "RAMPAGE"
  );
}

export function useRampageAchievement(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useAchievementQueue({ preview });

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

      if (parsed.event === "PLAYER_ACHIEVEMENT" && isRampagePayload(parsed.data)) {
        queue.enqueue(parsed.data);
      }
    };

    return () => ws.close();
  }, [tournamentID, preview, queue.enqueue]);

  return { ...queue, preview };
}
