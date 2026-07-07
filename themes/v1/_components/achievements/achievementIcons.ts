// Single home for the static header icons every achievement banner renders.
// The overlays import their icon from here and AchievementsView preloads this
// exact list on mount — so adding an icon in one place both wires it up and
// warms it into cache. Without preloading, the first event of a given type
// fetches its icon from the network mid-animation and flashes a blank slot.

export const ELIMS_ICON = "/assets/head2head/target.svg";
export const GRENADE_ICON = "/assets/achievements/grenade.svg";
export const VEHICLE_ICON = "/assets/achievements/vehicle.svg";
export const AIRDROP_ICON = "/assets/match-summary/airdrop.svg";

export const ACHIEVEMENT_ICONS = [
  ELIMS_ICON,
  GRENADE_ICON,
  VEHICLE_ICON,
  AIRDROP_ICON,
];
