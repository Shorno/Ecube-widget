"use client";
import { useGetMatchSummaryQuery } from "@/lib/services/widget-api";

/**
 * Match Summary — aggregate match stats.
 * Returns:
 *   stats   — { total_kills, total_heals, total_knocks, total_grenade_kills, total_assists, total_vehicle_kills }
 *   info    — tournament/match metadata
 *   ready
 */
export function useMatchSummary(tournamentID) {
  const { data, isLoading } = useGetMatchSummaryQuery({ tournamentID });
  const stats = data?.data ?? null;
  const info = data?.info ?? null;
  return { stats, info, ready: !isLoading && !!data };
}
