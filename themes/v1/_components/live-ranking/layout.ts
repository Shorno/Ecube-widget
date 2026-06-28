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
  scaledWidth: number;
  scaledHeight: number;
  outer: {
    position: "absolute";
    right: number;
    top: number;
    width: number;
    height: number;
    overflow: "hidden";
    contain: "layout paint style";
    isolation: "isolate";
  };
  slide: {
    width: string;
    height: string;
    position: "relative";
    willChange: "transform, opacity";
    backfaceVisibility: "hidden";
  };
  inner: {
    width: number;
    height: number;
    position: "absolute";
    right: number;
    top: number;
    transform: string;
    transformOrigin: string;
    willChange: "transform";
    backfaceVisibility: "hidden";
  };
};

function snapScaleToWholePanelWidth(scale: number, panelWidth: number) {
  if (scale <= 0 || panelWidth <= 0) {
    return {
      scale,
      scaledWidth: Math.max(1, Math.ceil(panelWidth * scale)),
    };
  }

  const scaledWidth = Math.floor(panelWidth * scale);
  if (scaledWidth <= 0) {
    return {
      scale,
      scaledWidth: Math.max(1, Math.ceil(panelWidth * scale)),
    };
  }

  return {
    scale: scaledWidth / panelWidth,
    scaledWidth,
  };
}

export function getLiveRankingBroadcastLayout(
  teamCount: number,
  panelWidth: number,
  viewportHeight: number,
): LiveRankingBroadcastLayout {
  const naturalHeight = getLiveRankingPanelHeight(teamCount);
  const available = Math.max(
    1,
    Math.floor(viewportHeight) -
      LIVE_RANKING_MAP_SAFE_TOP -
      LIVE_RANKING_PANEL_BOTTOM,
  );
  const rawScale =
    naturalHeight > 0
      ? Math.min(LIVE_RANKING_PANEL_SCALE, available / naturalHeight)
      : LIVE_RANKING_PANEL_SCALE;
  const { scale, scaledWidth } = snapScaleToWholePanelWidth(
    rawScale,
    panelWidth,
  );
  const scaledHeight = Math.ceil(naturalHeight * scale);

  return {
    scale,
    scaledWidth,
    scaledHeight,
    outer: {
      position: "absolute",
      right: 0,
      top: LIVE_RANKING_MAP_SAFE_TOP,
      width: scaledWidth,
      height: scaledHeight,
      overflow: "hidden",
      contain: "layout paint style",
      isolation: "isolate",
    },
    slide: {
      width: "100%",
      height: "100%",
      position: "relative",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
    },
    inner: {
      width: panelWidth,
      height: naturalHeight,
      position: "absolute",
      right: 0,
      top: 0,
      transform: `translate3d(0, 0, 0) scale(${scale})`,
      transformOrigin: "top right",
      willChange: "transform",
      backfaceVisibility: "hidden",
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
