"use client";
import { useGetTopPlayersQuery } from "@/lib/services/widget-api";

/**
 * Top Players (single match).
 * Returns:
 *   players — array of top player objects
 *   info    — tournament metadata
 *   ready
 *
 * Player fields: name, team_name, kills, damage, knocks, etc.
 */
export function useTopPlayers(tournamentID) {
  const { data, isLoading } = useGetTopPlayersQuery({ tournamentID });
  const players = data?.data ?? [];
  const info = data?.info ?? null;
  return { players, info, ready: !isLoading && !!data };
}
