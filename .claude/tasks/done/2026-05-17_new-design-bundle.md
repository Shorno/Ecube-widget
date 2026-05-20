# Task: New Design Bundle Scaffold

**Plan:** [[design-system-and-monitoring]]
**Created:** 2026-05-17
**Status:** completed 2026-05-17

## Objective

Scaffold the full folder structure for a new design bundle. Wire it into BUNDLE_MAP and the
seed route. Set isDefault: true. Guide user on exactly which files to create and what to export.

## Files Involved

- components/designs/<key>/index.js — new file
- components/designs/<key>/tokens.js — new file
- components/designs/<key>/\*.jsx — placeholders for each widget view
- lib/design/registry.js — add to BUNDLE_MAP
- app/api/admin/seed-designs/route.js — add to KNOWN_DESIGNS
