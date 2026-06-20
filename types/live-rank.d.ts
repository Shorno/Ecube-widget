// Live overall-ranking payload from GET /matches/active-match/rank-data/{tournamentID}

export interface LiveRankTeam {
  id?: string;
  _id?: string;
  name: string;
  clanTag?: string;
  logo?: string;
  logoImageUrl?: string;
  index?: number;
  country_code?: string;
  country_name?: string;
  country_alpha3?: string;
  country_flag_emoji?: string;
}

export interface LiveRankPlayer {
  liveState: number;
  healths: number;
  isOutsideZone?: boolean;
}

export interface LiveRankEntry {
  rank: number;
  team: LiveRankTeam;
  points: number;
  overAllPoints: number;
  kills: number;
  wwcd?: number;
  positionPoints?: number;
  players?: LiveRankPlayer[];
  isMissing?: boolean;
  isEliminated?: boolean;
  winProbability?: number | null;
}
