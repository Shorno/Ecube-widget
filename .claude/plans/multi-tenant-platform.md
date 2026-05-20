# Plan: Multi-Tenant Widget Platform

**Created:** 2026-04-25
**Status:** in-progress
**Goal:** Multi-tenant broadcast widget system. Each user gets isolated routes (/[userId]/[tournamentId]/...), isolated SSE state, MongoDB-backed user config, CSS-variable theming, and a color config page.

---

## Database: MongoDB (Mongoose)

Add Mongoose to this Next.js project. One collection:

```js
// users collection
{
  _id: String,          // synced from external API's user._id
  email: String,
  firstName: String,
  lastName: String,
  themeConfig: {
    designVariant: "default" | "mythical" | "custom",
    colors: {
      primary: String,
      primaryShadeOne: String,
      primaryShadeTwo: String,
      customYellow: String,
      customGreen: String,
    }
  }
}
```

**Login flow:**

1. POST external API → get `{ user, accessToken }`
2. Upsert user into MongoDB by `_id`
3. Set `accessToken` as httpOnly cookie
4. Return user + themeConfig to client

**OBS/vMix config loading:**

- Widget layout fetches `GET /api/user-config` → injects CSS vars server-side into layout
- Client also caches config in localStorage (OBS/vMix use Chromium CEF → localStorage works ✓)

---

## Target Folder Structure

```
pubg-widget/
├── app/
│   ├── (auth)/login/page.jsx
│   ├── [userId]/
│   │   ├── layout.jsx                    # loads themeConfig, injects CSS vars
│   │   ├── [tournamentId]/
│   │   │   ├── controller/page.jsx
│   │   │   ├── display/page.jsx
│   │   │   ├── widgets/page.jsx
│   │   │   ├── after-match/
│   │   │   │   ├── score/
│   │   │   │   ├── score-group/
│   │   │   │   ├── match-summary/
│   │   │   │   ├── mvp/
│   │   │   │   ├── mvp-group/
│   │   │   │   ├── head-to-head/
│   │   │   │   ├── top-players/
│   │   │   │   ├── top-players-group/
│   │   │   │   ├── wwcd/
│   │   │   │   └── wwcd-stats/
│   │   │   └── in-game/
│   │   │       ├── _components/          # TeamRow, TopFourCard, TopFourView
│   │   │       ├── live-ranking/
│   │   │       ├── overall-ranking/
│   │   │       ├── top-four/
│   │   │       ├── eliminations/
│   │   │       ├── first-blood/
│   │   │       ├── rampage/
│   │   │       └── achievements/
│   │   └── settings/design/page.jsx      # color config UI
│   ├── map/                              # standalone, outside user namespace
│   │   ├── _components/                  # MapCanvas, ControlPanel, MapSelector
│   │   ├── page.jsx
│   │   └── control/page.jsx
│   └── api/
│       ├── auth/login/route.js           # proxy → external, upsert MongoDB, set cookie
│       ├── auth/logout/route.js          # proxy → external, clear cookie
│       ├── user-config/route.js          # GET/PUT themeConfig in MongoDB
│       ├── sse/route.js                  # SSE stream, keyed userId+tournamentId
│       ├── sse/command/route.js
│       ├── sse/state/route.js
│       ├── widget-status/route.js
│       ├── getcircleinfo/route.js
│       ├── getgameglobalinfo/route.js
│       └── gettotalplayerlist/route.js
│
├── components/
│   ├── widgets/                          # TableRow, Tableheader, HighLightTeam,
│   │   │                                 # MVPDisplay (renamed), MVPStats,
│   │   │                                 # MVPStatsIdentity, PlayerCard, RampDom
│   └── common/                           # Layout, WidgetStage, Title, StoreProvider
│
├── hooks/
│   └── useWidgetReady.js
│
├── lib/
│   ├── db/
│   │   ├── mongoose.js                   # connection singleton
│   │   └── models/User.js                # User schema + model
│   ├── design/
│   │   ├── catalog.js                    # variant → CSS token defaults
│   │   └── ThemeProvider.jsx             # context, injects CSS vars
│   ├── sse/store.js                      # Map<userId_tid, state>
│   ├── services/
│   │   ├── widget-api/index.js
│   │   ├── api/index.js
│   │   └── pcob-api/index.js
│   ├── redux/
│   ├── widget-catalog.js
│   └── utils.js
│
├── middleware.js                         # JWT cookie guard on /[userId]/*
└── .env                                  # + MONGODB_URI
```

---

## Tasks

1. **fix-animation-timing** — `WidgetStageContext` + gate GSAP on `ready` signal
2. **folder-restructure** — move files to target structure, fix all imports, no logic changes
3. **auth-and-db** — Mongoose setup, User model, login/logout API routes, JWT cookie, middleware guard
4. **multi-tenant-routing** — `[userId]/[tournamentId]` routes, SSE Map isolation, widget-catalog update
5. **design-system** — `ThemeProvider`, `catalog.js`, `[userId]/layout.jsx` injects vars (mythical tokens preserved, no if/else removed yet)
6. **color-config-ui** — `settings/design/page.jsx`, color pickers, `GET/PUT /api/user-config`

---

## Key Decisions

| Question              | Decision                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| Database              | MongoDB via Mongoose — already in stack                                              |
| Config persistence    | MongoDB → client caches in localStorage                                              |
| OBS/vMix localStorage | Works — both use Chromium CEF ✓                                                      |
| JWT storage           | httpOnly cookie — middleware reads it                                                |
| SSE isolation         | `Map<\`${userId}_${tid}\`, state>`                                                   |
| Mythical              | Not touched until design-system task; tokens extracted from current hardcoded values |
| Map feature           | Stays outside `[userId]` namespace — it's a standalone tool                          |

---

## Risks

- Mongoose connection in Next.js serverless — use singleton pattern to avoid connection leaks
- OBS browser source URL changes when userId/tournamentId added — operators must update OBS source once
- Import path breakage during restructure — fix in one dedicated task before any logic changes
