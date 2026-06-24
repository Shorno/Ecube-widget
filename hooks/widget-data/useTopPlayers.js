"use client";
import { useGetTopPlayersQuery } from "@/lib/services/widget-api";
import { getMockTopPlayers, MOCK_MATCH_INFO } from "./mockAfterMatchScore";

/** @returns {import("@/types/widgets").UseTopPlayersResult} */
export function useTopPlayers(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetTopPlayersQuery(
    { tournamentID },
    { skip: preview },
  );

  if (preview) {
    return {
      players: getMockTopPlayers(),
      info: MOCK_MATCH_INFO,
      ready: true,
    };
  }

  const players = data?.data ?? [];
  const info = data?.info ?? null;
  return { players, info, ready: !isLoading && !!data && data?.data != null };
}
