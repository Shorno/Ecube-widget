import { cn } from "@/lib/utils";

// --- UTILS ---

/**
 * Determines the background color for a player's health bar based on their live state.
 * 0 = Alive (Green)
 * 4 = Knocked (Yellow)
 * 5 = Eliminated (Gray fallback)
 */
function getPlayerBarColor(liveState) {
  if (liveState === 0) return "bg-green-500";
  if (liveState === 4) return "bg-yellow-400";
  return "bg-gray-500"; // Fallback color, though mostly hidden when height is 0
}

/**
 * Determines the text color for the team's rank number.
 * Can be uncommented and customized to highlight top 3 teams.
 */
function getRankColor(rank) {
  // if (rank === 1) return "text-yellow-400";
  // if (rank === 2) return "text-slate-300";
  // if (rank === 3) return "text-amber-600";
  return "text-white";
}

/**
 * Checks if an entire team is eliminated.
 * A team is considered completely eliminated only if every single player's liveState is 5.
 */
function isEliminated(players) {
  return players.every((p) => p.liveState === 5);
}

// --- TEAM ROW COMPONENT ---
export function TeamRow({ entry, index }) {
  const eliminated = isEliminated(entry.players);

  return (
    <div
      className={cn(
        "team-row relative grid grid-cols-7 items-center border-b border-blue-900/30 bg-blue-100 text-sm text-white",
        eliminated && "opacity-90",
      )}
      data-flip-id={entry.team._id} // CRITICAL FOR GSAP FLIP
    >
      {/* Rank */}
      <div
        className={cn(
          "flex items-center justify-center bg-blue-700 p-2 font-bold",
          getRankColor(entry.rank),
        )}
      >
        {entry.rank}
      </div>

      {/* Team — 3 cols */}
      <div className="col-span-3 flex items-center gap-2 bg-blue-900 p-2">
        {/* IN NEXT.JS LOCAL: Switch this back to <Image /> from next/image */}
        <img
          src={entry.team.logoImageUrl}
          alt={entry.team.name}
          width={20}
          height={20}
          className="rounded"
        />
        <span className="truncate font-semibold uppercase">
          {entry.team.name}
        </span>
      </div>

      {/* Alive bars */}
      <div className="flex items-center justify-center gap-[3px] bg-blue-100">
        {entry.players.map((player, idx) => (
          <div
            key={idx}
            className="flex h-7 w-[5px] flex-col justify-end overflow-hidden rounded-[1px] bg-gray-800/15"
          >
            <div
              className={cn(
                "w-full transition-all duration-500 ease-out",
                getPlayerBarColor(player.liveState),
              )}
              style={{ height: `${player.healths}%` }}
            />
          </div>
        ))}
      </div>

      {/* PTS */}
      <div className="flex items-center justify-center bg-blue-100 p-2 font-bold text-black/70">
        {entry.overAllPoints}
      </div>

      {/* ELMIS */}
      <div className="flex items-center justify-center bg-blue-100 p-2 font-bold text-black/70">
        {entry.kills}
      </div>

      {eliminated && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60"></div>
      )}
    </div>
  );
}
