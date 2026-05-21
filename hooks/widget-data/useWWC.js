"use client";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";

/**
 * WWCD — shared by WWC, WWCTwo, WWCStats.
 *
 * Returns:
 *   team    — { team_name, team_logoUrl, total_kills, total_damages, totalPoints }
 *   players — [{ name, player_imageUrl, ... }]
 *   info    — tournament metadata
 *   ready
 *
 * Note: data.data is a single object (not an array).
 * Field names from API: team_logoUrl, total_damages, totalPoints, player_imageUrl
 */
export function useWWC(tournamentID) {
  const { data, isLoading } = useGetWwcdTeamStatsQuery({ tournamentID });
  const team = data?.data ?? null;
  const players = data?.data?.players ?? [];
  const info = data?.info ?? null;
  return { team, players, info, ready: !isLoading && !!data };
}
