# Design System

## Overview

Each user is assigned a design variant. The variant controls which React components render their widgets. Colors are stored per-user in MongoDB and injected as CSS variables server-side. Adding a new design requires code once; assigning it to users is a database update only.

---

## Folder structure

```
themes/
├── utils.js              ← h() hex→rgba helper (shared)
├── catalog.js            ← TOKEN_MAP, VARIANT_DEFAULTS, PREDEFINED_THEMES,
│                            WIDGET_FONTS, buildThemeStyle/Css/Json
├── extras.ts             ← per-design extra token definitions (for settings UI)
├── registry.js           ← BUNDLE_MAP + getDesignRegistry() + getUserDesignRegistry()
│
├── default/
│   ├── defaults.js       ← default design color defaults
│   └── index.js          ← barrel: exports all slots (AfterMatchScore, MVP, …)
│   └── ...View.jsx       ← one file per widget slot
│
└── v1/
    ├── defaults.ts       ← v1 color defaults (ECube blue palette)
    ├── tokens.ts         ← BASE_TOKENS + v1-specific extras (v1Gold)
    ├── index.ts          ← barrel: exports built slots, unbuilt slots get
    │                        UnimplementedView via registry.js merger
    └── ...View.tsx       ← one file per built widget slot
```

**Key rule:** `VARIANT_DEFAULTS` in `catalog.js` is assembled by importing each theme's `defaults.js/ts`. When you add a new design, create `themes/<key>/defaults.js` and add one import line to `catalog.js`.

---

## How a widget renders

```
OBS requests /{userId}/{tournamentID}/after-match/score
  → [tournamentID]/layout.jsx
      getUser(userId) → themeConfig.colors, font, designVariant
      buildThemeStyle(colors, variant) → CSS vars injected as inline style
  → after-match/score/page.jsx (Server Component)
      getUserDesignRegistry(userId, tournamentID)
        → looks up user's design variant (tournament override → global → "default")
        → loads correct bundle from BUNDLE_MAP
        → fills unimplemented slots with UnimplementedView (returns null)
      renders <AfterMatchScore tournamentID={...} />
  → Widget (Client Component) — hooks, RTK Query, GSAP, WidgetStage
```

---

## Color system

Colors are stored as **flat rgba objects** in MongoDB:

```json
{
  "themeConfig": {
    "designVariant": "v1",
    "colors": {
      "primary": "rgba(46, 135, 230, 1)",
      "bg": "rgba(7, 25, 45, 1)",
      "gradientAngle": "135deg"
    }
  },
  "tournamentColors": {
    "TRN-001": { "primary": "rgba(220, 38, 38, 1)" }
  }
}
```

`buildThemeStyle(colors, variant)` merges saved colors with `VARIANT_DEFAULTS[variant]` (missing keys fall back to defaults) and returns a React style object with CSS vars.

| DB key         | CSS var                   | Tailwind class                              |
| -------------- | ------------------------- | ------------------------------------------- |
| `primary`      | `--widget-primary`        | `bg-widget-primary` / `text-widget-primary` |
| `bg`           | `--widget-bg`             | `bg-widget-bg`                              |
| `text1`        | `--widget-text-1`         | `text-widget-text-1`                        |
| `gradientFrom` | `--widget-gradient-from`  | `from-widget-gradient-from`                 |
| `statusAlive`  | `--widget-status-alive`   | `bg-widget-status-alive`                    |
| `v1Gold`       | `--widget-v1-gold`        | `text-widget-v1-gold`                       |
| _(font)_       | `--widget-font-primary`   | `font-primary`                              |
| _(font)_       | `--widget-font-secondary` | `font-secondary`                            |

---

## Adding a new design (step by step)

```
1. Create themes/<key>/
   ├── defaults.ts       ← color defaults for this design
   ├── tokens.ts         ← if design has extra tokens beyond BASE_TOKENS
   └── index.ts          ← export all slots (unbuilt ones are filled by registry)

2. Add defaults to catalog.js
   import { defaults as myDefaults } from "./my-design/defaults";
   export const VARIANT_DEFAULTS = { ..., "my-design": myDefaults };

3. Add to BUNDLE_MAP in registry.js
   "my-design": () => import("@/themes/my-design"),

4. If design has extra tokens, add to extras.ts
   import { COLOR_TOKENS as MY_TOKENS } from "@/themes/my-design/tokens";
   DESIGN_EXTRAS["my-design"] = MY_TOKENS.filter(t => !baseKeys.has(t.key));

5. Add to KNOWN_DESIGNS in app/api/admin/seed-designs/route.js

6. Deploy

7. Hit GET /api/admin/seed-designs (auto-registers + cleans orphans)

8. Assign users via admin panel
```

---

## Slot names

Every design index exports these slot names. Unimplemented slots render `null` (transparent in OBS).

| Slot                   | Route                           |
| ---------------------- | ------------------------------- |
| `AfterMatchScore`      | `after-match/score`             |
| `AfterMatchScoreGroup` | `after-match/score-group`       |
| `MatchSummary`         | `after-match/match-summary`     |
| `MVP`                  | `after-match/mvp`               |
| `MVPGroup`             | `after-match/mvp-group`         |
| `HeadToHead`           | `after-match/head-to-head`      |
| `TopPlayers`           | `after-match/top-players`       |
| `TopPlayersGroup`      | `after-match/top-players-group` |
| `WWC`                  | `after-match/wwc`               |
| `WWCTwo`               | `after-match/wwc-two`           |
| `WWCStats`             | `after-match/wwc-stats`         |

Each view receives one prop: `tournamentID: string`.

---

## Unimplemented slots

Non-default designs don't need to implement every slot. `registry.js` fills missing slots with `UnimplementedView` (returns `null`). OBS sees a transparent frame — no error, no crash. The controller can still send the command; the display just shows nothing.

---

## Admin panel

- **Register Designs** — syncs `DesignRegistry` with `BUNDLE_MAP`. Upserts known designs, deletes orphans, cascades orphan removal to user records.
- **Delete** — removes from registry and cascades: pulls from `allowedDesignIds`, resets `designVariant` if affected, strips `tournamentDesigns` overrides.
