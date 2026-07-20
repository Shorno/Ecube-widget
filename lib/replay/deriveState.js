import { playersAt, zoneAt, killsAt, eventAt } from "./timeline";

// Everything the map and sidebar need at a single playback instant. Pure over
// (timeline, time), so the Replay Control and Replay display render identical
// frames from the same recording and can never drift apart.
export function deriveReplayState(timeline, time, world) {
  const players = playersAt(timeline, time);
  const zone = zoneAt(timeline, time, world.size);
  const kills = killsAt(timeline, time);
  const phase = eventAt(timeline, "setisingame", time)?.body ?? "Lobby";
  const circleInfo = eventAt(timeline, "setcircleinfo", time)?.body ?? null;
  const teams =
    eventAt(timeline, "totalmessage", time)?.body?.TeamInfoList ?? [];
  const observedUid =
    eventAt(timeline, "setobservingplayer", time)?.body?.["0"] ?? null;

  // The flight line never changes during a match — take it from the first
  // global-info event so it is visible from the very start of playback.
  const globalInfo = timeline.get("setgameglobalinfo")?.[0]?.body;
  const plane = globalInfo
    ? {
        start: {
          x: parseFloat(globalInfo.PlaneStartLocX),
          y: parseFloat(globalInfo.PlaneStartLocY),
        },
        stop: {
          x: parseFloat(globalInfo.PlaneStopLocX),
          y: parseFloat(globalInfo.PlaneStopLocY),
        },
      }
    : null;

  const playersInPlane = players.filter((player) => player.liveState === 1);
  const planePosition =
    playersInPlane.length > 0
      ? {
          x:
            playersInPlane.reduce((sum, player) => sum + player.location.x, 0) /
            playersInPlane.length,
          y:
            playersInPlane.reduce((sum, player) => sum + player.location.y, 0) /
            playersInPlane.length,
        }
      : null;

  // Movement trails: every snapshot position up to the playhead.
  const trailsById = new Map();
  for (const snapshot of timeline.get("totalmessage") ?? []) {
    if (snapshot.t > time) break;
    for (const player of snapshot.body?.TotalPlayerList ?? []) {
      const trail = trailsById.get(player.uId);
      const point = [player.location.x, player.location.y];
      if (trail) trail.points.push(point);
      else
        trailsById.set(player.uId, {
          uId: player.uId,
          teamId: player.teamId,
          points: [point],
        });
    }
  }
  for (const player of players) {
    trailsById
      .get(player.uId)
      ?.points.push([player.location.x, player.location.y]);
  }

  // Pin each kill to where the victim stood at the moment it happened.
  const killMarkers = kills
    .map((kill) => {
      const victim = playersAt(timeline, kill.t).find(
        (player) => String(player.uId) === kill.body.VictimUID,
      );
      if (!victim) return null;
      return {
        t: kill.t,
        x: victim.location.x,
        y: victim.location.y,
        teamId: victim.teamId,
      };
    })
    .filter(Boolean);

  return {
    players,
    zone,
    kills,
    phase,
    circleInfo,
    teams,
    observedUid,
    plane,
    planePosition,
    trails: [...trailsById.values()],
    killMarkers,
  };
}

// Team visibility applies to every team-owned map artifact. Zone and flight
// data stay global and are passed through separately by the pages.
export function filterReplayMapState(replayState, visibleTeamIds) {
  const visible = new Set(visibleTeamIds.map(String));
  return {
    players: replayState.players.filter((player) =>
      visible.has(String(player.teamId)),
    ),
    trails: replayState.trails.filter((trail) =>
      visible.has(String(trail.teamId)),
    ),
    killMarkers: replayState.killMarkers.filter((marker) =>
      visible.has(String(marker.teamId)),
    ),
  };
}
