"use client";

import { useGetLiveMatchInfoQuery } from "@/lib/services/widget-api";
import { MOCK_MATCH_INFO } from "./mockAfterMatchScore";

const MOCK_LIVE_MATCH = {
  id: "preview-match-1",
  name: MOCK_MATCH_INFO.match_name,
  map: "ERANGEL",
  stage_name: MOCK_MATCH_INFO.stage_name,
  day: MOCK_MATCH_INFO.day,
  is_running: true,
  is_completed: false,
};

/**
 * Live Match Info — current match metadata for match-start overlays.
 */
export function useLiveMatchInfo(tournamentID, { preview = false } = {}) {
  const { data, isLoading } = useGetLiveMatchInfoQuery(
    { tournamentID },
    { skip: preview },
  );

  if (preview) {
    return {
      match: MOCK_LIVE_MATCH,
      info: { ...MOCK_MATCH_INFO, match_map: "ERANGEL" },
      ready: true,
    };
  }

  return {
    match: data?.data ?? null,
    info: data?.info ?? null,
    ready: !isLoading && !!data?.data,
  };
}
