"use client";
import { useGetHeadToHeadQuery } from "@/lib/services/widget-api";

function maxSurvivalTime(team) {
  const players = team?.players ?? [];
  if (!players.length) return null;
  const best = players.reduce((b, p) =>
    (p?.survival_time_display?.minute ?? 0) >
    (b?.survival_time_display?.minute ?? 0)
      ? p
      : b,
  );
  return best?.survival_time_display?.text ?? null;
}

/**
 * Head-to-Head — top 2 teams comparison.
 * Returns:
 *   teamA   — first team with total_survival_time injected
 *   teamB   — second team with total_survival_time injected
 *   info    — tournament metadata
 *   ready
 *
 * Stats available per team:
 *   total_damages, total_knocks, total_kills, total_survival_time, totalPoints,
 *   team_name, team_logoUrl, players[]
 */
export function useHeadToHead(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetHeadToHeadQuery(
    { tournamentID },
    { skip: preview }
  );

  if (preview) {
    return {
      teamA: {
        team_name: "KZ ESPORTS",
        team_logoUrl: null,
        total_kills: 24,
        total_damages: 3820,
        total_knocks: 18,
        total_heals: 12,
        total_survival_time: "21:30",
        totalPoints: 46,
      },
      teamB: {
        team_name: "TLB ESPORTS",
        team_logoUrl: null,
        total_kills: 18,
        total_damages: 2950,
        total_knocks: 14,
        total_heals: 9,
        total_survival_time: "19:45",
        totalPoints: 32,
      },
      info: {
        stage_name: "HV LI JUNE 22",
        match_name: "MATCH 3",
        day: "DAY 1",
      },
      ready: true,
    };
  }

  const rows = data?.data ?? [];

  const teamA = rows[0]
    ? { ...rows[0], total_survival_time: maxSurvivalTime(rows[0]) }
    : null;
  const teamB = rows[1]
    ? { ...rows[1], total_survival_time: maxSurvivalTime(rows[1]) }
    : null;
  const info = data?.info ?? null;

  return { teamA, teamB, info, ready: !isLoading && !!data };
}
