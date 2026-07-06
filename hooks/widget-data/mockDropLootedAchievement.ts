import type { DropLootedPayload } from "@/types/drop-looted";

export function getMockDropLootedAchievement(): DropLootedPayload {
  return {
    player: {
      id: "6a4a1e6b2ef7f91b550694fa",
      name: "B4iesFABITO",
      ign: "B4iesFABITO",
      image: "https://api.ecube.gg/images/defaults/default-player.png",
      gameId: "51381001277",
    },
    team: {
      id: "6a4a1c3e2ef7f91b55069490",
      name: "BRACE 4 IMPACT",
      clanTag: "11",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      index: 11,
      country_code: "BD",
      country_name: "Bangladesh",
      country_alpha3: "BGD",
      country_flag_emoji: "🇧🇩",
    },
    kills: 0,
  };
}
