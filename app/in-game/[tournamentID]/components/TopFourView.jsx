"use client";
import Image from "next/image";

function getPlayerBarColor(liveState) {
  if ([0, 1, 2, 3, 6].includes(liveState)) return "bg-green-500";
  if (liveState === 4) return "bg-red-500";
  return "bg-gray-500";
}

function isTeamEliminated(players) {
  if (!players || players.length === 0) return false;
  return players.every((p) => p.liveState === 5);
}

export function TopFourView({ teams, observingTeamId = null }) {
  return (
    <div className="flex items-start justify-center gap-4">
      {teams.map((entry) => {
        const eliminated = isTeamEliminated(entry.players);
        const hasWinProb = entry.winProbability != null;

        return (
          <div
            key={entry.team._id}
            className={`top-four-card relative flex w-64 shrink-0 flex-col border-b-2 border-l-4 bg-blue-900 ${
              observingTeamId === entry.team._id
                ? "border-blue-400 border-l-yellow-400"
                : "border-blue-400"
            }`}
          >
            <div className="flex h-14 items-center">
              <div className="flex flex-1 items-center gap-2 overflow-hidden px-2">
                <Image
                  src={entry.team.logo}
                  alt={entry.team.name}
                  width={28}
                  height={28}
                  className="shrink-0 rounded object-contain"
                  unoptimized
                />
                <span className="truncate text-sm font-bold uppercase text-white">
                  {entry.team.name}
                </span>
              </div>

              <div className="flex h-full items-center gap-0.75 bg-blue-700 px-2">
                {entry.players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex h-8 w-1.25 flex-col justify-end overflow-hidden rounded-[1px] bg-gray-800/40"
                  >
                    <div
                      className={`w-full ${getPlayerBarColor(player.liveState)}`}
                      style={{ height: `${player.healths}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {hasWinProb && (
              <div className="flex h-7 w-full">
                <div className="flex flex-1 items-center justify-center bg-[#4F63CE] text-xs font-bold text-white">
                  WWCD
                </div>
                <div className="flex flex-1 items-center justify-center bg-[#3C41B4] text-xs font-bold text-white">
                  {Math.round(entry.winProbability)}%
                </div>
              </div>
            )}

            {eliminated && (
              <div className="pointer-events-none absolute inset-0 bg-black/60" />
            )}

            {observingTeamId === entry.team._id && (
              <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-yellow-400/80" />
            )}
          </div>
        );
      })}
    </div>
  );
}
