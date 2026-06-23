import type { PlayerAchievementPayload } from "@/types/player-achievement";

export function getMockDominationAchievement(): PlayerAchievementPayload {
  return {
    player: {
      id: "6a36583a84b592178a2430ee",
      name: "M5xRAIYAN",
      ign: "M5xRAIYAN",
      image: "https://api.ecube.gg/images/defaults/default-player.png",
      gameId: "5398709446",
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
    kills: 3,
    achievement: "DOMINATION",
    weapon: null,
  };
}
