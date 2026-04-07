import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const isDebug = process.env.DEBUG === "true";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");

const emptyPayload = {
  CircleArray: [],
  PlaneStartLocX: "0",
  PlaneStartLocY: "0",
  PlaneStopLocX: "0",
  PlaneStopLocY: "0",
};

// Must match the timing constants in getcircleinfo/route.js exactly.
const DEBUG_PHASE_WAIT_MS = 15000;
const DEBUG_PHASE_DELAY_MS = 5000;
const DEBUG_MAXTIME_S = 30;
const DEBUG_CYCLE_MS =
  DEBUG_PHASE_WAIT_MS + DEBUG_PHASE_DELAY_MS + DEBUG_MAXTIME_S * 1000;

// Erangel coords (816 000 cm map).
const BLUE_ZONE = { X: "420000", Y: "390000", Size: "500000" };
const SAFE_ZONE = { X: "460000", Y: "350000", Size: "250000" };

// CircleArray mirrors what the real PCOB sends per phase:
//   wait  → no circles yet (first cycle) or 1 circle (blue zone settling)
//   delay → 1 circle: white safe zone announced, blue zone not moving yet
//   move  → 2 circles: blue zone shrinking toward safe zone
function getDebugPayload() {
  const elapsed = Date.now() % DEBUG_CYCLE_MS;
  let circleArray;
  if (elapsed < DEBUG_PHASE_WAIT_MS) {
    circleArray = []; // waiting — no zone visible yet
  } else if (elapsed < DEBUG_PHASE_WAIT_MS + DEBUG_PHASE_DELAY_MS) {
    circleArray = [SAFE_ZONE]; // announcement phase — white circle only
  } else {
    circleArray = [BLUE_ZONE, SAFE_ZONE]; // shrinking — blue + next safe
  }
  return {
    CircleArray: circleArray,
    PlaneStartLocX: "50000",
    PlaneStartLocY: "100000",
    PlaneStopLocX: "750000",
    PlaneStopLocY: "700000",
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
    const response = await fetch(`${backendBaseUrl}/getgameglobalinfo`, {
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
