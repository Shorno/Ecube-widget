# v1 Design Bundle — Developer Guide

## Folder structure

```
components/designs/v1/
├── GUIDE.md                        ← you are here
├── index.js                        ← bundle entry — export everything from here
├── tokens.js                       ← color token manifest (settings reads this)
├── assets/                         ← static assets: SVGs, PNGs, etc.
│   └── logo.svg
├── AfterMatchScoreView.jsx
├── AfterMatchScoreGroupView.jsx
├── HeadToHeadView.jsx
├── MatchSummaryView.jsx
├── MVPView.jsx
├── MVPGroupView.jsx
├── TopPlayersView.jsx
├── TopPlayersGroupView.jsx
├── WWCView.jsx
├── WWCTwoView.jsx
└── WWCStatsView.jsx
```

---

## Component contract

Every widget view receives exactly one prop: `tournamentID` (string).
The component is a standard React client component (`"use client"`).

```jsx
"use client";

export default function AfterMatchScoreView({ tournamentID }) {
  // fetch data, animate, render
}
```

**The prop name and component name must match what index.js exports.**
The page files are already wired — they do:
```js
const { AfterMatchScore: View } = await getUserDesignRegistry(userId, tournamentID);
return <View tournamentID={tournamentID} />;
```

### Do components always have to look the same?

No. The only hard rules are:
1. Accept `{ tournamentID }` as the prop
2. Be a default export
3. Be a client component

Everything inside — layout, animation, structure, sub-components — is completely free.
You can have completely different layouts, animations, and structures between `default` and `v1`.
You can create as many sub-components and helper files inside `v1/` as you need.

---

## Data fetching

Use RTK Query hooks from `@/lib/services/widget-api`. They are already configured with the
correct base URL and cache settings.

```jsx
import { useGetAfterMatchScoreQuery } from "@/lib/services/widget-api";

const { data, isLoading } = useGetAfterMatchScoreQuery({ tournamentID });
if (!data) return null;
```

Available queries (check `lib/services/widget-api/index.js` for the full list):
- `useGetAfterMatchScoreQuery`
- `useGetAfterMatchScoreGroupQuery`
- `useGetMatchSummaryQuery`
- `useGetMVPQuery`
- `useGetMVPGroupQuery`
- `useGetTopPlayersQuery`
- `useGetTopPlayersGroupQuery`
- `useGetWWCQuery`
- `useGetHeadToHeadQuery`

---

## Color tokens

Use these Tailwind utility classes — they read from the user's theme settings automatically.

### Standard tokens (every design)

| Tailwind class              | CSS var                    | Use for                        |
|-----------------------------|----------------------------|--------------------------------|
| `bg-widget-primary`         | `--widget-primary`         | Main brand color               |
| `bg-widget-primary-bg`      | `--widget-primary-bg`      | Primary surface/background     |
| `bg-widget-primary-border`  | `--widget-primary-border`  | Primary border/divider         |
| `bg-widget-primary-dark`    | `--widget-primary-dark`    | Primary darker shade           |
| `bg-widget-secondary`       | `--widget-secondary`       | Secondary brand color          |
| `bg-widget-secondary-bg`    | `--widget-secondary-bg`    | Secondary surface              |
| `bg-widget-secondary-border`| `--widget-secondary-border`| Secondary border               |
| `bg-widget-secondary-dark`  | `--widget-secondary-dark`  | Secondary darker shade         |
| `bg-widget-status-alive`    | `--widget-status-alive`    | Player alive indicator         |
| `bg-widget-status-knocked`  | `--widget-status-knocked`  | Player knocked indicator       |
| `bg-widget-status-dead`     | `--widget-status-dead`     | Player dead indicator          |
| `bg-widget-bg`              | `--widget-bg`              | Widget background              |
| `text-widget-text`          | `--widget-text`            | Main text color                |

For gradient: `var(--widget-gradient-start)` and `var(--widget-gradient-end)` (use inline style
or CSS since Tailwind doesn't have arbitrary gradient utilities by default).

### Adding v1-specific tokens

1. Open `tokens.js` and add an entry to `COLOR_TOKENS`:
```js
{ key: "v1-gold", label: "Gold Accent", css: "--widget-v1-gold", group: "v1 Extras" },
```

2. Add a default value in `globals.css` under `:root`:
```css
--widget-v1-gold: #fbbf24;
```

3. Add a Tailwind alias in `globals.css` under `@theme inline`:
```css
--color-widget-v1-gold: var(--widget-v1-gold);
```

4. Use in your component:
```jsx
<div className="bg-widget-v1-gold">...</div>
```

---

## Widget → URL mapping

| Component file              | URL path                          |
|-----------------------------|-----------------------------------|
| `AfterMatchScoreView`       | `after-match/score`               |
| `AfterMatchScoreGroupView`  | `after-match/score-group`         |
| `HeadToHeadView`            | `after-match/head-to-head`        |
| `MatchSummaryView`          | `after-match/match-summary`       |
| `MVPView`                   | `after-match/mvp`                 |
| `MVPGroupView`              | `after-match/mvp-group`           |
| `TopPlayersView`            | `after-match/top-players`         |
| `TopPlayersGroupView`       | `after-match/top-players-group`   |
| `WWCView`                   | `after-match/wwc`                 |
| `WWCTwoView`                | `after-match/wwc-two`             |
| `WWCStatsView`              | `after-match/wwc-stats`           |

Full preview URL: `http://localhost:3000/<userId>/<tournamentID>/<url-path>`

---

## Animation

Use GSAP + `useGSAP` for animations. Gate animations on data being ready:

```jsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

useGSAP(
  () => {
    if (!data) return;
    gsap.from(".my-element", { opacity: 0, y: 40, duration: 0.8 });
  },
  { dependencies: [data] }
);
```

---

## Adding a new design bundle (future)

1. Copy this folder to `components/designs/<new-key>/`
2. Update `index.js` exports
3. Add to `BUNDLE_MAP` in `lib/design/registry.js`
4. Add to `KNOWN_DESIGNS` in `app/api/admin/seed-designs/route.js`
5. Hit "Register Designs" in `/admin/designs`
