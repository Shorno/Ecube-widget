# Live Overall Ranking Widget

OBS overlay for **tournament-wide standings** during a live match. Shows **all teams** ranked by **overall points** (not just match points), with live player status, kills, and broadcast-style effects. Supports official brackets (~16 teams) and **local tournaments** with larger team counts — the list is not capped at 16.

---

## Route & Access

| Item | Value |
|------|--------|
| **Widget ID** | `match-overall-live-ranking` |
| **URL** | `/{userId}/{tournamentId}/in-game/match-overall-live-ranking` |
| **Preview / test** | Add `?preview=1` |
| **Design** | Theme registry → **v1** for users on the new design bundle |

---

## Data & Real-Time Updates

- **Initial load:** HTTP snapshot via RTK Query
- **Live updates:** WebSocket on `/tournament?id={tournamentId}`
- **Sort:** By `overAllPoints` (descending)
- **Team count:** No slice or limit on the sidebar list — every team in `MATCH_LIVE_RANK_DATA` / the HTTP snapshot is rendered. The only `.slice(0, 4)` in the hook is for **Top Four**, not the ranking panel.

### WebSocket Events

| Event | What it does |
|-------|----------------|
| `match-connected` | Widget becomes ready |
| `MATCH_LIVE_RANK_DATA` | Refreshes full ranking list |
| `SET_OBSERVING_PLAYER` | Marks the team the camera is on |
| `TEAM_ELIMINATION` | Queues elimination overlay |
| `TOP_FOUR` | Shows Top Four banner; hides sidebar for rest of match |

---

## UI Layout (v1)

Right-side panel with columns:

| Column | Content |
|--------|---------|
| **#** | Rank |
| **TEAM** | Flag → logo → clan tag *(or full name)* |
| **ALIVE** | Vertical health bars per squad member (only actual players; no empty slots) |
| **PTS** | Overall tournament points |
| **ELIMS** | Match kills |

Footer legend: **ALIVE** (cyan) · **KNOCKED** (red) · **ELIMINATED** (gray)

Typography: clan tag / team name uses the same font size as PTS and ELIMS (25px).

### Panel height (all teams)

The v1 sidebar lists **every team** returned by the API. There is **no 16-team cap** — official and local tournaments use the same code path.

Panel height is **content-driven** (not a fixed 709px). It grows with team count:

```
panelHeight = header + (teamCount × rowHeight) + legend
            = 40px + (teamCount × 40.625px) + 19px
```

Use `getLiveRankingPanelHeight(teamCount)` in [`layout.ts`](themes/v1/_components/live-ranking/layout.ts) for the exact pixel value.

| Constant | Value | Used in |
|----------|-------|---------|
| `LIVE_RANKING_HEADER_HEIGHT` | 40px | `LiveRankingHeader` |
| `LIVE_RANKING_ROW_HEIGHT` | 40.625px | `LiveRankingRow` |
| `LIVE_RANKING_LEGEND_HEIGHT` | 19px | `LiveRankingLegend` |
| `LIVE_RANKING_MAP_SAFE_TOP` | 300px | Reserved top-right minimap zone |
| `LIVE_RANKING_PANEL_RIGHT` | 16px | Panel margin from right edge |
| `LIVE_RANKING_PANEL_BOTTOM` | 16px | Panel margin from bottom edge |
| `LIVE_RANKING_PANEL_SCALE` | 0.82 (max) | Default broadcast scale cap |
| `LIVE_RANKING_PANEL_SCALE_MIN` | 0.65 | Minimum scale for large brackets |

**Examples**

| Teams | Natural panel height |
|-------|----------------------|
| 16 (official) | 709px |
| 24 (local preview mock) | 1034px |

**OBS / broadcast positioning**

- Panel is anchored **bottom-right** (`right: 16px`, `bottom: 16px`) so it does not cover the **top-right minimap**.
- A **300px** top-right strip is treated as map-safe; the panel scales down (`transform: scale()`, origin bottom-right) to fit the remaining vertical space.
- Scale is computed dynamically via `getLiveRankingBroadcastLayout()` — capped at **0.82**, floored at **0.65** for large team counts.
- If rows exceed visible space at the computed scale, the team list clips between header and legend (`overflow: hidden`); header and legend stay visible.
- Preview mode (`?preview=1`) shows a dashed **Map safe zone** overlay in the top-right for alignment checks before OBS.

