"use client";

import React, { useState, useEffect, useRef } from "react";
import getPlayerMapdata from "@/utils/getPlayerMapdata";
import getGameGlobalInfo from "@/utils/getGameGlobalInfo";
import getCircleInfo from "@/utils/getCircleInfo";
import { MAPS, defaultGameInfo } from "./constants";
import MapCanvas from "./MapCanvas";
import ControlPanel from "./components/ControlPanel";

// Top-level simulator page: owns simulator state, polls live player data,
// and wires controls to the canvas via a shared render-state ref.
export default function PubgMapSimulator() {
  const [simulatorState, setSimulatorState] = useState({
    mapType: "Erangel",
    TotalPlayerList: [],
    gameGlobalInfo: defaultGameInfo(MAPS.Erangel.size),
  });
  const [showGrid, setShowGrid] = useState(false);

  // Mutable lerp / animation cache shared between MapCanvas and the
  // shrink-trigger button below. Lives in the page so siblings can poke it.
  const renderStateRef = useRef({
    players: {},
    circles: [],
    blueZoneAnim: null,
    viewport: null,
    // If a PCOB URL is configured we are in live mode. Block the MapCanvas
    // first-frame plane fallback so the plane only appears once we have a
    // real GameTime from the API. Without this, the plane flashes at position
    // 0 for the 1-2s before the first fetch resolves.
    planeInitialized: !!process.env.NEXT_PUBLIC_PCOB_URL,
  });

  // Polls player data every ~1000ms, scheduling the next request after each
  // fetch resolves so slow responses don't pile up.
  useEffect(() => {
    let isMounted = true;
    let pollTimeout;
    const POLL_INTERVAL_MS = 1000;

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
  // - getgameglobalinfo  → updates CircleArray and plane coordinates in state
  // - getCircleInfo      → drives the blue-zone shrink animation via a local timer
  //                        (we ignore Counter and trust MaxTime + local clock instead)
  useEffect(() => {
    let isMounted = true;
    let pollTimeout;
    const POLL_INTERVAL_MS = 1000;
    const PLANE_DURATION_MS = 60000;
    const prevCircleStatus = { current: null };

    const scheduleNextPoll = (startedAt) => {
      const elapsed = Date.now() - startedAt;
      pollTimeout = setTimeout(syncGameInfo, Math.max(0, POLL_INTERVAL_MS - elapsed));
    };

    const syncGameInfo = async () => {
      const startedAt = Date.now();
      try {
        const [globalInfo, circleInfo] = await Promise.all([
          getGameGlobalInfo(),
          getCircleInfo(),
        ]);
        if (!isMounted) return;

        const rp = renderStateRef.current;

        // --- Plane: set correct start offset from GameTime on first valid
        //     API response. We use a separate flag (planeOffsetApplied) so
        //     this runs even if MapCanvas already set planeInitialized on its
        //     first rAF frame (which happens ~16ms before the first fetch).
        if (circleInfo && !rp.planeOffsetApplied) {
          const gameTimeSec = parseInt(circleInfo.GameTime ?? 0);
          // GameTime "0" means either PCOB is unreachable (emptyPayload) or
          // the match literally just started. Skip for now — next poll (1s)
          // will have a non-zero value when PCOB is actually running.
          if (gameTimeSec === 0) return;
          if (gameTimeSec < PLANE_DURATION_MS / 1000) {
            rp.planeStartTime = performance.now() - gameTimeSec * 1000;
          } else {
            // Game is past the plane phase — mark as finished immediately
            rp.planeStartTime = performance.now() - PLANE_DURATION_MS - 1;
          }
          rp.planeInitialized = true;
          rp.planeOffsetApplied = true;
        }

        // --- CircleArray + plane coords → simulator state
        // Only update plane coords if the API returned non-zero values.
        // Zero coords mean PCOB is unreachable (emptyPayload fallback) and
        // would collapse the flight path to a single invisible point.
        if (globalInfo) {
          const hasPlaneData =
            parseFloat(globalInfo.PlaneStopLocX) !== 0 ||
            parseFloat(globalInfo.PlaneStopLocY) !== 0;

          setSimulatorState((prev) => ({
            ...prev,
            gameGlobalInfo: {
              CircleArray: Array.isArray(globalInfo.CircleArray)
                ? globalInfo.CircleArray
                : prev.gameGlobalInfo.CircleArray,
              PlaneStartLocX: hasPlaneData
                ? globalInfo.PlaneStartLocX
                : prev.gameGlobalInfo.PlaneStartLocX,
              PlaneStartLocY: hasPlaneData
                ? globalInfo.PlaneStartLocY
                : prev.gameGlobalInfo.PlaneStartLocY,
              PlaneStopLocX: hasPlaneData
                ? globalInfo.PlaneStopLocX
                : prev.gameGlobalInfo.PlaneStopLocX,
              PlaneStopLocY: hasPlaneData
                ? globalInfo.PlaneStopLocY
                : prev.gameGlobalInfo.PlaneStopLocY,
            },
          }));
        }

        // --- Blue zone animation: start local timer on CircleStatus → '2'
        //     Using MaxTime (seconds) as the duration, local performance.now()
        //     as the clock so HTTP latency has no effect on smoothness.
        if (circleInfo) {
          const status = circleInfo.CircleStatus;
          const prev = prevCircleStatus.current;

          if (status === "2" && prev !== "2") {
            // Zone just started moving — fire local shrink animation
            const duration = parseInt(circleInfo.MaxTime) * 1000;
            const circles = rp.circles;
            // circles[0] = current blue zone (visual pos), circles[1] = safe zone target
            if (circles.length >= 2 && globalInfo?.CircleArray?.length >= 2) {
              const safeZone = globalInfo.CircleArray[1];
              rp.blueZoneAnim = {
                startTime: performance.now(),
                duration,
                startX: circles[0].x,
                startY: circles[0].y,
                startRadius: circles[0].radius,
                targetX: parseFloat(safeZone.X),
                targetY: parseFloat(safeZone.Y),
                targetRadius: parseFloat(safeZone.Size) / 2,
              };
            }
          }

          // '2'→'0': zone finished on the server. We intentionally do NOT
          // snap or clear blueZoneAnim here. MaxTime matches the shrink duration,
          // so the animation will complete naturally within the same window.
          // frozenBlueZone in MapCanvas prevents the lerp from snapping back
          // to stale API coords once the animation finishes on its own.

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

  // ===========================================================================
  // SIMULATOR CONTROLS
  // ===========================================================================
  const updateCircle = (index, prop, value) => {
    renderStateRef.current.blueZoneAnim = null;
    setSimulatorState((prev) => {
      const newCircles = [...prev.gameGlobalInfo.CircleArray];
      newCircles[index] = { ...newCircles[index], [prop]: String(value) };
      return {
        ...prev,
        gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: newCircles },
      };
    });
  };

  const addCircle = () => {
    setSimulatorState((prev) => {
      const mapSize = MAPS[prev.mapType].size;
      const existing = prev.gameGlobalInfo.CircleArray;
      if (existing.length >= 2) return prev;
      const newCircle = {
        X: String(Math.round(mapSize * 0.5)),
        Y: String(Math.round(mapSize * 0.5)),
        Size: String(
          Math.round(existing.length === 0 ? mapSize * 0.6 : mapSize * 0.35),
        ),
      };
      return {
        ...prev,
        gameGlobalInfo: {
          ...prev.gameGlobalInfo,
          CircleArray: [...existing, newCircle],
        },
      };
    });
  };

  const removeLastCircle = () => {
    renderStateRef.current.blueZoneAnim = null;
    setSimulatorState((prev) => {
      const newCircles = prev.gameGlobalInfo.CircleArray.slice(0, -1);
      return {
        ...prev,
        gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: newCircles },
      };
    });
  };

  // Triggers a timed blue-zone shrink animation toward the safe zone.
  const triggerBlueZoneShrink = () => {
    const rp = renderStateRef.current;
    const circles = simulatorState?.gameGlobalInfo?.CircleArray ?? [];
    if (circles.length < 2 || rp.circles.length < 1) return;

    const target = circles[1];
    rp.blueZoneAnim = {
      startTime: performance.now(),
      duration: 15000,
      startX: rp.circles[0].x,
      startY: rp.circles[0].y,
      startRadius: rp.circles[0].radius,
      targetX: parseFloat(target.X),
      targetY: parseFloat(target.Y),
      targetRadius: parseFloat(target.Size) / 2,
    };

    setSimulatorState((prev) => {
      const newCircles = [...prev.gameGlobalInfo.CircleArray];
      newCircles[0] = { ...newCircles[1] };
      return {
        ...prev,
        gameGlobalInfo: { ...prev.gameGlobalInfo, CircleArray: newCircles },
      };
    });
  };

  const updatePlane = (prop, value) => {
    setSimulatorState((prev) => ({
      ...prev,
      gameGlobalInfo: { ...prev.gameGlobalInfo, [prop]: String(value) },
    }));
  };

  const updatePlayerPos = (index, axis, value) => {
    setSimulatorState((prev) => {
      const newPlayers = [...prev.TotalPlayerList];
      newPlayers[index] = {
        ...newPlayers[index],
        location: { ...newPlayers[index].location, [axis]: parseInt(value) },
      };
      return { ...prev, TotalPlayerList: newPlayers };
    });
  };

  // Rescales players/zones when switching maps and resets render caches.
  const handleMapChange = (e) => {
    const newMapType = e.target.value;
    const oldMapSize = MAPS[simulatorState.mapType].size;
    const newMapSize = MAPS[newMapType].size;
    const ratio = newMapSize / oldMapSize;

    setSimulatorState((prev) => ({
      ...prev,
      mapType: newMapType,
      TotalPlayerList: prev.TotalPlayerList.map((p) => ({
        ...p,
        location: {
          ...p.location,
          x: Math.round(p.location.x * ratio),
          y: Math.round(p.location.y * ratio),
        },
      })),
      gameGlobalInfo: {
        ...defaultGameInfo(newMapSize),
        CircleArray: (prev.gameGlobalInfo?.CircleArray ?? []).map((c) => ({
          X: String(Math.round(parseFloat(c.X) * ratio)),
          Y: String(Math.round(parseFloat(c.Y) * ratio)),
          Size: String(Math.round(parseFloat(c.Size) * ratio)),
        })),
      },
    }));

    renderStateRef.current = {
      players: {},
      circles: [],
      blueZoneAnim: null,
      viewport: null,
      planeStartTime: null,
    };
  };

  const currentMapUnits = MAPS[simulatorState?.mapType]?.size || 800000;
  const circles = simulatorState?.gameGlobalInfo?.CircleArray ?? [];

  return (
    <div className="flex h-screen overflow-hidden font-sans text-white">
      <ControlPanel
        simulatorState={simulatorState}
        currentMapUnits={currentMapUnits}
        circles={circles}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((g) => !g)}
        onMapChange={handleMapChange}
        onAddCircle={addCircle}
        onRemoveCircle={removeLastCircle}
        onUpdateCircle={updateCircle}
        onTriggerShrink={triggerBlueZoneShrink}
        onUpdatePlane={updatePlane}
        onUpdatePlayerPos={updatePlayerPos}
      />

      <div className="flex flex-1 items-start justify-end">
        <MapCanvas
          simulatorState={simulatorState}
          showGrid={showGrid}
          renderStateRef={renderStateRef}
        />
      </div>
    </div>
  );
}
