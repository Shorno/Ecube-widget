"use client";
import { useGetMvpGroupQuery } from "@/lib/services/widget-api";

/**
 * Group/Tournament MVP.
 * Returns:
 *   mvp     — array of MVP player objects (usually 1)
 *   player  — first/primary MVP player
 *   ready
 */
export function useMVPGroup(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetMvpGroupQuery(
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
        match_played: 15,
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
  const info = data?.info ?? null;
  return { mvp, info, ready: !isLoading && !!data && data?.data != null };
}
