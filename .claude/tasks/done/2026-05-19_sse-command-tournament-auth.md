---
status: in-progress
---

# Task: SSE Command Tournament Authorization

**Objective:** `/api/sse/command` verifies a session exists but never checks whether the requesting user owns the `tournamentId` they're commanding. Any authenticated user can broadcast to any tournament.

**Auth rules:**

- `admin` role → bypass check, can command any tournament (operational support)
- `user` role → `tournamentId` must be in their `allowedTournamentIds`

**Files Involved:**

- `app/api/sse/command/route.js` — add ownership check after `requireSession()`
- `lib/db/queries.js` — add `getUserTournaments(userId)` helper (lean, projection-only)
