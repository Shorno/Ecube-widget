# Project: PUBG Esports Widget Platform

A Next.js 16 broadcast widget system for PUBG esports tournaments. Operators control which widget is live via `/controller`; OBS captures `/display` (an SSE-driven iframe). Widgets are animated with GSAP and data-fetched via RTK Query.

## Project Tree

```
pubg-widget/
├── app/
│   ├── globals.css                        # CSS vars (--primary, --primary-shade-one, etc.) + Tailwind base
│   ├── layout.jsx                         # Root layout: fonts (Oswald), StoreProvider, body
│   ├── page.jsx                           # Redirects / → /controller
│   ├── api/
│   │   ├── sse/route.js                   # SSE endpoint — streams widget-change events to /display
│   │   ├── sse/command/route.js           # POST { url, label } → broadcasts to all SSE clients
│   │   ├── sse/state/route.js             # GET current widget state (for reconnect replay)
│   │   ├── widget-status/route.js         # POST image-load errors from widgets → broadcasts to /controller
│   │   ├── getcircleinfo/route.js         # Proxy → PCOB backend (circle overlay data)
│   │   ├── getgameglobalinfo/route.js     # Proxy → PCOB
│   │   └── gettotalplayerlist/route.js    # Proxy → PCOB
│   ├── controller/page.jsx                # Operator panel: save tournamentId, send widget commands
│   ├── display/page.jsx                   # OBS browser source: SSE listener + iframe renderer
│   ├── widgets/page.jsx                   # Index of all direct widget URLs
│   ├── after-match/[tournamentID]/
│   │   ├── after-match-score/page.jsx     # Two-col team standings, GSAP slide-in
│   │   ├── after-match-score-group/page.jsx # Grouped standings (?view=full query)
│   │   ├── matchsummary/page.jsx          # 6 stat boxes, clip-path wipe + count-up
│   │   ├── mvp-match/page.jsx             # Match MVP showcase
│   │   ├── mvp-group/page.jsx             # Tournament MVP
│   │   ├── head-to-head/page.jsx          # Top-2 teams comparison
│   │   ├── top-player-match/page.jsx      # Top-5 players (single match)
│   │   ├── top-players-group/page.jsx     # Top-5 players (tournament)
│   │   ├── wwcd/page.jsx                  # WWCD display
│   │   ├── wwcdstats/page.jsx             # WWCD statistics
│   │   └── mythical/
│   │       ├── after-match-score-group/page.jsx  # Mythical variant: yellow/green theme
│   │       └── wwcd/page.jsx
│   └── in-game/[tournamentID]/
│       ├── live-ranking/page.jsx          # Real-time rank table, GSAP Flip plugin
│       ├── match-overall-live-ranking/page.jsx
│       ├── topfour/page.jsx               # Top-4 alive teams view transition
│       ├── elmis/page.jsx                 # Elimination feed
│       ├── firstblood/page.jsx            # First blood notification
│       ├── rampdom/page.jsx               # Team elimination dashboard
│       └── achivments/page.jsx            # Event cards queue (WebSocket consumer)
├── components/
│   ├── WidgetStage.jsx                    # Keeps widget opacity-0 until all <img> load
│   ├── TableRow.jsx                       # Team standings row (position, name, stats)
│   ├── Tableheader.jsx                    # Column headers (rank, team, pts, kills, total)
│   ├── Title.jsx                          # Tournament title + stage/day info
│   ├── HighLightTeam.jsx                  # Winner showcase (4 player images + team logo)
│   ├── MVPPage.jsx                        # Full-screen MVP reveal with GSAP orchestration
│   ├── MVPStats.jsx                       # MVP stat boxes
│   ├── MVPStatsIdentity.jsx               # MVP name + team card
│   ├── PlayerCard.jsx                     # Individual player stat card
│   ├── RampDom.jsx                        # Team elimination tracker
│   ├── layout.jsx                         # Full-screen wrapper (h-screen w-screen, overflow-hidden)
│   └── StoreProvider.jsx                  # Redux Provider (singleton store)
├── hooks/
│   └── useWidgetReady.js                  # Scans <img> subtree; resolves when all loaded
├── lib/
│   ├── redux/
│   │   ├── store.js                       # configureStore with 3 RTK Query middlewares
│   │   ├── rootReducer.js                 # Combines all slices
│   │   └── hooks.js                       # useAppDispatch, useAppSelector
│   ├── services/
│   │   ├── widget-api/index.js            # RTK Query: /vmix/{tid}/* endpoints (5s cache)
│   │   ├── api/index.js                   # RTK Query: generic endpoints (5min cache)
│   │   └── pcob-api/index.js              # RTK Query: PCOB base (no endpoints yet)
│   ├── sse-store.js                       # Server-side widget state: currentUrl, clients Set, broadcast()
│   ├── utils.js                           # cn() — Tailwind + clsx merge
│   └── widget-catalog.js                  # Widget definitions (id, label, path) + getWidgetPath()
├── utils/
│   ├── getCircleInfo.js
│   ├── getGameGlobalInfo.js
│   └── getPlayerMapdata.js
├── next.config.js                         # React Compiler on, image domains, /api/proxy rewrite
├── jsconfig.json                          # @/* path alias
└── .claude/
    ├── CLAUDE.md                          # This file
    └── plans/
        └── multi-tenant-platform.md       # Active plan: multi-tenant + design system + animation fix
```

