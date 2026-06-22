"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGetLiveRankingQuery } from "@/lib/services/widget-api";
import type { LiveRankEntry } from "@/types/live-rank";
import type { TeamEliminationPayload } from "@/types/team-elimination";
import type { TopFourPayload } from "@/types/top-four";
import {
  getMockLiveOverallRanking,
  getMockTopFour,
  MOCK_OBSERVING_TEAM_ID,
  MOCK_OBSERVE_TEAM_IDS,
} from "./mockLiveOverallRanking";
import { useEliminationQueue } from "./useEliminationQueue";

function sortByOverallPoints(data: LiveRankEntry[]) {
  return [...data].sort(
    (a, b) => (b.overAllPoints ?? 0) - (a.overAllPoints ?? 0),
  );
}

function withRankPositions(data: LiveRankEntry[]): LiveRankEntry[] {
  return sortByOverallPoints(data).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

function teamId(entry: LiveRankEntry) {
  return entry.team.id ?? entry.team._id ?? String(entry.rank);
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

type Options = { preview?: boolean };

/**
 * Live overall ranking — HTTP snapshot + WebSocket updates.
 * Pass preview: true (via ?preview=1) to render static mock data without a live match.
 */
export function useLiveOverallRanking(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const elimination = useEliminationQueue({ preview });
  const { data: initialData } = useGetLiveRankingQuery(
    { tournamentID },
    { skip: preview },
  );
  const [teams, setTeams] = useState<LiveRankEntry[]>(() =>
    preview ? getMockLiveOverallRanking() : [],
  );
  const [showTopFour, setShowTopFour] = useState(false);
  const [topFourTeams, setTopFourTeams] = useState<LiveRankEntry[]>([]);
  const [isMatchConnected, setIsMatchConnected] = useState(preview);
  const [observingTeamId, setObservingTeamId] = useState<string | null>(
    preview ? MOCK_OBSERVING_TEAM_ID : null,
  );
  const showTopFourRef = useRef(showTopFour);
  const applyTeamsRef = useRef<(data: LiveRankEntry[]) => void>(() => {});

  showTopFourRef.current = showTopFour;

  applyTeamsRef.current = (data) => {
    const ranked = withRankPositions(data);
    setTeams(ranked);
    if (showTopFourRef.current) {
      setTopFourTeams((prev) =>
        prev.length > 0 ? mergeTopFourTeams(prev, ranked) : prev,
      );
    }
  };

  const applyTopFour = useCallback((data: TopFourPayload) => {
    const ranked = withRankPositions(data).slice(0, 4);
    setTopFourTeams(ranked);
    setShowTopFour(true);
  }, []);

  useEffect(() => {
    if (preview) return;
    if (!Array.isArray(initialData) || initialData.length === 0) return;
    applyTeamsRef.current(initialData as LiveRankEntry[]);
  }, [initialData, preview]);

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

      const { event: eventName, data } = parsed;

      if (eventName === "match-connected") {
        setIsMatchConnected(true);
      }

      if (eventName === "MATCH_LIVE_RANK_DATA" && Array.isArray(data)) {
        applyTeamsRef.current(data as LiveRankEntry[]);
      }

      if (eventName === "TOP_FOUR" && Array.isArray(data)) {
        applyTopFour(data as TopFourPayload);
      }

      if (eventName === "SET_OBSERVING_PLAYER") {
        const payload = data as { player?: { teamId?: string } } | null;
        setObservingTeamId(payload?.player?.teamId ?? null);
      }

      if (eventName === "TEAM_ELIMINATION" && data) {
        elimination.enqueue(data as TeamEliminationPayload);
      }
    };

    ws.onclose = () => setIsMatchConnected(false);

    return () => ws.close();
  }, [tournamentID, preview, elimination.enqueue, applyTopFour]);

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

  return {
    teams,
    showTopFour,
    topFourTeams,
    observingTeamId,
    ready: isMatchConnected && teams.length > 0,
    preview,
    triggerObservingPreview,
    triggerTopFourPreview,
    ...elimination,
  };
}
