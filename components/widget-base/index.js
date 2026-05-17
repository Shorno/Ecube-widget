// Single import point for all widget data hooks.
// Usage in any design component:
//   import { useAfterMatchScore } from "@/components/widget-base";

export { useAfterMatchScore }      from "./useAfterMatchScore";
export { useAfterMatchScoreGroup } from "./useAfterMatchScoreGroup";
export { useMatchSummary }         from "./useMatchSummary";
export { useMVP }                  from "./useMVP";
export { useMVPGroup }             from "./useMVPGroup";
export { useHeadToHead }           from "./useHeadToHead";
export { useTopPlayers }           from "./useTopPlayers";
export { useTopPlayersGroup }      from "./useTopPlayersGroup";
export { useWWC }                  from "./useWWC";
// Note: WWCTwo and WWCStats both use useWWC — same data, different visuals
