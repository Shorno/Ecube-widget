"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PlayerAchievementPayload } from "@/types/player-achievement";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";
const DEFAULT_TEAM_LOGO =
  "https://api.ecube.gg/images/defaults/default-team.png";
const PUBG_LOGO = "/assets/team-elimination/pubg-mobile-logo.png";
const ELIMS_ICON = "/assets/head2head/target.svg";

const LEFT_PANEL_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-primary) 82%, white) 0%, var(--widget-primary) 45%, var(--widget-primary-dark) 100%)";

const RIGHT_PANEL_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-status-dead) 88%, white) 0%, var(--widget-status-dead) 40%, color-mix(in srgb, var(--widget-status-dead) 85%, black) 100%)";

const NAME_BAR_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-primary) 80%, white) 0%, var(--widget-primary) 50%, var(--widget-primary-dark) 100%)";

type Props = {
  data: PlayerAchievementPayload;
};

export default function RampageAchievementOverlay({ data }: Props) {
  const playerImage = data.player?.image || DEFAULT_PLAYER_IMAGE;
  const teamLogo = data.team?.logo || DEFAULT_TEAM_LOGO;
  const playerName = data.player?.ign || data.player?.name || "PLAYER";
  const kills = data.kills ?? 0;
  const [pubgLogoFailed, setPubgLogoFailed] = useState(false);
  const logoSrc = pubgLogoFailed ? teamLogo : PUBG_LOGO;

  const bannerWidth = 520;
  const leftWidth = 200;
  const rightWidth = bannerWidth - leftWidth;
  const topHeight = 88;
  const bottomHeight = 36;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none overflow-hidden shadow-2xl"
      style={{ width: `min(${bannerWidth}px, 92vw)` }}
    >
      <div
        className="flex"
        style={{ height: topHeight + bottomHeight }}
      >
        {/* Left — player portrait */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          style={{ background: LEFT_PANEL_GRADIENT, width: leftWidth }}
          className="relative shrink-0 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 top-2"
          >
            <Image
              src={playerImage}
              alt={playerName}
              fill
              className="object-cover object-top scale-[1.35] origin-top"
              unoptimized
            />
          </motion.div>
        </motion.div>

        {/* Right column */}
        <div
          className="flex min-w-0 flex-col"
          style={{ width: rightWidth }}
        >
          {/* Top — kills + RAMPAGE */}
          <motion.div
            initial={{ scaleX: 0.4, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            style={{
              originX: 0,
              background: RIGHT_PANEL_GRADIENT,
              height: topHeight,
            }}
            className="relative flex items-center gap-3 px-4"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.35,
                delay: 0.25,
                type: "spring",
                stiffness: 280,
              }}
              className="font-primary shrink-0 text-5xl font-black leading-none text-widget-text-3"
            >
              {kills}
            </motion.span>

            <div className="flex shrink-0 flex-col items-center gap-0.5">
              <Image
                src={ELIMS_ICON}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain brightness-0 invert"
                unoptimized
              />
              <span className="font-primary text-[10px] font-bold tracking-widest text-widget-text-3 uppercase">
                Elims
              </span>
            </div>

            <motion.span
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
              className="font-primary min-w-0 flex-1 truncate text-2xl font-black tracking-wide text-widget-text-3 uppercase"
            >
              {data.achievement}
            </motion.span>
          </motion.div>

          {/* Bottom — team logo + player name */}
          <div className="flex" style={{ height: bottomHeight }}>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
              className="flex w-10 shrink-0 items-center justify-center bg-white"
            >
              <Image
                src={logoSrc}
                alt="Team"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
                onError={() => setPubgLogoFailed(true)}
                unoptimized
              />
            </motion.div>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
              style={{ background: NAME_BAR_GRADIENT }}
              className="flex min-w-0 flex-1 items-center px-3"
            >
              <span className="font-primary truncate text-sm font-bold tracking-wide text-widget-text-3 uppercase">
                {playerName}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
