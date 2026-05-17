# Task: tournament-design-model
**Plan:** [[settings-login-design-overrides]]
**Created:** 2026-05-17
**Status:** in_progress

## Objective
Add tournamentDesigns field to User schema. Update registry lookup to check per-tournament override first. Move theme CSS injection to tournament-level layout. Update all 11 after-match widget pages.

## Files Involved
- lib/db/models/User.js
- lib/design/registry.js
- app/[userId]/layout.jsx
- app/[userId]/[tournamentID]/layout.jsx
- app/[userId]/[tournamentID]/after-match/*.page.jsx (11 files)
