import { useEffect, useRef, useState } from "react";

// Virtual playback clock over a recorded session, in ms since recording start.
// Play/pause, speed multiplier, and seeking — the YouTube control surface.
export function useReplayPlayer(duration) {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const timeRef = useRef(0);

  // Advancing the clock is a sync with a browser timer — the external-system
  // case where useEffect is the right tool. setInterval instead of
  // requestAnimationFrame because rAF stops entirely in hidden tabs (OBS
  // browser sources, backgrounded windows); a throttled interval still ticks,
  // and elapsed time comes from performance.now() so throttling only lowers
  // the frame rate, never drifts the clock.
  useEffect(() => {
    if (!isPlaying || duration <= 0) return undefined;

    const TICK_MS = 33;
    let lastTick = performance.now();

    const intervalId = setInterval(() => {
      const now = performance.now();
      const nextTime = Math.min(
        timeRef.current + (now - lastTick) * speed,
        duration,
      );
      lastTick = now;
      timeRef.current = nextTime;
      setTime(nextTime);

      if (nextTime >= duration) setIsPlaying(false);
    }, TICK_MS);

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, duration]);

  const seek = (nextTime) => {
    const clamped = Math.min(Math.max(nextTime, 0), duration);
    timeRef.current = clamped;
    setTime(clamped);
  };

  const seekBy = (delta) => seek(timeRef.current + delta);

  const togglePlay = () => {
    // Pressing play at the end restarts from the beginning, like a video player.
    if (!isPlaying && duration > 0 && timeRef.current >= duration) seek(0);
    setIsPlaying((playing) => !playing);
  };

  return { time, isPlaying, speed, setSpeed, seek, seekBy, togglePlay };
}
