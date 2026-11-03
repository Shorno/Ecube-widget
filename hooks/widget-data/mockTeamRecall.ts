import type { TeamRecallPayload } from "@/types/team-recall";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";
const DEFAULT_TEAM_IMAGE =
  "https://api.ecube.gg/images/defaults/default-team.png";

const mockPlayer = (id: string, ign: string) => ({
  id,
  name: ign,
  ign,
  image: DEFAULT_PLAYER_IMAGE,
});

const MOCK_TEAMS = [
  {
    team: {
      id: "mock-team-tlb",
      name: "TLB ESPORTS",
      clanTag: "TLB ESPORTS",
      logo: DEFAULT_TEAM_IMAGE,
      index: 22,
    },
    reviver: mockPlayer("mock-tlb-4", "MUxFL4SHxps"),
    players: [
      mockPlayer("mock-tlb-1", "TLBesMIRAJop"),
      mockPlayer("mock-tlb-2", "TLBesCLUTCH"),
      mockPlayer("mock-tlb-3", "4PMesIGNORE"),
    ],
  },
  {
    team: {
      id: "mock-team-s12",
      name: "SECTOR 12 ES",
      clanTag: "S12",
      logo: DEFAULT_TEAM_IMAGE,
      index: 7,
    },
    reviver: mockPlayer("mock-s12-4", "S12xMARCO"),
    players: [
      mockPlayer("mock-s12-1", "S12xSRESTHA"),
      mockPlayer("mock-s12-2", "S12xSPIDEYYY"),
      mockPlayer("mock-s12-3", "S12xFALCON"),
    ],
  },
];

type MockOptions = {
  id: string;
  teamIndex?: number;
  playerCount: number;
  deadAfterRecall?: number[];
};

export function getMockTeamRecall({
  id,
  teamIndex = 0,
  playerCount,
  deadAfterRecall = [],
}: MockOptions): TeamRecallPayload {
  const { team, reviver, players } = MOCK_TEAMS[teamIndex];
  return {
    id,
    gameTime: 205.03,
    recalledAt: new Date().toISOString(),
    team,
    reviver,
    players: players.slice(0, playerCount).map((player, i) => ({
      ...player,
      isDeadAfterRecall: deadAfterRecall.includes(i),
    })),
  };
}

export type RecallPreviewStep = { at: number; payload: TeamRecallPayload };

export type RecallPreviewScenario = {
  key: string;
  label: string;
  steps: (runId: string) => RecallPreviewStep[];
};

// PCOB sends one packet per recalled player ~1ms apart; the staggered gap is
// stretched so the in-place update is easy to watch.
const STAGGER_MS = 700;

export const RECALL_PREVIEW_SCENARIOS: RecallPreviewScenario[] = [
  {
    key: "one",
    label: "1 Player",
    steps: (id) => [
      { at: 0, payload: getMockTeamRecall({ id, playerCount: 1 }) },
    ],
  },
  {
    key: "two",
    label: "2 Players",
    steps: (id) => [
      { at: 0, payload: getMockTeamRecall({ id, playerCount: 2 }) },
    ],
  },
  {
    key: "three",
    label: "3 Players",
    steps: (id) => [
      { at: 0, payload: getMockTeamRecall({ id, playerCount: 3 }) },
    ],
  },
  {
    key: "staggered",
    label: "Teammates Arrive 1 → 3",
    steps: (id) =>
      [1, 2, 3].map((playerCount, i) => ({
        at: i * STAGGER_MS,
        payload: getMockTeamRecall({ id, playerCount }),
      })),
  },
  {
    key: "two-teams",
    label: "Two Teams Queued",
    steps: (id) => [
      { at: 0, payload: getMockTeamRecall({ id: `${id}-a`, playerCount: 3 }) },
      {
        at: 300,
        payload: getMockTeamRecall({
          id: `${id}-b`,
          teamIndex: 1,
          playerCount: 2,
        }),
      },
    ],
  },
  {
    key: "dead-after",
    label: "Died After Recall",
    steps: (id) => [
      {
        at: 0,
        payload: getMockTeamRecall({
          id,
          playerCount: 3,
          deadAfterRecall: [1],
        }),
      },
    ],
  },
];
