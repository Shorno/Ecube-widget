"use client";

import { useCallback, useRef } from "react";
import type { TeamRecallPayload } from "@/types/team-recall";
import { useLazyGetMatchRecallsQuery } from "@/lib/services/widget-api";
import { useRecallQueue } from "./useRecallQueue";
import {
  shouldResetForMatchBoundary,
  useTournamentSocket,
  type TournamentSocketMeta,
} from "./useTournamentSocket";

// A recall missed while the socket was down is still worth showing only if it
// just happened — older ones would pop up long after the moment passed.
const MISSED_RECALL_MAX_AGE_MS = 10_000;

type Options = { preview?: boolean };

/**
 * TEAM_RECALL drives the card live. The recalls endpoint covers the gap when
 * the socket reconnects: on first connect every existing recall is marked as
 * seen (never replayed), on reconnect any recent recall not seen yet is played.
 */
export function useTeamRecall(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const queue = useRecallQueue({ preview });
  const { enqueue, reset } = queue;
  const [fetchRecalls] = useLazyGetMatchRecallsQuery();
  // id → number of players already shown, so a grown recall still updates.
  const seenRef = useRef(new Map<string, number>());

  const play = useCallback(
    (recall: TeamRecallPayload) => {
      seenRef.current.set(recall.id, recall.players.length);
      enqueue(recall);
    },
    [enqueue],
  );

  const syncFromEndpoint = useCallback(
    async (meta: TournamentSocketMeta) => {
      const result = await fetchRecalls({ tournamentID });
      const recalls: TeamRecallPayload[] = result.data?.data ?? [];
      // Endpoint lists newest first; play missed ones in the order they happened.
      for (const recall of [...recalls].reverse()) {
        const seenCount = seenRef.current.get(recall.id);
        if (seenCount === recall.players.length) continue;
        const age = Date.now() - new Date(recall.recalledAt).getTime();
        if (meta.isReconnect && age <= MISSED_RECALL_MAX_AGE_MS) play(recall);
        else seenRef.current.set(recall.id, recall.players.length);
      }
    },
    [fetchRecalls, tournamentID, play],
  );

  const handleSocketMessage = useCallback(
    (
      parsed: { event?: string; data?: unknown },
      meta: TournamentSocketMeta,
    ) => {
      if (shouldResetForMatchBoundary(parsed.event, meta)) {
        // A reconnect is not a new match — keep the seen list so the
        // endpoint catch-up does not replay recalls already shown.
        if (parsed.event !== "match-connected") seenRef.current.clear();
        reset();
        return;
      }

      if (parsed.event === "TEAM_RECALL" && parsed.data) {
        play(parsed.data as TeamRecallPayload);
      }
    },
    [play, reset],
  );

  useTournamentSocket(tournamentID, {
    preview,
    onMessage: handleSocketMessage,
    onOpen: syncFromEndpoint,
  });

  return { ...queue, preview };
}
