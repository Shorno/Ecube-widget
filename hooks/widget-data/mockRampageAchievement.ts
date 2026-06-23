import type { PlayerAchievementPayload } from "@/types/player-achievement";

export function getMockRampageAchievement(): PlayerAchievementPayload {
  return {
    player: {
      id: "6a36583a84b592178a2430ed",
      name: "M5xAYM4N",
      ign: "M5xAYM4N",
      image: "https://api.ecube.gg/images/defaults/default-player.png",
      gameId: "5793568913",
    },
    team: {
      id: "6a3655b384b592178a243070",
      name: "MA5IA ESPORTS",
      clanTag: "MA5IA ESPORTS",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      index: 21,
      country_code: "BD",
      country_name: "Bangladesh",
      country_alpha3: "BGD",
      country_flag_emoji: "🇧🇩",
    },
    kills: 5,
    achievement: "RAMPAGE",
    weapon: null,
  };
}
