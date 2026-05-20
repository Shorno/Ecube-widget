# Plan: Design System — Registry, Assignment & Folder Structure

**Created:** 2026-05-16
**Status:** draft
**Goal:** Formalise the design registry system so generic designs are available to all users and exclusive custom designs are scoped to specific customers. Admin assigns designs from the panel. Developers add new designs via code + one-click registration. Zero config changes needed to assign a design to a user.

---

## Folder Structure

```
components/designs/
  ├── default/              ← generic (all users can be assigned this)
  ├── mythical/             ← generic
  ├── pro-league/           ← generic (future)
  │
  ├── teamalpha-main/       ← exclusive: Team Alpha only
  │   ├── index.js          ← exports all slot names (same contract as default)
  │   ├── AfterMatchScoreView.jsx
  │   ├── AfterMatchScoreGroupView.jsx
  │   └── ... (same file names as default/)
  │
  └── nexuspro-gold/        ← exclusive: Nexus Pro only
      ├── index.js
      └── ...
```

**Naming convention:**

- Generic: plain name (`default`, `mythical`, `pro-league`)
- Exclusive: `{orgslug}-{variant}` (`teamalpha-main`, `nexuspro-gold`)

**Contract:** Every design folder MUST export these exact slot names from `index.js`:
`AfterMatchScore`, `AfterMatchScoreGroup`, `MatchSummary`, `MVP`, `MVPGroup`,
`HeadToHead`, `TopPlayers`, `TopPlayersGroup`, `WWC`, `WWCTwo`, `WWCStats`

Each slot receives one prop: `tournamentID: string`.

---

## Data Model Updates

### DesignRegistry (updated)

```js
{
  _id:         String,    // bundle key — matches BUNDLE_MAP key and folder name
  bundle:      String,    // must match a key in BUNDLE_MAP
  label:       String,    // display name in admin panel
  description: String,    // optional notes (e.g. "Custom design for Team Alpha")
  active:      Boolean,   // show/hide in admin dropdown
  isExclusive: Boolean,   // if true, only show for specific users
  assignedTo:  [String],  // userIds this exclusive design is meant for (informational)
}
```

### User.themeConfig (unchanged)

```js
themeConfig: {
  designVariant: String,   // must match a DesignRegistry._id
  colors: { color1..color5 }
}
```

---

## Registry.js (BUNDLE_MAP)

Developer adds one line per new design. Static object required by bundler:

```js
const BUNDLE_MAP = {
  default: () => import("@/components/designs/default"),
  mythical: () => import("@/components/designs/mythical"),
  "teamalpha-main": () => import("@/components/designs/teamalpha-main"),
  "nexuspro-gold": () => import("@/components/designs/nexuspro-gold"),
};
```

Each `import()` becomes a separate JS chunk — only the assigned design loads per request.

---

## Admin Panel — Design Assignment

When editing a user, the design dropdown shows:

- All `isExclusive: false` designs (generic, any user can get these)
- Exclusive designs where `assignedTo` contains this userId OR `assignedTo` is empty
- Exclusive designs for OTHER users are hidden (not shown at all)

Admin also sees a **"Register Designs"** button that hits `GET /api/admin/seed-designs` — scans `BUNDLE_MAP` keys, upserts any missing entries into `DESIGN_REGISTRY` with defaults. Run once after each deploy that adds new designs.

---

## Developer Workflow (adding a new exclusive design)

```
1. cp -r components/designs/default components/designs/teamalpha-main
2. Edit the new components (styles, layout, branding)
3. Add to BUNDLE_MAP in lib/design/registry.js:
     "teamalpha-main": () => import("@/components/designs/teamalpha-main")
4. git commit + deploy
5. Admin panel → "Register Designs" button (upserts into MongoDB)
6. Admin panel → edit customer → assign "Team Alpha — Main" design
7. Done
```

---

## CSS Variable Theming (colors per user)

Colors use a Tournalink-compatible nested structure stored in `User.themeConfig.colors`. Injected as CSS custom properties in `[userId]/layout.jsx` (Server Component — zero client JS, zero flicker in OBS).

### Color schema (`User.themeConfig.colors`)

```json
{
  "primary": {
    "DEFAULT": "rgb(191,49,49)",
    "background": "rgb(125,10,10)",
    "border": "rgb(42,3,3)",
    "dark": "rgb(216,27,67)"
  },
  "secondary": {
    "DEFAULT": "rgb(94,8,8)",
    "background": "rgba(244,63,94,0.8)",
    "border": "rgba(190,18,60,1)",
    "dark": "rgba(159,18,57,1)"
  },
  "status": {
    "alive": "rgba(255,255,255,1)",
    "knocked": "rgba(244,63,94,1)",
    "dead": "rgba(0,0,0,0.5)"
  },
  "background": "rgb(243,233,195)",
  "text": "rgb(248,245,222)",
  "gradient": { "start": "#bf3131", "end": "#e11b1b" }
}
```

### CSS var mapping (TOKEN_MAP in catalog.js)

| JSON path            | CSS variable               | Tailwind utility             |
| -------------------- | -------------------------- | ---------------------------- |
| primary.DEFAULT      | `--color-primary`          | `bg-widget-primary`          |
| primary.background   | `--color-primary-bg`       | `bg-widget-primary-bg`       |
| primary.border       | `--color-primary-border`   | `bg-widget-primary-border`   |
| primary.dark         | `--color-primary-dark`     | `bg-widget-primary-dark`     |
| secondary.DEFAULT    | `--color-secondary`        | `bg-widget-secondary`        |
| secondary.background | `--color-secondary-bg`     | `bg-widget-secondary-bg`     |
| secondary.border     | `--color-secondary-border` | `bg-widget-secondary-border` |
| secondary.dark       | `--color-secondary-dark`   | `bg-widget-secondary-dark`   |
| status.alive         | `--color-status-alive`     | `bg-widget-status-alive`     |
| status.knocked       | `--color-status-knocked`   | `bg-widget-status-knocked`   |
| status.dead          | `--color-status-dead`      | `bg-widget-status-dead`      |
| background           | `--color-bg`               | `bg-widget-bg`               |
| text                 | `--color-text`             | `text-widget-text`           |
| gradient.start       | `--color-gradient-start`   | — (use in style prop)        |
| gradient.end         | `--color-gradient-end`     | — (use in style prop)        |

A customer can have the `default` design bundle but with completely custom colors — they are two independent layers.

### Theme API endpoint

`GET /api/theme/[userId]` returns the full nested JSON (Tournalink-compatible). Used by the settings live preview and future external integrations.

---

## Tasks

1. **update-design-registry-model** — add `description`, `isExclusive`, `assignedTo` to DesignRegistry model; update seed-designs route to upsert from BUNDLE_MAP keys automatically
2. **admin-design-assignment** — wire design dropdown in admin user edit page (part of Task 4 in auth-system plan); filter exclusive designs by userId

---

## Risks

- BUNDLE_MAP must always stay in sync with `components/designs/` folders — if a design folder is deleted but the BUNDLE_MAP entry remains, the dynamic import will fail at runtime with a module-not-found error
- `isExclusive` + `assignedTo` is informational only — it doesn't prevent an admin from assigning a design to the wrong user. It only filters the dropdown. This is intentional (admin has full control).
- All designs must implement the full slot contract. A missing export causes a runtime error when that widget page loads. Consider adding a dev-time check.
