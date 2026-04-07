"use client";

import React from "react";

const CIRCLE_FIELDS = [
  ["X", "X"],
  ["Y", "Y"],
  ["Size", "Diameter"],
];

// Controls for the blue zone and next safe zone circles.
export default function ZoneCirclesPanel({
  circles,
  currentMapUnits,
  onAddCircle,
  onRemoveCircle,
  onUpdateCircle,
  onTriggerShrink,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
      <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
        <h3 className="text-sm font-semibold text-neutral-300">Zone Circles</h3>
        <div className="flex gap-2">
          {circles.length < 2 && (
            <button
              onClick={onAddCircle}
              className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-500"
            >
              + Circle {circles.length + 1}
            </button>
          )}
          {circles.length > 0 && (
            <button
              onClick={onRemoveCircle}
              className="rounded bg-neutral-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-neutral-500"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {circles.length === 0 && (
        <p className="text-center text-xs text-neutral-500">
          No circles yet — click &quot;+ Circle 1&quot;
        </p>
      )}

      {circles.map((circle, i) => (
        <div key={i} className="rounded bg-neutral-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`text-xs font-bold ${i === 0 ? "text-blue-400" : "text-white"}`}
            >
              {i === 0 ? "Blue Zone (current)" : "Safe Zone (next)"}
            </span>
            {i === 0 && circles.length >= 2 && (
              <button
                onClick={onTriggerShrink}
                className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-500"
              >
                Simulate Shrink
              </button>
            )}
          </div>
          {CIRCLE_FIELDS.map(([prop, label]) => (
            <div key={prop} className="mt-1">
              <label className="text-[10px] text-neutral-400">{label}</label>
              <input
                type="range"
                min="0"
                max={
                  prop === "Size" ? currentMapUnits * 1.5 : currentMapUnits
                }
                step="1000"
                className={`w-full ${i === 0 ? "accent-blue-500" : "accent-white"}`}
                value={parseFloat(circle[prop]) ?? 0}
                onChange={(e) => onUpdateCircle(i, prop, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
