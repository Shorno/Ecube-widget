"use client";
import { useGetMvpMatchQuery } from "@/lib/services/widget-api";

/**
 * Match MVP.
 * Returns:
 *   mvp     — array of MVP player objects (usually 1)
 *   player  — first/primary MVP player
 *   ready
 */
export function useMVP(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetMvpMatchQuery(
    { tournamentID },
    { skip: preview }
  );

  if (preview) {
    return {
      mvp: {
        player_ign: "KZesMiSTAKE47z",
        player_imageUrl: "/default-player.png",
        team_logoUrl: null,
        team_name: "KZ ESPORTS",
        kills: 13,
        damages: 1960,
        knocks: 12,
        heals: 583,
        survival_time_display: { text: "21:30" },
      },
      info: {
        stage_name: "HV LI JUNE 22",
        match_name: "MATCH 3",
        day: "DAY 1",
      },
      ready: true,
    };
  }

  const mvp = data?.data ?? {};
  const info = data?.info;
  return { mvp, info, ready: !isLoading && !!data && data?.data != null };
}
