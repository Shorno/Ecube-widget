"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTeamElimination } from "@/hooks/widget-data";

const DEFAULT_PLAYER_IMAGE =
  "https://api.ecube.gg/images/defaults/default-player.png";

function DefaultEliminationOverlay({ data }) {
  const teamLabel = data.victimTeam.clanTag || data.victimTeam.name;
  const kills = data.victimTeam.kills ?? 0;
  const placement = data.placement ?? data.victimTeam.placement ?? 0;
  const logo = data.victimTeam.logo || DEFAULT_PLAYER_IMAGE;

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 320 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative h-24 overflow-hidden border-t-2 border-widget-secondary-dark bg-widget-secondary-dark"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative h-full w-full bg-widget-primary"
      >
        <div className="flex h-full w-full items-center justify-between px-3">
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            className="relative flex flex-col items-center"
          >
            <Image
              src={logo}
              alt={teamLabel}
              width={48}
              height={48}
              className="object-contain"
              unoptimized
            />
            <span className="mt-1 text-xs font-bold text-widget-text-3">
              #{placement}
            </span>
          </motion.div>
          <div className="flex flex-col items-center justify-center">
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              className="text-2xl leading-none font-bold text-widget-text-3 uppercase italic"
            >
              {kills} ELIMS
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
              className="my-1 h-0.5 w-full origin-center bg-widget-primary-accent"
            />
            <motion.h3
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
              className="text-lg leading-none font-bold tracking-widest text-widget-secondary uppercase italic"
            >
              ELIMINATED
            </motion.h3>
            <p className="mt-1 max-w-[120px] truncate text-[10px] text-widget-text-3 opacity-80">
              {teamLabel}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamEliminationView({ tournamentID, preview = false }) {
  const {
    currentElimination,
    isVisible,
    isLocked,
    triggerPreview,
    onExitComplete,
    preview: isPreview,
  } = useTeamElimination(tournamentID, { preview });

  return (
    <div className="relative h-screen bg-transparent">
      {isPreview && (
        <>
          <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
            Preview mode
          </div>
          <div className="fixed top-5 right-5 z-50">
            <button
              type="button"
              onClick={triggerPreview}
              disabled={isLocked}
              className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trigger Elimination
            </button>
          </div>
        </>
      )}

      <div className="absolute top-[20%] left-1/2 -translate-x-1/2">
        <AnimatePresence onExitComplete={onExitComplete}>
          {isVisible && currentElimination && (
            <DefaultEliminationOverlay
              key={`${currentElimination.victimTeam.id}-${currentElimination.placement}`}
              data={currentElimination}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
