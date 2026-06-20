export function getTeamDisplayLabel(
  team: { name: string; clanTag?: string },
  showFullTeamName: boolean,
): string {
  if (showFullTeamName) return team.name;
  return team.clanTag || team.name;
}
