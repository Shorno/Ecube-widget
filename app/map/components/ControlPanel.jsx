"use client";

import React from "react";
import MapSelector from "./MapSelector";
import ZoneCirclesPanel from "./ZoneCirclesPanel";
import FlightPathPanel from "./FlightPathPanel";
import PlayerLocationsPanel from "./PlayerLocationsPanel";

// Left sidebar that wires every sub-panel to the parent simulator state.
export default function ControlPanel({
  simulatorState,
  currentMapUnits,
  circles,
  showGrid,
  onToggleGrid,
  onMapChange,
  onAddCircle,
  onRemoveCircle,
  onUpdateCircle,
  onTriggerShrink,
  onUpdatePlane,
  onUpdatePlayerPos,
}) {
  return (
    <div className="flex w-87.5 shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-700 bg-neutral-800 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-xl font-bold text-blue-400">
            PCOB Simulator
          </h1>
          <p className="text-xs text-neutral-400">
            Drag sliders to test Canvas
          </p>
        </div>
        <button
          onClick={onToggleGrid}
          className={`mt-1 rounded px-2 py-1 text-[10px] font-bold transition-colors ${
            showGrid
              ? "bg-yellow-500 text-black"
              : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
          }`}
        >
          {showGrid ? "Grid ON" : "Grid OFF"}
        </button>
      </div>

      <MapSelector value={simulatorState?.mapType} onChange={onMapChange} />

      <ZoneCirclesPanel
        circles={circles}
        currentMapUnits={currentMapUnits}
        onAddCircle={onAddCircle}
        onRemoveCircle={onRemoveCircle}
        onUpdateCircle={onUpdateCircle}
        onTriggerShrink={onTriggerShrink}
      />

      <FlightPathPanel
        gameGlobalInfo={simulatorState?.gameGlobalInfo}
        currentMapUnits={currentMapUnits}
        onUpdatePlane={onUpdatePlane}
      />

      <PlayerLocationsPanel
        players={simulatorState?.TotalPlayerList}
        currentMapUnits={currentMapUnits}
        onUpdatePlayerPos={onUpdatePlayerPos}
      />
    </div>
  );
}
