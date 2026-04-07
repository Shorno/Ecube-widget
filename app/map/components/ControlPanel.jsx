"use client";

import React from "react";
import MapSelector from "./MapSelector";

// Left sidebar for live view controls.
export default function ControlPanel({
  mapType,
  showGrid,
  logoStatus,
  onMapChange,
  onGridToggle,
  onLoadTeamLogos,
}) {
  return (
    <div className="flex w-80 shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-700 bg-neutral-800 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-xl font-bold text-blue-400">PCOB Map</h1>
          <p className="text-xs text-neutral-400">Live API view</p>
        </div>
      </div>

      <MapSelector value={mapType} onChange={onMapChange} />

      <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-neutral-200">
        <input
          type="checkbox"
          checked={!!showGrid}
          onChange={onGridToggle}
          className="h-4 w-4 rounded border-neutral-500 bg-neutral-900"
        />
        Show Grid
      </label>

      <div className="rounded-lg bg-neutral-900 p-4">
        <label className="mb-2 block text-sm font-semibold text-neutral-300">
          Team Logo Folder
        </label>

        <button
          type="button"
          onClick={onLoadTeamLogos}
          className="mt-3 w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Select Logo Folder
        </button>

        <p className="mt-2 text-xs text-neutral-300">{logoStatus}</p>
        <p className="mt-1 text-[11px] text-neutral-500">
          Use files named like 001.png, 002.png, 003.png where the number is the
          teamId.
        </p>
      </div>
    </div>
  );
}
