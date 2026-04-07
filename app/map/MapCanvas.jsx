"use client";

import React, { useEffect, useRef } from "react";
import {
  CANVAS_SIZE,
  MAPS,
  TEAM_COLOR_BY_ID,
  VISIBLE_LIVE_STATES,
} from "./constants";

// Keeps rendering stable if an unexpected teamId appears (e.g. custom scrim data).
const getTeamColor = (teamId) => TEAM_COLOR_BY_ID[Number(teamId)] ?? "#ff3366";

// Canvas rendering surface that owns the requestAnimationFrame loop and draws
// map, zones, flight path, players, and the optional calibration grid. All
// stateful simulator data is passed in via props; a shared `renderStateRef`
// keeps the lerp cache alive across frames and siblings (e.g. the shrink
// trigger button in ControlPanel).
export default function MapCanvas({
  simulatorState,
  showGrid,
  renderStateRef,
}) {
  const canvasRef = useRef(null);
  const gameStateRef = useRef(simulatorState);
  const showGridRef = useRef(showGrid);
  const imagesRef = useRef({});
  const requestRef = useRef();

  // Keeps an always-fresh state snapshot for the animation loop.
  useEffect(() => {
    gameStateRef.current = simulatorState;
  }, [simulatorState]);

  useEffect(() => {
    showGridRef.current = showGrid;
  }, [showGrid]);

  // Preloads all map images once to avoid draw-time fetch delays.
  useEffect(() => {
    Object.keys(MAPS).forEach((key) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = MAPS[key].src;
      imagesRef.current[key] = img;
    });
  }, []);

  // Starts the requestAnimationFrame loop on mount and cancels it on unmount.
  useEffect(() => {
    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const state = gameStateRef.current;
      const rp = renderStateRef.current;

      if (!state) {
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const currentMapSize = MAPS[state.mapType]?.size || 800000;
      const scale = CANVAS_SIZE / currentMapSize;
      const gi = state.gameGlobalInfo;
      const targetCircles = gi?.CircleArray ?? [];

      // =====================================================================
      // CIRCLE LERPING
      // Matches websocket: CircleArray[0] = blue zone, CircleArray[1] = safe zone
      // Size = diameter, so radius = Size / 2
      // =====================================================================
      while (rp.circles.length < targetCircles.length) {
        const tc = targetCircles[rp.circles.length];
        rp.circles.push({
          x: parseFloat(tc.X),
          y: parseFloat(tc.Y),
          radius: parseFloat(tc.Size) / 2,
        });
      }
      rp.circles.length = targetCircles.length;

      // Smoothly animates visible circles toward the latest telemetry targets.
      // After blueZoneAnim completes, rp.frozenBlueZone holds the final position
      // so the lerp branch doesn't snap back toward the stale API CircleArray[0].
      // frozenBlueZone is cleared once the API catches up within tolerance.
      rp.circles.forEach((vc, i) => {
        if (i === 0 && rp.blueZoneAnim) {
          const anim = rp.blueZoneAnim;
          const progress = Math.min(
            (performance.now() - anim.startTime) / anim.duration,
            1.0,
          );
          vc.x = anim.startX + (anim.targetX - anim.startX) * progress;
          vc.y = anim.startY + (anim.targetY - anim.startY) * progress;
          vc.radius =
            anim.startRadius +
            (anim.targetRadius - anim.startRadius) * progress;
          if (progress >= 1.0) {
            // Snap to exact target and freeze so the lerp branch doesn't fight it
            vc.x = anim.targetX;
            vc.y = anim.targetY;
            vc.radius = anim.targetRadius;
            rp.frozenBlueZone = {
              x: anim.targetX,
              y: anim.targetY,
              radius: anim.targetRadius,
            };
            rp.blueZoneAnim = null;
          }
        } else {
          const tc = targetCircles[i];
          let tx = parseFloat(tc.X),
            ty = parseFloat(tc.Y),
            tr = parseFloat(tc.Size) / 2;

          // For circle[0]: if the API value hasn't caught up to where we
          // animated to, lerp toward the frozen position instead.
          if (i === 0 && rp.frozenBlueZone) {
            const fb = rp.frozenBlueZone;
            const apiCaughtUp =
              Math.abs(tx - fb.x) < 2000 &&
              Math.abs(ty - fb.y) < 2000 &&
              Math.abs(tr - fb.radius) < 2000;
            if (apiCaughtUp) {
              rp.frozenBlueZone = null;
            } else {
              tx = fb.x;
              ty = fb.y;
              tr = fb.radius;
            }
          }

          vc.x += (tx - vc.x) * 0.1;
          vc.y += (ty - vc.y) * 0.1;
          vc.radius += (tr - vc.radius) * 0.1;
        }
      });

      // =====================================================================
      // VIEWPORT: AUTO-ZOOM TO BLUE ZONE (circle[0])
      // =====================================================================
      if (!rp.viewport)
        rp.viewport = { zoom: 1, cx: CANVAS_SIZE / 2, cy: CANVAS_SIZE / 2 };
      const vp = rp.viewport;

      if (rp.circles.length >= 2) {
        const bz = rp.circles[0];
        const bzPr = bz.radius * scale;
        const targetZoom = Math.max(1, (CANVAS_SIZE * 0.85) / (bzPr * 2));
        vp.zoom += (targetZoom - vp.zoom) * 0.02;
        vp.cx += (bz.x * scale - vp.cx) * 0.02;
        vp.cy += (bz.y * scale - vp.cy) * 0.02;
      } else {
        vp.zoom += (1 - vp.zoom) * 0.02;
        vp.cx += (CANVAS_SIZE / 2 - vp.cx) * 0.02;
        vp.cy += (CANVAS_SIZE / 2 - vp.cy) * 0.02;
      }

      const halfVis = CANVAS_SIZE / (2 * vp.zoom);
      vp.cx = Math.max(halfVis, Math.min(CANVAS_SIZE - halfVis, vp.cx));
      vp.cy = Math.max(halfVis, Math.min(CANVAS_SIZE - halfVis, vp.cy));

      const vpTx = CANVAS_SIZE / 2 - vp.zoom * vp.cx;
      const vpTy = CANVAS_SIZE / 2 - vp.zoom * vp.cy;

      // =====================================================================
      // DRAW
      // =====================================================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(vp.zoom, 0, 0, vp.zoom, vpTx, vpTy);

      // Map image
      const currentMapImg = imagesRef.current[state.mapType];
      if (currentMapImg && currentMapImg.complete) {
        ctx.drawImage(currentMapImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      }

      // -----------------------------------------------------------------------
      // ZONE RENDERING — PUBG mobile behaviour:
      //   1 circle  → white announcement circle only (no blue fog, not moving)
      //   2 circles → [0] = blue zone with fog, [1] = next white circle
      // -----------------------------------------------------------------------
      if (rp.circles.length === 1) {
        const sz = rp.circles[0];
        ctx.beginPath();
        ctx.arc(sz.x * scale, sz.y * scale, sz.radius * scale, 0, 2 * Math.PI);
        ctx.lineWidth = 3 / vp.zoom;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      } else if (rp.circles.length >= 2) {
        const bz = rp.circles[0];
        const bzPx = bz.x * scale,
          bzPy = bz.y * scale,
          bzPr = bz.radius * scale;

        ctx.beginPath();
        ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.arc(bzPx, bzPy, bzPr, 0, 2 * Math.PI, true);
        ctx.fillStyle = "rgba(0, 20, 120, 0.55)";
        ctx.fill("evenodd");

        ctx.beginPath();
        ctx.arc(bzPx, bzPy, bzPr, 0, 2 * Math.PI);
        ctx.lineWidth = 3 / vp.zoom;
        ctx.strokeStyle = "rgba(0, 150, 255, 1)";
        ctx.stroke();

        const sz = rp.circles[1];
        ctx.beginPath();
        ctx.arc(sz.x * scale, sz.y * scale, sz.radius * scale, 0, 2 * Math.PI);
        ctx.lineWidth = 3 / vp.zoom;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      }

      // =====================================================================
      // FLIGHT PATH + MOVING PLANE
      // =====================================================================
      const planeStartX = parseFloat(gi?.PlaneStartLocX ?? 0) * scale;
      const planeStartY = parseFloat(gi?.PlaneStartLocY ?? 0) * scale;
      const planeStopX = parseFloat(gi?.PlaneStopLocX ?? 0) * scale;
      const planeStopY = parseFloat(gi?.PlaneStopLocY ?? 0) * scale;
      const planeAngle = Math.atan2(
        planeStopY - planeStartY,
        planeStopX - planeStartX,
      );

      // Plane flies once. If page.jsx already set planeInitialized (live GameTime
      // offset), we respect it. Otherwise (simulator mode) we start on first frame.
      // Use performance.now() (wall clock) instead of rAF timestamp so the
      // plane keeps progressing even when the tab is hidden or throttled.
      const PLANE_DURATION = 60000;
      if (!rp.planeInitialized) {
        rp.planeStartTime = performance.now();
        rp.planeInitialized = true;
      }
      const planeT = Math.min(
        (performance.now() - rp.planeStartTime) / PLANE_DURATION,
        1.0,
      );
      const planeActive = planeT < 1.0;

      if (planeActive) {
        const planePx = planeStartX + (planeStopX - planeStartX) * planeT;
        const planePy = planeStartY + (planeStopY - planeStartY) * planeT;

        ctx.beginPath();
        ctx.moveTo(planeStartX, planeStartY);
        ctx.lineTo(planeStopX, planeStopY);
        ctx.lineWidth = 1.5 / vp.zoom;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.setLineDash([10 / vp.zoom, 7 / vp.zoom]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.save();
        ctx.translate(planePx, planePy);
        ctx.rotate(planeAngle);
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 5 / vp.zoom;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 0.5 / vp.zoom;
        const s = 14 / vp.zoom;

        // Fuselage
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 1.5, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Left wing
        ctx.beginPath();
        ctx.moveTo(s * 0.15, 0);
        ctx.lineTo(-s * 0.4, -s * 1.1);
        ctx.lineTo(-s * 0.85, -s * 0.6);
        ctx.lineTo(-s * 0.25, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right wing
        ctx.beginPath();
        ctx.moveTo(s * 0.15, 0);
        ctx.lineTo(-s * 0.4, s * 1.1);
        ctx.lineTo(-s * 0.85, s * 0.6);
        ctx.lineTo(-s * 0.25, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tail fin left
        ctx.beginPath();
        ctx.moveTo(-s * 1.1, 0);
        ctx.lineTo(-s * 1.35, -s * 0.45);
        ctx.lineTo(-s * 1.5, -s * 0.15);
        ctx.lineTo(-s * 1.2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tail fin right
        ctx.beginPath();
        ctx.moveTo(-s * 1.1, 0);
        ctx.lineTo(-s * 1.35, s * 0.45);
        ctx.lineTo(-s * 1.5, s * 0.15);
        ctx.lineTo(-s * 1.2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // =====================================================================
      // DEBUG GRID — 1 km cells, yellow labels, red centre crosshair
      // =====================================================================
      if (showGridRef.current) {
        const gridDivisions = 8;
        const gridStep = currentMapSize / gridDivisions;
        const gridStepPx = gridStep * scale;

        ctx.save();
        ctx.lineWidth = 2 / vp.zoom;
        ctx.strokeStyle = "rgba(255, 220, 0, 0.5)";

        for (let i = 0; i <= gridDivisions; i++) {
          const pos = i * gridStepPx;
          ctx.beginPath();
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, CANVAS_SIZE);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, pos);
          ctx.lineTo(CANVAS_SIZE, pos);
          ctx.stroke();
        }

        const fontSize = Math.max(9, 11 / vp.zoom);
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "left";
        for (let col = 0; col <= gridDivisions; col++) {
          for (let row = 0; row <= gridDivisions; row++) {
            const cx = col * gridStepPx;
            const cy = row * gridStepPx;
            const xKm = ((col * gridStep) / 100000).toFixed(1);
            const yKm = ((row * gridStep) / 100000).toFixed(1);
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillText(
              `${xKm},${yKm}`,
              cx + 3 / vp.zoom + 1,
              cy + fontSize + 3 / vp.zoom + 1,
            );
            ctx.fillStyle = "rgba(255, 220, 0, 0.9)";
            ctx.fillText(
              `${xKm},${yKm}`,
              cx + 3 / vp.zoom,
              cy + fontSize + 3 / vp.zoom,
            );
          }
        }

        const midPx = (currentMapSize / 2) * scale;
        const ch = 16 / vp.zoom;
        ctx.strokeStyle = "rgba(255, 60, 60, 0.9)";
        ctx.lineWidth = 2 / vp.zoom;
        ctx.beginPath();
        ctx.moveTo(midPx - ch, midPx);
        ctx.lineTo(midPx + ch, midPx);
        ctx.moveTo(midPx, midPx - ch);
        ctx.lineTo(midPx, midPx + ch);
        ctx.stroke();

        ctx.restore();
      }

      // =====================================================================
      // PLAYERS (asymptotic lerp)
      // =====================================================================
      state.TotalPlayerList?.forEach((player) => {
        if (!VISIBLE_LIVE_STATES.includes(player.liveState)) return;

        if (!rp.players[player.uId]) {
          rp.players[player.uId] = {
            x: player.location.x,
            y: player.location.y,
          };
        }

        const vpos = rp.players[player.uId];
        vpos.x += (player.location.x - vpos.x) * 0.1;
        vpos.y += (player.location.y - vpos.y) * 0.1;

        const px = vpos.x * scale,
          py = vpos.y * scale;
        const dotR = 6 / vp.zoom;

        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, 2 * Math.PI);
        ctx.fillStyle = getTeamColor(player.teamId);
        ctx.fill();
        ctx.lineWidth = 2 / vp.zoom;
        ctx.strokeStyle = "#000000";
        ctx.stroke();

        const fontSize = 13 / vp.zoom;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4 / vp.zoom;
        ctx.shadowOffsetX = 1 / vp.zoom;
        ctx.shadowOffsetY = 1 / vp.zoom;
        ctx.fillText(player.playerName, px + 12 / vp.zoom, py + 4 / vp.zoom);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [renderStateRef]);

  return (
    <div className="relative overflow-hidden shadow-2xl shadow-black/50">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block h-full w-full bg-transparent"
      />
    </div>
  );
}
