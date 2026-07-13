// Broadcast zone-countdown panel for the live ranking widgets. Sits just left
// of the in-game minimap and self-hides — it renders nothing unless `timer`
// (from useLiveCircleTimer) is active, i.e. inside the last seconds before a
// circle event. Shape mirrors the replay CircleTimer (heavily rounded panel +
// progress ring); colours come from the widget design tokens so it matches
// whichever theme the tenant runs.

import { CIRCLE_TICK_INTERVAL_MS } from "@/hooks/widget-data/useLiveCircleTimer";

const LABELS = {
  hold: "Circle Closing In",
  shrink: "New Circle In",
};

// Minimap footprint (px on the 1920x1080 broadcast) — the panel is anchored
// relative to it so it stays glued to the map's left edge and roughly fills the
// map's 250px height band.
const MAP_WIDTH = 204;
const MAP_TOP = 0;
const GAP = 6;
const PANEL_WIDTH = 150;
// Roughly the minimap's height so the panel fills the same vertical band.
const PANEL_HEIGHT = 240;

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircleCountdown({ timer }) {
  if (!timer) return null;

  const { phase, remaining, total } = timer;
  const seconds = Math.ceil(remaining);
  const fraction = total > 0 ? Math.min(Math.max(remaining / total, 0), 1) : 0;

  return (
    <div
      className="from-widget-gradient-from to-widget-gradient-to text-widget-text-3 pointer-events-none absolute z-30 flex flex-col items-center justify-start gap-4 bg-gradient-to-b px-4 pt-3 pb-4 shadow-2xl"
      style={{
        top: MAP_TOP,
        right: MAP_WIDTH + GAP,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
      }}
    >
      <h2 className="font-primary text-center text-2xl font-bold uppercase leading-[1.05] tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
        {LABELS[phase].split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h2>

      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-[104px] w-[104px] -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            className="stroke-widget-text-3/20"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            className="stroke-widget-secondary"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            // Drive the offset via inline style (a real CSS property, so the
            // transition reliably engages) and glide between the discrete
            // countdown samples instead of jumping each tick — linear so the
            // drain reads as steady real-time motion.
            style={{
              strokeDashoffset: CIRCUMFERENCE * (1 - fraction),
              transition: `stroke-dashoffset ${CIRCLE_TICK_INTERVAL_MS}ms linear`,
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span className="font-primary text-widget-secondary text-5xl font-bold tabular-nums">
            {seconds}
          </span>
          <span className="mt-1 text-[11px] font-semibold tracking-[0.25em]">
            SEC
          </span>
        </div>
      </div>
    </div>
  );
}
