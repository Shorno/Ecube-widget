# Widget Platform — Developer Guide

## Folder map (what lives where and why)

```
pubg-widget/
│
├── app/
│   └── [userId]/[tournamentID]/
│       ├── layout.jsx          ← Server Component. Fetches user from DB, injects
│       │                          CSS vars (--widget-primary etc.) as inline style.
│       │                          This is why colors never flicker in OBS.
│       │
│       └── after-match/
│           └── score/page.jsx  ← ~7 lines. Resolves which design bundle to load,
│                                  returns <View tournamentID={tournamentID} />.
│                                  Never put data logic here.
│
├── hooks/
│   ├── useWidgetReady.js       ← Watches <img> tags, resolves when all loaded.
│   │                              Used internally by WidgetStage. Don't call directly.
│   │
│   └── widget-data/            ← Data layer. One hook per widget type.
│       │                          Wraps RTK Query, shapes the API response into
│       │                          clean named fields. This is the ONLY place
│       │                          RTK Query is called for widget data.
│       ├── index.js            ← Single import point for all hooks
│       ├── useAfterMatchScore.js
│       ├── useAfterMatchScoreGroup.js
│       ├── useMatchSummary.js
│       ├── useMVP.js
│       ├── useMVPGroup.js
│       ├── useHeadToHead.js
│       ├── useTopPlayers.js
│       ├── useTopPlayersGroup.js
│       └── useWWC.js           ← Used by WWC, WWCTwo, AND WWCStats (same data)
│
├── components/
│   │
│   ├── common/                 ← Shared infrastructure. No color logic, no data.
│   │   ├── Layout.jsx          ← Full-screen wrapper (h-screen w-screen overflow-hidden)
│   │   ├── WidgetStage.jsx     ← Keeps widget at opacity-0 until all <img> load,
│   │   │                          then fires onReady. Required for OBS — prevents
│   │   │                          progressive JPEG chunk flash on broadcast.
│   │   ├── Title.jsx           ← PROTOTYPE. Uses old token system. Do not use in v1.
│   │   └── StoreProvider.jsx   ← Redux provider. Don't touch.
│   │
│   ├── widgets/                ← ⚠ PROTOTYPE — scheduled for deletion (see below)
│   │   └── ...                    Hard-wired to old bg-primary-* tokens.
│   │                              Not per-user. Do not use in new designs.
│   │
│   └── designs/
│       ├── default/            ← ⚠ PROTOTYPE — scheduled for deletion (see below)
│       │                          Built before the token system existed.
│       │                          Kept only as animation reference.
│       │
│       └── v1/                 ← THE OFFICIAL DESIGN. Build here.
│           ├── index.js        ← Barrel export. Register every view here.
│           ├── tokens.js       ← Color token manifest. Add v1-specific colors here.
│           ├── assets/         ← Static files: SVGs, PNGs, fonts
│           ├── _components/    ← Shared sub-components used by multiple v1 views
│           └── *.tsx           ← One file per widget slot (see slot table below)
│
├── lib/
│   ├── design/
│   │   ├── registry.js         ← Maps variant string → design bundle (dynamic import).
│   │   │                          Has 5-min in-process cache. Add v1 to BUNDLE_MAP here
│   │   │                          (already done).
│   │   └── catalog.js          ← VARIANT_DEFAULTS per design + buildThemeStyle().
│   │                              Edit here to change v1's default color palette.
│   │
│   └── services/widget-api/    ← RTK Query endpoints. Do not call these directly
│       └── index.js               from view components — use hooks/widget-data/ hooks.
│
└── types/
    └── widgets.d.ts            ← TypeScript types for all hook return shapes.
                                   Import with: import type { TeamRow } from "@/types/widgets"
```

---

## How a widget renders (end to end)

