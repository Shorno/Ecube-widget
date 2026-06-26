"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TeamFlag from "@/components/common/TeamFlag";
import { getTeamFlagDisplay } from "@/lib/utils/teamFlag";
import { getTeamDisplayLabel } from "@/lib/utils/teamDisplay";
import type { TeamEliminationPayload } from "@/types/team-elimination";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";
const PUBG_LOGO = "/assets/team-elimination/pubg-mobile-logo.png";

/** Token-only vertical gradients — subtle light top, slightly deeper bottom */
const SIDE_PANEL_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-status-knocked) 86%, white) 0%, var(--widget-status-knocked) 40%, color-mix(in srgb, var(--widget-status-knocked) 82%, black) 100%)";

const CENTER_PANEL_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-gradient-from) 80%, white) 0%, var(--widget-gradient-from) 20%, var(--widget-primary) 58%, var(--widget-primary-dark) 100%)";

const ELIMINATED_BAR_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-primary-dark) 88%, white) 0%, var(--widget-primary-dark) 45%, color-mix(in srgb, var(--widget-primary-dark) 80%, black) 100%)";

type Props = {
  data: TeamEliminationPayload;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
};

function getPlayerImages(data: TeamEliminationPayload): string[] {
  const fromTeam = data.victimTeam.players?.map((p) => p.image) ?? [];
  return Array.from({ length: 4 }, (_, i) => fromTeam[i] ?? DEFAULT_PLAYER_IMAGE);
}

function getPlacement(data: TeamEliminationPayload): number {
  return data.placement ?? data.victimTeam.placement ?? 0;
}

export default function TeamEliminationOverlay({
  data,
  showTeamFlags = true,
  showFullTeamName = false,
}: Props) {
  const playerImages = getPlayerImages(data);
  const placement = getPlacement(data);
  const teamLabel = getTeamDisplayLabel(data.victimTeam, showFullTeamName);
  const kills = data.victimTeam.kills ?? 0;
  const logoSrc = data.victimTeam.logo || DEFAULT_PLAYER_IMAGE;
  const [pubgLogoFailed, setPubgLogoFailed] = useState(false);
  const centerLogo = pubgLogoFailed ? logoSrc : PUBG_LOGO;
  const flagVisible =
    showTeamFlags && getTeamFlagDisplay(data.victimTeam).kind !== "none";
  const leftPanelWidth = 120;
  const bannerWidth = 544;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none"
      style={{ width: `min(${bannerWidth}px, 92vw)` }}
    >
      <div className="flex h-[115px] overflow-hidden shadow-2xl">
        {/* Left accent panel */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          style={{ background: SIDE_PANEL_GRADIENT, width: leftPanelWidth }}
          className="relative flex shrink-0 flex-col items-center justify-between px-2 py-2"
        >
          <div className="flex flex-col items-center justify-center gap-1 w-full min-h-[32px] px-1">
            <p
              className="font-primary min-w-0 font-bold leading-tight tracking-wide text-widget-text-3 uppercase text-center line-clamp-2 w-full"
              style={{
                fontSize: showFullTeamName ? "11px" : "13px",
                lineHeight: showFullTeamName ? "12px" : "14px",
              }}
            >
              {teamLabel}
            </p>
            {flagVisible && (
              <TeamFlag
                team={data.victimTeam}
                showTeamFlags={showTeamFlags}
                className="shrink-0"
                imageClassName="h-[14px] w-[20px] rounded-[1px] shadow-sm"
              />
            )}
          </div>
          <div className="relative h-8 w-full">
            <Image
              src={centerLogo}
              alt="PUBG Mobile"
              width={64}
              height={32}
              className="mx-auto h-8 w-auto object-contain"
              onError={() => setPubgLogoFailed(true)}
              unoptimized
            />
          </div>
          <p
            className="text-sm font-black tracking-tight text-widget-secondary uppercase italic"
            style={{
              fontFamily:
                "var(--widget-font-secondary), 'Agency FB', sans-serif",
            }}
          >
            {kills} ELIM
          </p>
        </motion.div>

        {/* Center panel */}
        <motion.div
          initial={{ scaleX: 0.3, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          style={{
            originX: 0.5,
            background: CENTER_PANEL_GRADIENT,
          }}
          className="relative flex min-w-0 flex-1 flex-col"
        >
          <div className="flex flex-1 items-end justify-center gap-0.5 pb-0.5 pt-1">
            {playerImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.25 + i * 0.08,
                  ease: "easeOut",
                }}
                className="relative h-[80px] flex-1 overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Player ${i + 1}`}
                  fill
                  className="object-cover object-top scale-[1.4] origin-top"
                  unoptimized
                />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
            style={{ background: ELIMINATED_BAR_GRADIENT }}
            className="flex h-7 items-center justify-center"
          >
            <span
              className={cn(
                "font-primary text-lg font-black tracking-[0.2em] text-widget-text-3 uppercase",
              )}
            >
              ELIMINATED
            </span>
          </motion.div>
        </motion.div>

        {/* Right accent panel */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          style={{ background: SIDE_PANEL_GRADIENT, width: leftPanelWidth }}
          className="flex shrink-0 items-center justify-center"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.35,
              type: "spring",
              stiffness: 260,
            }}
            className="font-primary text-4xl font-black text-widget-text-3 italic"
          >
            #{placement}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
