# v1 Custom Color Tokens — How It Works

## What we built

The `v1` design has a gold accent color (`v1Gold`) that a specific client requested. The user can still change it from the Settings page whenever they want. Here is the exact pipeline from database to CSS class.

---

## The full pipeline

```
User saves color in Settings
        ↓
MongoDB: User.themeConfig.colors = { ..., v1Gold: "#ff6600" }
        ↓
Server Component: [tournamentID]/layout.jsx
  calls buildThemeStyle(colors, "v1")
  → returns { "--widget-v1-gold": "#ff6600", ...all other tokens }
        ↓
Layout renders: <div style={{ "--widget-v1-gold": "#ff6600", ... }}>
  CSS vars are now active for every child component
        ↓
v1 component uses: className="bg-widget-v1-gold"
  Tailwind reads: --color-widget-v1-gold → var(--widget-v1-gold) → #ff6600
        ↓
OBS sees the correct color on first paint — zero flicker
```

---

## The 5 files you touch to add a custom token

### 1. `components/designs/v1/tokens.js`

Declares the token so the Settings UI shows a color picker for it.

```js
{ key: "v1Gold", label: "Gold Accent", css: "--widget-v1-gold", group: "v1 Extras" }
```

- `key` — the field name stored in MongoDB
- `css` — the CSS custom property that gets injected
- `group` — the section heading in Settings → Colors

### 2. `lib/design/catalog.js` — TOKEN_MAP

Tells `buildThemeStyle()` to inject this CSS var from the user's saved colors.

```js
{ key: "v1Gold", css: "--widget-v1-gold" }
```

Without this entry, the layout would never inject `--widget-v1-gold`, even if the user saved a value.

### 3. `lib/design/catalog.js` — VARIANT_DEFAULTS

Sets the default value when the user has no saved color for this token.

```js
v1: {
  // ... standard tokens ...
  v1Gold: "#fbbf24",   // amber gold — changes to whatever user saves
}
```

### 4. `app/globals.css`

Two places: the CSS var fallback in `:root`, and the Tailwind alias in `@theme inline`.

```css
/* :root — fallback if layout injection hasn't fired */
--widget-v1-gold: #fbbf24;

/* @theme inline — makes Tailwind classes work */
--color-widget-v1-gold: var(--widget-v1-gold);
```

After this you can use:

- `bg-widget-v1-gold`
- `text-widget-v1-gold`
- `border-widget-v1-gold`

### 5. Your component

Use it like any other token:

```tsx
<div className="bg-widget-v1-gold text-widget-text-2">Gold bar</div>
```

Or inline for gradient-style usage:

```tsx
style={{ borderColor: "var(--widget-v1-gold)" }}
```

---

## Why the user can still change it

The Settings page reads `tokens.js` to build the color picker UI. Any token in `COLOR_TOKENS` shows up as an editable input. When the user saves, the new value overwrites `User.themeConfig.colors.v1Gold` in MongoDB. The next time the widget loads, the layout reads the new value and injects a different `--widget-v1-gold`.

If you want a color that **cannot be changed** by the user, hardcode it directly in the component and do **not** add it to `tokens.js`. It will never appear in the Settings UI.

```tsx
// Locked — never appears in Settings
<div style={{ background: "#1a73e8" }}>sponsor color</div>

// Editable — user controls it from Settings
<div className="bg-widget-v1-gold">brand color</div>
```

---

## The test component (AfterMatchScoreView.tsx)

Uses `useAfterMatchScore(tournamentID)` from `@/hooks/widget-data`. Shows:

| Element              | Token used                                       |
| -------------------- | ------------------------------------------------ |
| Title gradient bar   | `--widget-gradient-from/to/angle` (inline style) |
| Color swatch grid    | Every standard token + `v1Gold`                  |
| Winner row           | `bg-widget-primary`                              |
| Other rows           | `bg-widget-primary-dark`                         |
| Rank numbers         | `text-widget-text-3`                             |
| Winner rank + points | `text-widget-v1-gold`                            |
| Kill points          | `text-widget-secondary-accent`                   |
| Position points      | `text-widget-secondary`                          |
| Gold bar at bottom   | `bg-widget-v1-gold` + `text-widget-text-2`       |

**URL to test:**

```
/{userId}/{tournamentID}/after-match/score
```

Ensure the user's `designVariant` is `"v1"` in the DB.

---

## Adding more v1-specific tokens

Same 5-step process. For example, adding a `v1Neon` color:

1. `tokens.js` → add `{ key: "v1Neon", label: "Neon", css: "--widget-v1-neon", group: "v1 Extras" }`
2. `catalog.js TOKEN_MAP` → add `{ key: "v1Neon", css: "--widget-v1-neon" }`
3. `catalog.js VARIANT_DEFAULTS.v1` → add `v1Neon: "#39ff14"`
4. `globals.css` → add `--widget-v1-neon: #39ff14;` in `:root` and `--color-widget-v1-neon: var(--widget-v1-neon);` in `@theme inline`
5. Use `bg-widget-v1-neon` in your component
