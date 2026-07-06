import type { GrenadierPayload } from "@/types/grenadier";

export function getMockGrenadierAchievement(): GrenadierPayload {
  return {
    victim: {
      player: {
        id: "6a4a88c82ef7f91b55069773",
        name: "FS・BLACKZ3RO",
        ign: "FS・BLACKZ3RO",
        image: "https://api.ecube.gg/images/defaults/default-player.png",
        gameId: "5359015301",
      },
      team: {
        id: "6a4a1bec2ef7f91b55069489",
        name: "TMES",
        clanTag: "4",
        logo: "https://api.ecube.gg/images/27d909d5-6153-48a6-82e2-55c08f9ebdbd.png",
        index: 1,
        country_code: "BD",
        country_name: "Bangladesh",
        country_alpha3: "BGD",
        country_flag_emoji: "🇧🇩",
      },
      kills: 0,
    },
    causer: {
      player: {
        id: "6a4a8be22ef7f91b55069785",
        name: "KS丨鴉VartifeX",
        ign: "KS丨鴉VartifeX",
        image: "https://api.ecube.gg/images/defaults/default-player.png",
        gameId: "5251307599",
      },
      team: {
        id: "6a4a1bf32ef7f91b5506948a",
        name: "TDSQ",
        clanTag: "5",
        logo: "https://api.ecube.gg/images/defaults/default-team.png",
        index: 2,
        country_code: "BD",
        country_name: "Bangladesh",
        country_alpha3: "BGD",
        country_flag_emoji: "🇧🇩",
      },
      kills: 2,
    },
    placement: 2,
    weapon: {
      id: "1105000",
      name: "Frag Grenade",
      type: "grenade",
    },
  };
}
