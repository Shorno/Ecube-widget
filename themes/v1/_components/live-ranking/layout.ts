export const LIVE_RANKING_RANK_WIDTH = 48;
export const LIVE_RANKING_STATS_WIDTH = 152;

export function getLiveRankingLayout(showFullTeamName: boolean) {
  const teamColWidth = showFullTeamName ? 210 : 150;
  const panelWidth =
    LIVE_RANKING_RANK_WIDTH + teamColWidth + LIVE_RANKING_STATS_WIDTH;
  const statsColStart = LIVE_RANKING_RANK_WIDTH + teamColWidth;

  return {
    teamColWidth,
    panelWidth,
    statsColStart,
    headerLabels: {
      team: LIVE_RANKING_RANK_WIDTH + 11,
      alive: statsColStart + 2,
      pts: statsColStart + 57,
      elims: statsColStart + 102,
    },
    statsValues: {
      barsLeft: 10,
      ptsLeft: 66,
      elimsLeft: 110,
    },
  };
}

export type LiveRankingLayout = ReturnType<typeof getLiveRankingLayout>;
