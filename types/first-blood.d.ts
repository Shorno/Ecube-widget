export interface FirstBloodParticipantPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
}

export interface FirstBloodParticipantTeam {
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

export interface FirstBloodParticipant {
  player: FirstBloodParticipantPlayer;
  team: FirstBloodParticipantTeam;
  kills: number;
}

export interface FirstBloodWeapon {
  id: string;
  name: string;
  type?: string;
}

export interface FirstBloodPayload {
  victim: FirstBloodParticipant;
  causer: FirstBloodParticipant;
  placement: number;
  weapon?: FirstBloodWeapon | null;
}
