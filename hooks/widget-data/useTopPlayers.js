"use client";
import { useGetTopPlayersQuery } from "@/lib/services/widget-api";

/** @returns {import("@/types/widgets").UseTopPlayersResult} */
export function useTopPlayers(tournamentID) {
  const { data, isLoading } = useGetTopPlayersQuery({ tournamentID });
  const players = data?.data ?? [];
  const info = data?.info ?? null;
  return { players, info, ready: !isLoading && !!data && data?.data != null };
}
