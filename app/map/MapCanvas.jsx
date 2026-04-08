"use client";

import React, { useEffect, useRef } from "react";
import {
  CANVAS_SIZE,
  MAPS,
  PLANE_DURATION_MS,
  PLANE_PATH_LENGTH_CM,
  PLANE_START_OFFSET_CM,
  TEAM_COLOR_BY_ID,
  VISIBLE_LIVE_STATES,
} from "./constants";

// Keeps rendering stable if an unexpected teamId appears (e.g. custom scrim data).
const getTeamColor = (teamId) => TEAM_COLOR_BY_ID[Number(teamId)] ?? "#ff3366";

const getTeamColor50 = (teamId) => {
  const base = String(getTeamColor(teamId)).trim();
  const rgbMatch = base.match(
    /^rgba?\(\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)(?:\s*,\s*[0-9.]+)?\s*\)$/i,
  );
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.5)`;
  }

  const hexMatch = base.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const raw = hexMatch[1];
    const hex =
      raw.length === 3
        ? raw
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : raw;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }

  return "rgba(255, 51, 102, 0.5)";
};

const formatTeamIdLabel = (teamId) => {
  const normalizedId = Number(teamId);
  if (!Number.isFinite(normalizedId) || normalizedId < 0) return "00";
  return String(Math.trunc(normalizedId)).padStart(2, "0");
};

const TALL_FONT_STACK =
  '"Bahnschrift Condensed", "Arial Narrow", "Roboto Condensed", sans-serif';

const LIVE_STATE_ICON_SRC_BY_STATE = {
  2: "/live-state-icons/parachute.svg",
  3: "/live-state-icons/steering-wheel.svg",
  4: "/live-state-icons/plus.svg",
  6: "/live-state-icons/disconnected.svg",
};

const drawLiveStateBadge = (
  ctx,
  liveState,
  markerX,
  markerY,
  markerRadius,
  zoom,
  iconImages,
) => {
  const stateValue = Number(liveState);
  if (![2, 3, 4, 6].includes(stateValue)) return;

  const badgeRadius = Math.max(8 / zoom, markerRadius * 0.5);
  const badgeX = markerX + markerRadius * 0.72;
  const badgeY = markerY - markerRadius * 0.72;

  ctx.save();

  // Base badge container (mini black circle).
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.6 / zoom;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Prefer image icons when available.
  const iconImage = iconImages?.[stateValue];
  if (iconImage && iconImage.complete && iconImage.naturalWidth > 0) {
    const iconSize = badgeRadius * 1.45;
    ctx.drawImage(
      iconImage,
      badgeX - iconSize / 2,
      badgeY - iconSize / 2,
      iconSize,
      iconSize,
    );
    ctx.restore();
    return;
  }

  if (stateValue === 2) {
    // Parachute icon with segmented canopy and suspension lines.
    const canopyTopY = badgeY - badgeRadius * 0.64;
    const canopyBaseY = badgeY - badgeRadius * 0.08;
    const canopyHalfW = badgeRadius * 0.78;
    const harnessY = badgeY + badgeRadius * 0.48;
    const harnessHalfW = badgeRadius * 0.24;

    // Outer canopy arch.
    ctx.beginPath();
    ctx.moveTo(badgeX - canopyHalfW, canopyBaseY);
    ctx.quadraticCurveTo(badgeX, canopyTopY, badgeX + canopyHalfW, canopyBaseY);
    ctx.stroke();

    // Lower canopy seam for the panel look.
    ctx.beginPath();
    ctx.moveTo(badgeX - canopyHalfW * 0.94, canopyBaseY);
    ctx.quadraticCurveTo(
      badgeX,
      canopyBaseY + badgeRadius * 0.16,
      badgeX + canopyHalfW * 0.94,
      canopyBaseY,
    );
    ctx.stroke();

    // Canopy ribs.
    const ribOffsets = [-0.66, -0.33, 0, 0.33, 0.66];
    ctx.beginPath();
    ribOffsets.forEach((ratio) => {
      ctx.moveTo(badgeX, canopyTopY + badgeRadius * 0.06);
      ctx.lineTo(badgeX + canopyHalfW * ratio, canopyBaseY);
    });
    ctx.stroke();

    // Suspension lines from canopy to harness.
    const lineOffsets = [-0.72, -0.42, 0, 0.42, 0.72];
    ctx.beginPath();
    lineOffsets.forEach((ratio) => {
      const topX = badgeX + canopyHalfW * ratio;
      const bottomX =
        ratio < -0.2
          ? badgeX - harnessHalfW
          : ratio > 0.2
            ? badgeX + harnessHalfW
            : badgeX;
      ctx.moveTo(topX, canopyBaseY + badgeRadius * 0.03);
      ctx.lineTo(bottomX, harnessY);
    });
    ctx.stroke();

    // Harness line.
    ctx.beginPath();
    ctx.moveTo(badgeX - harnessHalfW, harnessY);
    ctx.lineTo(badgeX + harnessHalfW, harnessY);
    ctx.stroke();
  } else if (stateValue === 3) {
    // Steering wheel icon.
    const outerR = badgeRadius * 0.58;
    const innerR = badgeRadius * 0.2;

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, outerR, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, innerR, 0, 2 * Math.PI);
    ctx.stroke();

    // Three spokes (top, bottom-left, bottom-right).
    const spokeAngles = [-Math.PI / 2, (5 * Math.PI) / 6, Math.PI / 6];
    ctx.beginPath();
    spokeAngles.forEach((angle) => {
      ctx.moveTo(
        badgeX + Math.cos(angle) * innerR * 0.3,
        badgeY + Math.sin(angle) * innerR * 0.3,
      );
      ctx.lineTo(
        badgeX + Math.cos(angle) * outerR * 0.92,
        badgeY + Math.sin(angle) * outerR * 0.92,
      );
    });
    ctx.stroke();
  } else if (stateValue === 4) {
    // Plus (DBNO) icon.
    const plusArm = badgeRadius * 0.45;

    ctx.beginPath();
    ctx.moveTo(badgeX - plusArm, badgeY);
    ctx.lineTo(badgeX + plusArm, badgeY);
    ctx.moveTo(badgeX, badgeY - plusArm);
    ctx.lineTo(badgeX, badgeY + plusArm);
    ctx.stroke();
  } else if (stateValue === 6) {
    // Disconnected icon: wifi arcs + slash.
    const arcY = badgeY + badgeRadius * 0.16;

    ctx.beginPath();
    ctx.arc(badgeX, arcY, badgeRadius * 0.62, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(badgeX, arcY, badgeRadius * 0.43, Math.PI * 1.14, Math.PI * 1.86);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(badgeX, arcY, badgeRadius * 0.24, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();

    // Wifi center dot.
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(
      badgeX,
      arcY + badgeRadius * 0.2,
      badgeRadius * 0.07,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(badgeX - badgeRadius * 0.62, badgeY + badgeRadius * 0.62);
    ctx.lineTo(badgeX + badgeRadius * 0.62, badgeY - badgeRadius * 0.62);
    ctx.stroke();
  }

  ctx.restore();
};

// Canvas rendering surface that owns the requestAnimationFrame loop and draws
// map, zones, flight path, and players. All stateful map data is passed in
// via props; a shared `renderStateRef`
// keeps the lerp cache alive across frames and siblings (e.g. the shrink
// trigger button in ControlPanel).
export default function MapCanvas({ simulatorState, renderStateRef }) {
  const canvasRef = useRef(null);
  const gameStateRef = useRef(simulatorState);
  const imagesRef = useRef({});
  const teamLogoImagesRef = useRef({});
  const liveStateIconImagesRef = useRef({});
  const planeIconImageRef = useRef(null);
  const requestRef = useRef();

  // Keeps an always-fresh state snapshot for the animation loop.
  useEffect(() => {
    gameStateRef.current = simulatorState;
  }, [simulatorState]);

  // Preloads all map images once to avoid draw-time fetch delays.
  useEffect(() => {
    Object.keys(MAPS).forEach((key) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = MAPS[key].src;
      imagesRef.current[key] = img;
    });
  }, []);

  // Preloads live-state badge icon assets from /public.
  useEffect(() => {
    Object.entries(LIVE_STATE_ICON_SRC_BY_STATE).forEach(([state, src]) => {
      const icon = new Image();
      icon.src = src;
      liveStateIconImagesRef.current[Number(state)] = icon;
    });
  }, []);

  useEffect(() => {
    const planeIcon = new Image();
    planeIcon.src = "/plane.png";
    planeIconImageRef.current = planeIcon;
  }, []);

  // Starts the requestAnimationFrame loop on mount and cancels it on unmount.
  useEffect(() => {
    const renderLoop = () => {
      // Read the current canvas element.
      const canvas = canvasRef.current;
      // Skip this frame if canvas is not mounted yet.
      if (!canvas) return;
      // Use a 2D context for all map rendering operations.
      const ctx = canvas.getContext("2d");
      // Snapshot the latest simulator state used for this frame.
      const state = gameStateRef.current;
      // Shared mutable render cache (lerp values, viewport, animation state).
      const rp = renderStateRef.current;

      // If state is temporarily unavailable, queue next frame and exit.
      if (!state) {
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Current world size for selected map (used to convert world->canvas).
      const currentMapSize = MAPS[state.mapType]?.size || 800000;
      // Scale factor from world coordinates to canvas coordinates.
      const scale = CANVAS_SIZE / currentMapSize;
      // Alias global game info for shorter access.
      const gi = state.gameGlobalInfo;
      // Incoming circle targets from latest telemetry.
      const targetCircles = gi?.CircleArray ?? [];

      // =====================================================================
      // CIRCLE LERPING
      // Matches websocket: CircleArray[0] = blue zone, CircleArray[1] = safe zone
      // Size from the API is already radius in world units.
      // =====================================================================
      while (rp.circles.length < targetCircles.length) {
        const tc = targetCircles[rp.circles.length];
        rp.circles.push({
          x: parseFloat(tc.X),
          y: parseFloat(tc.Y),
          radius: parseFloat(tc.Size),
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
            tr = parseFloat(tc.Size);

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
      // DRAW PHASE: clear canvas, apply viewport transform, then draw layers.
      // =====================================================================
      // Clear previous frame pixels before drawing current state.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Apply world camera transform (zoom + pan) for this frame.
      ctx.setTransform(vp.zoom, 0, 0, vp.zoom, vpTx, vpTy);

      // Draw the selected map texture as the base layer.
      const currentMapImg = imagesRef.current[state.mapType];
      if (currentMapImg && currentMapImg.complete) {
        // Paint map image over the full logical canvas.
        ctx.drawImage(currentMapImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      }

      // Optional grid overlay for coordinate debugging/reference.
      if (state.showGrid) {
        // Target world slice size for grid density.
        const TARGET_SLICE_WORLD = 100000; // Target ~= 1km per slice
        // Actual world size of selected map.
        const mapSizeWorld = MAPS[state.mapType]?.size ?? currentMapSize;
        // Number of slices used to build near-1km cells.
        const sliceCount = Math.max(
          1,
          Math.round(mapSizeWorld / TARGET_SLICE_WORLD),
        );
        // Exact world distance represented by each grid step.
        const sliceWorld = mapSizeWorld / sliceCount;
        // Pixel-space coordinates for all vertical/horizontal grid lines.
        const gridCoords = Array.from(
          { length: sliceCount + 1 },
          (_, i) => (i / sliceCount) * CANVAS_SIZE,
        );
        // World-space coordinates used for labels.
        const worldCoords = Array.from(
          { length: sliceCount + 1 },
          (_, i) => i * sliceWorld,
        );

        // Style for thin grid lines.
        ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = 1 / vp.zoom;

        gridCoords.forEach((p) => {
          // Draw one vertical grid line.
          ctx.beginPath();
          ctx.moveTo(p, 0);
          ctx.lineTo(p, CANVAS_SIZE);
          ctx.stroke();

          // Draw one horizontal grid line.
          ctx.beginPath();
          ctx.moveTo(0, p);
          ctx.lineTo(CANVAS_SIZE, p);
          ctx.stroke();
        });

        // Small markers at intersections help visual alignment checks.
        const markerR = 2.2 / vp.zoom;
        ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
        gridCoords.forEach((x) => {
          gridCoords.forEach((y) => {
            // Draw a tiny dot at each grid crossing.
            ctx.beginPath();
            ctx.arc(x, y, markerR, 0, 2 * Math.PI);
            ctx.fill();
          });
        });

        // Draw coordinate labels using spacing-aware skipping to avoid overlap.
        const slicePx = CANVAS_SIZE / sliceCount;
        const minLabelSpacing = 90 / vp.zoom;
        const labelStep = Math.max(1, Math.ceil(minLabelSpacing / slicePx));
        ctx.font = `${8 / vp.zoom}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        for (let xi = 0; xi < gridCoords.length; xi += 1) {
          for (let yi = 0; yi < gridCoords.length; yi += 1) {
            // Skip outer zero axes to reduce clutter.
            if (xi === 0 || yi === 0) continue;
            // Skip labels between sampling intervals.
            if (xi % labelStep !== 0 || yi % labelStep !== 0) continue;

            // Current intersection coordinates.
            const x = gridCoords[xi];
            const y = gridCoords[yi];
            // Convert world values to km text.
            const xKm = (worldCoords[xi] / 100000).toFixed(2);
            const yKm = (worldCoords[yi] / 100000).toFixed(2);
            const label = `X:${xKm} Y:${yKm}`;
            // Offset text so it does not sit exactly on the marker point.
            const tx = x + 4 / vp.zoom;
            const ty = y - 3 / vp.zoom;
            // Background padding for text readability.
            const padX = 2 / vp.zoom;
            const padY = 1 / vp.zoom;
            const textW = ctx.measureText(label).width;
            const textH = 8 / vp.zoom;

            // Draw dark backing rectangle under label.
            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            ctx.fillRect(
              tx - padX,
              ty - textH - padY,
              textW + padX * 2,
              textH + padY * 2,
            );

            // Draw coordinate text over label background.
            ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
            ctx.fillText(label, tx, ty);
          }
        }

        // Draw axis-style km labels along top and left edges.
        ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
        ctx.font = `${11 / vp.zoom}px Arial`;
        worldCoords.forEach((w, i) => {
          const p = gridCoords[i];
          const km = w / 100000;
          const label = Number.isInteger(km) ? `${km}km` : `${km.toFixed(2)}km`;
          // Top edge label.
          ctx.fillText(label, p + 4 / vp.zoom, 14 / vp.zoom);
          if (i > 0) {
            // Left edge label (skip duplicated origin label).
            ctx.fillText(label, 4 / vp.zoom, p - 4 / vp.zoom);
          }
        });
      }

      // -----------------------------------------------------------------------
      // ZONE RENDERING — PUBG mobile behaviour:
      //   1 circle  → white announcement circle only (no blue fog, not moving)
      //   2 circles → [0] = blue zone with fog, [1] = next white circle
      // -----------------------------------------------------------------------
      if (rp.circles.length === 1) {
        // Single circle: announced safe zone ring only.
        const sz = rp.circles[0];
        ctx.beginPath();
        ctx.arc(sz.x * scale, sz.y * scale, sz.radius * scale, 0, 2 * Math.PI);
        ctx.lineWidth = 3 / vp.zoom;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      } else if (rp.circles.length >= 2) {
        // Two circles: first is current blue zone, second is safe zone.
        const bz = rp.circles[0];
        const bzPx = bz.x * scale,
          bzPy = bz.y * scale,
          bzPr = bz.radius * scale;

        // Draw blue fog by filling the map rectangle with a circular cutout.
        ctx.beginPath();
        ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.arc(bzPx, bzPy, bzPr, 0, 2 * Math.PI, true);
        ctx.fillStyle = "rgba(0, 20, 120, 0.55)";
        ctx.fill("evenodd");

        // Draw blue zone border.
        ctx.beginPath();
        ctx.arc(bzPx, bzPy, bzPr, 0, 2 * Math.PI);
        ctx.lineWidth = 3 / vp.zoom;
        ctx.strokeStyle = "rgba(0, 150, 255, 1)";
        ctx.stroke();

        // Draw safe zone border.
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
      const rawPlaneStartX = parseFloat(gi?.PlaneStartLocX ?? 0);
      const rawPlaneStartY = parseFloat(gi?.PlaneStartLocY ?? 0);
      const rawPlaneStopX = parseFloat(gi?.PlaneStopLocX ?? 0);
      const rawPlaneStopY = parseFloat(gi?.PlaneStopLocY ?? 0);

      // Always keep direction from the ACTUAL start to ACTUAL end.
      const planeDirXRaw = rawPlaneStopX - rawPlaneStartX;
      const planeDirYRaw = rawPlaneStopY - rawPlaneStartY;
      const planeDirLen = Math.hypot(planeDirXRaw, planeDirYRaw);
      const hasPlaneDirection = Number.isFinite(planeDirLen) && planeDirLen > 1;
      const planeDirX = hasPlaneDirection ? planeDirXRaw / planeDirLen : 1;
      const planeDirY = hasPlaneDirection ? planeDirYRaw / planeDirLen : 0;

      // Visible path is clipped to [2 lakh, 8 lakh] from actual start,
      // i.e. total visible length remains 6 lakh.
      const visiblePathStartDistCm = hasPlaneDirection
        ? Math.min(PLANE_START_OFFSET_CM, planeDirLen)
        : 0;
      const visiblePathEndDistCm = hasPlaneDirection
        ? Math.min(PLANE_START_OFFSET_CM + PLANE_PATH_LENGTH_CM, planeDirLen)
        : 0;

      const visiblePathStartWorldX =
        rawPlaneStartX + planeDirX * visiblePathStartDistCm;
      const visiblePathStartWorldY =
        rawPlaneStartY + planeDirY * visiblePathStartDistCm;
      const visiblePathEndWorldX =
        rawPlaneStartX + planeDirX * visiblePathEndDistCm;
      const visiblePathEndWorldY =
        rawPlaneStartY + planeDirY * visiblePathEndDistCm;

      // Plane icon moves on actual start -> actual end route.
      const planeStartX = rawPlaneStartX * scale;
      const planeStartY = rawPlaneStartY * scale;
      const planeEndX = rawPlaneStopX * scale;
      const planeEndY = rawPlaneStopY * scale;

      const pathStartX = visiblePathStartWorldX * scale;
      const pathStartY = visiblePathStartWorldY * scale;
      const pathEndBaseX = visiblePathEndWorldX * scale;
      const pathEndBaseY = visiblePathEndWorldY * scale;
      const planeAngle = Math.atan2(
        planeEndY - planeStartY,
        planeEndX - planeStartX,
      );
      const hasPlanePath =
        hasPlaneDirection &&
        Number.isFinite(pathStartX) &&
        Number.isFinite(pathStartY) &&
        Number.isFinite(pathEndBaseX) &&
        Number.isFinite(pathEndBaseY) &&
        (Math.abs(pathEndBaseX - pathStartX) > 1 ||
          Math.abs(pathEndBaseY - pathStartY) > 1);

      // Plane flies once. page.jsx seeds planeStartTime from live API when
      // possible. Use performance.now() (wall clock) instead of rAF timestamp
      // so movement remains smooth even when tabs are throttled.
      const hasPlaneClock =
        rp.planeInitialized && Number.isFinite(rp.planeStartTime);
      const planeElapsedMs = hasPlaneClock
        ? Math.max(0, performance.now() - rp.planeStartTime)
        : 0;
      const stripeElapsedMs = performance.now();
      // Plane flies once on the fixed path and then stops at the end point.
      const planeT = hasPlaneClock
        ? Math.min(planeElapsedMs / PLANE_DURATION_MS, 1.0)
        : 0;
      const planeActive = hasPlaneClock && planeT < 1.0;
      const showPlanePath = hasPlanePath && planeActive;
      const planePx = planeStartX + (planeEndX - planeStartX) * planeT;
      const planePy = planeStartY + (planeEndY - planeStartY) * planeT;

      // Convert plane progress to a distance on actual route and clamp into
      // visible path range so red segment does not "move the whole path".
      const traveledDistCm = planeDirLen * planeT;
      const redStartDistCm = Math.max(
        visiblePathStartDistCm,
        Math.min(traveledDistCm, visiblePathEndDistCm),
      );
      const redStartWorldX = rawPlaneStartX + planeDirX * redStartDistCm;
      const redStartWorldY = rawPlaneStartY + planeDirY * redStartDistCm;
      const redStartX = redStartWorldX * scale;
      const redStartY = redStartWorldY * scale;

      if (showPlanePath) {
        // Draw full PUBG-style path immediately (no gradual expansion).
        const arrowForwardOffset = 8 / vp.zoom;
        const pathEndX =
          pathEndBaseX + Math.cos(planeAngle) * arrowForwardOffset;
        const pathEndY =
          pathEndBaseY + Math.sin(planeAngle) * arrowForwardOffset;

        ctx.save();

        // White base stroke. Keep width/caps equal to red stripe so there is
        // no white border/padding around red segments.
        ctx.beginPath();
        ctx.moveTo(pathStartX, pathStartY);
        ctx.lineTo(pathEndBaseX, pathEndBaseY);
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.lineWidth = 6 / vp.zoom;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
        ctx.stroke();

        // Red striped center stroke.
        ctx.beginPath();
        // The remaining (upcoming) path stays red; passed path remains white.
        ctx.moveTo(redStartX, redStartY);
        ctx.lineTo(pathEndBaseX, pathEndBaseY);
        // Use square dash caps so stripes are not rounded and start exactly
        // at the same point as the white line.
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.lineWidth = 6 / vp.zoom;
        ctx.strokeStyle = "rgba(215, 38, 38, 0.98)";
        ctx.setLineDash([18 / vp.zoom, 12 / vp.zoom]);
        // Conveyor motion runs continuously, even before plane starts.
        ctx.lineDashOffset = -(stripeElapsedMs / 18);
        ctx.stroke();
        ctx.setLineDash([]);

        // White start marker circle (PUBG-style origin dot).
        ctx.beginPath();
        ctx.arc(pathStartX, pathStartY, 10 / vp.zoom, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.fill();

        // White arrow at the exact end of the path.
        const arrowLength = 26 / vp.zoom;
        const arrowWidth = 18 / vp.zoom;
        const backX = pathEndX - Math.cos(planeAngle) * arrowLength;
        const backY = pathEndY - Math.sin(planeAngle) * arrowLength;
        const perpX = -Math.sin(planeAngle);
        const perpY = Math.cos(planeAngle);

        ctx.beginPath();
        ctx.moveTo(pathEndX, pathEndY);
        ctx.lineTo(
          backX + perpX * (arrowWidth / 2),
          backY + perpY * (arrowWidth / 2),
        );
        ctx.lineTo(
          backX - perpX * (arrowWidth / 2),
          backY - perpY * (arrowWidth / 2),
        );
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
        ctx.lineWidth = 1 / vp.zoom;
        ctx.stroke();

        ctx.restore();
      }

      if (hasPlanePath && planeActive) {
        // Interpolate plane position along the flight path.

        // Enter local transform space for drawing oriented plane shape.
        ctx.save();
        ctx.translate(planePx, planePy);
        const planeIcon = planeIconImageRef.current;
        const hasPlaneIcon =
          planeIcon && planeIcon.complete && planeIcon.naturalWidth > 0;

        // plane.png points upward by default, so add +90deg to align with path.
        ctx.rotate(hasPlaneIcon ? planeAngle + Math.PI / 2 : planeAngle);

        if (hasPlaneIcon) {
          const iconSize = 100 / vp.zoom;
          ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
          ctx.shadowBlur = 5 / vp.zoom;
          ctx.drawImage(
            planeIcon,
            -iconSize / 2,
            -iconSize / 2,
            iconSize,
            iconSize,
          );
          ctx.shadowBlur = 0;
        } else {
          ctx.shadowColor = "rgba(0,0,0,0.7)";
          ctx.shadowBlur = 5 / vp.zoom;
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "rgba(0,0,0,0.4)";
          ctx.lineWidth = 0.5 / vp.zoom;
          const s = 14 / vp.zoom;

          ctx.beginPath();
          ctx.ellipse(0, 0, s * 1.5, s * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(s * 0.15, 0);
          ctx.lineTo(-s * 0.4, -s * 1.1);
          ctx.lineTo(-s * 0.85, -s * 0.6);
          ctx.lineTo(-s * 0.25, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(s * 0.15, 0);
          ctx.lineTo(-s * 0.4, s * 1.1);
          ctx.lineTo(-s * 0.85, s * 0.6);
          ctx.lineTo(-s * 0.25, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-s * 1.1, 0);
          ctx.lineTo(-s * 1.35, -s * 0.45);
          ctx.lineTo(-s * 1.5, -s * 0.15);
          ctx.lineTo(-s * 1.2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-s * 1.1, 0);
          ctx.lineTo(-s * 1.35, s * 0.45);
          ctx.lineTo(-s * 1.5, s * 0.15);
          ctx.lineTo(-s * 1.2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      // =====================================================================
      // PLAYERS (asymptotic lerp)
      // =====================================================================
      state.TotalPlayerList?.forEach((player) => {
        // Render only states considered visible on map.
        if (!VISIBLE_LIVE_STATES.includes(player.liveState)) return;

        // Seed render cache when player appears for first time.
        if (!rp.players[player.uId]) {
          rp.players[player.uId] = {
            x: player.location.x,
            y: player.location.y,
          };
        }

        // Lerp cached position toward latest network coordinates.
        const vpos = rp.players[player.uId];
        vpos.x += (player.location.x - vpos.x) * 0.1;
        vpos.y += (player.location.y - vpos.y) * 0.1;

        // Convert world player position into canvas space.
        const px = vpos.x * scale,
          py = vpos.y * scale;
        // Candidate logo source loaded from control page state.
        const teamLogoSrc = state?.teamLogoById?.[Number(player.teamId)];
        const hasTeamLogo =
          typeof teamLogoSrc === "string" && teamLogoSrc.length > 0;
        // Solid team color (used for name plate).
        const teamColor = getTeamColor(player.teamId);
        // 50% alpha team color (used for marker backgrounds).
        const teamColor50 = getTeamColor50(player.teamId);
        // Two-digit team id text for number fallback marker.
        const teamIdLabel = formatTeamIdLabel(player.teamId);
        // Unified marker size used by both logos and number fallback.
        const markerSize = 38 / vp.zoom;
        // Dark tint used under marker backgrounds for better contrast.
        const markerDarkOverlay = "rgba(0, 0, 0, 0.35)";
        const fallbackRadius = markerSize * 0.55;
        let markerRadius = fallbackRadius;
        let logoRendered = false;

        // Try drawing team logo marker when a logo src is available.
        if (hasTeamLogo) {
          // Lazily create and cache HTMLImageElement for this logo src.
          if (!teamLogoImagesRef.current[teamLogoSrc]) {
            const logoImg = new Image();
            logoImg.src = teamLogoSrc;
            teamLogoImagesRef.current[teamLogoSrc] = logoImg;
          }

          // Resolve cached logo image and marker geometry.
          const logoImg = teamLogoImagesRef.current[teamLogoSrc];
          const logoSize = markerSize;
          const logoRadius = logoSize * 0.55;
          if (logoImg.complete && logoImg.naturalWidth > 0) {
            // Draw dark+team marker base, then clip logo on top.
            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, logoRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = markerDarkOverlay;
            ctx.fill();
            ctx.fillStyle = teamColor50;
            ctx.fill();
            ctx.clip();
            ctx.drawImage(
              logoImg,
              px - logoSize / 2,
              py - logoSize / 2,
              logoSize,
              logoSize,
            );
            ctx.restore();

            // Draw white outline ring around logo marker.
            ctx.beginPath();
            ctx.arc(px, py, logoRadius, 0, 2 * Math.PI);
            ctx.lineWidth = 2 / vp.zoom;
            ctx.strokeStyle = "rgba(255,255,255,0.95)";
            ctx.stroke();

            // Use logo radius for downstream name label placement.
            markerRadius = logoRadius;
            logoRendered = true;
          }
        }

        // If no logo was rendered, draw numeric fallback marker.
        if (!logoRendered) {
          ctx.beginPath();
          ctx.arc(px, py, fallbackRadius, 0, 2 * Math.PI);
          ctx.fillStyle = markerDarkOverlay;
          ctx.fill();
          ctx.fillStyle = teamColor50;
          ctx.fill();
          ctx.lineWidth = 2 / vp.zoom;
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.stroke();

          // Team id text size inside fallback circle.
          const teamIdFontSize = 18 / vp.zoom;
          ctx.font = `${teamIdFontSize}px ${TALL_FONT_STACK}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(teamIdLabel, px, py);
        }

        // Draw live-state badge at marker top-right for supported states.
        drawLiveStateBadge(
          ctx,
          player.liveState,
          px,
          py,
          markerRadius,
          vp.zoom,
          liveStateIconImagesRef.current,
        );

        // Read and sanitize player name text.
        const labelText = String(player.playerName ?? "").trim();
        // Skip label rendering when name is empty.
        if (!labelText) return;

        // Configure font and alignment for centered name plate text.
        const fontSize = 14 / vp.zoom;
        ctx.font = `${fontSize}px ${TALL_FONT_STACK}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Measure text to size the background exactly to glyph bounds.
        const textMetrics = ctx.measureText(labelText);
        const textWidth = textMetrics.width;
        const textHeight = Math.max(
          fontSize,
          (textMetrics.actualBoundingBoxAscent || fontSize * 0.75) +
            (textMetrics.actualBoundingBoxDescent || fontSize * 0.25),
        );

        // Add a very small padding so text is not touching the edges.
        const labelPadX = 1 / vp.zoom;
        const labelPadY = 1 / vp.zoom;

        // Compute background box and center point under marker.
        const labelWidth = textWidth + labelPadX * 4;
        const labelHeight = textHeight + labelPadY * 4;
        const labelCenterX = px;
        const labelCenterY = py + markerRadius + labelHeight / 2 + 4 / vp.zoom;

        // Draw solid team-color name background.
        ctx.fillStyle = teamColor;
        ctx.fillRect(
          labelCenterX - labelWidth / 2,
          labelCenterY - labelHeight / 2,
          labelWidth,
          labelHeight,
        );

        // Add a black tint overlay above team color for better text contrast.
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
          labelCenterX - labelWidth / 2,
          labelCenterY - labelHeight / 2,
          labelWidth,
          labelHeight,
        );

        // Stroke first, then fill so text stays readable over any terrain.
        ctx.lineWidth = 1.4 / vp.zoom;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
        ctx.strokeText(labelText, labelCenterX, labelCenterY);

        // Draw player name text over background.
        ctx.fillStyle = "#ffffff";
        ctx.fillText(labelText, labelCenterX, labelCenterY);
      });

      // Reset transform so any later UI draw (if added) starts from identity.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Keep one continuous render cycle by scheduling the next frame
      // only after this frame's drawing work has finished.
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [renderStateRef]);

  return (
    <div className="relative h-full w-full overflow-hidden shadow-2xl shadow-black/50">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block h-full w-full bg-transparent"
      />
    </div>
  );
}
