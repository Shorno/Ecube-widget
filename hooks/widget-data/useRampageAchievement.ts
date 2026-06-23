"use client";

import { getMockRampageAchievement } from "./mockRampageAchievement";
import { usePlayerAchievement } from "./usePlayerAchievement";

type Options = { preview?: boolean };

export function useRampageAchievement(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  return usePlayerAchievement(tournamentID, {
    preview,
    achievement: "RAMPAGE",
    getMock: getMockRampageAchievement,
  });
}
