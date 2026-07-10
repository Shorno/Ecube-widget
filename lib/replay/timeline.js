// Reconstructs match state at an arbitrary point in a recorded PCOB session.
// Every route is snapshot-based (each event carries the full payload), so
// "state at time T" is simply the latest event of each route at or before T.

// Snapshots arrive ~4s apart; never interpolate across a bigger gap than this
// or players would glide unnaturally over recording dropouts.
const MAX_LERP_GAP_MS = 15000;

export function buildTimeline(events) {
  const byRoute = new Map();
  for (const event of events) {
    const list = byRoute.get(event.route);
    if (list) list.push(event);
    else byRoute.set(event.route, [event]);
  }
  return byRoute;
}

// Index of the last event with t <= time, or -1 if time precedes the route.
function indexAt(events, time) {
  let low = 0;
  let high = events.length - 1;
  let found = -1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (events[mid].t <= time) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return found;
}

export function eventAt(timeline, route, time) {
  const list = timeline.get(route);
  if (!list) return null;
  const index = indexAt(list, time);
  return index >= 0 ? list[index] : null;
}

function lerp(from, to, fraction) {
  return from + (to - from) * fraction;
}

// Players at `time`, with positions interpolated between the surrounding
// snapshots so movement is smooth instead of jumping every ~4 seconds.
export function playersAt(timeline, time) {
  const snapshots = timeline.get("totalmessage");
  if (!snapshots) return [];

  const index = indexAt(snapshots, time);
  if (index < 0) return [];

  const current = snapshots[index];
  const players = current.body?.TotalPlayerList ?? [];
  const next = snapshots[index + 1];
  const gap = next ? next.t - current.t : Infinity;
  if (!next?.body?.TotalPlayerList || gap > MAX_LERP_GAP_MS) return players;

  const fraction = (time - current.t) / gap;
  const upcoming = new Map(next.body.TotalPlayerList.map((p) => [p.uId, p]));

  return players.map((player) => {
    const target = upcoming.get(player.uId);
    if (!target) return player;
    return {
      ...player,
      location: {
        x: lerp(player.location.x, target.location.x, fraction),
        y: lerp(player.location.y, target.location.y, fraction),
        z: lerp(player.location.z, target.location.z, fraction),
      },
    };
  });
}

function parseCircle(circle) {
  if (!circle) return null;
  return {
    x: parseFloat(circle.X),
    y: parseFloat(circle.Y),
    radius: parseFloat(circle.Size),
  };
}

// setcircleinfo drives a phase machine, all timing straight from the feed:
// CircleStatus 3 = pre-game, 0 = hold (blue parked on the previous circle),
// 2 = shrink (blue closes onto the white circle), 1 = final circle reached.
// Counter counts 0 → MaxTime at one tick per second in every phase, so
// Counter/MaxTime is the shrink progress.
export function zoneAt(timeline, time, worldSize) {
  const info = eventAt(timeline, "setcircleinfo", time);
  if (!info) return { white: null, blue: null };

  const { CircleStatus: status, CircleIndex, Counter, MaxTime } = info.body;
  const index = Number(CircleIndex);
  if (status === "3" || index < 1) return { white: null, blue: null };

  // Circle geometry never changes once published, and in a recording the whole
  // match is already known — read the final CircleArray so the sparse
  // setgameglobalinfo polling (seconds behind the phase machine) can't delay
  // a white-circle reveal.
  const circles = (
    timeline.get("setgameglobalinfo")?.at(-1)?.body?.CircleArray ?? []
  ).map(parseCircle);

  const white = circles[index - 1] ?? null;
  // Phase 1 shrinks in from the map boundary, which the feed never includes —
  // approximate it with a circle enclosing the whole map.
  const blueFrom = circles[index - 2] ?? {
    x: worldSize / 2,
    y: worldSize / 2,
    radius: worldSize * 0.75,
  };

  if (status === "1") return { white, blue: white };
  if (status !== "2" || !white) return { white, blue: blueFrom };

  // Counter only ticks once per second — anchor progress to the event's
  // capture time so the shrink animates smoothly at any playback speed.
  const elapsedSeconds = Number(Counter) + (time - info.t) / 1000;
  const progress = Math.min(Math.max(elapsedSeconds / Number(MaxTime), 0), 1);
  return {
    white,
    blue: {
      x: lerp(blueFrom.x, white.x, progress),
      y: lerp(blueFrom.y, white.y, progress),
      radius: lerp(blueFrom.radius, white.radius, progress),
    },
  };
}

export function killsAt(timeline, time) {
  const kills = timeline.get("setkillinfo") ?? [];
  return kills.filter((event) => event.t <= time);
}
