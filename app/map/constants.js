// Canvas is a fixed-size logical surface; CSS scales it to the viewport.
export const CANVAS_SIZE = 1080;

// Observer feeds commonly use ~125s for the plane phase.
// Keep this configurable for tournaments that use different timings.
const envPlaneDuration = Number(process.env.NEXT_PUBLIC_PCOB_PLANE_DURATION_MS);
export const PLANE_DURATION_MS =
  Number.isFinite(envPlaneDuration) && envPlaneDuration > 0
    ? envPlaneDuration
    : 125000;

// Plane path visualization tuning.
// Hide first 2.5 lakh cm from the real start, then render next 6 lakh cm
// (visible segment is 2.5 lakh -> 8.5 lakh from actual start).
export const PLANE_START_OFFSET_CM = 250000;
// Visible segment length.
// 6 lakh cm = 600000 cm.
export const PLANE_PATH_LENGTH_CM = 618000;

// Map sizes are in centimetres (Unreal Engine units).
// 1 km = 100 000 cm. All values verified against PUBG official API telemetry docs.
// Erangel/Miramar/Taego/Deston/Rondo: 8.16 km × 8.16 km = 816 000 cm
// Sanhok: exactly half of Erangel = 408 000 cm (4.08 km)
// Vikendi (original 6 km version used in Mobile): 612 000 cm (6.12 km)
// Karakin: 204 000 cm (2.04 km)
const BASE_URL =
  "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps";

export const MAPS = {
  Erangel: {
    src: `/Erangel_Main_High_Res.png`,
    name: "Erangel",
    size: 816000,
    label: "Erangel (8.16km)",
  },
  Miramar: {
    src: `${BASE_URL}/Miramar_Main_Low_Res.png`,
    name: "Miramar",
    size: 816000,
    label: "Miramar (8.16km)",
  },
  Vikendi: {
    src: `${BASE_URL}/Vikendi_Main_Low_Res.png`,
    name: "Vikendi",
    size: 612000,
    label: "Vikendi (6.12km)",
  },
  Sanhok: {
    src: `${BASE_URL}/Sanhok_Main_Low_Res.png`,
    name: "Sanhok",
    size: 408000,
    label: "Sanhok (4.08km)",
  },
  Taego: {
    src: `${BASE_URL}/Taego_Main_Low_Res.png`,
    name: "Taego",
    size: 816000,
    label: "Taego (8.16km)",
  },
  Karakin: {
    src: `${BASE_URL}/Karakin_Main_Low_Res.png`,
    name: "Karakin",
    size: 204000,
    label: "Karakin (2.04km)",
  },
  Rondo: {
    src: `${BASE_URL}/Rondo_Main_Low_Res.png`,
    name: "Rondo",
    size: 816000,
    label: "Rondo (8.16km)",
  },
};

// Team palette from match feed design spec.
// API teamId is 1-based, so teamId 20 maps directly to key 20 below.
export const TEAM_COLOR_BY_ID = {
  1: "rgba(13, 71, 161, 1)",
  2: "rgba(183, 6, 15, 1)",
  3: "rgba(225, 98, 9, 1)",
  4: "rgba(32, 150, 209, 1)",
  5: "rgba(74, 20, 140, 1)",
  6: "rgba(159, 43, 20, 1)",
  7: "rgba(72, 106, 0, 1)",
  8: "rgba(198, 26, 86, 1)",
  9: "rgba(156, 102, 34, 1)",
  10: "rgba(130, 0, 69, 1)",
  11: "rgba(213, 177, 21, 1)",
  12: "rgba(74, 179, 175, 1)",
  13: "rgba(107, 130, 141, 1)",
  14: "rgba(243, 151, 0, 1)",
  15: "rgba(55, 71, 79, 1)",
  16: "rgba(224, 100, 142, 1)",
  17: "rgba(72, 106, 0, 1)",
  18: "rgba(198, 26, 86, 1)",
  19: "rgba(156, 102, 34, 1)",
  20: "rgba(130, 0, 69, 1)",
  21: "rgba(13, 71, 161, 1)",
  22: "rgba(183, 6, 15, 1)",
  23: "rgba(246, 121, 34, 1)",
  24: "rgba(63, 171, 225, 1)",
  25: "rgba(88, 24, 168, 1)",
};

// Builds default plane path and empty circle state for a selected map size.
export const defaultGameInfo = (_mapSize) => ({
  CircleArray: [],
  PlaneStartLocX: "0",
  PlaneStartLocY: "0",
  PlaneStopLocX: "0",
  PlaneStopLocY: "0",
});

// liveState values that represent a player we want to render on the minimap.
export const VISIBLE_LIVE_STATES = [0, 1, 2, 3, 4, 6];
