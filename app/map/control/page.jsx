"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ControlPanel from "../components/ControlPanel";
import {
  DEFAULT_MAP_CONTROL_STATE,
  readMapControlState,
  writeMapControlState,
} from "../controlStorage";

const TEAM_LOGO_FILE_PATTERN = /^(\d{3})\.png$/i;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else resolve("");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });

export default function MapControlPage() {
  const [controlState, setControlState] = useState(DEFAULT_MAP_CONTROL_STATE);

  useEffect(() => {
    const stored = readMapControlState();
    setControlState(stored);
    writeMapControlState(stored);
  }, []);

  const updateControlState = (patch) => {
    setControlState((prev) => {
      const next = { ...prev, ...patch };
      writeMapControlState(next);
      return next;
    });
  };

  const handleMapChange = (e) => {
    updateControlState({ mapType: e.target.value });
  };

  const handleGridToggle = (e) => {
    updateControlState({ showGrid: e.target.checked });
  };

  const handleLoadTeamLogos = async () => {
    if (typeof window === "undefined") return;

    if (!window.showDirectoryPicker) {
      updateControlState({
        logoStatus: "This browser does not support local file permissions.",
      });
      return;
    }

    try {
      updateControlState({
        logoStatus: "Select the folder that contains logo files...",
      });

      const logoDirHandle = await window.showDirectoryPicker();
      const loadedLogos = {};
      let matchedFileCount = 0;

      for await (const entry of logoDirHandle.values()) {
        if (!entry || entry.kind !== "file") continue;
        const nameMatch = entry.name.match(TEAM_LOGO_FILE_PATTERN);
        if (!nameMatch) continue;

        const teamId = Number(nameMatch[1]);
        if (!Number.isFinite(teamId) || teamId <= 0) continue;

        matchedFileCount += 1;

        try {
          const logoFile = await entry.getFile();
          const dataUrl = await fileToDataUrl(logoFile);
          if (dataUrl) loadedLogos[teamId] = dataUrl;
        } catch {
          // Missing files are skipped so partial packs still work.
        }
      }

      const loadedCount = Object.keys(loadedLogos).length;
      updateControlState({
        teamLogoById: loadedLogos,
        logoStatus:
          loadedCount > 0
            ? `Loaded ${loadedCount} team logos from folder.`
            : matchedFileCount > 0
              ? "Matching files found but none could be read."
              : "No logo files found. Expected names like 001.png, 002.png.",
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        updateControlState({ logoStatus: "Logo loading cancelled." });
        return;
      }
      updateControlState({ logoStatus: "Failed to load logo folder." });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-5 text-white">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/map"
          className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back To Map
        </Link>
        <p className="text-sm text-neutral-300">
          Controls are synced through LocalStorage.
        </p>
      </div>

      <ControlPanel
        mapType={controlState.mapType}
        showGrid={controlState.showGrid}
        logoStatus={controlState.logoStatus}
        onMapChange={handleMapChange}
        onGridToggle={handleGridToggle}
        onLoadTeamLogos={handleLoadTeamLogos}
      />
    </div>
  );
}
