"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { TeamEliminationPayload } from "@/types/team-elimination";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";
const PUBG_LOGO = "/assets/team-elimination/pubg-mobile-logo.png";

type Props = {
  data: TeamEliminationPayload;
};

function getPlayerImages(data: TeamEliminationPayload): string[] {
  const fromTeam = data.victimTeam.players?.map((p) => p.image) ?? [];
  return Array.from({ length: 4 }, (_, i) => fromTeam[i] ?? DEFAULT_PLAYER_IMAGE);
}

function getPlacement(data: TeamEliminationPayload): number {
  return data.placement ?? data.victimTeam.placement ?? 0;
}

function getTeamLabel(data: TeamEliminationPayload): string {
  return data.victimTeam.clanTag || data.victimTeam.name;
}

export default function TeamEliminationOverlay({ data }: Props) {
  const playerImages = getPlayerImages(data);
  const placement = getPlacement(data);
  const teamLabel = getTeamLabel(data);
  const kills = data.victimTeam.kills ?? 0;
  const logoSrc = data.victimTeam.logo || DEFAULT_PLAYER_IMAGE;
  const [pubgLogoFailed, setPubgLogoFailed] = useState(false);
  const centerLogo = pubgLogoFailed ? logoSrc : PUBG_LOGO;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none w-[min(1100px,92vw)]"
    >
      <div className="flex h-[140px] overflow-hidden shadow-2xl">
        {/* Left red panel */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="flex w-[140px] shrink-0 flex-col items-center justify-between bg-[#D42027] px-2 py-3"
        >
          <p className="w-full truncate text-center text-[11px] font-bold tracking-wide text-white uppercase">
            {teamLabel}
          </p>
          <div className="relative h-10 w-full">
            <Image
              src={centerLogo}
              alt="PUBG Mobile"
              width={80}
              height={40}
              className="mx-auto h-10 w-auto object-contain"
              onError={() => setPubgLogoFailed(true)}
              unoptimized
            />
          </div>
          <p className="text-lg font-black tracking-tight text-white uppercase italic">
            {kills} ELIM
          </p>
        </motion.div>

        {/* Center navy panel */}
        <motion.div
          initial={{ scaleX: 0.3, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          style={{ originX: 0.5 }}
          className="relative flex min-w-0 flex-1 flex-col bg-[#1a2744]"
        >
          <div className="flex flex-1 items-end justify-center gap-1 px-4 pb-1 pt-2">
            {playerImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.08, ease: "easeOut" }}
                className="relative h-[90px] flex-1 max-w-[120px]"
              >
                <Image
                  src={src}
                  alt={`Player ${i + 1}`}
                  fill
                  className="object-contain object-bottom"
                  unoptimized
                />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
            className="flex h-9 items-center justify-center bg-[#0f1829]"
          >
            <span className="text-2xl font-black tracking-[0.25em] text-white uppercase">
              ELIMINATED
            </span>
          </motion.div>
        </motion.div>

        {/* Right red panel */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="flex w-[120px] shrink-0 items-center justify-center bg-[#D42027]"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35, type: "spring", stiffness: 260 }}
            className="text-5xl font-black italic text-white"
          >
            #{placement}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
