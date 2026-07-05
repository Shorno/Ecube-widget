"use client";

import LiveOverallRankingView from "./LiveOverallRankingView";

/**
 * Live (per-match) ranking — same layout as the overall ranking, but the PTS
 * column shows per-match points and teams are ranked by per-match points.
 */
export default function LiveRankingView(props) {
  return (
    <LiveOverallRankingView {...props} isOverall={false} sortBy="points" />
  );
}
