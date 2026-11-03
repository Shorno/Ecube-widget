"use client";

import type { ChangeEvent } from "react";
import type { TeamRecallPayload } from "@/types/team-recall";
import { useRecallReplay } from "@/hooks/widget-data/useRecallReplay";
import PlaybackControls, {
  formatClock,
} from "@/components/replay/PlaybackControls";

const RECALL_COLOR = "#fbbf24";
const DEAD_COLOR = "#f87171";

type Props = {
  onEnqueue: (payload: TeamRecallPayload) => void;
  onReset: () => void;
};

// Preview-only: replays a recorded match's recalls through the real queue,
// with a scrubber along the bottom and a jump list of every recall moment.
export default function RecallReplayPanel({ onEnqueue, onReset }: Props) {
  const replay = useRecallReplay({ enqueue: onEnqueue, reset: onReset });

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (file) replay.loadFile(file);
  }

  return (
    <>
      <div className="flex flex-col gap-1.5 rounded bg-black/75 p-2.5 shadow-lg">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase">
          <span className="text-white/70">Match replay</span>
          <label className="cursor-pointer text-yellow-300 hover:underline">
            Load .jsonl
            <input
              type="file"
              accept=".jsonl,.txt"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>
        <div className="truncate font-mono text-[10px] text-white/40">
          {replay.sourceName} · {replay.moments.length} moments
        </div>
        {replay.error && (
          <div className="font-mono text-[10px] text-red-400">
            {replay.error}
          </div>
        )}
        <div className="flex max-h-[45vh] flex-col gap-1 overflow-y-auto">
          {replay.moments.map((moment) => (
            <button
              key={moment.key}
              type="button"
              onClick={() => replay.jumpTo(moment.t)}
              className="flex items-baseline gap-2 rounded bg-white/10 px-2 py-1 text-left text-xs text-white hover:bg-white/20"
            >
              <span
                className="font-mono tabular-nums"
                style={{
                  color: moment.kind === "dead" ? DEAD_COLOR : RECALL_COLOR,
                }}
              >
                {formatClock(moment.t)}
              </span>
              <span className="truncate">{moment.label}</span>
              <span
                className="ml-auto shrink-0 font-mono text-[10px] text-white/40"
                title="In-game time"
              >
                {formatClock(moment.gameTime * 1000)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Left inset keeps the play button clear of the Next.js dev indicator. */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-neutral-900 pl-14">
        <PlaybackControls
          time={replay.time}
          duration={replay.duration}
          isPlaying={replay.isPlaying}
          speed={replay.speed}
          markers={replay.moments.map((moment) => ({
            t: moment.t,
            color: moment.kind === "dead" ? DEAD_COLOR : RECALL_COLOR,
          }))}
          onTogglePlay={replay.togglePlay}
          onSeek={replay.seek}
          onSpeedChange={replay.setSpeed}
        />
      </div>
    </>
  );
}
