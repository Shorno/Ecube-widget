# v1 Color & Font Token Reference

All tokens are injected server-side by the layout and available as Tailwind classes.
No imports needed — just use the class.

---

## Primary

```jsx
// Background
<div className="bg-widget-primary" />

// Text
<span className="text-widget-primary">TEAM NAME</span>

// Border
<div className="border border-widget-primary" />

// Primary Dark — darker shade, use for hover states or backgrounds behind primary text
<div className="bg-widget-primary-dark" />
<span className="text-widget-primary-dark">secondary label</span>

// Primary Accent — lighter highlight, use for glows or active indicators
<div className="bg-widget-primary-accent" />
<span className="text-widget-primary-accent">+2 pts</span>
```

---

## Secondary

```jsx
// Secondary — contrasting color, use for kill counts, highlights, badges
<span className="text-widget-secondary font-bold">{kills}</span>
<div className="bg-widget-secondary" />

// Secondary Dark
<div className="bg-widget-secondary-dark" />

// Secondary Accent
<span className="text-widget-secondary-accent">WWCD</span>
```

---

## Text

```jsx
// text-1 — primary text, use for names, headings, main values
<h1 className="text-widget-text-1 text-2xl font-bold">{teamName}</h1>

// text-2 — secondary text, use for labels, captions
<span className="text-widget-text-2 text-xs">Placement</span>

// text-3 — muted / tertiary text, use for rank, metadata, dimmed values
<span className="text-widget-text-3 text-sm">{rank}.</span>
```

---

## Background

```jsx
// Full widget background
<div className="h-screen w-screen bg-widget-bg" />

// Panel / card background
<div className="rounded bg-widget-bg p-4" />
```

---

## Gradient

```jsx
// Use gradientFrom and gradientTo as Tailwind gradient stops.
// gradientAngle is not a Tailwind utility — use inline style for the angle.

<div
  className="from-widget-gradient-from to-widget-gradient-to bg-gradient-to-br"
  // To use the custom angle from the token:
  style={{ background: `linear-gradient(var(--widget-gradient-angle), var(--widget-gradient-from), var(--widget-gradient-to))` }}
/>

// Header bar with gradient
<div
  className="h-2 w-full"
  style={{ background: `linear-gradient(var(--widget-gradient-angle), var(--widget-gradient-from), var(--widget-gradient-to))` }}
/>
```

---

## Status (player alive / knocked / dead)

```jsx
// Dot indicator
<span className="h-2 w-2 rounded-full bg-widget-status-alive" />
<span className="h-2 w-2 rounded-full bg-widget-status-knocked" />
<span className="h-2 w-2 rounded-full bg-widget-status-dead" />

// Text color
<span className="text-widget-status-alive">Alive</span>
<span className="text-widget-status-knocked">Knocked</span>
<span className="text-widget-status-dead">Dead</span>
```

---

## v1 Extra — Gold Accent

```jsx
// Use for MVP badges, winner highlights, champion labels
<span className="text-widget-v1-gold font-bold">CHAMPION</span>
<div className="border border-widget-v1-gold bg-widget-v1-gold/10 px-3 py-1">
  MVP
</div>

// Gold divider line
<div className="h-px w-full bg-widget-v1-gold" />
```

---

## Fonts

```jsx
// Primary font — inherited by default, no class needed.
// Add font-primary only when you need to explicitly reset back to it.
<h1 className="font-primary text-2xl font-bold">{teamName}</h1>
<span>{rank}</span>  {/* also primary — inherited */}

// Secondary font — must be explicit
<span className="font-secondary text-xs">{label}</span>

// Common pattern: primary for values, secondary for labels
<div className="flex items-baseline gap-1">
  <span className="text-xl font-bold text-widget-primary">{points}</span>
  <span className="font-secondary text-xs text-widget-text-3">PTS</span>
</div>
```

---

## Full row example

```jsx
export default function ScoreRow({ rank, team, points, kills, placement }) {
  return (
    <div className="border-widget-primary/20 flex items-center gap-4 border-b px-4 py-2">
      <span className="font-secondary text-widget-text-3 w-6 text-center text-sm">
        {rank}
      </span>
      <span className="text-widget-text-1 flex-1 text-base font-bold">
        {team}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-widget-primary text-lg font-bold">{points}</span>
        <span className="font-secondary text-widget-text-3 text-[10px]">
          PTS
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-widget-secondary text-lg font-bold">{kills}</span>
        <span className="font-secondary text-widget-text-3 text-[10px]">
          KILLS
        </span>
      </div>
    </div>
  );
}
```
