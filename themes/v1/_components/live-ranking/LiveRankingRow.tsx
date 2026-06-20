import Image from "next/image";
import { cn } from "@/lib/utils";
import { getTeamFlagDisplay } from "@/lib/utils/teamFlag";
import type { LiveRankEntry } from "@/types/live-rank";
import PlayerStatusBars from "./PlayerStatusBars";

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

function TeamFlag({
  entry,
  showTeamFlags,
}: {
  entry: LiveRankEntry;
  showTeamFlags: boolean;
}) {
  if (!showTeamFlags) return null;

  const flag = getTeamFlagDisplay(entry.team);
  if (flag.kind === "none") return null;

  if (flag.kind === "emoji") {
    return (
      <span
        className="mr-1.5 shrink-0 text-[18px] leading-none"
        aria-hidden
      >
        {flag.value}
      </span>
    );
  }

  return (
    <Image
      src={flag.value}
      alt=""
      width={20}
      height={15}
      className="mr-1.5 h-[15px] w-[20px] shrink-0 object-cover"
      unoptimized
    />
  );
}

type Props = {
  entry: LiveRankEntry;
  rank: number;
  isObserved?: boolean;
  showTeamFlags?: boolean;
  className?: string;
};

export default function LiveRankingRow({
  entry,
  rank,
  isObserved = false,
  showTeamFlags = true,
  className,
}: Props) {
  const eliminated = isEliminated(entry.players);
  const missing =
    entry.isMissing && (!entry.players || entry.players.length === 0);
  const logo = teamLogo(entry);

  return (
    <div
      className={cn(
        "relative flex h-[40.625px] w-[350px] items-stretch select-none overflow-visible",
        eliminated && "opacity-75",
        className,
      )}
      data-flip-id={teamId(entry)}
    >
      {/* 1. Rank Column (Rectangle 57) */}
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

      {/* 2. Team Name Column (Rectangle 58) */}
      <div
        className={cn(
          "relative box-border flex w-[150px] shrink-0 items-center px-2 border border-widget-secondary-dark",
          isObserved && "ring-2 ring-widget-secondary ring-inset",
        )}
        style={{
          background: "linear-gradient(90deg, var(--widget-gradient-from, #009980) 0%, var(--widget-primary, #00473C) 100%)",
          borderColor: "var(--widget-secondary-dark, #C6A646)",
          marginTop: "-1.5px", // overlap borders cleanly
          height: "42px",
        }}
      >
        {missing ? (
          <span
            className="w-full text-center font-bold text-widget-status-knocked uppercase"
            style={{
              fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif",
              fontSize: "16px",
            }}
          >
            MISSING
          </span>
        ) : (
          <>
            <TeamFlag entry={entry} showTeamFlags={showTeamFlags} />
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
            {entry.team.clanTag ? (
              <span
                className="min-w-0 flex-1 truncate text-[18px] leading-none font-bold text-white uppercase"
                style={{ fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif" }}
              >
                {entry.team.clanTag}
              </span>
            ) : (
              <span
                className="min-w-0 flex-1 truncate text-[18px] leading-none font-bold text-white uppercase"
                style={{ fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif" }}
              >
                {entry.team.name}
              </span>
            )}
          </>
        )}

        {eliminated && (
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
        )}
      </div>

      {/* 3. Stats Column (Rectangle 287 / bars, points, elims) */}
      <div
        className="relative flex w-[152px] shrink-0 items-center overflow-hidden"
        style={{
          backgroundColor: "var(--widget-v1-forest, #003129)",
        }}
      >
        {!missing && (
          <>
            {/* Status Bars */}
            <div className="absolute left-[10px] top-[5px]">
              <PlayerStatusBars players={entry.players} />
            </div>

            {/* Points (PTS) */}
            <div
              className="absolute left-[66px] top-[6px] w-[32px] text-center font-bold text-white"
              style={{
                fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif",
                fontSize: "25px",
                lineHeight: "30px",
              }}
            >
              {String(entry.overAllPoints ?? 0).padStart(2, "0")}
            </div>

            {/* Eliminations (ELIMS) */}
            <div
              className="absolute left-[110px] top-[6px] w-[32px] text-center font-bold text-white"
              style={{
                fontFamily: "var(--widget-font-secondary), 'Agency FB', sans-serif",
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