```
OBS loads URL → Next.js Server Component
  → reads userId from URL
  → fetches user from MongoDB (cached per-request)
  → injects --widget-primary, --widget-secondary etc. as inline CSS vars
  → resolves which design bundle (v1, default, ...) via registry.js
  → returns <AfterMatchScoreView tournamentID={tournamentID} />

AfterMatchScoreView (Client Component, runs in browser)
  → calls useAfterMatchScore(tournamentID) from hooks/widget-data/
  → RTK Query fetches from the API
  → data arrives → renders layout with --widget-* color classes
  → WidgetStage waits for all <img> to load
  → onReady fires → GSAP animation starts
```

**Why server injection?** CSS vars are in the HTML before any JS runs. OBS/vMix see the correct colors on the very first paint. Zero flicker, zero layout shift.

---

## Rules for building a v1 widget

### 1. File

```tsx
// components/designs/v1/AfterMatchScoreView.tsx
"use client";

export default function AfterMatchScoreView({
  tournamentID,
}: {
  tournamentID: string;
}) {
  // ...
}
```

- Extension: `.tsx`
- One default export per file
- `"use client"` at the top
- Only prop: `tournamentID: string`

### 2. Register in index.js

```js
// components/designs/v1/index.js
export { default as AfterMatchScore } from "./AfterMatchScoreView";
```

The export name must match the slot name exactly (see slot table below).

### 3. Get data from hooks/widget-data — never call RTK Query directly

```tsx
import { useAfterMatchScore } from "@/hooks/widget-data";
import type { UseAfterMatchScoreResult } from "@/types/widgets";

const { winner, col1, col2, info, ready } = useAfterMatchScore(tournamentID);
if (!ready) return null;
```

### 4. Use --widget-_ color classes — never bg-primary-_

```tsx
// ✅ correct — per-user, server-injected
<div className="bg-widget-primary text-widget-text-1" />

// ❌ wrong — static prototype colors, not per-user
// bg-primary  /  bg-primary-shade-one  /  bg-primary-shade-two
```

### 5. Gate animation on images loading (WidgetStage + useGSAP)

```tsx
import { useState, useRef } from "react";
import WidgetStage from "@/components/common/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const containerRef = useRef<HTMLDivElement>(null);
const [stageReady, setStageReady] = useState(false);

useGSAP(
  () => {
    if (!ready || !stageReady) return;
    gsap.set(".anim-row", { opacity: 0, x: -60 });
    gsap
      .timeline()
      .to(".anim-row", { opacity: 1, x: 0, stagger: 0.08, duration: 0.9 });
  },
  { scope: containerRef, dependencies: [ready, stageReady] },
);

return (
  <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
    <div ref={containerRef}>{/* layout */}</div>
  </WidgetStage>
);
```

`WidgetStage` hides the widget until images load. `stageReady` ensures GSAP only fires after that. Both together mean: no partial renders, no animation on invisible content, no OBS flash.

---

## Slot names (exact export names required by the page files)

| index.js export name   | File to create                 | URL path                        |
| ---------------------- | ------------------------------ | ------------------------------- |
| `AfterMatchScore`      | `AfterMatchScoreView.tsx`      | `after-match/score`             |
| `AfterMatchScoreGroup` | `AfterMatchScoreGroupView.tsx` | `after-match/score-group`       |
| `MatchSummary`         | `MatchSummaryView.tsx`         | `after-match/match-summary`     |
| `MVP`                  | `MVPView.tsx`                  | `after-match/mvp`               |
| `MVPGroup`             | `MVPGroupView.tsx`             | `after-match/mvp-group`         |
| `HeadToHead`           | `HeadToHeadView.tsx`           | `after-match/head-to-head`      |
| `TopPlayers`           | `TopPlayersView.tsx`           | `after-match/top-players`       |
| `TopPlayersGroup`      | `TopPlayersGroupView.tsx`      | `after-match/top-players-group` |
| `WWC`                  | `WWCView.tsx`                  | `after-match/wwc`               |
| `WWCTwo`               | `WWCTwoView.tsx`               | `after-match/wwc-two`           |
| `WWCStats`             | `WWCStatsView.tsx`             | `after-match/wwc-stats`         |

---

## Data hooks reference

