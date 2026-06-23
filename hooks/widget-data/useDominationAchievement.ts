"use client";

import { getMockDominationAchievement } from "./mockDominationAchievement";
import { usePlayerAchievement } from "./usePlayerAchievement";

type Options = { preview?: boolean };

export function useDominationAchievement(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  return usePlayerAchievement(tournamentID, {
    preview,
    achievement: "DOMINATION",
    getMock: getMockDominationAchievement,
  });
}
