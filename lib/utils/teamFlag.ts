import type { LiveRankTeam } from "@/types/live-rank";

export interface TeamFlagFields {
  country_code?: string;
  country_alpha3?: string;
  country_name?: string;
  country_flag_emoji?: string;
}

export type TeamFlagDisplay =
  | { kind: "image"; value: string }
  | { kind: "none" };

const LOCAL_FLAG_CODES = new Set(["af", "bd", "bt", "lk", "np", "pk"]);

const ALPHA3_TO_ALPHA2: Record<string, string> = {
  afg: "af",
  bgd: "bd",
  btn: "bt",
  lka: "lk",
  npl: "np",
  pak: "pk",
};

const COUNTRY_NAME_TO_ALPHA2: Record<string, string> = {
  afghanistan: "af",
  bangladesh: "bd",
  bhutan: "bt",
  nepal: "np",
  pakistan: "pk",
  srilanka: "lk",
};

function normalizeCountryName(name?: string) {
  return name?.trim().toLowerCase().replace(/[^a-z]/g, "") ?? "";
}

function resolveLocalFlagCode(team: TeamFlagFields | LiveRankTeam) {
  const countryCode = team.country_code?.trim().toLowerCase() ?? "";
  if (LOCAL_FLAG_CODES.has(countryCode)) return countryCode;
  if (ALPHA3_TO_ALPHA2[countryCode]) return ALPHA3_TO_ALPHA2[countryCode];

  const alpha3 = team.country_alpha3?.trim().toLowerCase() ?? "";
  if (ALPHA3_TO_ALPHA2[alpha3]) return ALPHA3_TO_ALPHA2[alpha3];

  const countryName = normalizeCountryName(team.country_name);
  return COUNTRY_NAME_TO_ALPHA2[countryName] ?? null;
}

export function getTeamFlagDisplay(team: TeamFlagFields | LiveRankTeam): TeamFlagDisplay {
  const code = resolveLocalFlagCode(team);
  if (code) return { kind: "image", value: `/flags/${code}.svg` };

  return { kind: "none" };
}
