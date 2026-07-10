const LABELS = {
  hold: "Circle Closing In",
  shrink: "New Circle In",
  final: "Final Circle",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// The pink zone-countdown panel. Driven entirely by `timer` from
// circleTimerAt, so it renders nothing until a circle phase is active and can
// safely overlay the broadcast feed.
export default function CircleTimer({ timer }) {
  if (!timer) return null;

  const { phase, remaining, total } = timer;
  const seconds = Math.ceil(remaining);
  const fraction = total > 0 ? remaining / total : 0;

  return (
    <div className="flex w-56 flex-col items-center gap-5 rounded-[2.5rem] bg-gradient-to-b from-rose-500 to-rose-600 px-6 py-8 text-white shadow-2xl">
      <h2 className="text-center text-3xl font-extrabold uppercase leading-tight tracking-wide">
        {LABELS[phase]}
      </h2>

      {phase !== "final" && (
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            />
          </svg>
          <div className="absolute flex flex-col items-center leading-none">
            <span className="text-5xl font-bold tabular-nums">{seconds}</span>
            <span className="mt-1 text-sm font-semibold tracking-[0.3em]">
              SEC
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
