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

/** Rows carry raw stats only; standing and rank fields are derived in the builder. */
type MockTeam = Omit<
  LiveRankEntry,
  "position" | "matchRank" | "positionPoints" | "killPoints" | "wwcd"
>;

const MOCK_TEAMS: MockTeam[] = [
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
      [4, 30],
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
    players: players([[0, 100]]),
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
  {
    team: {
      id: "team-17",
      name: "DESERT VIPERS",
      clanTag: "DSV",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "AE",
      country_flag_emoji: "🇦🇪",
    },
    points: 0,
    overAllPoints: 1,
    kills: 0,
    players: players([
      [0, 100],
      [0, 80],
      [0, 60],
      [0, 40],
    ]),
  },
  {
    team: {
      id: "team-18",
      name: "COASTAL RAIDERS",
      clanTag: "CSR",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "AU",
      country_flag_emoji: "🇦🇺",
    },
    points: 0,
    overAllPoints: 1,
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
      id: "team-19",
      name: "NORTHERN LIGHTS",
      clanTag: "NRL",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "CA",
      country_flag_emoji: "🇨🇦",
    },
    points: 0,
    overAllPoints: 0,
    kills: 0,
    players: players([
      [0, 55],
      [0, 45],
      [4, 20],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-20",
      name: "SILVER STORM",
      clanTag: "SLS",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "BR",
      country_flag_emoji: "🇧🇷",
    },
    points: 0,
    overAllPoints: 0,
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
      id: "team-21",
      name: "EAGLE SQUAD",
      clanTag: "EGL",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "MX",
      country_flag_emoji: "🇲🇽",
    },
    points: 0,
    overAllPoints: 0,
    kills: 0,
    isMissing: true,
    players: [],
  },
  {
    team: {
      id: "team-22",
      name: "MIDNIGHT CREW",
      clanTag: "MDC",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "PH",
      country_flag_emoji: "🇵🇭",
    },
    points: 0,
    overAllPoints: 0,
    kills: 0,
    players: players([
      [0, 30],
      [0, 25],
      [0, 20],
      [0, 15],
    ]),
  },
  {
    team: {
      id: "team-23",
      name: "TITAN FORCE",
      clanTag: "TTN",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "TR",
      country_flag_emoji: "🇹🇷",
    },
    points: 0,
    overAllPoints: 0,
    kills: 0,
    players: players([
      [4, 10],
      [4, 8],
      [5, 0],
      [5, 0],
    ]),
  },
  {
    team: {
      id: "team-24",
      name: "LOCAL LEGENDS",
      clanTag: "LLG",
      logo: "https://api.ecube.gg/images/defaults/default-team.png",
      country_code: "BD",
      country_flag_emoji: "🇧🇩",
    },
    points: 0,
    overAllPoints: 0,
    kills: 0,
    players: players([
      [0, 90],
      [0, 85],
      [0, 75],
      [0, 70],
    ]),
  },
];

const LOCAL_PREVIEW_COUNTRIES = [
  { country_code: "BD", country_alpha3: "BGD", country_name: "Bangladesh" },
  { country_code: "NP", country_alpha3: "NPL", country_name: "Nepal" },
  { country_code: "PK", country_alpha3: "PAK", country_name: "Pakistan" },
  { country_code: "LK", country_alpha3: "LKA", country_name: "Sri Lanka" },
  { country_code: "AF", country_alpha3: "AFG", country_name: "Afghanistan" },
  { country_code: "BT", country_alpha3: "BTN", country_name: "Bhutan" },
];

function withLocalPreviewCountry(entry: MockTeam, index: number): MockTeam {
  const team = { ...entry.team };
  delete team.country_flag_emoji;

  return {
    ...entry,
    team: {
      ...team,
      ...LOCAL_PREVIEW_COUNTRIES[index % LOCAL_PREVIEW_COUNTRIES.length],
    },
  };
}

/**
 * Group positions held by teams sitting out the current match. Preview drops
 * them so the overlay renders 1-10 then jumps to 15 — the scenario this widget
 * exists to handle, and the one that proves rows show true tournament rank
 * rather than renumbering whatever the payload happens to contain.
 */
const PREVIEW_SIT_OUT_POSITIONS = [11, 12, 13, 14];

export function getMockLiveOverallRanking(): LiveRankEntry[] {
  const groupStandings = MOCK_TEAMS.map(withLocalPreviewCountry)
    .map((entry, index) => {
      // Vary the split so teams tied on total still differ on position points,
      // which exercises the real tiebreak chain in preview.
      const positionPoints = Math.round(
        entry.overAllPoints * (0.25 + (index % 5) * 0.1),
      );
      return {
        ...entry,
        positionPoints,
        killPoints: entry.overAllPoints - positionPoints,
        wwcd: index === 0 ? 2 : entry.overAllPoints >= 60 ? 1 : 0,
      };
    })
    .sort(
      (a, b) =>
        b.overAllPoints - a.overAllPoints ||
        b.wwcd - a.wwcd ||
        b.positionPoints - a.positionPoints ||
        b.killPoints - a.killPoints,
    )
    .map((entry, index) => ({ ...entry, position: index + 1 }));

  const playing = groupStandings.filter(
    (entry) => !PREVIEW_SIT_OUT_POSITIONS.includes(entry.position),
  );

  return playing
    .slice()
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, matchRank: index + 1 }))
    .sort((a, b) => a.position - b.position);
}

/** Sample WWCD % for preview top-four cards (rank order) */
const MOCK_TOP_FOUR_WIN_PROBABILITIES = [72, 18, 6, 4];

/** Top 4 alive teams for preview TOP_FOUR trigger */
export function getMockTopFour(): LiveRankEntry[] {
  const alive = getMockLiveOverallRanking().filter(
    (entry) =>
      !(entry.players ?? []).every((player) => player.liveState === 5),
  );
  return alive.slice(0, 4).map((entry, index) => ({
    ...entry,
    winProbability: MOCK_TOP_FOUR_WIN_PROBABILITIES[index] ?? null,
  }));
}

/** Team id used for observed-team highlight in preview mode */
export const MOCK_OBSERVING_TEAM_ID = "team-2";

/** Teams cycled by the preview observer trigger button */
export const MOCK_OBSERVE_TEAM_IDS = ["team-1", "team-2", "team-3", "team-4"];