All imported from `@/hooks/widget-data`. Types in `@/types/widgets`.

| Hook                           | What it returns                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `useAfterMatchScore(tID)`      | `winner` (TeamRow), `col1` (TeamRow[]), `col2` (TeamRow[]), `info`, `ready`                                                |
| `useAfterMatchScoreGroup(tID)` | same shape as above                                                                                                        |
| `useMatchSummary(tID)`         | `stats` (total_kills, total_heals, total_knocks, total_grenade_kills, total_assists, total_vehicle_kills), `info`, `ready` |
| `useMVP(tID)`                  | `player` (MVPPlayer), `mvp` (MVPPlayer[]), `ready`                                                                         |
| `useMVPGroup(tID)`             | same shape as above                                                                                                        |
| `useHeadToHead(tID)`           | `teamA` (H2HTeam), `teamB` (H2HTeam), `info`, `ready`                                                                      |
| `useTopPlayers(tID)`           | `players` (Player[]), `info`, `ready`                                                                                      |
| `useTopPlayersGroup(tID)`      | same shape as above                                                                                                        |
| `useWWC(tID)`                  | `team` (WWCTeam), `players` (WWCPlayer[]), `gameInfo`, `info`, `ready` — used by WWC, WWCTwo, and WWCStats                 |

---

## Color token reference

18 flat tokens. All injected server-side per user — swap `bg-` for `text-` or `border-` as needed.

### Primary & Secondary

| Tailwind class               | CSS var                     | Settings label   | Intent                    |
| ---------------------------- | --------------------------- | ---------------- | ------------------------- |
| `bg-widget-primary`          | `--widget-primary`          | Primary          | Main brand color          |
| `bg-widget-primary-dark`     | `--widget-primary-dark`     | Primary Dark     | Darker shade of primary   |
| `bg-widget-primary-accent`   | `--widget-primary-accent`   | Primary Accent   | Highlight / pop color     |
| `bg-widget-secondary`        | `--widget-secondary`        | Secondary        | Second brand color        |
| `bg-widget-secondary-dark`   | `--widget-secondary-dark`   | Secondary Dark   | Darker shade of secondary |
| `bg-widget-secondary-accent` | `--widget-secondary-accent` | Secondary Accent | Secondary highlight       |

### Text

| Tailwind class       | CSS var           | Settings label | Default intent       |
| -------------------- | ----------------- | -------------- | -------------------- |
| `text-widget-text-1` | `--widget-text-1` | Text 1 — Light | Main text on dark bg |
| `text-widget-text-2` | `--widget-text-2` | Text 2 — Dark  | Text on light bg     |
| `text-widget-text-3` | `--widget-text-3` | Text 3         | Custom slot          |
| `text-widget-text-4` | `--widget-text-4` | Text 4         | Custom slot          |
| `text-widget-text-5` | `--widget-text-5` | Text 5         | Custom slot          |

### Background & Status

| Tailwind class             | CSS var                   | Intent                   |
| -------------------------- | ------------------------- | ------------------------ |
| `bg-widget-bg`             | `--widget-bg`             | Widget canvas            |
| `bg-widget-status-alive`   | `--widget-status-alive`   | Player alive indicator   |
| `bg-widget-status-knocked` | `--widget-status-knocked` | Player knocked indicator |
| `bg-widget-status-dead`    | `--widget-status-dead`    | Player dead / eliminated |

### Gradient — inline style only

```tsx
style={{
  background: `linear-gradient(
    var(--widget-gradient-angle),
    var(--widget-gradient-from),
    var(--widget-gradient-to)
  )`
}}
```

`--widget-gradient-angle` is stored **with the `deg` unit** (e.g. `"135deg"`) so it can be used directly in `var()` — no transformation needed in component code.

### Color values are always rgba

All stored color values use `rgba(r, g, b, a)` format — never hex. The color picker in Settings converts any hex pick to rgba automatically. Store values as:

```
rgba(165, 78, 38, 1)      ← opaque color
rgba(0, 0, 0, 0.5)        ← semi-transparent (useful for status indicators)
```

