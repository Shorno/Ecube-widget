"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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

// Depth layering for the four busts — the middle pair sits in front (full size,
// higher stacking, drop shadow), the outer pair tucks behind (smaller, dimmed).
// Negative `overlap` pulls each bust over its neighbour so silhouettes overlap
// instead of leaving a hard seam between them.
const PLAYER_LAYERS = [
  { scale: 0.82, z: 10, overlap: 0, back: true },
  { scale: 1, z: 30, overlap: -28, back: false },
  { scale: 1, z: 30, overlap: -28, back: false },
  { scale: 0.82, z: 10, overlap: -28, back: true },
];

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
  showFullTeamName = false,
}: Props) {
  const playerImages = getPlayerImages(data);
  const placement = getPlacement(data);
  const teamLabel = getTeamDisplayLabel(data.victimTeam, showFullTeamName);
  const kills = data.victimTeam.kills ?? 0;
  const logoSrc = data.victimTeam.logo || DEFAULT_PLAYER_IMAGE;
  const [pubgLogoFailed, setPubgLogoFailed] = useState(false);
  const sidePanelWidth = 140;
  const bannerWidth = 620;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none"
      style={{ width: `min(${bannerWidth}px, 94vw)` }}
    >
      <div className="flex h-[128px] overflow-hidden shadow-2xl">
        {/* Left panel — team identity */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          style={{ background: SIDE_PANEL_GRADIENT, width: sidePanelWidth }}
          className="relative flex shrink-0 flex-col items-center justify-center gap-2.5 px-2 py-2.5"
        >
          <Image
            src={logoSrc}
            alt={data.victimTeam.name}
            width={96}
            height={96}
            className="h-20 w-20 shrink-0 object-contain drop-shadow"
            unoptimized
          />
          <p
            className="font-primary min-w-0 w-full text-center font-bold leading-tight tracking-wide text-widget-text-3 uppercase line-clamp-2"
            style={{
              fontSize: showFullTeamName ? "14px" : "17px",
              lineHeight: showFullTeamName ? "15px" : "18px",
            }}
          >
            {teamLabel}
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
          {!pubgLogoFailed && (
            <div className="pointer-events-none absolute inset-x-0 top-1 z-10 flex justify-center">
              <Image
                src={PUBG_LOGO}
                alt="PUBG Mobile"
                width={72}
                height={20}
                className="h-[18px] w-auto object-contain opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                onError={() => setPubgLogoFailed(true)}
                unoptimized
              />
            </div>
          )}
          <div className="relative flex flex-1 items-end justify-center pt-1">
            {playerImages.map((src, i) => {
              const layer = PLAYER_LAYERS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.25 + i * 0.08,
                    ease: "easeOut",
                  }}
                  className="relative h-[96px] w-[92px] shrink-0"
                  style={{ zIndex: layer.z, marginLeft: layer.overlap }}
                >
                  <div
                    className={cn(
                      "relative h-full w-full",
                      layer.back
                        ? "brightness-[0.82]"
                        : "drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]",
                    )}
                    style={{
                      transform: `scale(${layer.scale})`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Player ${i + 1}`}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
            style={{ background: ELIMINATED_BAR_GRADIENT }}
            className="flex h-8 items-center justify-center"
          >
            <span
              className={cn(
                "font-primary text-xl font-black tracking-[0.2em] text-widget-text-3 uppercase",
              )}
            >
              ELIMINATED
            </span>
          </motion.div>
        </motion.div>

        {/* Right panel — result (placement + elims) */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          style={{ background: SIDE_PANEL_GRADIENT, width: sidePanelWidth }}
          className="flex shrink-0 flex-col items-center justify-center gap-1.5 px-2"
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
            className="font-primary text-4xl font-black leading-none text-widget-text-3 italic"
          >
            #{placement}
          </motion.span>
          <div className="h-px w-10 bg-white/30" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.5,
              type: "spring",
              stiffness: 260,
            }}
            className="flex flex-col items-center leading-none text-widget-secondary"
            style={{
              fontFamily:
                "var(--widget-font-secondary), 'Agency FB', sans-serif",
            }}
          >
            <span className="text-4xl font-black leading-none">{kills}</span>
            <span className="mt-0.5 text-[11px] font-black tracking-[0.18em] uppercase">
              ELIMS
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