## Key Patterns

- **SSE widget control**: `/controller` POSTs to `/api/sse/command` → `sse-store.js` broadcasts → `/display` receives → iframe re-mounts with new `key`
- **Animation gating**: Each widget page uses `useGSAP({ dependencies: [data] })` with `gsap.set()` pre-setting opacity-0, then `gsap.timeline()` animating in. `WidgetStage` hides the container until images load.
- **Theming**: CSS variables in `globals.css`, consumed via Tailwind utilities (`bg-primary`, `text-primary-shade-one`). Mythical variant currently uses `if/else` on a `mythical` prop — being replaced by design catalog.
- **Data fetching**: RTK Query via `useGetAfterMatchScoreQuery({ tournamentID })` etc. No manual `useEffect` for data.
- **WebSocket**: Live ranking and achievements pages open a WebSocket to `/tournament?id={tournamentID}`.

## Environment Variables

```
NEXT_PUBLIC_API_BASE_URL   # vMix widget API base URL
NEXT_PUBLIC_BASE_URL       # Generic API base URL
NEXT_PUBLIC_PCOB_URL       # PCOB backend base URL
NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR  # "false" = show widget even on broken images
REDIRECT_TO_RENDER         # If set, redirects root to Render.com deployment
```

---

# Identity

I'm a full-stack developer working primarily with the Node.js/React ecosystem.
Talk to me like a pair programmer — conversational, collaborative, thinking out loud together.

# Stack

- Runtime: Node.js
- Frontend: React 19 (latest stable), Next.js 16 (latest stable, App Router), shadcn/ui
- Backend: Express.js, NestJS
- Databases: PostgreSQL (Prisma ORM), MongoDB (Mongoose)
- Language: TypeScript (preferred), JavaScript when the project uses it
- Package manager: npm
- Linting: ESLint + Prettier (always respect project config)

# Code Philosophy

- Simplicity is everything. Every change should impact as little code as possible.
- Start simple. Split into classes/modules only when complexity demands it.
- Every piece of logic has ONE home. No duplicated logic scattered across files.
- Readability over cleverness. Code should read like a story, not a puzzle.
- Small focused functions. One responsibility each.
- Meaningful names — no abbreviations unless universal (id, url, config).
- Comments for WHY only, never WHAT.

# Bug Fixing & Modification Rules

- You are a senior developer. No lazy fixes. No temporary patches. Ever.
- ALWAYS investigate root cause before touching code.
- Check ALL related files before planning a fix.
- Find the minimal professional path — touch only what's necessary.
- After fixing, sweep the codebase for the same pattern elsewhere.
- Every fix should prevent that class of error from recurring.
- Your goal is zero new bugs introduced. Simplicity is how you achieve that.

# Logging

- Never use raw console.log in production code.
- Structured logging with context: module name, action, relevant data.
- Log levels matter: error for failures, warn for recoverable issues, info for key events, debug for development.
- Use a logger library (e.g. winston, pino) on the backend. Never raw console in NestJS — use the built-in Logger or inject a custom one.

# React & Next.js Conventions

- Functional components only. Never class components.
- We use React 19 with the React Compiler enabled — the compiler handles memoization automatically. Do NOT manually add useMemo, useCallback, or memo unless there is a measurable, specific reason. Let the compiler do its job.
- Keep components small. Extract custom hooks for reusable logic.
- Co-locate state as close to where it's used as possible. Lift only when necessary.
- Next.js App Router: prefer Server Components by default. Opt into Client Components ('use client') only when you genuinely need interactivity, browser APIs, or React hooks.
- Data fetching in Server Components or Route Handlers — not client-side unless the data is user-session-specific or dynamic after page load.
- Use Next.js built-ins: next/image, next/link, next/font. Never raw img tags.
- Props down, callbacks up. No direct parent state mutation.

