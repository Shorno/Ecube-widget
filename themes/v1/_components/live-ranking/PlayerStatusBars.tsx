import { cn } from "@/lib/utils";
import type { LiveRankPlayer } from "@/types/live-rank";

type Props = {
  players?: LiveRankPlayer[];
  className?: string;
  size?: "default" | "large";
};

export default function PlayerStatusBars({
  players = [],
  className,
  size = "default",
}: Props) {
  const slots = Array.from({ length: 4 }, (_, i) => players[i] ?? null);
  const isLarge = size === "large";

  return (
    <div
      className={cn(
        "flex items-center justify-start gap-[2px]",
        isLarge ? "h-[38px] w-[50px]" : "h-[32px] w-[42px]",
        className,
      )}
    >
      {slots.map((player, idx) => {
        const isEliminated = !player || player.liveState === 5;
        const isKnocked = player && player.liveState === 4;

        return (
          <div
            key={idx}
            className={cn(
              "relative overflow-hidden",
              isLarge ? "h-[38px] w-[10px]" : "h-[32px] w-[9px]",
            )}
            style={{ backgroundColor: "var(--widget-status-dead, #4E4E4E)" }}
          >
            {!isEliminated && (
              <>
                {/* White background block representing empty/lost health */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                {/* Health fill from bottom representing remaining health */}
                <div
                  className="absolute bottom-0 left-0 w-full transition-all duration-300"
                  style={{
                    height: `${player.healths ?? 100}%`,
                    backgroundColor: isKnocked
                      ? "var(--widget-status-knocked, #FF0000)"
                      : "var(--widget-status-alive, #00FFD5)",
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
