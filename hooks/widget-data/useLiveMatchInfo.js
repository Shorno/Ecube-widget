"use client";

import { useGetLiveMatchInfoQuery } from "@/lib/services/widget-api";

/**
 * Live Match Info — current match metadata for match-start overlays.
 */
export function useLiveMatchInfo(tournamentID) {
  const { data, isLoading } = useGetLiveMatchInfoQuery({ tournamentID });

  return {
    match: data?.data ?? null,
    info: data?.info ?? null,
    ready: !isLoading && !!data?.data,
  };
}
