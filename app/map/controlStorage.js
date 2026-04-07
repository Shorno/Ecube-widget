import { MAPS } from "./constants";

export const MAP_CONTROL_STORAGE_KEY = "pubg-map-control-v1";

export const DEFAULT_MAP_CONTROL_STATE = {
  mapType: "Erangel",
  showGrid: false,
  logoStatus: "No team logos loaded.",
  teamLogoById: {},
};

export const sanitizeMapControlState = (raw) => {
  const next = {
    ...DEFAULT_MAP_CONTROL_STATE,
  };

  if (raw && typeof raw === "object") {
    if (typeof raw.mapType === "string" && MAPS[raw.mapType]) {
      next.mapType = raw.mapType;
    }
    next.showGrid = Boolean(raw.showGrid);
    if (typeof raw.logoStatus === "string") {
      next.logoStatus = raw.logoStatus;
    }
    if (raw.teamLogoById && typeof raw.teamLogoById === "object") {
      const safeTeamLogoMap = {};
      for (const [teamId, src] of Object.entries(raw.teamLogoById)) {
        if (!/^\d+$/.test(teamId)) continue;
        if (typeof src !== "string" || src.length === 0) continue;
        safeTeamLogoMap[teamId] = src;
      }
      next.teamLogoById = safeTeamLogoMap;
    }
  }

  return next;
};

export const readMapControlState = () => {
  if (typeof window === "undefined") return DEFAULT_MAP_CONTROL_STATE;

  try {
    const raw = window.localStorage.getItem(MAP_CONTROL_STORAGE_KEY);
    if (!raw) return DEFAULT_MAP_CONTROL_STATE;
    return sanitizeMapControlState(JSON.parse(raw));
  } catch {
    return DEFAULT_MAP_CONTROL_STATE;
  }
};

export const writeMapControlState = (state) => {
  if (typeof window === "undefined") return;

  const safeState = sanitizeMapControlState(state);
  window.localStorage.setItem(
    MAP_CONTROL_STORAGE_KEY,
    JSON.stringify(safeState),
  );
};
