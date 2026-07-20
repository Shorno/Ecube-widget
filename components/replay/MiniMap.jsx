"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize } from "lucide-react";
import TeamLogoGlyph, { teamColor } from "./TeamLogoGlyph";

const VIEW = 1000;
const MAX_ZOOM = 8;
const WHEEL_ZOOM_STEP = 1.2;

const DEAD_STATE = 5;

export default function MiniMap({
  world,
  players,
  trails,
  zone,
  plane,
  killMarkers,
  observedUid,
  planePosition,
  teamLogoById,
}) {
  // Pan/zoom lives entirely in this component so map gestures never re-render
  // the page (and its per-frame replay state derivations) above us.
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const svgRef = useRef(null);
  const dragRef = useRef(null); // { lastClientX, lastClientY, pendingX, pendingY }
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const toX = (x) => (x / world.size) * VIEW;
  const toY = (y) => (y / world.size) * VIEW;
  const toR = (radius) => (radius / world.size) * VIEW;

  // Keep the map covering the viewport: translation stays in [VIEW(1-k), 0].
  const clampView = (scale, x, y) => ({
    scale,
    x: Math.min(0, Math.max(VIEW * (1 - scale), x)),
    y: Math.min(0, Math.max(VIEW * (1 - scale), y)),
  });

  const cursorViewPoint = (event) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEW,
      y: ((event.clientY - rect.top) / rect.height) * VIEW,
      unitsPerPixel: VIEW / rect.width,
    };
  };

  const zoomAt = (point, factor) => {
    setView((current) => {
      const scale = Math.min(MAX_ZOOM, Math.max(1, current.scale * factor));
      if (scale === current.scale) return current;
      // Keep the world point under the cursor fixed while the scale changes.
      const ratio = scale / current.scale;
      return clampView(
        scale,
        point.x - (point.x - current.x) * ratio,
        point.y - (point.y - current.y) * ratio,
      );
    });
  };

  const handleWheel = (event) => {
    zoomAt(
      cursorViewPoint(event),
      event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP,
    );
  };

  const handleDoubleClick = (event) => {
    zoomAt(cursorViewPoint(event), 2);
  };

  const handlePointerDown = (event) => {
    if (!event.isPrimary) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      pendingX: 0,
      pendingY: 0,
    };
    event.currentTarget.style.cursor = "grabbing";
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    // Accumulate deltas and commit at most one state update per frame, so a
    // 120Hz mouse can't outpace rendering.
    const { unitsPerPixel } = cursorViewPoint(event);
    drag.pendingX += (event.clientX - drag.lastClientX) * unitsPerPixel;
    drag.pendingY += (event.clientY - drag.lastClientY) * unitsPerPixel;
    drag.lastClientX = event.clientX;
    drag.lastClientY = event.clientY;
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const pending = dragRef.current;
      if (!pending) return;
      const dx = pending.pendingX;
      const dy = pending.pendingY;
      pending.pendingX = 0;
      pending.pendingY = 0;
      setView((current) =>
        clampView(current.scale, current.x + dx, current.y + dy),
      );
    });
  };

  const handlePointerUp = (event) => {
    dragRef.current = null;
    event.currentTarget.style.cursor = "";
  };

  const resetView = () => setView({ scale: 1, x: 0, y: 0 });

  const isMoved = view.scale !== 1 || view.x !== 0 || view.y !== 0;
  // Markers keep a constant on-screen size: geometry scales with the map,
  // point markers get the inverse scale applied locally.
  const markerScale = 1 / view.scale;

  return (
    <div className="relative h-full w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="h-full w-full cursor-grab touch-none rounded-lg border border-white/10"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          {/* White outside the blue circle = area shaded as out-of-zone */}
          <mask id="outside-blue-zone">
            <rect width={VIEW} height={VIEW} fill="white" />
            {zone.blue && (
              <circle
                cx={toX(zone.blue.x)}
                cy={toY(zone.blue.y)}
                r={toR(zone.blue.radius)}
                fill="black"
              />
            )}
          </mask>
          <clipPath id="map-viewport">
            <rect width={VIEW} height={VIEW} rx="8" />
          </clipPath>
        </defs>

        <g clipPath="url(#map-viewport)">
          <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
            <image
              href={world.imageSrc}
              width={VIEW}
              height={VIEW}
              preserveAspectRatio="none"
            />

            {plane && (
              <line
                x1={toX(plane.start.x)}
                y1={toY(plane.start.y)}
                x2={toX(plane.stop.x)}
                y2={toY(plane.stop.y)}
                stroke="#facc15"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeDasharray="12 10"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {zone.blue && (
              <>
                <rect
                  width={VIEW}
                  height={VIEW}
                  fill="#2563eb"
                  fillOpacity="0.25"
                  mask="url(#outside-blue-zone)"
                />
                <circle
                  cx={toX(zone.blue.x)}
                  cy={toY(zone.blue.y)}
                  r={toR(zone.blue.radius)}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
            {zone.white && (
              <circle
                cx={toX(zone.white.x)}
                cy={toY(zone.white.y)}
                r={toR(zone.white.radius)}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {trails.map((trail) => (
              <polyline
                key={trail.uId}
                points={trail.points
                  .map(([x, y]) => `${toX(x)},${toY(y)}`)
                  .join(" ")}
                fill="none"
                stroke={teamColor(trail.teamId)}
                strokeOpacity="0.5"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {killMarkers.map((kill) => (
              <g
                key={kill.t}
                transform={`translate(${toX(kill.x)}, ${toY(kill.y)}) scale(${markerScale})`}
                stroke="#ef4444"
                strokeWidth="3"
              >
                <line x1="-7" y1="-7" x2="7" y2="7" />
                <line x1="-7" y1="7" x2="7" y2="-7" />
              </g>
            ))}

            {planePosition && (
              <g
                transform={`translate(${toX(planePosition.x)}, ${toY(planePosition.y)}) scale(${markerScale})`}
              >
                <polygon points="0,-14 10,10 0,4 -10,10" fill="#facc15" />
              </g>
            )}

            {players.map((player) => {
              const x = toX(player.location.x);
              const y = toY(player.location.y);
              const dead = player.liveState === DEAD_STATE;
              const observed = String(player.uId) === observedUid;
              const teamLogoUrl = teamLogoById[String(player.teamId)];
              return (
                <g
                  key={player.uId}
                  transform={`translate(${x}, ${y}) scale(${markerScale})`}
                >
                  {dead ? (
                    <g stroke="#9ca3af" strokeWidth="3">
                      <line x1="-6" y1="-6" x2="6" y2="6" />
                      <line x1="-6" y1="6" x2="6" y2="-6" />
                    </g>
                  ) : (
                    <TeamLogoGlyph
                      key={teamLogoUrl || "fallback"}
                      teamId={player.teamId}
                      logoUrl={teamLogoUrl}
                      observed={observed}
                      radius={9}
                    />
                  )}
                  <text
                    y={dead ? "-13" : "-16"}
                    textAnchor="middle"
                    fontSize="17"
                    fill="#ffffff"
                    fillOpacity={dead ? 0.6 : 1}
                    stroke="#000000"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    {player.playerName}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {isMoved && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className="rounded bg-black/60 px-2 py-1 font-mono text-xs text-neutral-200 tabular-nums">
            {view.scale.toFixed(1)}x
          </span>
          <button
            type="button"
            onClick={resetView}
            className="flex h-7 w-7 items-center justify-center rounded bg-black/60 text-neutral-200 transition hover:bg-black/80"
            aria-label="Reset view"
            title="Reset view"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
