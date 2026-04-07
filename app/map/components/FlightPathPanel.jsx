"use client";

import React from "react";

const PLANE_FIELDS = [
  ["PlaneStartLocX", "Start X"],
  ["PlaneStartLocY", "Start Y"],
  ["PlaneStopLocX", "End X"],
  ["PlaneStopLocY", "End Y"],
];

// Sliders for the dropship start/end coordinates.
export default function FlightPathPanel({
  gameGlobalInfo,
  currentMapUnits,
  onUpdatePlane,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-neutral-900 p-4">
      <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
        Flight Path
      </h3>
      {PLANE_FIELDS.map(([prop, label]) => (
        <div key={prop}>
          <label className="text-[10px] text-neutral-400">{label}</label>
          <input
            type="range"
            min={Math.round(-currentMapUnits * 0.2)}
            max={Math.round(currentMapUnits * 1.2)}
            step="1000"
            className="w-full accent-yellow-400"
            value={parseFloat(gameGlobalInfo?.[prop] ?? 0)}
            onChange={(e) => onUpdatePlane(prop, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
