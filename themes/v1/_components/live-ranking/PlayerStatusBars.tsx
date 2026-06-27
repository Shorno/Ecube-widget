import { cn } from "@/lib/utils";
import type { LiveRankPlayer } from "@/types/live-rank";

type Props = {
  players?: LiveRankPlayer[];
  className?: string;
  size?: "default" | "large";
};

function barGroupWidth(count: number, barWidth: number, gap: number) {
  if (count <= 0) return 0;
  return count * barWidth + (count - 1) * gap;
}

export default function PlayerStatusBars({
  players = [],
  className,
  size = "default",
}: Props) {
  const isLarge = size === "large";
  const barWidth = isLarge ? 10 : 9;
  const gap = 2;
  const height = isLarge ? 38 : 32;
  const width = barGroupWidth(players.length, barWidth, gap);

  if (players.length === 0) return null;

  return (
    <div
      className={cn("flex items-center justify-start gap-[2px]", className)}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      {players.map((player, idx) => {
        const isEliminated = player.liveState === 5;
        const isKnocked = player.liveState === 4;

        return (
          <div
            key={idx}
            className="flex flex-col justify-end overflow-hidden"
            style={{
              height: `${height}px`,
              width: `${barWidth}px`,
              backgroundColor: "var(--widget-status-dead, #4E4E4E)",
            }}
          >
            {!isEliminated && (
              <div
                className="w-full transition-all duration-300"
                style={{
                  height: `${player.healths ?? 100}%`,
                  backgroundColor: isKnocked
                    ? "var(--widget-status-knocked, #FF0000)"
                    : "var(--widget-status-alive, #00FFD5)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
