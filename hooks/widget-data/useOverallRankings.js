"use client";

import { useGetAfterMatchScoreGroupQuery } from "@/lib/services/widget-api";
import {
  getMockOverallRankingsRows,
  MOCK_MATCH_INFO,
} from "./mockAfterMatchScore";

/**
 * Overall Rankings (v1 Score Group) — tournament group standings.
 * Source: GET /vmix/{tournamentID}/group/team-scoreboard
 *
 * Returns:
 *   col1  — teams ranked 1–10
 *   col2  — teams ranked 11–20
 *   info  — tournament/match metadata
 *   ready — true when data has loaded
 */
export function useOverallRankings(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetAfterMatchScoreGroupQuery(
    { tournamentID },
    { skip: preview },
  );

  if (preview) {
    const rows = getMockOverallRankingsRows();
    return {
      col1: rows.slice(0, 10),
      col2: rows.slice(10, 20),
      info: MOCK_MATCH_INFO,
      ready: true,
    };
  }

  const rows = [...(data?.data ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  const col1 = rows.slice(0, 10);
  const col2 = rows.slice(10, 20);
  const info = data?.info ?? null;

  return {
    col1,
    col2,
    info,
    ready: !isLoading && !!data && rows.length > 0,
  };
}
