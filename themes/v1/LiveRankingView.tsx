"use client";

import LiveOverallRankingView from "./LiveOverallRankingView";

type Props = {
  tournamentID: string;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
  showObserverHighlight?: boolean;
  preview?: boolean;
};

/**
 * Live (per-match) ranking — identical to the overall ranking design, but the
 * PTS column is hidden and teams are ranked by per-match points.
 */
export default function LiveRankingView(props: Props) {
  return <LiveOverallRankingView {...props} showPoints={false} sortBy="points" />;
}
