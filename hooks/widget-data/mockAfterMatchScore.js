/** Shared match meta for after-match preview widgets */
export const MOCK_MATCH_INFO = {
  stage_name: "HV LI JUNE 22",
  match_name: "MATCH 3",
  day: "DAY 1",
};

const PREVIEW_TEAM_NAMES = [
  "KZ ESPORTS",
  "TLB ESPORTS",
  "GFOX ESPORTS",
  "SECTOR 12 ES",
  "PHOENIX RISING",
  "NIGHT OWLS",
  "IRON WOLVES",
  "STORM RAIDERS",
  "APEX LEGACY",
  "CRIMSON SQUAD",
  "VOID HUNTERS",
  "NEON STRIKE",
  "BLAZE UNIT",
  "FROST CORE",
  "TITAN FORCE",
  "RAPTOR CREW",
  "SHADOW LINE",
  "OMEGA CLAN",
  "VIPER SIX",
  "DELTA PRIME",
];

/** Placement + kill points for ranks 1–20 (single-match standings). */
const PLACEMENT_POINTS = [15, 12, 10, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const KILL_POINTS = [24, 18, 15, 12, 11, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0];

function buildTeam(position, teamName) {
  const idx = position - 1;
  const positionPoints = PLACEMENT_POINTS[idx] ?? 0;
  const killPoints = KILL_POINTS[idx] ?? 0;

  return {
    team_id: `preview-team-${position}`,
    position,
    team_name: teamName,
    team_logoUrl: null,
    positionPoints,
    killPoints,
    totalPoints: positionPoints + killPoints,
  };
}

export function getMockAfterMatchScoreRows() {
  return PREVIEW_TEAM_NAMES.map((name, idx) => buildTeam(idx + 1, name));
}

/** Tournament overall standings — WWCD + cumulative points for score-group preview. */
const OVERALL_WWCD = [2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const OVERALL_POS = [
  85, 72, 68, 61, 55, 48, 42, 38, 35, 32, 28, 25, 22, 19, 16, 14, 11, 8, 5, 2,
];
const OVERALL_KILLS = [
  78, 65, 58, 52, 48, 44, 40, 36, 33, 30, 27, 24, 21, 18, 15, 12, 9, 6, 4, 2,
];

function buildOverallTeam(position, teamName) {
  const idx = position - 1;
  const positionPoints = OVERALL_POS[idx] ?? 0;
  const killPoints = OVERALL_KILLS[idx] ?? 0;

  return {
    team_id: `preview-overall-${position}`,
    position,
    team_name: teamName,
    team_logoUrl: null,
    wwcd: OVERALL_WWCD[idx] ?? 0,
    positionPoints,
    killPoints,
    totalPoints: positionPoints + killPoints,
    match_played: 3,
  };
}

export function getMockOverallRankingsRows() {
  return PREVIEW_TEAM_NAMES.map((name, idx) => buildOverallTeam(idx + 1, name));
}

export const MOCK_WWC_PLAYERS = [
  {
    player_id: "preview-p1",
    player_name: "KZesMiSTAKE47z",
    player_imageUrl: "/default-player.png",
  },
  {
    player_id: "preview-p2",
    player_name: "KZesPlayerTwo",
    player_imageUrl: "/default-player.png",
  },
  {
    player_id: "preview-p3",
    player_name: "KZesPlayerThree",
    player_imageUrl: "/default-player.png",
  },
  {
    player_id: "preview-p4",
    player_name: "KZesPlayerFour",
    player_imageUrl: "/default-player.png",
  },
];

const PREVIEW_PLAYER_NAMES = [
  "KZesMiSTAKE47z",
  "TLB_ShadowX",
  "GFOX_Viper",
  "SECTOR_Nova",
  "PHX_Blaze",
];

const PREVIEW_PLAYER_STATS = [
  { kills: 12, damages: 2847, assists: 5, survival: "24:32" },
  { kills: 9, damages: 2103, assists: 4, survival: "22:18" },
  { kills: 8, damages: 1986, assists: 6, survival: "21:45" },
  { kills: 7, damages: 1754, assists: 3, survival: "20:09" },
  { kills: 6, damages: 1622, assists: 2, survival: "19:51" },
];

/** Top 5 match players for top-players preview. */
export function getMockTopPlayers() {
  return PREVIEW_PLAYER_NAMES.map((name, idx) => {
    const stats = PREVIEW_PLAYER_STATS[idx];
    const [minute, second] = stats.survival.split(":").map(Number);

    return {
      player_id: `preview-top-player-${idx + 1}`,
      player_name: name,
      player_imageUrl: "/default-player.png",
      team_name: PREVIEW_TEAM_NAMES[idx],
      team_logoUrl: null,
      kills: stats.kills,
      damages: stats.damages,
      assists: stats.assists,
      survival_time_display: {
        minute,
        second,
        text: stats.survival,
      },
    };
  });
}
