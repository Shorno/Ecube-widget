# Task: fix-animation-timing
**Plan:** [[multi-tenant-platform]]
**Created:** 2026-04-25
**Status:** in-progress

## Objective
GSAP animations complete while WidgetStage still hides the container (opacity-0 waiting for images). Fix by adding `onReady` callback to WidgetStage; widget pages gate their GSAP timeline on that signal.

## Files Involved
- `components/WidgetStage.jsx`
- `app/after-match/[tournamentID]/after-match-score/page.jsx`
- `app/after-match/[tournamentID]/after-match-score-group/page.jsx`
- `app/after-match/[tournamentID]/head-to-head/page.jsx`
- `components/MVPPage.jsx`
- `app/after-match/[tournamentID]/mvp-match/page.jsx`
- `app/after-match/[tournamentID]/mvp-group/page.jsx`
