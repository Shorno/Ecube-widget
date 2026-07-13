"use client";

import { useCallback, useEffect, useState } from "react";
import { circleTimerFromInfo } from "@/lib/circle-timer";

// Only reveal the countdown in the final stretch before each zone event, then
// hide until the next one approaches — a persistent clock would clutter the map.
const WARNING_WINDOW_SECONDS = 10;
// /getcircleinfo's Counter ticks once per second; poll at that cadence and
// interpolate locally so the visible countdown stays smooth between ticks.
const POLL_INTERVAL_MS = 1000;
// The countdown is re-sampled at this cadence; the ring uses it as its CSS
// transition duration so it glides between samples instead of stepping.
export const CIRCLE_TICK_INTERVAL_MS = 200;

type CircleInfoBody = {
  CircleStatus?: string;
  CircleIndex?: string;
  Counter?: string;
  MaxTime?: string;
};

type Capture = { body: CircleInfoBody; capturedAt: number };

export type CircleCountdownTimer = {
  phase: "hold" | "shrink";
  remaining: number;
  total: number;
};

// Windowed view for the overlay: null unless a hold/shrink countdown is inside
// the warning window. total is pinned to the window so the ring drains fully
// over those last seconds instead of barely moving on a long phase.
function toWindowed(
  raw: ReturnType<typeof circleTimerFromInfo>,
): CircleCountdownTimer | null {
  if (!raw || raw.phase === "final") return null;
  if (raw.remaining <= 0 || raw.remaining > WARNING_WINDOW_SECONDS) return null;
  return {
    phase: raw.phase as "hold" | "shrink",
    remaining: raw.remaining,
    total: WARNING_WINDOW_SECONDS,
  };
}

/**
 * Live zone countdown for the ranking widgets. Polls the /getcircleinfo proxy
 * and surfaces the timer only during the last {@link WARNING_WINDOW_SECONDS}
 * before each circle event. In preview mode nothing polls — call triggerCircle
 * to play a one-off countdown for placement testing.
 */
export function useLiveCircleTimer(
  tournamentID: string,
  { preview = false }: { preview?: boolean } = {},
) {
  const [capture, setCapture] = useState<Capture | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Poll the proxy for the authoritative circle state (skipped in preview).
  useEffect(() => {
    if (preview) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/getcircleinfo", { cache: "no-store" });
        if (!res.ok) return;
        const body: CircleInfoBody = await res.json();
        if (!cancelled) setCapture({ body, capturedAt: Date.now() });
      } catch {
        // Transient proxy/network errors just skip a tick — the next poll retries.
      }
    }

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [preview]);

  // Local ticker that advances the interpolated countdown between polls.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), CIRCLE_TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const raw = capture
    ? circleTimerFromInfo(capture.body, (now - capture.capturedAt) / 1000)
    : null;
  const timer = toWindowed(raw);

  // Preview: start a synthetic hold countdown from the top of the window so the
  // overlay plays through a full reveal → drain → hide without a live match.
  const triggerCircle = useCallback(() => {
    if (!preview) return;
    setCapture({
      body: {
        CircleStatus: "0",
        CircleIndex: "3",
        Counter: "0",
        MaxTime: String(WARNING_WINDOW_SECONDS),
      },
      capturedAt: Date.now(),
    });
    setNow(Date.now());
  }, [preview]);

  return { timer, triggerCircle };
}
