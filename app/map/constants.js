// Canvas is a fixed-size logical surface; CSS scales it to the viewport.
export const CANVAS_SIZE = 1080;

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
    src: `${BASE_URL}/Erangel_Main_Low_Res.png`,
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
  // Continue palette cycling for lobbies with team IDs beyond 22.
  23: "rgba(225, 98, 9, 1)",
  24: "rgba(32, 150, 209, 1)",
  25: "rgba(74, 20, 140, 1)",
};

// Builds default plane path and empty circle state for a selected map size.
export const defaultGameInfo = (mapSize) => ({
  CircleArray: [],
  PlaneStartLocX: String(Math.round(mapSize * 0.2)),
  PlaneStartLocY: String(Math.round(mapSize * 0.1)),
  PlaneStopLocX: String(Math.round(mapSize * 0.8)),
  PlaneStopLocY: String(Math.round(mapSize * 0.9)),
});

// liveState values that represent a player we want to render on the minimap.
export const VISIBLE_LIVE_STATES = [0, 2, 3, 4, 6];
