"use client";
import { useGetAfterMatchScoreQuery } from "@/lib/services/widget-api";
import {
  getMockAfterMatchScoreRows,
  MOCK_MATCH_INFO,
} from "./mockAfterMatchScore";

/**
 * After-Match Score (single match standings).
 * Returns:
 *   winner  — top team (position 1)
 *   col1    — teams 2-7 (left column)
 *   col2    — teams 8-20 (right column)
 *   info    — tournament/match metadata
 *   ready   — true when data is loaded
 */
export function useAfterMatchScore(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetAfterMatchScoreQuery(
    { tournamentID },
    { skip: preview },
  );

  if (preview) {
    const rows = getMockAfterMatchScoreRows();
    return {
      winner: rows[0] ?? null,
      col1: rows.slice(1, 7),
      col2: rows.slice(7, 20),
      info: MOCK_MATCH_INFO,
      ready: true,
    };
  }

  const rows = data?.data ?? [];
  const winner = rows[0] ?? null;
  const col1 = rows.slice(1, 7);
  const col2 = rows.slice(7, 20);
  const info = data?.info ?? null;
  return { winner, col1, col2, info, ready: !isLoading && !!data };
}
