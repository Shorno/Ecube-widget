export const IN_GAME_WIDGETS = [
  { id: "rampdom", label: "RampDom", slug: "rampdom", section: "in-game" },
  { id: "elmis", label: "Elmis", slug: "elmis", section: "in-game" },
  { id: "topfour", label: "Top Four", slug: "topfour", section: "in-game" },
  {
    id: "firstblood",
    label: "First Blood",
    slug: "firstblood",
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
    id: "achivments",
    label: "Achivments",
    slug: "achivments",
    section: "in-game",
  },
];

export const AFTER_MATCH_WIDGETS = [
  {
    id: "matchsummary",
    label: "Match Summary",
    slug: "matchsummary",
    section: "after-match",
  },
  {
    id: "mvp-match",
    label: "MVP Match",
    slug: "mvp-match",
    section: "after-match",
  },
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
    label: "After Match Score",
    slug: "after-match-score",
    section: "after-match",
  },
  {
    id: "after-match-score-group",
    label: "Score Group",
    slug: "after-match-score-group",
    section: "after-match",
  },
  {
    id: "top-player-match",
    label: "Top Player Match",
    slug: "top-player-match",
    section: "after-match",
  },
  {
    id: "top-players-group",
    label: "Top Players Group",
    slug: "top-players-group",
    section: "after-match",
  },
  
  {
    id: "wwcd",
    label: "WWCD", 
    slug: "wwcd",
    section: "after-match",
  },
  {
    id: "wwcdstats",
    label: "WWCD Stats",
    slug: "wwcdstats",
    section: "after-match",
  },
];

function normalizeTournamentId(tournamentId) {
  return typeof tournamentId === "string" ? tournamentId.trim() : "";
}

export function getWidgetPath(widget, tournamentId, extraQuery = {}) {
  if (widget.path) return widget.path;

  const tid = normalizeTournamentId(tournamentId);
  if (!tid) return null;

  let base;
  if (widget.section === "in-game") {
    base = `/in-game/${tid}/${widget.slug}`;
  } else if (widget.section === "after-match") {
    base = `/after-match/${tid}/${widget.slug}`;
  } else {
    return null;
  }

  const qs = new URLSearchParams(extraQuery).toString();
  return qs ? `${base}?${qs}` : base;
}

export function getWidgetPlaceholder(widget) {
  if (widget.path) return widget.path;

  if (widget.section === "in-game") {
    return `/in-game/{id}/${widget.slug}`;
  }

  if (widget.section === "after-match") {
    return `/after-match/{id}/${widget.slug}`;
  }

  return "/";
}

function warnDuplicateWidgetIds() {
  const allWidgets = [...IN_GAME_WIDGETS, ...AFTER_MATCH_WIDGETS];
  const idCounts = allWidgets.reduce((acc, widget) => {
    acc[widget.id] = (acc[widget.id] || 0) + 1;
    return acc;
  }, {});

  const duplicates = Object.entries(idCounts)
    .filter(([, count]) => count > 1)
    .map(([id]) => id);

  if (duplicates.length > 0) {
    console.warn(
      `[widget-catalog] Duplicate widget IDs found: ${duplicates.join(", ")}`,
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  warnDuplicateWidgetIds();
}
