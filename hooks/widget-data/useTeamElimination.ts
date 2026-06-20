"use client";

import { useEffect } from "react";
import type { TeamEliminationPayload } from "@/types/team-elimination";
import { useEliminationQueue } from "./useEliminationQueue";

type Options = { preview?: boolean };

export function useTeamElimination(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useEliminationQueue({ preview });

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

      if (parsed.event === "TEAM_ELIMINATION" && parsed.data) {
        queue.enqueue(parsed.data as TeamEliminationPayload);
      }
    };

    return () => ws.close();
  }, [tournamentID, preview, queue.enqueue]);

  return { ...queue, preview };
}
