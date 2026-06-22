"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import TeamFlag from "@/components/common/TeamFlag";
import { getTeamDisplayLabel } from "@/lib/utils/teamDisplay";
import { getTeamFlagDisplay } from "@/lib/utils/teamFlag";
import type { LiveRankEntry } from "@/types/live-rank";
import PlayerStatusBars from "../live-ranking/PlayerStatusBars";
import TopFourCardShape from "./TopFourCardShape";
import TopFourWwcdBar from "./TopFourWwcdBar";
import {
  TOP_FOUR_CARD_HEIGHT,
  TOP_FOUR_CARD_WIDTH,
  TOP_FOUR_WWCD_GAP,
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
  className?: string;
};

export default function TopFourCard({
  entry,
  rank,
  isObserved = false,
  showTeamFlags = true,
  showFullTeamName = false,
  className,
}: Props) {
  const eliminated = isEliminated(entry.players);
  const logo = teamLogo(entry);
  const teamLabel = getTeamDisplayLabel(entry.team, showFullTeamName);
  const flagDisplay = getTeamFlagDisplay(entry.team);
  const hasFlag = showTeamFlags && flagDisplay.kind !== "none";
  const hasWinProb = entry.winProbability != null;
  const observedBg = "var(--widget-secondary, #FFDD75)";
  const observedText = "var(--widget-primary, #00473C)";

  return (
    <div
      className={cn("top-four-card relative flex shrink-0 flex-col", className)}
      style={{ width: TOP_FOUR_CARD_WIDTH, gap: TOP_FOUR_WWCD_GAP }}
      data-flip-id={teamId(entry)}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: TOP_FOUR_CARD_WIDTH, height: TOP_FOUR_CARD_HEIGHT }}
      >
        <TopFourCardShape />

        <div className="relative z-10 flex h-full items-center pl-6 pr-8">
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2",
              isObserved && "rounded-sm px-1",
            )}
            style={
              isObserved
                ? { backgroundColor: observedBg, color: observedText }
                : undefined
            }
          >
            {hasFlag && (
              <TeamFlag
                team={entry.team}
                showTeamFlags={showTeamFlags}
                className="h-[22px] w-[30px] shrink-0"
              />
            )}
            {logo && (
              <Image
                src={logo}
                alt={entry.team.name}
                width={40}
                height={40}
                className="shrink-0 object-contain"
                unoptimized
              />
            )}
            <span
              className={cn(
                "min-w-0 truncate font-primary font-bold uppercase",
                !isObserved && "text-widget-text-3",
              )}
              style={{ fontSize: 22, lineHeight: "26px" }}
            >
              {teamLabel}
            </span>
          </div>

          <PlayerStatusBars
            players={entry.players}
            size="large"
            className="shrink-0"
          />
        </div>

        {eliminated && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-black/60" />
        )}
      </div>

      {hasWinProb && (
        <TopFourWwcdBar winProbability={entry.winProbability!} />
      )}
    </div>
  );
}
