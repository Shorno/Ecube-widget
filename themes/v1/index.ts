// v1 design bundle — slot names must match what getUserDesignRegistry() destructures.
// TypeScript ensures every exported component matches the WidgetSlot contract.

import type { FC } from "react";

export type WidgetProps = { tournamentID: string };
export type WidgetComponent = FC<WidgetProps>;

// All slot names the registry knows about. Adding a slot here makes TypeScript
// complain if you forget to export a matching component below.
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
  | "WWCStats";

// ── Built slots ───────────────────────────────────────────────────────────────
export { default as AfterMatchScore } from "./AfterMatchScoreView";
export { default as MatchSummary } from "./MatchSummaryView";

// ── TODO: uncomment as you build each view ────────────────────────────────────
// export { default as AfterMatchScoreGroup } from "./AfterMatchScoreGroupView";
// export { default as MVP }                  from "./MVPView";
// export { default as MVPGroup }             from "./MVPGroupView";
// export { default as HeadToHead }           from "./HeadToHeadView";
// export { default as TopPlayers }           from "./TopPlayersView";
// export { default as TopPlayersGroup }      from "./TopPlayersGroupView";
export { default as WWC } from "./WWCView";
// export { default as WWCTwo }               from "./WWCTwoView";
// export { default as WWCStats }             from "./WWCStatsView";

// ── Token manifest ────────────────────────────────────────────────────────────
export { COLOR_TOKENS, TOKEN_DEFAULTS } from "./tokens";
