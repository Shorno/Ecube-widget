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
  const mvp = data?.data ?? {};
  const info = data?.info;
  return { mvp, info, ready: !isLoading && !!data && data?.data != null };
}
