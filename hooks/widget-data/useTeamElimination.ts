"use client";

import { useCallback } from "react";
import type { TeamEliminationPayload } from "@/types/team-elimination";
import { useEliminationQueue } from "./useEliminationQueue";
import {
  shouldResetForMatchBoundary,
  useTournamentSocket,
  type TournamentSocketMeta,
} from "./useTournamentSocket";

type Options = { preview?: boolean };

export function useTeamElimination(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useEliminationQueue({ preview });
  const { enqueue, reset } = queue;

  const handleSocketMessage = useCallback(
    (parsed: { event?: string; data?: unknown }, meta: TournamentSocketMeta) => {
      if (shouldResetForMatchBoundary(parsed.event, meta)) {
        reset();
        return;
      }

      if (parsed.event === "TEAM_ELIMINATION" && parsed.data) {
        enqueue(parsed.data as TeamEliminationPayload);
      }
    },
    [enqueue, reset],
  );

  useTournamentSocket(tournamentID, {
    preview,
    onMessage: handleSocketMessage,
  });

  return { ...queue, preview };
}
