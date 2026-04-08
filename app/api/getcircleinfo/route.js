import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");
const DEBUG_ON = ["1", "true", "yes", "on"].includes(
  String(
    process.env.DEBUG ?? process.env.NEXT_PUBLIC_DEBUG ?? "",
  ).toLowerCase(),
);
const DEBUG_MAX_TIME_SEC = 300;
const DEBUG_SESSION_TTL_MS = 10 * 60 * 1000;
const debugSessionStateById = new Map();

const emptyPayload = {
  GameTime: "0",
  CircleStatus: "0",
  CircleIndex: "0",
  Counter: "0",
  MaxTime: "0",
};

const getDebugSessionState = (sessionId, nowMs) => {
  for (const [key, state] of debugSessionStateById.entries()) {
    if (nowMs - state.lastRequestMs > DEBUG_SESSION_TTL_MS) {
      debugSessionStateById.delete(key);
    }
  }

  const normalizedId = sessionId?.trim() || "default";
  let state = debugSessionStateById.get(normalizedId);

  if (!state) {
    state = {
      requestCount: 0,
      startTimeMs: nowMs,
      lastRequestMs: nowMs,
    };
    debugSessionStateById.set(normalizedId, state);
  } else {
    state.lastRequestMs = nowMs;
  }

  return state;
};

export async function GET(request) {
  if (DEBUG_ON) {
    const nowMs = Date.now();
    const debugSessionId = request?.nextUrl?.searchParams?.get("session") ?? "";
    const sessionState = getDebugSessionState(debugSessionId, nowMs);
    sessionState.requestCount += 1;
    const isSecondPayloadOrLater = sessionState.requestCount >= 2;

    const elapsedSec = Math.max(
      0,
      Math.floor((nowMs - sessionState.startTimeMs) / 1000),
    );
    const counterSec = isSecondPayloadOrLater
      ? Math.min(elapsedSec, DEBUG_MAX_TIME_SEC)
      : 0;

    return NextResponse.json(
      {
        circleInfo: {
          GameTime: String(elapsedSec),
          CircleStatus: isSecondPayloadOrLater ? "2" : "0",
          CircleIndex: "0",
          Counter: String(counterSec),
          MaxTime: isSecondPayloadOrLater ? String(DEBUG_MAX_TIME_SEC) : "0",
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
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
