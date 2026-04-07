import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const isDebug = process.env.DEBUG === "true";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");

const emptyPayload = {
  GameTime: "0",
  CircleStatus: "0",
  CircleIndex: "0",
  Counter: "0",
  MaxTime: "0",
};

// Simulated circle cycle using wall-clock time so module re-instantiation
// (common with Turbopack) doesn't reset the phase.
// Cycle: 15s wait → 5s delay → 30s move → repeat
const DEBUG_PHASE_WAIT_MS = 15000;
const DEBUG_PHASE_DELAY_MS = 5000;
const DEBUG_MAXTIME_S = 30;
const DEBUG_CYCLE_MS =
  DEBUG_PHASE_WAIT_MS + DEBUG_PHASE_DELAY_MS + DEBUG_MAXTIME_S * 1000;

function getDebugPayload() {
  const elapsed = Date.now() % DEBUG_CYCLE_MS;
  let circleStatus;
  if (elapsed < DEBUG_PHASE_WAIT_MS) {
    circleStatus = "0"; // wait
  } else if (elapsed < DEBUG_PHASE_WAIT_MS + DEBUG_PHASE_DELAY_MS) {
    circleStatus = "1"; // delay
  } else {
    circleStatus = "2"; // move
  }
  return {
    // Use elapsed ms within the cycle as "seconds into the match" so GameTime
    // stays in the 0–50 range. Real PCOB sends seconds since match start.
    GameTime: String(Math.floor(elapsed / 1000)),
    CircleStatus: circleStatus,
    CircleIndex: "1",
    Counter: "0",
    MaxTime: String(DEBUG_MAXTIME_S),
  };
}

export async function GET() {
  if (isDebug) {
    return NextResponse.json(getDebugPayload(), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!backendBaseUrl) {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${backendBaseUrl}/getcircleinfo`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(emptyPayload, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
