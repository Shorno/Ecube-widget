"use client";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";
import {
  MOCK_MATCH_INFO,
  MOCK_WWC_PLAYERS,
  getMockAfterMatchScoreRows,
} from "./mockAfterMatchScore";

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
/** @returns {import("@/types/widgets").UseWWCResult} */
export function useWWC(tournamentID, { preview = false, previewPlayerCount } = {}) {
  const { data, isLoading } = useGetWwcdTeamStatsQuery(
    { tournamentID },
    { skip: preview },
  );

  if (preview) {
    const players =
      previewPlayerCount != null
        ? MOCK_WWC_PLAYERS.slice(0, previewPlayerCount)
        : MOCK_WWC_PLAYERS;
    const winner = getMockAfterMatchScoreRows()[0];
    return {
      team: winner
        ? {
            team_name: winner.team_name,
            team_logoUrl: winner.team_logoUrl,
            total_kills: winner.killPoints,
            totalPoints: winner.totalPoints,
            positionPoints: winner.positionPoints,
            killPoints: winner.killPoints,
            players,
          }
        : null,
      players,
      info: MOCK_MATCH_INFO,
      ready: true,
    };
  }

  const team = data?.data ?? null;
  const players = data?.data?.players ?? [];
  const info = data?.info ?? null;
  return {
    team,
    players,
    info,
    ready: !isLoading && !!data && data?.data != null,
  };
}
