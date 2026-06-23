export const AFTER_MATCH_WIDGETS = [
  {
    id: "matchsummary",
    label: "Match Summary",
    slug: "match-summary",
    section: "after-match",
  },
  { id: "mvp-match", label: "MVP Match", slug: "mvp", section: "after-match" },
  {
    id: "mvp-group",
    label: "MVP Group",
    slug: "mvp-group",
    section: "after-match",
  },
  {
    id: "head-to-head",
    label: "Head to Head",
    slug: "head-to-head",
    section: "after-match",
  },
  {
    id: "after-match-score",
    label: "Match Rankings",
    slug: "ranking",
    section: "after-match",
  },
  {
    id: "after-match-score-group",
    label: "Score Group",
    slug: "score-group",
    section: "after-match",
  },
  {
    id: "top-player-match",
    label: "Top Players",
    slug: "top-players",
    section: "after-match",
  },
  {
    id: "top-players-group",
    label: "Top Players Group",
    slug: "top-players-group",
    section: "after-match",
  },
  // { id: "wwc", label: "WWCD", slug: "wwc", section: "after-match" },
  { id: "wwctwo", label: "WWCD", slug: "wwc-two", section: "after-match" },
  {
    id: "wwcstats",
    label: "WWC Stats",
    slug: "wwc-stats",
    section: "after-match",
  },
];

export const ACHIEVEMENT_WIDGETS = [
  {
    id: "rampage",
    label: "Rampage",
    slug: "achievements/rampage",
    section: "in-game",
  },
];

export const IN_GAME_WIDGETS = [
  { id: "rampdom", label: "Ramp Dom", slug: "rampdom", section: "in-game" },
  {
    id: "eliminations",
    label: "Eliminations",
    slug: "eliminations",
    section: "in-game",
  },
  { id: "top-four", label: "Top Four", slug: "top-four", section: "in-game" },
  {
    id: "first-blood",
    label: "First Blood",
    slug: "first-blood",
    section: "in-game",
  },
  {
    id: "live-ranking",
    label: "Live Ranking",
    slug: "live-ranking",
    section: "in-game",
  },
  {
    id: "match-overall-live-ranking",
    label: "Live Overall Ranking",
    slug: "match-overall-live-ranking",
    section: "in-game",
  },
  {
    id: "map",
    label: "Map",
    path: "http://localhost:10087/map-overlay/map",
    section: "in-game",
  },
  {
    id: "map-control",
    label: "Map Control",
    path: "http://localhost:10087/map-overlay/map/control",
    section: "in-game",
  },
];

function normalizeTournamentId(tournamentId) {
  return typeof tournamentId === "string" ? tournamentId.trim() : "";
}

export function getWidgetPath(widget, userId, tournamentId) {
  if (widget.path) return widget.path;
  const tid = normalizeTournamentId(tournamentId);
  if (!tid || !userId) return null;
  const section = widget.section === "in-game" ? "in-game" : "after-match";
  return `/${userId}/${tid}/${section}/${widget.slug}`;
}

export function getWidgetPlaceholder(widget) {
  if (widget.path) return widget.path;
  const section = widget.section === "in-game" ? "in-game" : "after-match";
  return `/{userId}/{tournamentId}/${section}/${widget.slug}`;
}
