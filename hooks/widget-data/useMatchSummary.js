"use client";
import { useGetMatchSummaryQuery } from "@/lib/services/widget-api";

/**
 * Match Summary — aggregate match stats.
 * Returns:
 *   stats   — { total_damages, total_knocks, total_airdrops_looted, total_heals, total_kills, total_rescues, ... }
 *   info    — tournament/match metadata
 *   ready
 */
export function useMatchSummary(tournamentID) {
  const { data, isLoading } = useGetMatchSummaryQuery({ tournamentID });
  const stats = data?.data ?? null;
  const info = data?.info ?? null;
  return { stats, info, ready: !isLoading && !!data };
}
