# Task: Remove Auth + Flatten Routes
**Plan:** [[auth-removal-theme-upgrade]]
**Created:** 2026-05-16
**Status:** pending

## Objective
Strip all login/logout/JWT machinery and collapse the `[userId]/[tournamentID]` double-segment routing into a flat `[tournamentID]` structure. Result: `/controller`, `/[tournamentID]/display`, `/[tournamentID]/after-match/*`, `/[tournamentID]/in-game/*`. No user accounts, no cookies, no auth guards.

## Files Involved

### Delete
- `app/(auth)/login/page.jsx` (+ directory)
- `app/api/auth/login/route.js` (+ `api/auth/` directory)
- `app/api/auth/logout/route.js`
- `app/[userId]/layout.jsx`
- `app/[userId]/controller/page.jsx`
- `app/[userId]/settings/design/page.jsx`
- `app/[userId]/[tournamentID]/display/page.jsx`
- `app/[userId]/[tournamentID]/widgets/page.jsx`
- All `app/[userId]/[tournamentID]/after-match/*/page.jsx` (11 files)
- All `app/[userId]/[tournamentID]/in-game/*/page.jsx` (6 files)
- `app/[userId]/[tournamentID]/in-game/_components/` (3 files)
- `lib/sse-store.js` (old global singleton — superseded by lib/sse/store.js)

### Modify
- `app/page.jsx` → redirect straight to `/controller`
- `lib/sse/store.js` → remove userId from all function signatures; key = tournamentId only
- `app/api/sse/route.js` → remove dual-mode; use V2 store with tournamentId only
- `app/api/sse/command/route.js` → remove userId; V2 store only
- `app/api/sse/state/route.js` → remove dual-mode; V2 store only
- `app/api/widget-status/route.js` → use V2 store; parse tournamentId from widgetUrl path
- `lib/widget-catalog.js` → remove userId param; flat paths `/${tournamentId}/${section}/${slug}`

### Create (new flat routes)
- `app/controller/page.jsx`
- `app/[tournamentID]/display/page.jsx`
- `app/[tournamentID]/widgets/page.jsx`
- `app/[tournamentID]/after-match/score/page.jsx`
- `app/[tournamentID]/after-match/score-group/page.jsx`
- `app/[tournamentID]/after-match/match-summary/page.jsx`
- `app/[tournamentID]/after-match/mvp/page.jsx`
- `app/[tournamentID]/after-match/mvp-group/page.jsx`
- `app/[tournamentID]/after-match/head-to-head/page.jsx`
- `app/[tournamentID]/after-match/top-players/page.jsx`
- `app/[tournamentID]/after-match/top-players-group/page.jsx`
- `app/[tournamentID]/after-match/wwc/page.jsx`
- `app/[tournamentID]/after-match/wwc-two/page.jsx`
- `app/[tournamentID]/after-match/wwc-stats/page.jsx`
- `app/[tournamentID]/in-game/live-ranking/page.jsx` (client — move as-is)
- `app/[tournamentID]/in-game/overall-ranking/page.jsx`
- `app/[tournamentID]/in-game/top-four/page.jsx`
- `app/[tournamentID]/in-game/eliminations/page.jsx`
- `app/[tournamentID]/in-game/first-blood/page.jsx`
- `app/[tournamentID]/in-game/rampdom/page.jsx`
- `app/[tournamentID]/in-game/_components/TeamRow.jsx`
- `app/[tournamentID]/in-game/_components/TopFourCard.jsx`
- `app/[tournamentID]/in-game/_components/TopFourView.jsx`

### Keep untouched (future user system)
- `lib/db/models/User.js`
- `lib/db/mongoose.js`
- `lib/design/get-user-design.js`
- `lib/design/registry.js`
- `lib/design/catalog.js`
- `app/api/user-config/route.js`
