// Shared data types for widget-base hooks.
// Import in v1 view components:
//   import type { TeamRow, Player, MatchInfo, MVPPlayer, WWCTeam } from "@/types/widgets";

export interface MatchInfo {
  stage_name?: string;
  game_stage?: string;
  day?: string | number;
  game_day?: string | number;
  match_name?: string;
  game_name?: string;
}

export interface TeamRow {
  team_id: string;
  position: number;
  team_name: string;
  team_clanTag?: string;
  team_logoUrl?: string;
  positionPoints: number;
  killPoints: number;
  totalPoints: number;
  // overall/group only
  match_played?: number;
  wwcd?: number;
}

export interface Player {
  id?: string;
  name: string;
  team_name?: string;
  team_logo?: string;
  player_image?: string;
  image?: string;
  // match stats
  eliminations?: number;
  damage?: number;
  assists?: number;
  survival_time?: { text: string };
  // group stats
  total_damage?: number;
  total_assists?: number;
  kd_ratio?: number;
}

export interface MVPPlayer {
  player_imageUrl: string;
  name: string;
  team_name?: string;
  team_logo?: string;
  kills: number;
  damages: number;
  knocks: number;
  survival_time_display?: { text: string; minute: number };
  match_played?: number;
}

export interface H2HTeam {
  team_name: string;
  team_logoUrl?: string;
  total_damages: number;
  total_knocks: number;
  total_kills: number;
  total_survival_time: string | null;
  totalPoints: number;
  players: Player[];
}

export interface WWCTeam {
  team_name: string;
  team_image?: string;
  clan_tag?: string;
  total_kills?: number;
  total_damage?: number;
  total_points?: number;
  players: WWCPlayer[];
}

export interface WWCPlayer {
  player_id?: string;
  player_name?: string;
  player_imageUrl?: string;
  kills?: number;
  knocks?: number;
  damage_taken?: number;
}

export interface MatchStats {
  total_kills: number;
  total_heals: number;
  total_knocks: number;
  total_grenade_kills: number;
  total_assists: number;
  total_vehicle_kills: number;
}

// Hook return shapes — mirrors what widget-base/ hooks return
export interface UseAfterMatchScoreResult {
  winner: TeamRow | null;
  col1: TeamRow[];
  col2: TeamRow[];
  info: MatchInfo | null;
  ready: boolean;
}

export interface UseMatchSummaryResult {
  stats: MatchStats | null;
  info: MatchInfo | null;
  ready: boolean;
}

export interface UseMVPResult {
  mvp: MVPPlayer[];
  player: MVPPlayer | null;
  ready: boolean;
}

export interface UseHeadToHeadResult {
  teamA: H2HTeam | null;
  teamB: H2HTeam | null;
  info: MatchInfo | null;
  ready: boolean;
}

export interface UseTopPlayersResult {
  players: Player[];
  info: MatchInfo | null;
  ready: boolean;
}

export interface UseWWCResult {
  team: WWCTeam | null;
  players: WWCPlayer[];
  gameInfo: MatchInfo | null;
  info: MatchInfo | null;
  ready: boolean;
}
