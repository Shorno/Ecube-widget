import Image from "next/image";
import { cn } from "@/lib/utils";
import TeamFlag from "@/components/common/TeamFlag";
import { getTeamDisplayLabel } from "@/lib/utils/teamDisplay";
import type { LiveRankEntry } from "@/types/live-rank";
import PlayerStatusBars from "./PlayerStatusBars";
import { getLiveRankingLayout } from "./layout";

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
  const logo = teamLogo(entry);
  const layout = getLiveRankingLayout(showFullTeamName);
  const teamLabel = getTeamDisplayLabel(entry.team, showFullTeamName);

  return (
    <div
      className={cn(
        "relative flex h-[40.625px] items-stretch select-none overflow-visible",
        eliminated && "opacity-75",
        className,
      )}
      style={{ width: layout.panelWidth }}
      data-flip-id={teamId(entry)}
    >
      <div
        className="flex w-[48px] shrink-0 items-center justify-center font-bold"
        style={{
          backgroundColor: "var(--widget-primary, #00473C)",
          color: "var(--widget-secondary, #FFDD75)",
          fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif",
          fontSize: "25px",
          lineHeight: "30px",
        }}
      >
        {rank}
      </div>

      <div
        className={cn(
          "relative box-border flex shrink-0 items-center border border-widget-secondary-dark px-2",
          isObserved && "ring-2 ring-widget-secondary ring-inset",
        )}
        style={{
          width: layout.teamColWidth,
          background:
            "linear-gradient(90deg, var(--widget-gradient-from, #009980) 0%, var(--widget-primary, #00473C) 100%)",
          borderColor: "var(--widget-secondary-dark, #C6A646)",
          marginTop: "-1.5px",
          height: "42px",
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
            <TeamFlag
              team={entry.team}
              showTeamFlags={showTeamFlags}
              className="mr-1.5 shrink-0"
            />
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
              className="min-w-0 flex-1 truncate font-bold text-white uppercase"
              style={{
                fontFamily:
                  "var(--widget-font-secondary), 'Agency FB', sans-serif",
                fontSize: showFullTeamName ? "14px" : "18px",
                lineHeight: showFullTeamName ? "16px" : "18px",
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

      <div
        className="relative flex shrink-0 items-center overflow-hidden"
        style={{
          width: layout.panelWidth - layout.teamColWidth - 48,
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
                fontSize: "25px",
                lineHeight: "30px",
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
                fontSize: "25px",
                lineHeight: "30px",
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