## useEffect — Handle With Care

- useEffect is a last resort, not a first instinct. Before reaching for it, ask: can this be derived from state? Can this be done in an event handler? Can Server Components eliminate the need entirely?
- Never fetch data in useEffect when a Server Component or a Route Handler can do it instead.
- Every useEffect must have a correct, minimal dependency array. Missing deps = stale closure bugs. Unnecessary deps = infinite loops.
- Always clean up: return a cleanup function for subscriptions, timers, and event listeners.
- If you need to sync with an external system (DOM library, websocket, analytics), useEffect is appropriate — document why with a comment.
- If you find yourself writing useEffect to set state based on other state, you likely need derived state or a restructured component instead.

# State Management (Redux Toolkit & RTK Query)

- Follow a standard Root Reducer architecture. Combine feature slices cleanly into a single centralized store.
- Export and strictly use typed hooks (`useAppDispatch`, `useAppSelector`) throughout the app. Never use raw `useDispatch` or `useSelector`.
- Keep client state (slices) and server state (RTK Query) strictly separated. Do not store API data in standard slice state.
- Data Fetching: Use RTK Query for ALL asynchronous data fetching, caching, and server state synchronization.
- Never write manual `createAsyncThunk` functions or use `useEffect` for data fetching if RTK Query can handle it.
- Define a single base API slice and use `injectEndpoints` to code-split queries and mutations by feature to avoid circular dependencies.

# shadcn/ui Conventions

- Use shadcn/ui as the primary component library. Never build a primitive (button, dialog, input, etc.) from scratch if shadcn has one.
- Add components via the CLI: `npx shadcn@latest add <component>` — never copy-paste manually.
- Customize via the component file in `components/ui/` — do not override with inline styles or external CSS. Extend using Tailwind utility classes and the cn() helper.
- Use CSS variables for theming (defined in globals.css). Never hardcode colors that should be themeable.
- Compose shadcn primitives to build higher-level components. Keep the ui/ folder as the raw layer; put composed/business components in a separate folder (e.g. components/common/ or feature folders).

# Express.js Conventions

- Separate route definitions, controller logic, and service logic into distinct layers.
- Middleware for cross-cutting concerns (auth, logging, validation, error handling).
- Always use a centralized error handler — never swallow errors silently.
- Validate and sanitize all inputs at the boundary (use zod or joi).
- Never trust req.body directly — parse and validate first.

# NestJS Conventions

- Follow the module/controller/service/repository pattern strictly.
- Use dependency injection — never instantiate services manually.
- DTOs with class-validator for all incoming data. Pipes for transformation.
- Guards for auth, interceptors for logging/response shaping, filters for error handling.
- Keep modules focused. One feature per module.

# Database Conventions

## PostgreSQL (Prisma)

- Define schema in schema.prisma. Never write raw DDL by hand unless absolutely necessary.
- Use Prisma transactions for multi-step writes.
- Never expose raw Prisma errors to the client — map them to domain errors.
- Index foreign keys and frequently queried fields.

## MongoDB (Mongoose)

- Define schemas with strict types. Avoid `strict: false`.
- Use lean() for read-heavy queries where Mongoose document methods aren't needed.
- Keep documents flat where possible — avoid deeply nested arrays that are hard to update atomically.
- Use indexes. Never query unbounded collections without a filter on an indexed field.

# Communication

- Be direct. If my approach is wrong, say so and explain why.
- When there are trade-offs, lay them out — don't just pick one silently.
- If something is unclear, ask before assuming.
- Don't repeat back what I just said. Move the conversation forward.
- Skip preambles like "Great question!" — just answer.
- After every change, give a brief high-level summary of what you did and why.
- Show concrete examples before explaining theory.
- Use diagrams (ASCII/Mermaid) to explain complex concepts when it helps.

# Workflow

- Before making big changes, outline the plan and get my okay.
- Run lint/format after editing when project config exists.
- When I say "fix" — investigate root cause, fix it, verify, then sweep for the same issue elsewhere.
- Prefer editing existing code over rewriting from scratch.
- After completing a task: verify everything you can, then ask me to test what you can't.
- Once verified, prompt me to commit and update the project changelog.
