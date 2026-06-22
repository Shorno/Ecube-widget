import { h } from "../utils";

export const fontDefaults = {
  primary: "american-captain",
  secondary: "agency-fb",
};

export const defaults = {
  // bg/text/border-widget-primary
  primary: h("#00473C"),
  // bg/text-widget-primary-dark
  primaryDark: h("#00332B"),
  // bg/text-widget-primary-accent
  primaryAccent: h("#00AD91"),
  // bg/text-widget-secondary
  secondary: h("#FFDD75"),
  // bg/text-widget-secondary-dark
  secondaryDark: h("#C6A646"),
  // bg/text-widget-secondary-accent
  secondaryAccent: h("#D4BC75"),
  // text-widget-text-1
  text1: h("#000000"),
  // text-widget-text-2
  text2: h("#00473C"),
  // text-widget-text-3
  text3: h("#ffffff"),
  // bg-widget-bg
  bg: h("#ffffff"),
  // from-widget-gradient-from + to-widget-gradient-to + bg-gradient-to-br
  gradientFrom: h("#009980"),
  gradientTo: h("#00332B"),
  gradientAngle: "135deg",
  // bg/text-widget-status-alive
  statusAlive: h("#00FFD5"),
  // bg/text-widget-status-knocked
  statusKnocked: h("#FF0000"),
  // bg/text-widget-status-dead
  statusDead: h("#4E4E4E"),
  // bg/text/border-widget-v1-forest
  v1Forest: h("#00332B"),
  // Top-four WWCD bar fills
  v1WwcdFrom: h("#4F63CE"),
  v1WwcdTo: h("#3C41B4"),
};
