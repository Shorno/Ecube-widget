"use client";
import { useGetAfterMatchScoreGroupQuery } from "@/lib/services/widget-api";

/**
 * After-Match Score Group (overall/tournament standings).
 * Returns:
 *   winner  — rank 1 team
 *   col1    — teams 2-7
 *   col2    — teams 8-16
 *   info    — tournament metadata
 *   ready
 */
export function useAfterMatchScoreGroup(tournamentID) {
  const { data, isLoading } = useGetAfterMatchScoreGroupQuery({ tournamentID });
  const rows = data?.data ?? [];
  const winner = rows[0] ?? null;
  const col1 = rows.slice(1, 7);
  const col2 = rows.slice(7, 16);
  const info = data?.info ?? null;
  return { winner, col1, col2, info, ready: !isLoading && !!data };
}