**Historical note:** v1 previously anchored the panel at `top: 0` on the full right edge, which overlapped the minimap. Older docs referenced `top: 247px`; broadcast layout now uses bottom-right anchor + scale.

---

## Live Behaviors

1. **GSAP Flip animations** — rows reorder smoothly when ranks change; pending updates queued during animation
2. **Top Four transition** — on `TOP_FOUR` event, sidebar slides out and v1 **Top Four** cards slide down from top (persistent; WWCD % on rank-1 card)
3. **Team elimination overlay** — same OBS source; animated overlay on `TEAM_ELIMINATION` (~4.5s, queued)
4. **Observer highlight** — solid yellow on **# + team only** when camera is on that team (stats columns unchanged)
5. **Outside zone (blue zone)** — blue pulse on **# + team only** when any alive player has `isOutsideZone: true`
6. **Missing / eliminated teams** — `MISSING` label or dimmed row with overlay

---

## Global Controller Toggles

Saved to MongoDB (`themeConfig`). **Refresh OBS browser source** after changing — widgets read settings at page load, not live over the wire.

| Toggle | Setting | Default | Effect |
|--------|---------|---------|--------|
| **Team Flags** | `showTeamFlags` | On | Country flag in TEAM column |
| **Full Team Name** | `showFullTeamName` | Off | Clan tag → full team name; wider team column |
| **Observer Highlight** | `showObserverHighlight` | On | Yellow # + team highlight when spectating |

Available in **controller toolbar** and **widgets page** under Team Display.

---

## Preview Mode (`?preview=1`)

- 24 mock teams (flags, clan tags, knocked/dead/missing, outside zone on team 3)
- No WebSocket or API calls
- **Trigger Observer** — cycles observed team (team-1 → team-2 → team-3 → team-4 → clear)
- **Trigger Elimination** — fires sample elimination overlay
- **Trigger Top Four** — shows Top Four banner with mock top 4 teams
- Default observed team: **team-2** (SECTOR 12 ES)

Example:

```
/{userId}/{tournamentId}/in-game/match-overall-live-ranking?preview=1
```

---

## Key Files

| Area | Path |
|------|------|
| Page entry | `app/[userId]/[tournamentID]/in-game/match-overall-live-ranking/page.jsx` |
| v1 view | `themes/v1/LiveOverallRankingView.tsx` |
| Row UI | `themes/v1/_components/live-ranking/LiveRankingRow.tsx` |
| Header / legend | `themes/v1/_components/live-ranking/LiveRankingHeader.tsx`, `LiveRankingLegend.tsx` |
| Layout tokens | `themes/v1/_components/live-ranking/layout.ts` |
| Data hook | `hooks/widget-data/useLiveOverallRanking.ts` |
| Mock data | `hooks/widget-data/mockLiveOverallRanking.ts` |
| Elimination | `themes/v1/_components/team-elimination/*` |
| Top Four | `themes/v1/_components/top-four/*` |
| Top Four types | `types/top-four.d.ts` |
| Toggles | `components/common/TeamFlagsSwitch.jsx`, `TeamNameSwitch.jsx`, `ObserverHighlightSwitch.jsx` |
| User model | `lib/db/models/User.js` (`themeConfig.*`) |
| Settings API | `app/api/user/settings/route.js` |

---

## vs Match Live Ranking

| Widget | Sort field | Use case |
|--------|------------|----------|
| **Live Overall Ranking** | `overAllPoints` | Tournament standings across all matches |
| **Match Live Ranking** | `points` | Current match only |

---

## Architecture Notes

- **Theme registry:** `getUserDesignRegistry()` routes v1 users to `themes/v1/LiveOverallRankingView.tsx`; default bundle falls back to legacy `TeamRow` layout (also uncapped — no fixed list height).
- **Dynamic team list:** v1 panel/list heights are not fixed; rows stack naturally. Layout math lives in `themes/v1/_components/live-ranking/layout.ts`.
- **Observer vs blue zone:** Both effects apply to the rank + team identity block only, not PTS/ALIVE/ELIMS.
- **Elimination integration:** Elimination overlay is layered on the same page as the ranking list — no separate OBS source required for eliminations during overall ranking.
