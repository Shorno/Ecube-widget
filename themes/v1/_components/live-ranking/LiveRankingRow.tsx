"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TeamFlag from "@/components/common/TeamFlag";
import { getTeamDisplayLabel } from "@/lib/utils/teamDisplay";
import { getTeamFlagDisplay } from "@/lib/utils/teamFlag";
import type { LiveRankEntry } from "@/types/live-rank";
import EliminationFlash from "./EliminationFlash";
import PlayerStatusBars from "./PlayerStatusBars";
import {
  getLiveRankingLayout,
  LIVE_RANKING_RANK_WIDTH,
  LIVE_RANKING_ROW_HEIGHT,
} from "./layout";

function teamId(entry: LiveRankEntry) {
  return entry.team.id ?? entry.team._id ?? String(entry.rank);
}

function teamLogo(entry: LiveRankEntry) {
  return entry.team.logo ?? entry.team.logoImageUrl;
}

function isEliminated(players?: LiveRankEntry["players"]) {
  return (
    (players?.length ?? 0) > 0 &&
    players!.every((player) => player.liveState === 5)
  );
}

type Props = {
  entry: LiveRankEntry;
  rank: number;
  isObserved?: boolean;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
  showPoints?: boolean;
  className?: string;
};

export default function LiveRankingRow({
  entry,
  rank,
  isObserved = false,
  showTeamFlags = true,
  showFullTeamName = false,
  showPoints = true,
  className,
}: Props) {
  const eliminated = isEliminated(entry.players);
  const missing = entry.isMissing === true;
  const inactive = eliminated || missing;

  // Play the one-shot flash only when a team transitions alive -> eliminated.
  // Teams already eliminated on mount start in the resting grayed state.
  const wasEliminatedRef = useRef(eliminated);
  const [showEliminationFlash, setShowEliminationFlash] = useState(false);
  useEffect(() => {
    if (eliminated && !wasEliminatedRef.current) {
      setShowEliminationFlash(true);
    }
    wasEliminatedRef.current = eliminated;
  }, [eliminated]);

  const hasBlueZone =
    !inactive &&
    (entry.players?.some(
      (player) => player.isOutsideZone && player.liveState !== 5,
    ) ??
      false);
  const logo = teamLogo(entry);
  const layout = getLiveRankingLayout(showFullTeamName, showPoints);
  const teamLabel = getTeamDisplayLabel(entry.team, showFullTeamName);
  const flagDisplay = getTeamFlagDisplay(entry.team);
  const hasFlag = showTeamFlags && flagDisplay.kind !== "none";
  const observedBg = "var(--widget-secondary, #FFDD75)";
  const observedText = "var(--widget-text-2, var(--widget-primary, #00473C))";

  const identityWidth = LIVE_RANKING_RANK_WIDTH + layout.teamColWidth;
  const statsWidth = layout.panelWidth - identityWidth;
  const statsFontSize = 25;
  const statsLineHeight = 30;
  const identityCellHeight = LIVE_RANKING_ROW_HEIGHT;

  return (
    <div
      className={cn(
        "relative flex items-stretch overflow-hidden select-none",
        className,
      )}
      style={{ width: layout.panelWidth, height: LIVE_RANKING_ROW_HEIGHT }}
      data-flip-id={teamId(entry)}
    >
      <div
        className="relative flex shrink-0 items-stretch"
        style={{ width: identityWidth }}
      >
        <div
          className="font-secondary relative flex shrink-0 items-center justify-center overflow-hidden font-bold"
          style={{
            width: LIVE_RANKING_RANK_WIDTH,
            height: identityCellHeight,
            backgroundColor: isObserved
              ? observedBg
              : "var(--widget-primary, #00473C)",
            color: isObserved ? observedText : "var(--widget-text-3, #FFFFFF)",
            fontSize: `${statsFontSize}px`,
            lineHeight: `${statsLineHeight}px`,
          }}
        >
          {inactive && (
            <div className="pointer-events-none absolute inset-0 z-0 bg-black/25" />
          )}
          <span className="relative z-10">{rank}</span>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px"
            style={{
              backgroundColor: "var(--widget-secondary-dark, #C6A646)",
              opacity: 0.55,
            }}
          />
        </div>

        <div
          className={cn(
            "relative box-border flex shrink-0 items-center px-2",
            !isObserved && "border",
          )}
          style={{
            width: layout.teamColWidth,
            background: isObserved
              ? observedBg
              : "linear-gradient(90deg, var(--widget-gradient-from, #009980) 0%, var(--widget-primary, #00473C) 100%)",
            borderColor: "var(--widget-secondary-dark, #C6A646)",
            height: identityCellHeight,
          }}
        >
          {hasFlag && (
            <span className="mr-1.5 flex w-[24px] shrink-0 items-center justify-center">
              <TeamFlag team={entry.team} showTeamFlags={showTeamFlags} />
            </span>
          )}
          {logo && (
            <Image
              src={logo}
              alt={entry.team.name}
              width={22}
              height={22}
              className="mr-2 size-[22px] shrink-0 object-contain"
              unoptimized
            />
          )}
          <span
            className="font-secondary min-w-0 flex-1 truncate font-bold uppercase"
            style={{
              color: isObserved
                ? observedText
                : "var(--widget-text-3, #FFFFFF)",
              fontSize: `${statsFontSize}px`,
              lineHeight: `${statsLineHeight}px`,
            }}
          >
            {teamLabel}
          </span>

          {inactive && (
            <div className="pointer-events-none absolute inset-0 bg-black/45" />
          )}
        </div>

        {hasBlueZone && (
          <div
            className="pointer-events-none absolute inset-0 z-10 animate-pulse ring-2 ring-blue-400 ring-inset"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(147,197,253,0.5) 50%, rgba(59,130,246,0.5) 100%, transparent 100%)",
              animationDuration: "3s",
              animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              backfaceVisibility: "hidden",
              contain: "paint",
              transform: "translate3d(0, 0, 0)",
              willChange: "opacity",
            }}
          />
        )}
      </div>

      <div
        className="relative flex shrink-0 items-center overflow-hidden"
        style={{
          width: statsWidth,
          backgroundColor: "var(--widget-v1-forest, #003129)",
        }}
      >
        {missing ? (
          <div
            className="font-secondary absolute top-[6px] w-[42px] text-center font-bold text-[#ff3b30] uppercase"
            style={{
              left: layout.statsValues.barsLeft,
              fontSize: `${statsFontSize}px`,
              lineHeight: `${statsLineHeight}px`,
            }}
          >
            MISS
          </div>
        ) : (
          <div
            className="absolute top-[5px]"
            style={{ left: layout.statsValues.barsLeft }}
          >
            <PlayerStatusBars players={entry.players} />
          </div>
        )}

        {showPoints && (
          <div
            className="font-secondary text-widget-text-3 absolute top-[6px] w-[32px] text-center font-bold"
            style={{
              left: layout.statsValues.ptsLeft,
              fontSize: `${statsFontSize}px`,
              lineHeight: `${statsLineHeight}px`,
            }}
          >
            {String(entry.overAllPoints ?? 0).padStart(2, "0")}
          </div>
        )}

        <div
          className="font-secondary text-widget-text-3 absolute top-[6px] w-[32px] text-center font-bold"
          style={{
            left: layout.statsValues.elimsLeft,
            fontSize: `${statsFontSize}px`,
            lineHeight: `${statsLineHeight}px`,
          }}
        >
          {String(entry.kills ?? 0).padStart(2, "0")}
        </div>

        {inactive && (
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
        )}
      </div>

      {showEliminationFlash && (
        <EliminationFlash onDone={() => setShowEliminationFlash(false)} />
      )}
    </div>
  );
}
