export interface PlayerAchievementPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
}

export interface PlayerAchievementTeam {
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

export interface PlayerAchievementWeapon {
  id: string;
  name: string;
  type?: string;
}

export interface PlayerAchievementPayload {
  player: PlayerAchievementPlayer;
  team: PlayerAchievementTeam;
  kills: number;
  achievement: string;
  weapon?: PlayerAchievementWeapon | null;
}
