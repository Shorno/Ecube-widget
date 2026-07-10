"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useGetReplayEventsQuery } from "@/lib/services/replay-api";
import { useReplayPlayer } from "@/hooks/useReplayPlayer";
import { useReplayHost } from "@/hooks/useReplaySync";
import { parseReplay } from "@/lib/replay/parse";
import { buildTimeline } from "@/lib/replay/timeline";
import { deriveReplayState } from "@/lib/replay/deriveState";
import { ERANGEL } from "@/lib/replay/maps";
import MiniMap from "@/components/replay/MiniMap";
import PlaybackControls from "@/components/replay/PlaybackControls";
import MatchSidebar from "@/components/replay/MatchSidebar";
import Centered from "@/components/replay/Centered";

export default function ReplayControlPage() {
  const { data: defaultData, isError } = useGetReplayEventsQuery();
  const [localData, setLocalData] = useState(null);
  const [loadedName, setLoadedName] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  // A locally loaded match takes precedence over the bundled default.
  const data = localData ?? defaultData;
  const { time, isPlaying, speed, setSpeed, seek, seekBy, togglePlay } =
    useReplayPlayer(data?.duration ?? 0);

  // Mirror the clock and the loaded match to any Replay display in this browser.
  useReplayHost(time, localData);

  // Load another match recording — parsed here in the browser, no server round
  // trip. Setting localData feeds the display/circle widgets via the host hook.
  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setUploadError(null);
    setIsParsing(true);
    try {
      const parsed = parseReplay(await file.text());
      if (parsed.count === 0) throw new Error("No usable events in file");
      setLocalData(parsed);
      setLoadedName(file.name);
      seek(0);
    } catch {
      setUploadError("Couldn't read that file");
    } finally {
      setIsParsing(false);
    }
  }

  // Revert to the bundled default match.
  function clearLocal() {
    setLocalData(null);
    setLoadedName(null);
    setUploadError(null);
    seek(0);
  }

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

  if (!data)
    return (
      <Centered>
        {isError ? "Failed to load replay recording" : "Loading replay…"}
      </Centered>
    );

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
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold uppercase tracking-widest">
            Replay Control
          </h1>
          <label
            className={`flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition hover:bg-white/20 ${
              isParsing ? "cursor-wait opacity-60" : "cursor-pointer"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            {isParsing ? "Loading…" : "Load match"}
            <input
              type="file"
              accept=".jsonl,.json,.txt"
              className="hidden"
              disabled={isParsing}
              onChange={handleUpload}
            />
          </label>
          {uploadError ? (
            <span className="text-xs text-red-400">{uploadError}</span>
          ) : (
            loadedName && (
              <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                <span className="max-w-[16rem] truncate">{loadedName}</span>
                <button
                  type="button"
                  onClick={clearLocal}
                  className="rounded p-0.5 text-neutral-500 transition hover:bg-white/10 hover:text-neutral-200"
                  aria-label="Revert to default match"
                  title="Revert to default match"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )
          )}
        </div>
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
