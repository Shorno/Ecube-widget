"use client";

import TopFourLayer from "@/themes/v1/_components/top-four/TopFourLayer";
import { getMockTopFour } from "@/hooks/widget-data/mockLiveOverallRanking";

export default function TopFourPreview() {
  const mockTeams = getMockTopFour();
  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-transparent">
      <TopFourLayer
        teams={mockTeams}
        observingTeamId="team-2"
        showTeamFlags={true}
        showFullTeamName={false}
      />
    </div>
  );
}
