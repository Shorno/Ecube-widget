import type { LiveRankTeam } from "@/types/live-rank";

export type TeamFlagDisplay =
  | { kind: "emoji"; value: string }
  | { kind: "image"; value: string }
  | { kind: "none" };

export function getTeamFlagDisplay(team: LiveRankTeam): TeamFlagDisplay {
  const emoji = team.country_flag_emoji?.trim();
  if (emoji) {
    return { kind: "emoji", value: emoji };
  }

  const code = team.country_code?.trim().toLowerCase();
  if (code && /^[a-z]{2}$/.test(code)) {
    return { kind: "image", value: `https://flagcdn.com/w40/${code}.png` };
  }

  return { kind: "none" };
}
