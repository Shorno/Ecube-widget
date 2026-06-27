"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PlayerAchievementPayload } from "@/types/player-achievement";
import {
  ACHIEVEMENT_HEADER_GRADIENT,
  NAME_BAR_GRADIENT,
  PLAYER_PANEL_GRADIENT,
} from "../achievementGradients";

const DEFAULT_PLAYER_IMAGE = "/default-player.png";
const ELIMS_ICON = "/assets/head2head/target.svg";

type Props = {
  data: PlayerAchievementPayload;
};

export default function RampageAchievementOverlay({ data }: Props) {
  const playerImage = data.player?.image || DEFAULT_PLAYER_IMAGE;
  const playerName = data.player?.ign || data.player?.name || "PLAYER";
  const kills = data.kills ?? 0;

  const bannerWidth = 483;
  const leftWidth = 210;
  const rightWidth = bannerWidth - leftWidth;
  const topHeight = 160;
  const bottomHeight = 50;
  const shiftAmount = 37;

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
            className="relative flex flex-col items-center justify-center gap-0 px-6 pt-1"
          >
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
                className="font-primary shrink-0 text-[7.5rem] font-normal leading-[0.75] text-widget-text-3"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                {kills}
              </motion.span>

              <div className="mt-2 flex shrink-0 flex-col items-center gap-1">
                <Image
                  src={ELIMS_ICON}
                  alt=""
                  width={72}
                  height={72}
                  className="h-[4.5rem] w-[4.5rem] object-contain brightness-0 invert"
                  unoptimized
                />
                <span
                  className="font-primary text-[0.9rem] font-bold tracking-[0.25em] text-widget-text-3 uppercase leading-none -mr-[0.25em]"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  Elims
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
              className="font-primary mt-1 w-full text-center text-[2.65rem] font-normal tracking-[0.05em] text-widget-text-3 uppercase leading-none"
              style={{ fontFamily: "var(--font-american-captain)" }}
            >
              {data.achievement}
            </motion.div>
          </motion.div>

          <div
            className="relative z-10 flex"
            style={{ height: bottomHeight, marginLeft: -shiftAmount }}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center bg-widget-bg"
              style={{ width: 110 }}
            >
              <div className="flex flex-col items-center justify-center leading-none text-widget-text-1 select-none">
                <span
                  className="text-[1.9rem] font-normal leading-[0.85] uppercase"
                  style={{ fontFamily: "var(--font-american-captain)" }}
                >
                  PUBG
                </span>
                <span className="mt-0.5 font-sans text-[0.55rem] font-extrabold tracking-[0.25em] leading-[0.95] uppercase -mr-[0.25em]">
                  MOBILE
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
              style={{ background: NAME_BAR_GRADIENT }}
              className="flex min-w-0 flex-1 items-center justify-center px-4"
            >
              <span
                className="font-primary truncate text-[2.1rem] font-normal tracking-wide text-widget-text-3 uppercase"
                style={{ fontFamily: "var(--font-american-captain)" }}
              >
                {playerName}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
