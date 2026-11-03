export interface TeamRecallPlayer {
  id: string;
  name: string;
  ign: string;
  image: string;
  gameId?: string;
  isDeadAfterRecall?: boolean;
}

export interface TeamRecallTeam {
  id: string;
  name: string;
  clanTag?: string;
  logo?: string;
  index?: number;
}

/**
 * One recall at a recall tower (Rondo). `id` is stable while teammates recalled
 * in the same action trickle in — each TEAM_RECALL carries the full group.
 */
export interface TeamRecallPayload {
  id: string;
  gameTime: number;
  recalledAt: string;
  team: TeamRecallTeam | null;
  reviver: TeamRecallPlayer | null;
  players: TeamRecallPlayer[];
}
