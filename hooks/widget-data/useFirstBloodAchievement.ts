"use client";

import { useEffect } from "react";
import type { FirstBloodPayload } from "@/types/first-blood";
import { getMockFirstBloodAchievement } from "./mockFirstBloodAchievement";
import { useFirstBloodQueue } from "./useFirstBloodQueue";

type Options = { preview?: boolean };

function isFirstBloodPayload(data: unknown): data is FirstBloodPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as FirstBloodPayload;
  return Boolean(payload.causer?.player && payload.victim?.player);
}

export function useFirstBloodAchievement(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useFirstBloodQueue({
    preview,
    getMock: getMockFirstBloodAchievement,
  });

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

      if (parsed.event === "FIRST_BLOOD" && isFirstBloodPayload(parsed.data)) {
        queue.enqueue(parsed.data);
      }
    };

    return () => ws.close();
  }, [tournamentID, preview, queue.enqueue]);

  return { ...queue, preview };
}
