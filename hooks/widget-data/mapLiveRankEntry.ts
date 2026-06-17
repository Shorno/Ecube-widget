import type { LiveRankEntry } from "@/types/live-rank";
import type { TeamRow } from "@/types/widgets";

/**
 * Maps one live rank API entry to the TeamRow shape used by v1 overall-rankings UI.
 *
 * API field mapping:
 *   position      — entry.rank
 *   team_id       — team.id | team._id
 *   team_name     — team.name
 *   team_logoUrl  — team.logo | team.logoImageUrl
 *   wwcd          — entry.wwcd (0 when absent)
 *   positionPoints — entry.positionPoints | entry.points
 *   killPoints    — entry.kills
 *   totalPoints   — entry.overAllPoints
 */
export function mapLiveRankEntry(entry: LiveRankEntry): TeamRow {
  const team = entry.team ?? ({} as LiveRankEntry["team"]);
  const total = entry.overAllPoints ?? 0;
  const kills = entry.kills ?? 0;

  return {
    team_id: team.id ?? team._id ?? String(entry.rank),
    position: entry.rank,
    team_name: team.name ?? "",
    team_clanTag: team.clanTag,
    team_logoUrl: team.logo ?? team.logoImageUrl,
    wwcd: entry.wwcd ?? 0,
    positionPoints: entry.positionPoints ?? entry.points ?? 0,
    killPoints: kills,
    totalPoints: total,
  };
}

/** Sort by API rank (asc) and map to TeamRow. */
export function mapLiveRankList(entries: LiveRankEntry[]): TeamRow[] {
  return [...entries]
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => mapLiveRankEntry(entry));
}
