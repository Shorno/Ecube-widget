// Grenade-elimination payload from the PLAYER_ELIMINATION socket event,
// surfaced as an achievement only when weapon.type === "grenade".

export interface GrenadierPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
}

export interface GrenadierTeam {
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

export interface GrenadierParticipant {
  player: GrenadierPlayer;
  team: GrenadierTeam;
  kills: number;
}

export interface GrenadierWeapon {
  id: string;
  name: string;
  type?: string;
}

export interface GrenadierPayload {
  victim: GrenadierParticipant;
  causer: GrenadierParticipant;
  placement: number;
  weapon?: GrenadierWeapon | null;
}
