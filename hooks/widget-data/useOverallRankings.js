"use client";

import { useGetLiveRankingQuery } from "@/lib/services/widget-api";
import { mapLiveRankList } from "./mapLiveRankEntry";

/**
 * Overall Rankings (v1 Score Group) — live tournament standings.
 * Source: GET /matches/active-match/rank-data/{tournamentID}
 *
 * Returns:
 *   col1  — teams ranked 1–10
 *   col2  — teams ranked 11–20
 *   info  — null (rank-data does not include match metadata)
 *   ready — true when data has loaded
 */
export function useOverallRankings(tournamentID) {
  const { data, isLoading } = useGetLiveRankingQuery({ tournamentID });
  const rows = Array.isArray(data) ? mapLiveRankList(data) : [];
  const col1 = rows.slice(0, 10);
  const col2 = rows.slice(10, 20);

  return {
    col1,
    col2,
    info: null,
    ready: !isLoading && Array.isArray(data) && data.length > 0,
  };
}
