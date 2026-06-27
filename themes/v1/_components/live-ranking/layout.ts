export const LIVE_RANKING_RANK_WIDTH = 48;
export const LIVE_RANKING_STATS_WIDTH = 152;
export const LIVE_RANKING_ROW_HEIGHT = 40.625;
export const LIVE_RANKING_HEADER_HEIGHT = 40;
export const LIVE_RANKING_LEGEND_HEIGHT = 19;

/** Broadcast layout — reserve top-right for in-game minimap */
export const LIVE_RANKING_MAP_SAFE_TOP = 220;
export const LIVE_RANKING_MAP_SAFE_WIDTH = 280;
export const LIVE_RANKING_PANEL_BOTTOM = 16;
export const LIVE_RANKING_PANEL_SCALE = 0.92;

export function getLiveRankingPanelHeight(teamCount: number) {
  return (
    LIVE_RANKING_HEADER_HEIGHT +
    teamCount * LIVE_RANKING_ROW_HEIGHT +
    LIVE_RANKING_LEGEND_HEIGHT
  );
}

export type LiveRankingBroadcastLayout = {
  scale: number;
  outer: {
    position: "absolute";
    right: number;
    top: number;
    transform: string;
    transformOrigin: string;
  };
  inner: {
    width: number;
    height: number;
  };
};

export function getLiveRankingBroadcastLayout(
  teamCount: number,
  panelWidth: number,
  viewportHeight: number,
): LiveRankingBroadcastLayout {
  const naturalHeight = getLiveRankingPanelHeight(teamCount);
  const available =
    viewportHeight - LIVE_RANKING_MAP_SAFE_TOP - LIVE_RANKING_PANEL_BOTTOM;
  const scale =
    naturalHeight > 0
      ? Math.min(LIVE_RANKING_PANEL_SCALE, available / naturalHeight)
      : LIVE_RANKING_PANEL_SCALE;

  return {
    scale,
    outer: {
      position: "absolute",
      right: 0,
      top: LIVE_RANKING_MAP_SAFE_TOP,
      transform: `scale(${scale})`,
      transformOrigin: "top right",
    },
    inner: {
      width: panelWidth,
      height: naturalHeight,
    },
  };
}

export function getLiveRankingLayout(showFullTeamName: boolean) {
  const teamColWidth = showFullTeamName ? 210 : 130;
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
