import Image from "next/image";
import { cn } from "@/lib/utils";

function getPlayerBarColor(liveState) {
  if ([0, 1, 2, 3, 6].includes(liveState)) return "bg-green-500";
  if (liveState === 4) return "bg-red-500";
  return "bg-gray-500";
}

function isEliminated(players) {
  return players.length > 0 && players.every((p) => p.liveState === 5);
}

export function TeamRow({
  entry,
  isObserved = false,
  isOverall = false,
  rank,
}) {
  const players = entry.players ?? [];
  const eliminated = isEliminated(players);
  const missing = entry.isMissing === true;
  const inactive = eliminated || missing;
  const hasBlueZone =
    !inactive && players.some((p) => p.isOutsideZone && p.liveState !== 5);

  return (
    <div
      className={cn(
        "team-row relative grid grid-cols-7 items-center border-b border-blue-900/30 bg-blue-100 text-sm text-white",
        inactive && "opacity-90",
      )}
      data-flip-id={entry.team.id}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-blue-700 p-2 font-bold text-white",
          isObserved && "bg-yellow-500 text-black",
        )}
      >
        {rank}
      </div>

      <div
        className={cn(
          "col-span-3 flex items-center gap-2 bg-blue-900 p-2",
          isObserved && "bg-yellow-700 text-black",
        )}
      >
        <Image
          src={entry.team.logo}
          alt={entry.team.name}
          width={20}
          height={20}
          className="rounded"
          unoptimized
        />
        <span className="truncate font-semibold uppercase">
          {entry.team.name}
        </span>
      </div>

      {missing ? (
        <div className="flex items-center justify-center bg-blue-100 p-2 text-lg leading-none font-bold text-black/70 uppercase">
          MISS
        </div>
      ) : (
        <div className="flex items-center justify-center gap-0.75 bg-blue-100">
          {players.map((player, idx) => (
            <div key={idx} className="relative">
              <div className="flex h-7 w-1.25 flex-col justify-end overflow-hidden rounded-[1px] bg-gray-800/15">
                <div
                  className={cn("w-full", getPlayerBarColor(player.liveState))}
                  style={{ height: `${player.healths}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center bg-blue-100 p-2 font-bold text-black/70">
        {isOverall ? entry?.overAllPoints : entry?.points}
      </div>

      <div className="flex items-center justify-center bg-blue-100 p-2 font-bold text-black/70">
        {entry?.kills}
      </div>

      {inactive && (
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
      )}

      {hasBlueZone && (
        <div
          className="pointer-events-none absolute inset-0 z-50 animate-pulse ring-2 ring-blue-400 ring-inset"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(147,197,253,0.5) 50%, rgba(59,130,246,0.5) 100%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
}
