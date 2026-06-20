import type { TeamEliminationPayload } from "@/types/team-elimination";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";

export function getMockTeamElimination(): TeamEliminationPayload {
  return {
    victimTeam: {
      id: "6a3655ba84b592178a243071",
      name: "TLB ESPORTS",
      clanTag: "TLB ESPORTS",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      index: 22,
      country_code: "BD",
      country_name: "Bangladesh",
      country_alpha3: "BGD",
      country_flag_emoji: "🇧🇩",
      placement: 6,
      kills: 10,
      players: [
        {
          id: "6a36583a84b592178a2430ef",
          name: "MUxFL4SHxps",
          ign: "MUxFL4SHxps",
          image: DEFAULT_PLAYER_IMAGE,
          gameId: "5655216302",
        },
        {
          id: "6a36583a84b592178a2430f0",
          name: "TLBesMIRAJop",
          ign: "TLBesMIRAJop",
          image: DEFAULT_PLAYER_IMAGE,
          gameId: "5107510196",
        },
        {
          id: "6a36583a84b592178a2430f1",
          name: "TLBesCLUTCH",
          ign: "TLBesCLUTCH",
          image: DEFAULT_PLAYER_IMAGE,
          gameId: "5599302727",
        },
        {
          id: "6a36583a84b592178a2430f2",
          name: "4PMesIGNORE",
          ign: "4PMesIGNORE",
          image: DEFAULT_PLAYER_IMAGE,
          gameId: "61288707311",
        },
      ],
    },
    causerTeam: {
      id: "6a35051784b592178a242d4b",
      name: "SECTOR 12 ES",
      clanTag: "020",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      index: 7,
      country_code: "BD",
      country_name: "Bangladesh",
      country_alpha3: "BGD",
      country_flag_emoji: "🇧🇩",
    },
    placement: 6,
    weapon: {
      id: "101006",
      name: "AUG A3",
      type: "weapon",
    },
  };
}
