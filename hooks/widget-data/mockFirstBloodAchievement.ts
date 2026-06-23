import type { FirstBloodPayload } from "@/types/first-blood";

export function getMockFirstBloodAchievement(): FirstBloodPayload {
  return {
    victim: {
      player: {
        id: "6a3506bf84b592178a242dc4",
        name: "HŁS・ULtRoN",
        ign: "HŁS・ULtRoN",
        image: "https://api.ecube.gg/images/defaults/default-player.png",
        gameId: "5259729544",
      },
      team: {
        id: "6a3504fa84b592178a242d48",
        name: "HLS ESPORTS",
        clanTag: "017",
        logo: "https://api.ecube.gg/images/defaults/default-team.png",
        index: 17,
        country_code: "BD",
        country_name: "Bangladesh",
        country_alpha3: "BGD",
        country_flag_emoji: "🇧🇩",
      },
      kills: 0,
    },
    causer: {
      player: {
        id: "6a3506bf84b592178a242dd4",
        name: "waveSTR3TCHx",
        ign: "waveSTR3TCHx",
        image: "https://api.ecube.gg/images/defaults/default-player.png",
        gameId: "5998880072",
      },
      team: {
        id: "6a35051d84b592178a242d4c",
        name: "DEADLIEST ES",
        clanTag: "021",
        logo: "https://api.ecube.gg/images/defaults/default-team.png",
        index: 21,
        country_code: "BD",
        country_name: "Bangladesh",
        country_alpha3: "BGD",
        country_flag_emoji: "🇧🇩",
      },
      kills: 1,
    },
    placement: 83,
    weapon: {
      id: "101001",
      name: "AKM",
      type: "weapon",
    },
  };
}
