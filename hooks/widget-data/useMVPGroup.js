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
  const mvp = data?.data ?? {};
  const info = data?.info ?? null;
  return { mvp, info, ready: !isLoading && !!data && data?.data != null };
}
