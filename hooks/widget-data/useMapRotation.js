"use client";

import { useState } from "react";
import { useGetMapRotationQuery } from "@/lib/services/widget-api";

/**
 * Map Rotation — scheduled maps and completed winner results.
 * Completion is intentionally derived from winner_team only.
 */
export function useMapRotation(tournamentID) {
  const [cacheBuster] = useState(() => Date.now());
  const { data, isLoading } = useGetMapRotationQuery({ tournamentID, cacheBuster });
  const matches = Array.isArray(data?.data) ? data.data : [];
  const info = data?.info ?? null;

  return {
    matches,
    info,
    ready: !isLoading && !!data,
  };
}
