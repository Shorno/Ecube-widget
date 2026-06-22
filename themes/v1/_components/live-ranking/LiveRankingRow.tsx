import Image from "next/image";
import { cn } from "@/lib/utils";
import TeamFlag from "@/components/common/TeamFlag";
import { getTeamDisplayLabel } from "@/lib/utils/teamDisplay";
import { getTeamFlagDisplay } from "@/lib/utils/teamFlag";
import type { LiveRankEntry } from "@/types/live-rank";
import PlayerStatusBars from "./PlayerStatusBars";
import { getLiveRankingLayout, LIVE_RANKING_RANK_WIDTH, LIVE_RANKING_ROW_HEIGHT } from "./layout";

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

export default function LiveRankingRow({
  entry,
  rank,
  isObserved = false,
  showTeamFlags = true,
  showFullTeamName = false,
  className,
}: Props) {
  const eliminated = isEliminated(entry.players);
  const missing =
    entry.isMissing && (!entry.players || entry.players.length === 0);
  const hasBlueZone =
    entry.players?.some(
      (player) => player.isOutsideZone && player.liveState !== 5,
    ) ?? false;
  const logo = teamLogo(entry);
  const layout = getLiveRankingLayout(showFullTeamName);
  const teamLabel = getTeamDisplayLabel(entry.team, showFullTeamName);
  const flagDisplay = getTeamFlagDisplay(entry.team);
  const hasFlag = showTeamFlags && flagDisplay.kind !== "none";
  const observedBg = "var(--widget-secondary, #FFDD75)";
  const observedText = "var(--widget-primary, #00473C)";

  const identityWidth = LIVE_RANKING_RANK_WIDTH + layout.teamColWidth;
  const statsWidth = layout.panelWidth - identityWidth;
  const statsFontSize = 25;
  const statsLineHeight = 30;

  return (
    <div
      className={cn(
        "relative flex items-stretch select-none overflow-visible",
        eliminated && "opacity-75",
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
          className="flex shrink-0 items-center justify-center font-bold"
          style={{
            width: LIVE_RANKING_RANK_WIDTH,
            backgroundColor: isObserved
              ? observedBg
              : "var(--widget-primary, #00473C)",
            color: isObserved
              ? observedText
              : "var(--widget-secondary, #FFDD75)",
            fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif",
            fontSize: `${statsFontSize}px`,
            lineHeight: `${statsLineHeight}px`,
          }}
        >
          {rank}
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
            ...(isObserved ? {} : { marginTop: "-1.5px", height: "42px" }),
          }}
        >
          {missing ? (
            <span
              className="w-full text-center font-bold text-widget-status-knocked uppercase"
              style={{
                fontFamily:
                  "var(--widget-font-secondary), 'Agency FB', sans-serif",
                fontSize: "16px",
              }}
            >
              MISSING
            </span>
          ) : (
            <>
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
                className="min-w-0 flex-1 truncate font-bold uppercase"
                style={{
                  color: isObserved ? observedText : "#FFFFFF",
                  fontFamily:
                    "var(--widget-font-secondary), 'Agency FB', sans-serif",
                  fontSize: `${statsFontSize}px`,
                  lineHeight: `${statsLineHeight}px`,
                }}
              >
                {teamLabel}
              </span>
            </>
          )}

          {eliminated && (
            <div className="pointer-events-none absolute inset-0 bg-black/45" />
          )}
        </div>

        {hasBlueZone && (
          <div
            className="pointer-events-none absolute inset-0 z-10 animate-pulse ring-2 ring-blue-400 ring-inset"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(147,197,253,0.5) 50%, rgba(59,130,246,0.5) 100%, transparent 100%)",
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
        {!missing && (
          <>
            <div
              className="absolute top-[5px]"
              style={{ left: layout.statsValues.barsLeft }}
            >
              <PlayerStatusBars players={entry.players} />
            </div>

            <div
              className="absolute top-[6px] w-[32px] text-center font-bold text-white"
              style={{
                left: layout.statsValues.ptsLeft,
                fontFamily:
                  "var(--widget-font-secondary), 'Agency FB', sans-serif",
                fontSize: `${statsFontSize}px`,
                lineHeight: `${statsLineHeight}px`,
              }}
            >
              {String(entry.overAllPoints ?? 0).padStart(2, "0")}
            </div>

            <div
              className="absolute top-[6px] w-[32px] text-center font-bold text-white"
              style={{
                left: layout.statsValues.elimsLeft,
                fontFamily:
                  "var(--widget-font-secondary), 'Agency FB', sans-serif",
                fontSize: `${statsFontSize}px`,
                lineHeight: `${statsLineHeight}px`,
              }}
            >
              {String(entry.kills ?? 0).padStart(2, "0")}
            </div>
          </>
        )}

        {eliminated && (
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
        )}
      </div>
    </div>
  );
}
