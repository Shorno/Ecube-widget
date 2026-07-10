import { Pause, Play } from "lucide-react";

const SPEEDS = [1, 2, 4, 8, 16, 32];

export function formatClock(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function PlaybackControls({
  time,
  duration,
  isPlaying,
  speed,
  markers,
  onTogglePlay,
  onSeek,
  onSpeedChange,
}) {
  return (
    <div className="flex items-center gap-4 border-t border-white/10 bg-neutral-900 px-4 py-3">
      <button
        type="button"
        onClick={onTogglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-neutral-950 transition hover:bg-amber-300"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
        )}
      </button>

      <span className="w-24 shrink-0 font-mono text-sm tabular-nums text-neutral-300">
        {formatClock(time)} / {formatClock(duration)}
      </span>

      <div className="relative flex-1">
        {/* Event markers under the scrubber, YouTube-chapter style */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-3 -translate-y-1/2">
          {markers.map((marker) => (
            <span
              key={`${marker.t}-${marker.color}`}
              className="absolute top-0 h-full w-0.5 rounded"
              style={{
                left: `${(marker.t / duration) * 100}%`,
                backgroundColor: marker.color,
              }}
            />
          ))}
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          step="100"
          value={time}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="relative w-full accent-amber-400"
          aria-label="Seek"
        />
      </div>

      <div className="flex shrink-0 gap-1">
        {SPEEDS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSpeedChange(option)}
            className={`rounded px-2 py-1 text-xs font-semibold transition ${
              speed === option
                ? "bg-amber-400 text-neutral-950"
                : "bg-white/10 text-neutral-300 hover:bg-white/20"
            }`}
          >
            {option}x
          </button>
        ))}
      </div>
    </div>
  );
}
