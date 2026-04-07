"use client";

import React from "react";
import { MAPS } from "../constants";

// Dropdown for choosing the active PUBG map.
export default function MapSelector({ value, onChange }) {
  return (
    <div className="rounded-lg bg-neutral-900 p-4">
      <label className="mb-2 block text-sm font-semibold text-neutral-300">
        Active Map
      </label>
      <select
        className="w-full rounded border border-neutral-600 bg-neutral-700 p-2 text-sm text-white outline-none"
        value={value ?? "Erangel"}
        onChange={onChange}
      >
        {Object.entries(MAPS).map(([key, map]) => (
          <option key={key} value={key}>
            {map.label}
          </option>
        ))}
      </select>
    </div>
  );
}
