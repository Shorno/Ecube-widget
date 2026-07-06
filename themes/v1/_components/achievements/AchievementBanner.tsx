"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ACHIEVEMENT_HEADER_GRADIENT,
  NAME_BAR_GRADIENT,
  PLAYER_PANEL_GRADIENT,
} from "./achievementGradients";

const DEFAULT_PLAYER_IMAGE = "/default-player.png";
const DEFAULT_TEAM_IMAGE =
  "https://api.ecube.gg/images/defaults/default-team.png";
const ELIMS_ICON = "/assets/head2head/target.svg";

type BannerPlayer = { image?: string; ign?: string; name?: string };
type BannerTeam = { logo?: string; name?: string };

type Props = {
  player?: BannerPlayer;
  team?: BannerTeam;
  /** Achievement label, e.g. "DOMINATION" or "FIRST BLOOD". */
  title: string;
  /** When provided, the header shows the kill-count block; otherwise icon + title. */
  kills?: number;
  /** Header icon; defaults to the elims target icon. */
  icon?: string;
};

/**
 * Shared achievement banner. Every achievement renders through this — the only
 * thing that differs is the header: pass `kills` for the count variant
 * (Rampage/Domination), omit it for the icon + title variant (First Blood).
 * Player panel, team badge, name bar, dimensions, animations and the
 * bottom-edge coverage all live here, so there is one home for every tweak.
 */
export default function AchievementBanner({
  player,
  team,
  title,
  kills,
  icon = ELIMS_ICON,
}: Props) {
  const playerImage = player?.image || DEFAULT_PLAYER_IMAGE;
  const playerName = player?.ign || player?.name || "PLAYER";
  const teamLogo = team?.logo || DEFAULT_TEAM_IMAGE;
  const teamName = team?.name || "TEAM";
  const showKills = typeof kills === "number";

  // Icon-variant title auto-fits its column. A long single word like
  // "GRENADIER" can't wrap across the 7ch cap, so it would overflow and clip.
  // Widen the cap to the longest word and shrink the font proportionally, which
  // keeps the pixel width constant. Titles whose longest word is <= 7 chars
  // (FIRST BLOOD, VEHICLE ELIM, AIR DROP LOOTED) are left exactly as before.
  const longestTitleWord = Math.max(
    ...title.split(/\s+/).map((word) => word.length),
  );
  const titleCapCh = Math.max(7, longestTitleWord);
  const titleFontRem = (2.75 * 7) / titleCapCh;

  const bannerWidth = 483;
  const leftWidth = 210;
  const rightWidth = bannerWidth - leftWidth;
  const topHeight = 160;
  const bottomHeight = 50;
  const logoBadgeSize = 68;
  // Center the square badge on the player-image / name-bar seam: the badge is
  // the first item in the bottom row, so its left edge lands at
  // leftWidth - shiftAmount. Half the badge width straddles the boundary.
  const shiftAmount = logoBadgeSize / 2;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none overflow-hidden shadow-2xl"
      style={{ width: `min(${bannerWidth}px, 92vw)` }}
    >
      <div className="flex" style={{ height: topHeight + bottomHeight }}>
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          style={{ background: PLAYER_PANEL_GRADIENT, width: leftWidth }}
          className="relative shrink-0 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 top-6"
          >
            <Image
              src={playerImage}
              alt={playerName}
              fill
              className="object-cover object-top scale-[1.3] origin-top"
              unoptimized
            />
          </motion.div>
        </motion.div>

        <div className="flex min-w-0 flex-col" style={{ width: rightWidth }}>
          <motion.div
            initial={{ scaleX: 0.4, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            style={{
              originX: 0,
              background: ACHIEVEMENT_HEADER_GRADIENT,
              height: topHeight,
            }}
            className={`relative flex flex-col items-center justify-center px-6 pt-1 ${
              showKills ? "gap-0" : "gap-1"
            }`}
          >
            {showKills ? (
              <>
                <div className="flex items-center justify-center gap-4 select-none">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.25,
                      type: "spring",
                      stiffness: 280,
                    }}
                    className="font-primary shrink-0 text-[7.5rem] font-normal leading-[0.75] text-widget-text-2"
                  >
                    {kills}
                  </motion.span>

                  <div className="mt-2 flex shrink-0 flex-col items-center gap-1">
                    <Image
                      src={icon}
                      alt=""
                      width={72}
                      height={72}
                      className="h-[4.5rem] w-[4.5rem] object-contain brightness-0"
                      unoptimized
                    />
                    <span
                      className="font-primary text-[0.9rem] font-bold tracking-[0.25em] text-widget-text-2 uppercase leading-none -mr-[0.25em]"
                    >
                      Elims
                    </span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
                  className="font-primary mt-1 w-full text-center text-[2.65rem] font-normal tracking-[0.05em] text-widget-text-2 uppercase leading-none"
                >
                  {title}
                </motion.div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-5 select-none">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 260,
                  }}
                  className="shrink-0"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={96}
                    height={96}
                    className="h-[6.25rem] w-[6.25rem] object-contain brightness-0"
                    unoptimized
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
                  className="font-primary text-center font-normal tracking-[0.06em] text-widget-text-2 uppercase leading-[0.9]"
                  style={{
                    maxWidth: `${titleCapCh}ch`,
                    fontSize: `${titleFontRem}rem`,
                  }}
                >
                  {title}
                </motion.div>
              </div>
            )}
          </motion.div>

          <div
            className="relative z-10 flex -mt-px"
            style={{ height: bottomHeight + 1, marginLeft: -shiftAmount }}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
              className="flex shrink-0 items-center justify-center self-end bg-widget-secondary shadow-lg"
              style={{
                width: logoBadgeSize,
                height: logoBadgeSize,
                marginBottom: -4,
              }}
            >
              <Image
                src={teamLogo}
                alt={teamName}
                width={60}
                height={60}
                className="h-[54px] w-[54px] object-contain"
                unoptimized
              />
            </motion.div>

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
              style={{ background: NAME_BAR_GRADIENT }}
              className="flex min-w-0 flex-1 items-center justify-center px-4"
            >
              <span className="font-secondary truncate text-[2.1rem] font-normal tracking-wide text-widget-text-3 uppercase">
                {playerName}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
