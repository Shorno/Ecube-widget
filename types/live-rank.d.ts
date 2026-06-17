// Live overall-ranking payload from GET /matches/active-match/rank-data/{tournamentID}

export interface LiveRankTeam {
  id?: string;
  _id?: string;
  name: string;
  clanTag?: string;
  logo?: string;
  logoImageUrl?: string;
  index?: number;
}

export interface LiveRankEntry {
  rank: number;
  team: LiveRankTeam;
  points: number;
  overAllPoints: number;
  kills: number;
  wwcd?: number;
  positionPoints?: number;
  players?: unknown[];
  isMissing?: boolean;
  isEliminated?: boolean;
  winProbability?: number | null;
}
