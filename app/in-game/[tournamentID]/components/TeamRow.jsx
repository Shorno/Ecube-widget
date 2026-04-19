import { cn } from "@/lib/utils";

function getPlayerBarColor(liveState) {
  if ([0, 1, 2, 3, 6].includes(liveState)) return "bg-green-500";
  if (liveState === 4) return "bg-red-500";
  return "bg-gray-500";
}

function isEliminated(players) {
  // Empty array → team is MISSING, not eliminated — no overlay
  return players.length > 0 && players.every((p) => p.liveState === 5);
}

export function TeamRow({
  entry,
  isObserved = false,
  isOverall = false,
  rank,
}) {
  const eliminated = isEliminated(entry.players);
  const hasBlueZone = entry.players.some(
    (p) => p.isOutsideZone && p.liveState !== 5,
  );

  return (
    <div
      className={cn(
        "team-row relative grid grid-cols-7 items-center border-b border-blue-900/30 bg-blue-100 text-sm text-white",
        eliminated && "opacity-90",
      )}
      data-flip-id={entry.team._id}
    >
      {/* Rank */}
      <div
        className={cn(
          "flex items-center justify-center bg-blue-700 p-2 font-bold text-white",
          isObserved && "bg-yellow-500 text-black",
        )}
      >
        {rank}
      </div>

      {/* Team — 3 cols */}
      <div className={cn("col-span-3 flex items-center gap-2 bg-blue-900 p-2", isObserved && "bg-yellow-700 text-black")}>
        <img
          src={entry.team.logo}
          alt={entry.team.name}
          width={20}
          height={20}
          className="rounded"
        />
        <span className="truncate font-semibold uppercase">
          {entry.team.name}
        </span>
      </div>

      {entry?.players?.length > 0 ? (
        <>
          {/* Player health bars */}
          <div className="flex items-center justify-center gap-0.75 bg-blue-100">
            {entry.players.map((player, idx) => (
              <div key={idx} className="relative">
                <div className="flex h-7 w-1.25 flex-col justify-end overflow-hidden rounded-[1px] bg-gray-800/15">
                  <div
                    className={cn(
                      "w-full",
                      getPlayerBarColor(player.liveState),
                    )}
                    style={{ height: `${player.healths}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* PTS — points for live match, overAllPoints for overall */}
          <div className="flex items-center justify-center bg-blue-100 p-2 font-bold text-black/70">
            {isOverall ? entry?.overAllPoints : entry?.points}
          </div>

          {/* ELMIS */}
          <div className="flex items-center justify-center bg-blue-100 p-2 font-bold text-black/70">
            {entry?.kills}
          </div>
        </>
      ) : (
        <div className="col-span-3 text-center text-red-500">MISSING</div>
      )}

      {/* Elimination overlay */}
      {eliminated && (
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
      )}

      {/* Observer highlight */}
      {/* {isObserved && (
        <div className="pointer-events-none absolute inset-0 z-40 ring-2 ring-yellow-400/80 ring-inset" />
      )} */}

      {/* Blue zone — above observer ring */}

      {hasBlueZone && (
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(147,197,253,0.5) 100%, rgba(59,130,246,0.5) 100%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
}
