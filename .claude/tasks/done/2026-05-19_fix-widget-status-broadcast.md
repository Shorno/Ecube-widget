---
status: in-progress
---

# Task: Fix widget-status Broadcast

**Objective:** The `/api/widget-status` route extracts the wrong URL segment when determining which tournament to broadcast to. Widget URLs follow `/{userId}/{tournamentId}/...`, so `split("/")[1]` gives the userId. It should be `[2]`.

**Impact:** The load-error banner in the controller has never fired. WidgetStage POSTs to this endpoint when an image fails, but the broadcast goes to the wrong SSE key, so no controller ever receives it.

**Files Involved:**

- `app/api/widget-status/route.js` — one-character fix
