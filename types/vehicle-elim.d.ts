// Vehicle-elimination payload from the PLAYER_ELIMINATION socket event,
// surfaced as an achievement only when weapon.type === "vehicle".

export interface VehicleElimPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
}

export interface VehicleElimTeam {
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

export interface VehicleElimParticipant {
  player: VehicleElimPlayer;
  team: VehicleElimTeam;
  kills: number;
}

export interface VehicleElimWeapon {
  id: string;
  name: string;
  type?: string;
}

export interface VehicleElimPayload {
  victim: VehicleElimParticipant;
  causer: VehicleElimParticipant;
  placement: number;
  weapon?: VehicleElimWeapon | null;
}
