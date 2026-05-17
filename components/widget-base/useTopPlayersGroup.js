"use client";
import { useGetTopPlayersGroupQuery } from "@/lib/services/widget-api";

/**
 * Top Players Group (overall tournament standings).
 * Returns:
 *   players — array of top player objects
 *   info    — tournament metadata
 *   ready
 */
export function useTopPlayersGroup(tournamentID) {
  const { data, isLoading } = useGetTopPlayersGroupQuery({ tournamentID });
  const players = data?.data ?? [];
  const info    = data?.info ?? null;
  return { players, info, ready: !isLoading && !!data };
}
