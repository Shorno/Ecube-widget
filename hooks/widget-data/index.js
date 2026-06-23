// Single import point for all widget data hooks.
// Usage in any design component:
//   import { useAfterMatchScore } from "@/hooks/widget-data";

export { useAfterMatchScore } from "./useAfterMatchScore";
export { useAfterMatchScoreGroup } from "./useAfterMatchScoreGroup";
export { useOverallRankings } from "./useOverallRankings";
export { useMatchSummary } from "./useMatchSummary";
export { useMVP } from "./useMVP";
export { useMVPGroup } from "./useMVPGroup";
export { useHeadToHead } from "./useHeadToHead";
export { useTopPlayers } from "./useTopPlayers";
export { useTopPlayersGroup } from "./useTopPlayersGroup";
export { useWWC } from "./useWWC";
export { useLiveOverallRanking } from "./useLiveOverallRanking";
export { useTeamElimination } from "./useTeamElimination";
export { useEliminationQueue } from "./useEliminationQueue";
export { useRampageAchievement } from "./useRampageAchievement";
export { useDominationAchievement } from "./useDominationAchievement";
export { usePlayerAchievement } from "./usePlayerAchievement";
export { useAchievementQueue } from "./useAchievementQueue";
// Note: WWCTwo and WWCStats both use useWWC — same data, different visuals
