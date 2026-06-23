"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FirstBloodPayload } from "@/types/first-blood";
import {
  ACHIEVEMENT_HEADER_GRADIENT,
  NAME_BAR_GRADIENT,
  PLAYER_PANEL_GRADIENT,
} from "../achievementGradients";

const DEFAULT_PLAYER_IMAGE = "/default-player.png";
const ELIMS_ICON = "/assets/head2head/target.svg";

type Props = {
  data: FirstBloodPayload;
};

export default function FirstBloodAchievementOverlay({ data }: Props) {
  const causer = data.causer;
  const playerImage = causer.player?.image || DEFAULT_PLAYER_IMAGE;
  const playerName = causer.player?.ign || causer.player?.name || "PLAYER";

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
            className="relative flex flex-col items-center justify-center gap-1 px-6 pt-1"
          >
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
                  src={ELIMS_ICON}
                  alt=""
                  width={96}
                  height={96}
                  className="h-[6.25rem] w-[6.25rem] object-contain brightness-0 invert"
                  unoptimized
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center leading-[0.9]"
                style={{ fontFamily: "var(--font-american-captain)" }}
              >
                <span className="font-primary text-[2.75rem] font-normal tracking-[0.06em] text-widget-text-3 uppercase">
                  First
                </span>
                <span className="font-primary text-[2.75rem] font-normal tracking-[0.06em] text-widget-text-3 uppercase">
                  Blood
                </span>
              </motion.div>
            </div>
          </motion.div>

          <div
            className="relative z-10 flex"
            style={{ height: bottomHeight, marginLeft: -shiftAmount }}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center bg-white"
              style={{ width: 110 }}
            >
              <div className="flex flex-col items-center justify-center leading-none text-black select-none">
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
