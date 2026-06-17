import type { MatchInfo, TeamRow } from "@/types/widgets";

export const STATIC_INFO: MatchInfo = {
  stage_name: "GRAND FINALS",
  match_name: "MATCH 99",
  day: "DAY 99",
};

const PLACEHOLDER_TEAM = "alrgdeathstorm";

function makeTeam(position: number): TeamRow {
  return {
    team_id: `static-team-${position}`,
    position,
    team_name: PLACEHOLDER_TEAM,
    team_logoUrl: "/EcubeOG.svg",
    wwcd: 0,
    positionPoints: 0,
    killPoints: 0,
    totalPoints: 0,
  };
}

export const STATIC_TEAMS: TeamRow[] = Array.from({ length: 20 }, (_, i) =>
  makeTeam(i + 1),
);
