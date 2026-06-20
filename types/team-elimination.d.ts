export interface TeamEliminationPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
}

export interface TeamEliminationTeam {
  id: string;
  name: string;
  clanTag?: string;
  logo?: string;
  index?: number;
  country_code?: string;
  country_name?: string;
  country_alpha3?: string;
  country_flag_emoji?: string;
  placement?: number;
  kills?: number;
  players?: TeamEliminationPlayer[];
}

export interface TeamEliminationWeapon {
  id: string;
  name: string;
  type: string;
}

export interface TeamEliminationPayload {
  victimTeam: TeamEliminationTeam;
  causerTeam?: TeamEliminationTeam;
  placement: number;
  weapon?: TeamEliminationWeapon;
}
