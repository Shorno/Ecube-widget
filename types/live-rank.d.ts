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
  /**
   * Rank across every team in the group, server-assigned. Gaps appear when
   * teams sit out the current match — a team ranked 15th overall renders as 15
   * even if four teams above it are not playing, so the live overlay and the
   * after-match scoreboard always show the same number for the same team.
   */
  position: number;
  /** Rank by this match's points alone, for the per-match ranking variant. */
  matchRank: number;
  team: LiveRankTeam;
  points: number;
  overAllPoints: number;
  positionPoints: number;
  killPoints: number;
  wwcd: number;
  kills: number;
  players?: LiveRankPlayer[];
  isMissing?: boolean;
  isEliminated?: boolean;
  winProbability?: number | null;
}
