// PUBG zone-countdown math, shared by the replay overlay and the live widgets.
// Both feed the same setcircleinfo payload — recorded events for replay, the
// /getcircleinfo proxy for live — so the phase machine lives here, once.
//
// CircleStatus 3 = pre-game, 0 = hold (blue parked on the previous circle,
// counting down to when it STARTS closing → "Circle Closing In"), 2 = shrink
// (blue actively closing, counting down to when the new circle is revealed →
// "New Circle In"), 1 = final circle reached. Counter ticks 0 → MaxTime once
// per second in every phase, so remaining = MaxTime - Counter. Pass the seconds
// elapsed since the payload was captured to keep the countdown smooth between
// those one-per-second ticks. Returns null whenever no timer should show.
export function circleTimerFromInfo(body, elapsedSinceCaptureSeconds = 0) {
  if (!body) return null;

  const { CircleStatus: status, CircleIndex, Counter, MaxTime } = body;
  const index = Number(CircleIndex);
  if (index < 1 || status === "3") return null;
  if (status === "1") return { phase: "final", index, remaining: 0, total: 0 };

  const total = Number(MaxTime);
  if (total <= 0) return null;

  const elapsed = Number(Counter) + elapsedSinceCaptureSeconds;
  const remaining = Math.min(Math.max(total - elapsed, 0), total);
  return {
    phase: status === "2" ? "shrink" : "hold",
    index,
    remaining,
    total,
  };
}
