"use client";

import React from "react";

// Per-player X/Y sliders for manual position simulation.
export default function PlayerLocationsPanel({
  players,
  currentMapUnits,
  onUpdatePlayerPos,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
      <h3 className="border-b border-neutral-700 pb-2 text-sm font-semibold text-neutral-300">
        Player Locations
      </h3>
      {players?.map((player, index) => (
        <div key={player.uId} className="rounded bg-neutral-800 p-3">
          <span
            className="text-xs font-bold"
            style={{ color: player.teamId === 6 ? "#00ffff" : "#ff3366" }}
          >
            {player.playerName}
          </span>
          <div className="mt-2 flex gap-4">
            {["x", "y"].map((axis) => (
              <div key={axis} className="flex-1">
                <label className="text-[10px] text-neutral-400">
                  {axis.toUpperCase()}
                </label>
                <input
                  type="range"
                  min="0"
                  max={currentMapUnits}
                  step="1000"
                  className="w-full accent-neutral-500"
                  value={player.location[axis] ?? 0}
                  onChange={(e) =>
                    onUpdatePlayerPos(index, axis, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
