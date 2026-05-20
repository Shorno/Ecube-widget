# Plan: Widget Pipeline Hardening

**Created:** 2026-05-19
**Status:** completed
**Goal:** Fix three confirmed bugs and harden the image-load → GSAP animation pipeline for zero-flicker live broadcasting.

---

## Context

The broadcast display pipeline is:

```
DB → SSR layout (CSS vars injected) → Server Component (resolves design bundle)
  → Client View Component (RTK Query) → WidgetStage (gates opacity on images)
    → useWidgetReady (img load tracking) → onReady → useGSAP (animates in)
```

The design registry and theme injection are architecturally sound:

- CSS vars arrive via SSR inline `style` — no FOUC, no client flash
- `getUserDesignRegistry` resolves the correct design bundle server-side
- `useGSAP` (which uses `useLayoutEffect` internally) fires synchronously before paint, so `gsap.set()` runs before the browser renders the newly-visible container — the opacity-0 → animate-in sequence is frame-perfect

**Issues confirmed in the current implementation:**

1. **Map widget URLs are hardcoded to `localhost:10087`** — broken in every non-local environment
2. **`/api/widget-status` extracts the wrong URL segment** — `split("/")[1]` gives `userId`, not `tournamentId`; the load-error banner in the controller has never worked
3. **`/api/sse/command` has no tournament ownership check** — any authenticated user can broadcast to any tournament
4. **`useWidgetReady` has no cleanup and no timeout** — stale listeners if the effect re-runs; silent hang forever if an image CDN stalls mid-broadcast
5. **`WidgetStage` `onReady` is missing from `useEffect` deps** — stale closure risk if `onReady` ever changes before `ready` becomes true

---

## Strategy

Four small, isolated tasks. Each touches one layer with no cross-task dependencies — they can be reviewed and shipped independently.

- No changes to the design registry architecture (it's correct)
- No changes to the GSAP animation logic (it's correct)
- No changes to CSS var injection (it's correct)
- Touch only the confirmed broken/fragile spots

---

## Tasks

| #   | Task                             | Files                                                                                 | Impact                                                |
| --- | -------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | `fix-map-url-env`                | `lib/widget-catalog.js`, `.env`                                                       | Map widgets work in any environment                   |
| 2   | `fix-widget-status-and-sse-auth` | `app/api/widget-status/route.js`, `app/api/sse/command/route.js`, `lib/db/queries.js` | Load-error banner works; broadcast auth enforced      |
| 3   | `harden-widget-ready`            | `hooks/useWidgetReady.js`, `components/common/WidgetStage.jsx`                        | No silent hang; no listener leaks; correct React deps |

---

## Risks

- **Task 2 SSE auth**: Validating `tournamentId` against `allowedTournamentIds` requires a DB lookup per command. Mitigated by reading it from the already-verified JWT payload (user object from `requireSession`), then fetching the user's allowed list — already cached by `getUser()` via React `cache()` in the same request tree. A `getUserAllowedTournaments(userId)` helper in `lib/db/queries.js` keeps this clean.
- **Task 3 timeout**: Choosing the right default timeout. Too short = widget flashes in with broken images on slow CDNs. Too long = operator waits too long for error feedback. Proposed: **8 seconds** — long enough for any reasonable CDN round-trip, short enough to be actionable during a live match.
- **Task 3 cleanup**: Removing `{ once: true }` and tracking listeners manually means more code. Keeping `{ once: true }` but also returning a no-op cleanup is the minimal path — the `{ once: true }` already prevents listener accumulation after firing. The timeout `clearTimeout` in cleanup is the critical part.

---

## Architecture Diagram

```mermaid
flowchart TD
    subgraph SSR ["Server (per request)"]
        DB[(MongoDB)] --> GU["getUser()  cached"]
        GU --> LAYOUT["[tournamentID]/layout.jsx\nbuildThemeStyle → inline style"]
        GU --> REGISTRY["getUserDesignRegistry()\nresolves variant → bundle"]
        REGISTRY --> PAGE["Server Component Page\nreturns View tournamentID"]
    end

    subgraph CLIENT ["Client (browser / OBS)"]
        PAGE --> VIEW["'use client' View\nRTK Query fetch"]
        VIEW --> WS["WidgetStage\nopacity-0 wrapper"]
        WS --> UWR["useWidgetReady\nimg load tracking"]
        UWR -->|"all loaded OR timeout"| READY["ready = true"]
        READY --> ON_READY["onReady → setStageReady"]
        ON_READY --> WS_SHOW["WidgetStage\nopacity-100"]
        ON_READY --> GSAP["useGSAP (useLayoutEffect)\ngsap.set() → timeline"]
        GSAP --> ANIM["Animated reveal"]
    end

    subgraph API_FIXES ["API Fixes (Task 2)"]
        CMD["POST /api/sse/command"]:::modified --> AUTH_CHECK["validate tournamentId\n∈ user.allowedTournamentIds"]:::new
        AUTH_CHECK --> BROADCAST["broadcast()"]
        WS_STATUS["POST /api/widget-status"]:::modified --> URL_FIX["split('/')[2] → tournamentId"]:::modified
        URL_FIX --> BST["broadcastWidgetStatus()"]
    end

    subgraph CATALOG_FIX ["Catalog Fix (Task 1)"]
        CAT["widget-catalog.js"]:::modified
        ENV["NEXT_PUBLIC_MAP_BASE_URL\n.env"]:::new
        CAT --> ENV
    end

    subgraph HOOK_FIX ["Hook Fix (Task 3)"]
        UWR2["useWidgetReady"]:::modified
        TO["8s timeout → setReady true\nclears on cleanup"]:::new
        CLN["cleanup: clearTimeout\n+  removeEventListener"]:::new
        UWR2 --> TO
        UWR2 --> CLN
        WSF["WidgetStage"]:::modified --> REF["onReadyRef\n(avoids stale closure)"]:::new
    end

    classDef modified fill:#f97316,color:#fff
    classDef new fill:#22c55e,color:#fff
    classDef removed fill:#ef4444,color:#fff
```

---

## Review Checklist (post-implementation)

- [ ] Map widgets load in production deployment
- [ ] Load-error banner appears in controller when a widget image fails
- [ ] User B cannot send SSE commands to User A's tournament
- [ ] Widget stays visible after 8s even if an image CDN hangs (OBS test)
- [ ] No duplicate listener warnings in browser console on data refetch
