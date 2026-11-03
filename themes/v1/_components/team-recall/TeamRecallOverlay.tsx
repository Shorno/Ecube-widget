"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTeamDisplayLabel } from "@/lib/utils/teamDisplay";
import type { TeamRecallPayload } from "@/types/team-recall";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";
const DEFAULT_TEAM_IMAGE =
  "https://api.ecube.gg/images/defaults/default-team.png";

/** Same token gradients as the team elimination banner. */
const SIDE_PANEL_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-secondary) 86%, white) 0%, var(--widget-secondary) 40%, color-mix(in srgb, var(--widget-secondary) 82%, black) 100%)";

const CENTER_PANEL_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-gradient-from) 80%, white) 0%, var(--widget-gradient-from) 20%, var(--widget-primary) 58%, var(--widget-primary-dark) 100%)";

const RECALLED_BAR_GRADIENT =
  "linear-gradient(180deg, color-mix(in srgb, var(--widget-primary-dark) 88%, white) 0%, var(--widget-primary-dark) 45%, color-mix(in srgb, var(--widget-primary-dark) 80%, black) 100%)";

const PLAYER_WIDTH = 116;
const PLAYER_IMAGE_HEIGHT = 100;
const SIDE_PANEL_WIDTH = 170;

// One spring for every layout change, so the banner widening and a late
// teammate sliding in move together instead of snapping.
const LAYOUT_TRANSITION = {
  type: "spring",
  stiffness: 320,
  damping: 32,
} as const;

type Props = {
  data: TeamRecallPayload;
  showFullTeamName?: boolean;
};

export default function TeamRecallOverlay({
  data,
  showFullTeamName = false,
}: Props) {
  const players = data.players.slice(0, 4);
  const teamLabel = data.team
    ? getTeamDisplayLabel(data.team, showFullTeamName)
    : "";
  const reviverName = data.reviver?.ign || data.reviver?.name || "";

  return (
    <motion.div
      layout
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", layout: LAYOUT_TRANSITION }}
      className="pointer-events-none"
    >
      <div className="flex overflow-hidden shadow-2xl">
        {/* Recalled players — left to right */}
        <motion.div
          layout
          initial={{ scaleX: 0.3, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
            ease: "easeOut",
            layout: LAYOUT_TRANSITION,
          }}
          style={{ originX: 0, background: CENTER_PANEL_GRADIENT }}
          className="relative flex flex-col"
        >
          <div className="flex flex-1 items-end px-3 pt-2">
            <AnimatePresence initial={false} mode="popLayout">
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.2 + i * 0.08,
                    ease: "easeOut",
                    layout: LAYOUT_TRANSITION,
                  }}
                  className="flex shrink-0 flex-col items-center"
                  style={{ width: PLAYER_WIDTH }}
                >
                  <div
                    className={cn(
                      "relative w-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]",
                      player.isDeadAfterRecall && "grayscale",
                    )}
                    style={{ height: PLAYER_IMAGE_HEIGHT }}
                  >
                    <Image
                      src={player.image || DEFAULT_PLAYER_IMAGE}
                      alt={player.ign || player.name}
                      fill
                      className="object-contain object-bottom"
                      unoptimized
                    />
                  </div>
                  <p className="font-primary text-widget-text-3 w-full truncate bg-black/35 px-1 text-center text-[15px] leading-[20px] font-bold tracking-wide uppercase">
                    {player.ign || player.name}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            layout
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.4,
              ease: "easeOut",
              layout: LAYOUT_TRANSITION,
            }}
            style={{ background: RECALLED_BAR_GRADIENT }}
            className="flex h-8 items-center justify-center"
          >
            <span className="font-primary text-widget-text-3 text-xl font-black tracking-[0.2em] uppercase">
              RECALLED
            </span>
          </motion.div>
        </motion.div>

        {/* Team logo + who recalled them */}
        <motion.div
          layout
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.35,
            delay: 0.15,
            ease: "easeOut",
            layout: LAYOUT_TRANSITION,
          }}
          style={{ background: SIDE_PANEL_GRADIENT, width: SIDE_PANEL_WIDTH }}
          className="flex shrink-0 flex-col items-center justify-center gap-1.5 px-3"
        >
          <Image
            src={data.team?.logo || DEFAULT_TEAM_IMAGE}
            alt={data.team?.name || "Team"}
            width={96}
            height={96}
            className="h-12 w-12 shrink-0 object-contain drop-shadow"
            unoptimized
          />
          {teamLabel && (
            <p className="font-primary text-widget-text-2 w-full truncate text-center text-[17px] leading-[19px] font-bold tracking-wide uppercase">
              {teamLabel}
            </p>
          )}
          {reviverName && (
            <>
              <div className="h-px w-10 bg-black/25" />
              <div className="text-widget-text-2 flex w-full flex-col items-center leading-none">
                <span className="text-[11px] font-black tracking-[0.18em] uppercase opacity-80">
                  RECALLED BY
                </span>
                <span className="font-primary mt-0.5 w-full truncate text-center text-[16px] font-bold uppercase">
                  {reviverName}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
