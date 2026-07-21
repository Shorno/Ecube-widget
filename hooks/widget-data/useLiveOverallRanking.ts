"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGetLiveRankingQuery } from "@/lib/services/widget-api";
import type { LiveRankEntry } from "@/types/live-rank";
import type { TopFourPayload } from "@/types/top-four";
import {
  getMockLiveOverallRanking,
  getMockTopFour,
  MOCK_OBSERVING_TEAM_ID,
  MOCK_OBSERVE_TEAM_IDS,
} from "./mockLiveOverallRanking";
import {
  shouldResetForMatchBoundary,
  useTournamentSocket,
  type TournamentSocketMeta,
} from "./useTournamentSocket";

type SortKey = "overAllPoints" | "points";

/**
 * Row order only — the rank NUMBERS come from the server on every entry.
 * "overAllPoints" reads group standings (already position-ordered by the API),
 * "points" reads this match's standings.
 */
function inRankOrder(data: LiveRankEntry[], sortKey: SortKey): LiveRankEntry[] {
  const key = sortKey === "points" ? "matchRank" : "position";
  return [...data].sort((a, b) => (a[key] ?? 0) - (b[key] ?? 0));
}

function teamId(entry: LiveRankEntry) {
  return entry.team.id ?? entry.team._id ?? String(entry.position);
}

function isTeamEliminated(players?: LiveRankEntry["players"]) {
  return (players ?? []).every((player) => player.liveState === 5);
}

function getAliveTeams(data: LiveRankEntry[]) {
  return data.filter((entry) => !isTeamEliminated(entry.players));
}

function mergeTopFourTeams(
  frozen: LiveRankEntry[],
  liveData: LiveRankEntry[],
): LiveRankEntry[] {
  const liveById = Object.fromEntries(liveData.map((t) => [teamId(t), t]));
  return frozen.map((entry) => {
    const live = liveById[teamId(entry)];
    if (!live) return entry;
    return {
      ...entry,
      players: live.players,
      winProbability: live.winProbability ?? entry.winProbability,
    };
  });
}

type Options = { preview?: boolean; sortBy?: SortKey };

/**
 * Live overall ranking — HTTP snapshot + WebSocket updates.
 * Pass preview: true (via ?preview=1) to render static mock data without a live match.
 * sortBy selects the ranking basis: "overAllPoints" (overall) or "points" (per-match live).
 */
export function useLiveOverallRanking(
  tournamentID: string,
  { preview = false, sortBy = "overAllPoints" }: Options = {},
) {
  const { data: initialData } = useGetLiveRankingQuery(
    { tournamentID },
    {
      skip: preview,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
  const [teams, setTeams] = useState<LiveRankEntry[]>(() =>
    preview ? inRankOrder(getMockLiveOverallRanking(), sortBy) : [],
  );
  const [showTopFour, setShowTopFour] = useState(false);
  const [topFourTeams, setTopFourTeams] = useState<LiveRankEntry[]>([]);
  const [isMatchConnected, setIsMatchConnected] = useState(preview);
  const [observingTeamId, setObservingTeamId] = useState<string | null>(
    preview ? MOCK_OBSERVING_TEAM_ID : null,
  );
  const topFourModeRef = useRef(false);

  const applyTopFour = useCallback(
    (data: TopFourPayload) => {
      const ranked = inRankOrder(data, sortBy).slice(0, 4);
      topFourModeRef.current = true;
      setTopFourTeams(ranked);
      setShowTopFour(true);
    },
    [sortBy],
  );

  const resetTopFour = useCallback(() => {
    topFourModeRef.current = false;
    setTopFourTeams([]);
    setShowTopFour(false);
  }, []);

  const resetLiveMatchState = useCallback(() => {
    setTeams([]);
    resetTopFour();
    setObservingTeamId(null);
  }, [resetTopFour]);

  const applyTeams = useCallback((data: LiveRankEntry[]) => {
    const ranked = inRankOrder(data, sortBy);
    const aliveTeams = getAliveTeams(ranked);

    setTeams(ranked);

    if (topFourModeRef.current && aliveTeams.length > 4) {
      resetTopFour();
      return;
    }

    if (
      !topFourModeRef.current &&
      aliveTeams.length <= 4 &&
      aliveTeams.length > 0
    ) {
      applyTopFour(aliveTeams);
      return;
    }

    if (topFourModeRef.current) {
      setTopFourTeams((prev) =>
        prev.length > 0 ? mergeTopFourTeams(prev, ranked) : prev,
      );
    }
  }, [applyTopFour, resetTopFour, sortBy]);

  useEffect(() => {
    if (preview) return;
    if (!Array.isArray(initialData) || initialData.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync external RTK Query snapshot into the live WebSocket state.
    applyTeams(initialData as LiveRankEntry[]);
  }, [initialData, preview, applyTeams]);

  const handleSocketMessage = useCallback(
    (parsed: { event?: string; data?: unknown }, meta: TournamentSocketMeta) => {
      const { event: eventName, data } = parsed;

      if (shouldResetForMatchBoundary(eventName, meta)) {
        resetLiveMatchState();
      }

      if (eventName === "match-connected") {
        setIsMatchConnected(true);
      }

      if (eventName === "MATCH_LIVE_RANK_DATA" && Array.isArray(data)) {
        applyTeams(data as LiveRankEntry[]);
      }

      if (eventName === "TOP_FOUR" && Array.isArray(data)) {
        applyTopFour(data as TopFourPayload);
      }

      if (eventName === "SET_OBSERVING_PLAYER") {
        const payload = data as { player?: { teamId?: string } } | null;
        setObservingTeamId(payload?.player?.teamId ?? null);
      }
    },
    [applyTeams, applyTopFour, resetLiveMatchState],
  );

  const handleSocketClose = useCallback(() => {
    setIsMatchConnected(false);
  }, []);

  useTournamentSocket(tournamentID, {
    preview,
    onMessage: handleSocketMessage,
    onClose: handleSocketClose,
  });

  const triggerObservingPreview = useCallback(() => {
    if (!preview) return;

    setObservingTeamId((current) => {
      const cycle = [...MOCK_OBSERVE_TEAM_IDS, null] as const;
      const currentIndex = current ? cycle.indexOf(current) : -1;
      const nextIndex = (currentIndex + 1) % cycle.length;
      return cycle[nextIndex] ?? null;
    });
  }, [preview]);

  const triggerTopFourPreview = useCallback(() => {
    if (!preview || showTopFour) return;
    applyTopFour(getMockTopFour());
  }, [preview, showTopFour, applyTopFour]);

  // Flip one alive team to fully eliminated — same data shape a live update
  // produces, so the row's transition detector plays its flash naturally.
  const triggerEliminationPreview = useCallback(() => {
    if (!preview) return;
    setTeams((current) => {
      const target = current.find(
        (entry) =>
          !entry.isMissing &&
          (entry.players?.length ?? 0) > 0 &&
          !isTeamEliminated(entry.players),
      );
      if (!target) return current;
      return current.map((entry) =>
        entry === target
          ? {
              ...entry,
              players: (entry.players ?? []).map((player) => ({
                ...player,
                liveState: 5,
                healths: 0,
              })),
            }
          : entry,
      );
    });
  }, [preview]);

  return {
    teams,
    showTopFour,
    topFourTeams,
    observingTeamId,
    ready: isMatchConnected && teams.length > 0,
    preview,
    triggerObservingPreview,
    triggerTopFourPreview,
    triggerEliminationPreview,
  };
}
