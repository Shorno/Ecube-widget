// Air-drop looted payload from the DROP_LOOTED socket event.

export interface DropLootedPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
}

export interface DropLootedTeam {
  id: string;
  name: string;
  clanTag?: string;
  logo?: string;
  index?: number;
  country_code?: string;
  country_name?: string;
  country_alpha3?: string;
  country_flag_emoji?: string;
}

export interface DropLootedPayload {
  player: DropLootedPlayer;
  team: DropLootedTeam;
  kills: number;
}
