"use client";
import { useGetMvpMatchQuery } from "@/lib/services/widget-api";

/**
 * Match MVP.
 * Returns:
 *   mvp     — array of MVP player objects (usually 1)
 *   player  — first/primary MVP player
 *   ready
 */
export function useMVP(tournamentID) {
  const { data, isLoading } = useGetMvpMatchQuery({ tournamentID });
  const mvp    = data?.data ?? [];
  const player = mvp[0] ?? null;
  return { mvp, player, ready: !isLoading && !!data };
}
