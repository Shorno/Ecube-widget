"use client";

import React, { useState, useEffect, useRef } from "react";
import getPlayerMapdata from "@/utils/getPlayerMapdata";
import getGameGlobalInfo from "@/utils/getGameGlobalInfo";
import getCircleInfo from "@/utils/getCircleInfo";
import { MAPS, defaultGameInfo } from "./constants";
import MapCanvas from "./MapCanvas";
import { MAP_CONTROL_STORAGE_KEY, readMapControlState } from "./controlStorage";

// Top-level map page: polls live player/circle data and renders it on canvas.
export default function PubgMapSimulator() {
  const debugSessionRef = useRef(
    `map-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  );
  const initialControl = readMapControlState();
  const initialMapType = MAPS[initialControl.mapType]
    ? initialControl.mapType
    : "Erangel";
  const [simulatorState, setSimulatorState] = useState(() => ({
    mapType: initialMapType,
    showGrid: Boolean(initialControl.showGrid),
    teamLogoById:
      initialControl.teamLogoById &&
      typeof initialControl.teamLogoById === "object"
        ? initialControl.teamLogoById
        : {},
    TotalPlayerList: [],
    gameGlobalInfo: defaultGameInfo(
      MAPS[initialMapType]?.size ?? MAPS.Erangel.size,
    ),
  }));
  const activeMapTypeRef = useRef(initialMapType);

  // Synthesizes an initial first-shrink blue zone from map center.
  // Radius is always the center-to-corner distance (half map diagonal).
  const buildFirstShrinkBlueZone = (safeZone) => {
    void safeZone;
    const mapSize = MAPS[activeMapTypeRef.current]?.size ?? MAPS.Erangel.size;
    const center = mapSize / 2;
    const startRadius = Math.hypot(center, center);

    return {
      X: String(center),
      Y: String(center),
      Size: String(startRadius),
    };
  };

  // Mutable lerp / animation cache shared between MapCanvas and the
  // canvas. Lives in the page so it persists across re-renders.
  const renderStateRef = useRef({
    players: {},
    circles: [],
    blueZoneAnim: null,
    activeShrinkKey: null,
    lastShrinkElapsedMs: null,
    frozenBlueZone: null,
    viewport: null,
    // MapCanvas starts plane animation once this start time is known.
    planeInitialized: false,
    planeOffsetApplied: false,
  });

  const resetRenderCaches = () => {
    renderStateRef.current = {
      players: {},
      circles: [],
      blueZoneAnim: null,
      activeShrinkKey: null,
      lastShrinkElapsedMs: null,
      frozenBlueZone: null,
      viewport: null,
      planeStartTime: null,
      planeInitialized: false,
      planeOffsetApplied: false,
    };
  };

  // Control settings live in LocalStorage via /map/control page.
  useEffect(() => {
    const applyStoredControlState = () => {
      const stored = readMapControlState();
      const nextMapType = MAPS[stored.mapType] ? stored.mapType : "Erangel";

      setSimulatorState((prev) => {
        const mapChanged = prev.mapType !== nextMapType;
        if (mapChanged) {
          activeMapTypeRef.current = nextMapType;
          resetRenderCaches();
        }

        return {
          ...prev,
          mapType: nextMapType,
          showGrid: Boolean(stored.showGrid),
          teamLogoById:
            stored.teamLogoById && typeof stored.teamLogoById === "object"
              ? stored.teamLogoById
              : {},
        };
      });
    };

    applyStoredControlState();

    const onStorage = (event) => {
      if (!event.key || event.key === MAP_CONTROL_STORAGE_KEY) {
        applyStoredControlState();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Polls player data every ~500ms, scheduling the next request after each
  // fetch resolves so slow responses don't pile up.
  useEffect(() => {
    let isMounted = true;
    let pollTimeout;
    const POLL_INTERVAL_MS = 500;

    const scheduleNextPoll = (startedAt) => {
      const elapsedMs = Date.now() - startedAt;
      const delayMs = Math.max(0, POLL_INTERVAL_MS - elapsedMs);
      pollTimeout = setTimeout(syncPlayers, delayMs);
    };

    const syncPlayers = async () => {
      const startedAt = Date.now();
      try {
        const data = await getPlayerMapdata();
        if (!isMounted || !Array.isArray(data)) return;

        setSimulatorState((prev) => ({
          ...prev,
          TotalPlayerList: data,
        }));

        // Prune lerp cache entries for players no longer in the payload,
        // but keep existing entries so movement stays smoothly interpolated.
        const liveIds = new Set(data.map((p) => p.uId));
        const cache = renderStateRef.current.players;
        for (const id of Object.keys(cache)) {
          if (!liveIds.has(id)) delete cache[id];
        }
      } finally {
        if (isMounted) scheduleNextPoll(startedAt);
      }
    };

    syncPlayers();

    return () => {
      isMounted = false;
      clearTimeout(pollTimeout);
    };
  }, []);

  // Polls getgameglobalinfo + getCircleInfo together every 1s.
  useEffect(() => {
    let isMounted = true;
    let pollTimeout;
    const POLL_INTERVAL_MS = 1000;
    const prevCircleStatus = { current: null };

    const scheduleNextPoll = (startedAt) => {
      const elapsed = Date.now() - startedAt;
      pollTimeout = setTimeout(
        syncGameInfo,
        Math.max(0, POLL_INTERVAL_MS - elapsed),
      );
    };

    const syncGameInfo = async () => {
      const startedAt = Date.now();
      try {
        const debugSessionId = debugSessionRef.current;
        const [globalInfo, circleInfo] = await Promise.all([
          getGameGlobalInfo(debugSessionId),
          getCircleInfo(debugSessionId),
        ]);
        if (!isMounted) return;

        const rp = renderStateRef.current;

        // --- CircleArray + plane coords → live state
        // Only update plane coords if the API returned non-zero values.
        // Zero coords mean PCOB is unreachable (emptyPayload fallback) and
        // would collapse the flight path to a single invisible point.
        if (globalInfo) {
          const incomingCircles = Array.isArray(globalInfo.CircleArray)
            ? globalInfo.CircleArray
            : [];
          const status = circleInfo?.CircleStatus ?? "0";
          // PCOB returns historical + active circles in one array.
          // The active pair is always at the tail:
          //   last     => safe zone
          //   second last => blue zone
          const safeIdx = Math.max(0, incomingCircles.length - 1);
          const blueIdx = Math.max(0, safeIdx - 1);
          const latestSafeZone = incomingCircles[safeIdx];
          const latestBlueZone = incomingCircles[blueIdx] ?? latestSafeZone;

          // At shrink start some feeds briefly return only one circle.
          // In that window, blue zone should start from map edge.
          const fallbackBlueZone =
            status === "2" && incomingCircles.length === 1
              ? buildFirstShrinkBlueZone(latestSafeZone)
              : null;

          // For rendering we normalize API CircleArray into either:
          // - [] during delay (status 1, circle not announced yet)
          // - [blue, safe] during wait/shrink when available
          // - [map-edge blue, safe] during first shrink tick when only one
          //   element exists
          let visibleCircles = [];
          if (incomingCircles.length > 0) {
            if (status === "2") {
              if (blueIdx !== safeIdx) {
                visibleCircles = [latestBlueZone, latestSafeZone];
              } else if (fallbackBlueZone && latestSafeZone) {
                visibleCircles = [fallbackBlueZone, latestSafeZone];
              } else {
                visibleCircles = latestSafeZone ? [latestSafeZone] : [];
              }
            } else if (status === "0") {
              if (incomingCircles.length >= 2) {
                visibleCircles = [latestBlueZone, latestSafeZone];
              } else {
                visibleCircles = latestSafeZone ? [latestSafeZone] : [];
              }
            }
          }

          const planeStartX = parseFloat(globalInfo.PlaneStartLocX);
          const planeStartY = parseFloat(globalInfo.PlaneStartLocY);
          const planeStopX = parseFloat(globalInfo.PlaneStopLocX);
          const planeStopY = parseFloat(globalInfo.PlaneStopLocY);
          const hasPlaneData =
            Number.isFinite(planeStartX) &&
            Number.isFinite(planeStartY) &&
            Number.isFinite(planeStopX) &&
            Number.isFinite(planeStopY) &&
            (Math.abs(planeStopX - planeStartX) > 1 ||
              Math.abs(planeStopY - planeStartY) > 1);

          // Start plane timing once on first detected GameTime key/value.
          // After initialization, keep local animation clock stable to avoid
          // flicker or jumps from polling jitter.
          const gameTimeRawValue = circleInfo?.GameTime;
          const hasGameTimeValue =
            gameTimeRawValue !== undefined &&
            gameTimeRawValue !== null &&
            String(gameTimeRawValue).trim() !== "";
          const parsedGameTime = hasGameTimeValue
            ? parseInt(String(gameTimeRawValue), 10)
            : NaN;
          const canStartPlaneClock = Number.isFinite(parsedGameTime);

          if (hasPlaneData && canStartPlaneClock && !rp.planeInitialized) {
            // Start from the actual route start on first detection only.
            rp.planeStartTime = performance.now();
            rp.planeInitialized = true;
            rp.planeOffsetApplied = true;
          }

          setSimulatorState((prev) => ({
            ...prev,
            gameGlobalInfo: {
              CircleArray: visibleCircles,
              PlaneStartLocX: globalInfo.PlaneStartLocX,
              PlaneStartLocY: globalInfo.PlaneStartLocY,
              PlaneStopLocX: globalInfo.PlaneStopLocX,
              PlaneStopLocY: globalInfo.PlaneStopLocY,
            },
          }));
        }

        // --- Blue zone animation: start local timer on CircleStatus → '2'
        //     Using MaxTime (seconds) as the duration, local performance.now()
        //     as the clock so HTTP latency has no effect on smoothness.
        if (circleInfo) {
          const status = circleInfo.CircleStatus;

          if (status === "2") {
            const allCircles = Array.isArray(globalInfo?.CircleArray)
              ? globalInfo.CircleArray
              : [];
            const safeIdx = Math.max(0, allCircles.length - 1);
            const blueIdx = Math.max(0, safeIdx - 1);
            const safeZone = allCircles[safeIdx];
            const isFirstShrinkSingleCircle = allCircles.length === 1;
            const fallbackBlueZone = isFirstShrinkSingleCircle
              ? buildFirstShrinkBlueZone(safeZone)
              : null;
            const blueZone = isFirstShrinkSingleCircle
              ? (fallbackBlueZone ?? safeZone)
              : (allCircles[blueIdx] ?? safeZone);
            const shrinkKey = safeZone
              ? `${safeZone.X}|${safeZone.Y}|${safeZone.Size}`
              : null;
            const rawMaxTimeSec = parseInt(circleInfo.MaxTime ?? "0", 10);
            const maxTimeSec =
              Number.isFinite(rawMaxTimeSec) && rawMaxTimeSec > 0
                ? rawMaxTimeSec
                : null;
            const maxTimeMs = maxTimeSec ? maxTimeSec * 1000 : null;
            const rawCounterSec = parseInt(circleInfo.Counter ?? "0", 10);
            const counterSec = Number.isFinite(rawCounterSec)
              ? Math.max(0, rawCounterSec)
              : 0;
            const elapsedMsFromCounter = maxTimeSec
              ? Math.min(counterSec, maxTimeSec) * 1000
              : 0;
            const startElapsedMs = elapsedMsFromCounter;

            // Start a shrink once per target safe zone and only with valid
            // MaxTime to avoid instant collapse to safe zone.
            if (
              safeZone &&
              blueZone &&
              shrinkKey &&
              maxTimeMs &&
              rp.activeShrinkKey !== shrinkKey
            ) {
              rp.blueZoneAnim = {
                startTime: performance.now() - startElapsedMs,
                duration: maxTimeMs,
                startX: parseFloat(blueZone.X),
                startY: parseFloat(blueZone.Y),
                startRadius: parseFloat(blueZone.Size),
                targetX: parseFloat(safeZone.X),
                targetY: parseFloat(safeZone.Y),
                targetRadius: parseFloat(safeZone.Size),
              };
              rp.activeShrinkKey = shrinkKey;
              rp.lastShrinkElapsedMs = elapsedMsFromCounter;
              rp.frozenBlueZone = null;
            } else if (
              safeZone &&
              blueZone &&
              shrinkKey &&
              maxTimeMs &&
              rp.activeShrinkKey === shrinkKey &&
              rp.blueZoneAnim
            ) {
              // Reload/poll failsafe: recover local timer from Counter/MaxTime
              // and gently correct drift without visual jumps.
              // Counter can briefly repeat or regress on unstable feeds; keep
              // elapsed time monotonic to avoid fallback/restart behavior.
              rp.blueZoneAnim.duration = maxTimeMs;
              const previousElapsedMs = Number.isFinite(rp.lastShrinkElapsedMs)
                ? rp.lastShrinkElapsedMs
                : null;
              const stableElapsedMs =
                previousElapsedMs === null
                  ? elapsedMsFromCounter
                  : Math.max(previousElapsedMs, elapsedMsFromCounter);
              const counterAdvanced =
                previousElapsedMs === null ||
                stableElapsedMs > previousElapsedMs;

              if (counterAdvanced) {
                const expectedStartTime = performance.now() - stableElapsedMs;
                const driftMs = expectedStartTime - rp.blueZoneAnim.startTime;
                if (Math.abs(driftMs) > 1200) {
                  rp.blueZoneAnim.startTime += driftMs * 0.35;
                }
              }

              rp.lastShrinkElapsedMs = stableElapsedMs;
            }
          } else if (status !== "2") {
            // In wait/announce phases, nothing should be moving.
            rp.blueZoneAnim = null;
            rp.activeShrinkKey = null;
            rp.lastShrinkElapsedMs = null;
            rp.frozenBlueZone = null;
          }

          // Status handling contract:
          // - "0" -> wait (announced, not moving)
          // - "1" -> delay (not announced yet, not moving)
          // - "2"       -> shrinking

          prevCircleStatus.current = status;
        }
      } finally {
        if (isMounted) scheduleNextPoll(startedAt);
      }
    };

    syncGameInfo();

    return () => {
      isMounted = false;
      clearTimeout(pollTimeout);
    };
  }, []);
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-neutral-900">
      <div className="h-270 w-270 flex-none">
        <MapCanvas
          simulatorState={simulatorState}
          renderStateRef={renderStateRef}
        />
      </div>
    </div>
  );
}
