import type { LiveRankEntry, LiveRankPlayer } from "@/types/live-rank";

function players(
  states: Array<[number, number, boolean?]>,
): LiveRankPlayer[] {
  return states.map(([liveState, healths, isOutsideZone]) => ({
    liveState,
    healths,
    ...(isOutsideZone ? { isOutsideZone: true } : {}),
  }));
}

const MOCK_TEAMS: Omit<LiveRankEntry, "rank">[] = [
  {
    team: {
      id: "team-1",
      name: "GFOX ESPORTS",
      clanTag: "012",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "BD",
      country_flag_emoji: "🇧🇩",
    },
    points: 12,
    overAllPoints: 99,
    kills: 8,
    players: players([
      [0, 100],
      [0, 85],
      [0, 72],
      [0, 90],
    ]),
  },
  {
    team: {
      id: "team-2",
      name: "SECTOR 12 ES",
      clanTag: "020",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "BD",
      country_flag_emoji: "🇧🇩",
    },
    points: 10,
    overAllPoints: 88,
    kills: 6,
    players: players([
      [0, 100],
      [0, 100],
      [4, 30],
      [0, 55],
    ]),
  },
  {
    team: {
      id: "team-3",
      name: "PHOENIX RISING",
      clanTag: "PHX",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "IN",
    },
    points: 9,
    overAllPoints: 77,
    kills: 5,
    players: players([
      [0, 60],
      [0, 45],
      [4, 20, true],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-4",
      name: "NIGHT OWLS",
      clanTag: "NOW",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "PK",
      country_flag_emoji: "🇵🇰",
    },
    points: 8,
    overAllPoints: 66,
    kills: 4,
    players: players([
      [5, 0],
      [5, 0],
      [5, 0],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-5",
      name: "STEEL LEGION",
      clanTag: "STL",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "US",
      country_flag_emoji: "🇺🇸",
    },
    points: 7,
    overAllPoints: 55,
    kills: 3,
    players: players([
      [0, 100],
      [0, 100],
      [0, 100],
      [0, 100],
    ]),
  },
  {
    team: {
      id: "team-6",
      name: "CRIMSON WOLVES",
      clanTag: "CRW",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "GB",
      country_flag_emoji: "🇬🇧",
    },
    points: 6,
    overAllPoints: 44,
    kills: 2,
    players: players([
      [0, 75],
      [4, 10],
      [5, 0],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-7",
      name: "THUNDER STRIKE",
      clanTag: "TDS",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "DE",
    },
    points: 5,
    overAllPoints: 33,
    kills: 1,
    players: players([
      [0, 40],
      [0, 30],
      [4, 15],
      [4, 5],
    ]),
  },
  {
    team: {
      id: "team-8",
      name: "APEX PREDATORS",
      clanTag: "APX",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "FR",
      country_flag_emoji: "🇫🇷",
    },
    points: 4,
    overAllPoints: 22,
    kills: 0,
    isMissing: true,
    players: [],
  },
  {
    team: {
      id: "team-9",
      name: "VOID RUNNERS",
      clanTag: "VDR",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "JP",
      country_flag_emoji: "🇯🇵",
    },
    points: 3,
    overAllPoints: 18,
    kills: 2,
    players: players([
      [0, 90],
      [0, 80],
      [0, 70],
      [0, 65],
    ]),
  },
  {
    team: {
      id: "team-10",
      name: "IRON FIST",
      clanTag: "IRF",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "KR",
    },
    points: 3,
    overAllPoints: 15,
    kills: 1,
    players: players([
      [0, 50],
      [0, 50],
      [0, 50],
      [0, 50],
    ]),
  },
  {
    team: {
      id: "team-11",
      name: "SHADOW CLAN",
      clanTag: "SHD",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "TH",
      country_flag_emoji: "🇹🇭",
    },
    points: 2,
    overAllPoints: 12,
    kills: 0,
    players: players([
      [5, 0],
      [5, 0],
      [5, 0],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-12",
      name: "BLAZE UNIT",
      clanTag: "BLZ",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "MY",
      country_flag_emoji: "🇲🇾",
    },
    points: 2,
    overAllPoints: 10,
    kills: 1,
    players: players([
      [0, 100],
      [4, 25],
      [4, 15],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-13",
      name: "NEON STRIKE",
      clanTag: "NEO",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "SG",
    },
    points: 1,
    overAllPoints: 8,
    kills: 0,
    players: players([
      [0, 100],
      [0, 100],
      [0, 100],
      [0, 100],
    ]),
  },
  {
    team: {
      id: "team-14",
      name: "STORM BREAKERS",
      clanTag: "STB",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "ID",
      country_flag_emoji: "🇮🇩",
    },
    points: 1,
    overAllPoints: 6,
    kills: 0,
    players: players([
      [0, 30],
      [0, 20],
      [4, 10],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-15",
      name: "FROST GUARD",
      clanTag: "FRG",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "RU",
    },
    points: 0,
    overAllPoints: 4,
    kills: 0,
    players: players([
      [5, 0],
      [5, 0],
      [5, 0],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-16",
      name: "LAST STAND",
      clanTag: "LST",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "VN",
      country_flag_emoji: "🇻🇳",
    },
    points: 0,
    overAllPoints: 2,
    kills: 0,
    players: players([
      [0, 15],
      [4, 5],
      [5, 0],
      [5, 0],
    ]),
  },
];

export function getMockLiveOverallRanking(): LiveRankEntry[] {
  return [...MOCK_TEAMS]
    .sort((a, b) => (b.overAllPoints ?? 0) - (a.overAllPoints ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/** Top 4 alive teams for preview TOP_FOUR trigger */
export function getMockTopFour(): LiveRankEntry[] {
  const alive = getMockLiveOverallRanking().filter(
    (entry) =>
      !(entry.players ?? []).every((player) => player.liveState === 5),
  );
  return alive.slice(0, 4).map((entry, index) => ({
    ...entry,
    rank: index + 1,
    winProbability: index === 0 ? 72 : entry.winProbability ?? null,
  }));
}

/** Team id used for observed-team highlight in preview mode */
export const MOCK_OBSERVING_TEAM_ID = "team-2";

/** Teams cycled by the preview observer trigger button */
export const MOCK_OBSERVE_TEAM_IDS = ["team-1", "team-2", "team-3", "team-4"];
