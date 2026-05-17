"use client";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";

/**
 * WWCD (Winner Winner Chicken Dinner) — shared by WWC, WWCTwo, WWCStats.
 * All three widgets use the same endpoint, just display differently.
 *
 * Returns:
 *   team      — winning team object { team_name, team_image, clan_tag, total_kills, total_damage, total_points }
 *   players   — array of players in the winning team
 *   gameInfo  — game/match metadata (data.game[0])
 *   info      — tournament metadata (data.info)
 *   ready
 */
export function useWWC(tournamentID) {
  const { data, isLoading } = useGetWwcdTeamStatsQuery({ tournamentID });
  const team    = data?.data?.[0] ?? null;
  const players = team?.players ?? [];
  const gameInfo = data?.game?.[0] ?? null;
  const info    = data?.info ?? null;
  return { team, players, gameInfo, info, ready: !isLoading && !!data };
}
