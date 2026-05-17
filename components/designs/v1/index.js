// v1 design bundle — exported components match the names consumed by getUserDesignRegistry().
// Each page does: const { AfterMatchScore: View } = await getUserDesignRegistry(userId, tid);

export { default as AfterMatchScore }      from "./AfterMatchScoreView";
export { default as AfterMatchScoreGroup } from "./AfterMatchScoreGroupView";
export { default as HeadToHead }           from "./HeadToHeadView";
export { default as MatchSummary }         from "./MatchSummaryView";
export { default as MVP }                  from "./MVPView";
export { default as MVPGroup }             from "./MVPGroupView";
export { default as TopPlayers }           from "./TopPlayersView";
export { default as TopPlayersGroup }      from "./TopPlayersGroupView";
export { default as WWC }                  from "./WWCView";
export { default as WWCTwo }               from "./WWCTwoView";
export { default as WWCStats }             from "./WWCStatsView";

// Token manifest — settings color picker reads this to show relevant color inputs
export { COLOR_TOKENS, TOKEN_DEFAULTS } from "./tokens";
