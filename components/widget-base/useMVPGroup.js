"use client";
import { useGetMvpGroupQuery } from "@/lib/services/widget-api";

/**
 * Group/Tournament MVP.
 * Returns:
 *   mvp     — array of MVP player objects (usually 1)
 *   player  — first/primary MVP player
 *   ready
 */
export function useMVPGroup(tournamentID) {
  const { data, isLoading } = useGetMvpGroupQuery({ tournamentID });
  const mvp    = data?.data ?? [];
  const player = mvp[0] ?? null;
  return { mvp, player, ready: !isLoading && !!data };
}