### Where default colors come from

**There are no hardcoded fallback colors in `globals.css`.** The `--widget-*` vars are declared as `transparent` in globals.css and always overridden by the layout server component before the first paint:

```
VARIANT_DEFAULTS[variant] in catalog.js
  → buildThemeStyle(userColors, variant)
    → [tournamentID]/layout.jsx inline style prop
      → CSS vars active for all child components
```

Each design variant gets its own default palette. `default` gets `VARIANT_DEFAULTS.default`, `v1` gets `VARIANT_DEFAULTS.v1`, etc. To change a design's defaults, edit its entry in `lib/design/catalog.js → VARIANT_DEFAULTS`.

### Adding a v1-specific color token

For colors that only exist in v1 (e.g., a gold accent):

1. **`components/designs/v1/tokens.ts`** — add to `COLOR_TOKENS` (after the `...BASE_TOKENS` spread):

```ts
{ key: "v1Gold", label: "Gold Accent", css: "--widget-v1-gold", group: "v1 Extras" }
```

2. **`lib/design/catalog.js`** — add to `TOKEN_MAP`:

```js
{ key: "v1Gold", css: "--widget-v1-gold" }
```

3. **`lib/design/catalog.js`** — add to `VARIANT_DEFAULTS.v1`:

```js
v1Gold: "rgba(251, 191, 36, 1)",
```

4. **`lib/design/extras.ts`** — it auto-computes from `tokens.ts`, no change needed.

5. **`app/globals.css`** — add `transparent` placeholder in `:root` and Tailwind alias in `@theme inline`:

```css
/* :root */
--widget-v1-gold: transparent;

/* @theme inline */
--color-widget-v1-gold: var(--widget-v1-gold);
```

6. Use in your component: `bg-widget-v1-gold` / `text-widget-v1-gold`

The settings UI reads `tokens.ts` → `extras.ts` and shows these inputs in a **"v1 Extras"** section automatically when v1 is the active design. Users can change them. To lock a color permanently, hardcode it as a CSS literal and skip steps 1 and 4.

---

## Prototype files — scheduled for deletion

These exist from before the proper design system was built. Delete them once v1 covers all widget slots and `default` is no longer needed for demos.

### `components/widgets/` — entire folder

| File                   | Used by                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `TableRow.jsx`         | default/AfterMatchScoreView, default/AfterMatchScoreGroupView |
| `Tableheader.jsx`      | default/AfterMatchScoreView, default/AfterMatchScoreGroupView |
| `HighLightTeam.jsx`    | default/AfterMatchScoreView                                   |
| `PlayerCard.jsx`       | default/TopPlayersView, default/TopPlayersGroupView           |
| `MVPDisplay.jsx`       | default/MVPView, default/MVPGroupView                         |
| `MVPStats.jsx`         | MVPDisplay.jsx                                                |
| `MVPStatsIdentity.jsx` | MVPDisplay.jsx                                                |
| `RampDom.jsx`          | in-game/rampdom (in-game widget, separate concern)            |

### `components/designs/default/` — entire folder

All 11 view files. Uses old `bg-primary-*` tokens, mixed direct RTK Query calls, no TypeScript.

### `components/common/Title.jsx`

Uses `text-primary-shade-one` and `bg-primary-shade-one` (old tokens). Either update it to `--widget-*` tokens or replace with a v1-specific title component in `v1/_components/`.

### CSS vars in `app/globals.css` — after default is deleted

```css
/* Remove these from :root once default design is gone */
--primary-shade-one: #008e88;
--primary-shade-two: #007570;
--custom-yellow: #ffdd75;
--custom-green: #00473c;

/* And these from @theme inline */
--color-primary-shade-one: var(--primary-shade-one);
--color-primary-shade-two: var(--primary-shade-two);
--color-custom-yellow: var(--custom-yellow);
--color-custom-green: var(--custom-green);
```

**Do not delete any of the above until v1 has all 11 widget slots working.**
