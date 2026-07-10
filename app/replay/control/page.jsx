"use client";

import { useEffect } from "react";
import { useGetReplayEventsQuery } from "@/lib/services/replay-api";
import { useReplayPlayer } from "@/hooks/useReplayPlayer";
import { useReplayHost } from "@/hooks/useReplaySync";
import { buildTimeline } from "@/lib/replay/timeline";
import { deriveReplayState } from "@/lib/replay/deriveState";
import { ERANGEL } from "@/lib/replay/maps";
import MiniMap from "@/components/replay/MiniMap";
import PlaybackControls from "@/components/replay/PlaybackControls";
import MatchSidebar from "@/components/replay/MatchSidebar";
import Centered from "@/components/replay/Centered";

export default function ReplayControlPage() {
  const { data, isLoading, isError } = useGetReplayEventsQuery();
  const { time, isPlaying, speed, setSpeed, seek, seekBy, togglePlay } =
    useReplayPlayer(data?.duration ?? 0);

  // Mirror the clock to any open Replay display in the same browser.
  useReplayHost(time);

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
  if (isError || !data)
    return <Centered>Failed to load replay recording</Centered>;

  const timeline = buildTimeline(data.events);
  const {
    players,
    zone,
    kills,
    phase,
    circleInfo,
    teams,
    observedUid,
    plane,
    trails,
    killMarkers,
  } = deriveReplayState(timeline, time, ERANGEL);

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
          Replay Control
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
              trails={trails}
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
