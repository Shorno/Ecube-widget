// v1 design bundle — slot names must match what getUserDesignRegistry() destructures.
// Unimplemented slots are automatically filled from the default bundle by registry.js.

import type { FC } from "react";

export type WidgetProps = {
  tournamentID: string;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
  showObserverHighlight?: boolean;
  preview?: boolean;
};
export type TeamEliminationProps = {
  tournamentID: string;
  preview?: boolean;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
};
export type WidgetComponent = FC<WidgetProps>;

export type WidgetSlot =
  | "AfterMatchScore"
  | "AfterMatchScoreGroup"
  | "MatchSummary"
  | "MVP"
  | "MVPGroup"
  | "HeadToHead"
  | "TopPlayers"
  | "TopPlayersGroup"
  | "WWC"
  | "WWCTwo"
  | "WWCStats"
  | "LiveOverallRanking"
  | "TeamElimination"
  | "RampageAchievement"
  | "DominationAchievement";

// ── Built ─────────────────────────────────────────────────────────────────────
export { default as AfterMatchScore } from "./AfterMatchScoreView";
export { default as MatchSummary } from "./MatchSummaryView";
export { default as WWC } from "./WWCDView";
export { default as WWCTwo } from "./WWCDView";

// ── TODO: add v1 views here as you build them — default fills the rest ────────
export { default as AfterMatchScoreGroup } from "./AfterMatchScoreGroupView";
export { default as MVP } from "./MVPView";
export { default as MVPGroup } from "./MVPGroupView";
export { default as HeadToHead } from "./HeadToHeadView";
export { default as TopPlayers } from "./TopPlayersView";
export { default as TopPlayersGroup } from "./TopPlayersGroupView";
export { default as WWCStats } from "./WWCStatsView";
export { default as LiveOverallRanking } from "./LiveOverallRankingView";
export { default as TeamElimination } from "./TeamEliminationView";
export { default as RampageAchievement } from "./RampageAchievementView";
export { default as DominationAchievement } from "./DominationAchievementView";

// ── Token manifest ────────────────────────────────────────────────────────────
export { COLOR_TOKENS, TOKEN_DEFAULTS } from "./tokens";
