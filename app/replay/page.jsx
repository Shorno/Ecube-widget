"use client";

import { useEffect } from "react";
import { useGetReplayEventsQuery } from "@/lib/services/replay-api";
import { useReplayPlayer } from "@/hooks/useReplayPlayer";
import {
  buildTimeline,
  eventAt,
  playersAt,
  zoneAt,
  killsAt,
} from "@/lib/replay/timeline";
import MiniMap from "@/components/replay/MiniMap";
import PlaybackControls from "@/components/replay/PlaybackControls";
import MatchSidebar from "@/components/replay/MatchSidebar";

// Official PUBG world size for Erangel: 816,000 cm per side (8x8 grid of
// 1.02 km cells), origin at the map image's top-left corner.
const ERANGEL = { imageSrc: "/maps/erangel.webp", size: 816000 };

function Centered({ children }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
      {children}
    </div>
  );
}

export default function ReplayPage() {
  const { data, isLoading, isError } = useGetReplayEventsQuery();
  const { time, isPlaying, speed, setSpeed, seek, seekBy, togglePlay } =
    useReplayPlayer(data?.duration ?? 0);

  // Keyboard shortcuts bind to the window — external system, so an effect.
  useEffect(() => {
    const handleKey = (event) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      } else if (event.code === "ArrowLeft") {
        seekBy(-10000);
      } else if (event.code === "ArrowRight") {
        seekBy(10000);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay, seekBy]);

  if (isLoading) return <Centered>Loading replay…</Centered>;
  if (isError || !data) return <Centered>Failed to load replay recording</Centered>;

  const timeline = buildTimeline(data.events);

  const players = playersAt(timeline, time);
  const zone = zoneAt(timeline, time, ERANGEL.size);
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
      return { t: kill.t, x: victim.location.x, y: victim.location.y };
    })
    .filter(Boolean);

  const scrubberMarkers = [
    ...(timeline.get("setgameglobalinfo") ?? []).map((event) => ({
      t: event.t,
      color: "#38bdf8",
    })),
    ...(timeline.get("setisingame") ?? []).map((event) => ({
      t: event.t,
      color: "#facc15",
    })),
    ...(timeline.get("setkillinfo") ?? []).map((event) => ({
      t: event.t,
      color: "#ef4444",
    })),
  ];

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <h1 className="text-sm font-semibold uppercase tracking-widest">
          Match Replay
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-mono tabular-nums text-neutral-400">
            Game time {circleInfo?.GameTime ?? "0"}s
          </span>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
              phase === "InGame"
                ? "bg-emerald-500/20 text-emerald-300"
                : phase === "Finished"
                  ? "bg-red-500/20 text-red-300"
                  : "bg-white/10 text-neutral-300"
            }`}
          >
            {phase}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="aspect-square h-full max-w-full">
            <MiniMap
              world={ERANGEL}
              players={players}
              trails={[...trailsById.values()]}
              zone={zone}
              plane={plane}
              killMarkers={killMarkers}
              observedUid={observedUid}
            />
          </div>
        </main>
        <MatchSidebar
          circleInfo={circleInfo}
          teams={teams}
          players={players}
          kills={kills}
        />
      </div>

      <PlaybackControls
        time={time}
        duration={data.duration}
        isPlaying={isPlaying}
        speed={speed}
        markers={scrubberMarkers}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
