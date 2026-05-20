# Todo: Remove Auth + Flatten Routes

**Task:** [[2026-05-16_remove-auth-flatten-routes]]
**Plan:** [[auth-removal-theme-upgrade]]

## Steps

### Phase A — Delete auth surface

- [ ] Delete `app/(auth)/` directory (login page)
- [ ] Delete `app/api/auth/` directory (login + logout routes)
- [ ] Update `app/page.jsx` → `redirect("/controller")`

### Phase B — Simplify SSE layer

- [ ] Delete `lib/sse-store.js` (old global singleton)
- [ ] Update `lib/sse/store.js` — remove `userId` param from all 7 exports; key becomes `tournamentId` only
- [ ] Update `app/api/sse/route.js` — drop dual-mode; always use V2 store with `tournamentId` from query
- [ ] Update `app/api/sse/command/route.js` — drop userId from body; V2 store only
- [ ] Update `app/api/sse/state/route.js` — drop dual-mode; V2 store only
- [ ] Update `app/api/widget-status/route.js` — parse `tournamentId` from `widgetUrl` (`path.split("/")[1]`); use V2 `broadcastWidgetStatus`

### Phase C — Update widget-catalog

- [ ] Update `lib/widget-catalog.js` — remove `userId` param from `getWidgetPath` + `getWidgetPlaceholder`; paths become `/${tournamentId}/${section}/${slug}`

### Phase D — Create flat controller + display

- [ ] Create `app/controller/page.jsx` — SSE with tournamentId only; localStorage key `"tournamentId"`; widget URLs via flat `getWidgetPath`; no logout button; no Theme link; OBS URL = `${origin}/${tid}/display`
- [ ] Create `app/[tournamentID]/display/page.jsx` — SSE with tournamentId only (no userId)

### Phase E — Create flat after-match widget pages (Server Components)

Each page: destructure `{ tournamentID }` from params; call `await getDesignRegistry("default")`; render the matching named export.

- [ ] `app/[tournamentID]/after-match/score/page.jsx` → `AfterMatchScore`
- [ ] `app/[tournamentID]/after-match/score-group/page.jsx` → `AfterMatchScoreGroup`
- [ ] `app/[tournamentID]/after-match/match-summary/page.jsx` → `MatchSummary`
- [ ] `app/[tournamentID]/after-match/mvp/page.jsx` → `MVP`
- [ ] `app/[tournamentID]/after-match/mvp-group/page.jsx` → `MVPGroup`
- [ ] `app/[tournamentID]/after-match/head-to-head/page.jsx` → `HeadToHead`
- [ ] `app/[tournamentID]/after-match/top-players/page.jsx` → `TopPlayers`
- [ ] `app/[tournamentID]/after-match/top-players-group/page.jsx` → `TopPlayersGroup`
- [ ] `app/[tournamentID]/after-match/wwc/page.jsx` → `WWC`
- [ ] `app/[tournamentID]/after-match/wwc-two/page.jsx` → `WWCTwo`
- [ ] `app/[tournamentID]/after-match/wwc-stats/page.jsx` → `WWCStats`

### Phase F — Move in-game widget pages + \_components (Client Components)

These pages use `useParams()` and do not reference userId — move files as-is, fix the `_components` relative import path only.

- [ ] Move `_components/TeamRow.jsx`, `TopFourCard.jsx`, `TopFourView.jsx` → `app/[tournamentID]/in-game/_components/`
- [ ] Move `live-ranking/page.jsx` → `app/[tournamentID]/in-game/live-ranking/page.jsx`
- [ ] Move `overall-ranking/page.jsx` → `app/[tournamentID]/in-game/overall-ranking/`
- [ ] Move `top-four/page.jsx` → `app/[tournamentID]/in-game/top-four/`
- [ ] Move `eliminations/page.jsx` → `app/[tournamentID]/in-game/eliminations/`
- [ ] Move `first-blood/page.jsx` → `app/[tournamentID]/in-game/first-blood/`
- [ ] Move `rampdom/page.jsx` → `app/[tournamentID]/in-game/rampdom/`

### Phase G — Create flat widgets index page

- [ ] Create `app/[tournamentID]/widgets/page.jsx` — lists all widget URLs with flat paths (no userId)

### Phase H — Delete old [userId] routes

- [ ] Delete `app/[userId]/` directory entirely (layout, controller, settings, all [tournamentID] sub-routes)

### Phase I — Verify

- [ ] Confirm no remaining imports reference `lib/sse-store.js`
- [ ] Confirm no remaining references to `userId` in route files or widget pages
- [ ] Confirm `app/[tournamentID]` and `app/controller` do not conflict with any remaining routes
