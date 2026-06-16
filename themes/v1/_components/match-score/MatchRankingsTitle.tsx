import { cn } from "@/lib/utils";
import type { MatchInfo } from "@/types/widgets";

type Props = {
  data?: MatchInfo | null;
  className?: string;
};

export default function MatchRankingsTitle({ data, className }: Props) {
  const stage = data?.stage_name || data?.game_stage;
  const day = data?.day || data?.game_day;
  const matchName = data?.match_name || data?.game_name;

  return (
    <div className={cn("relative w-full h-[200px] uppercase", className)}>
      {/* MATCH RANKINGS centered globally */}
      <h1
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[160px] leading-[160px] tracking-[-0.01em] text-white font-normal whitespace-nowrap"
        style={{ fontFamily: "var(--font-american-captain)" }}
      >
        MATCH RANKINGS
      </h1>

      {(stage || matchName || day) && (
        <div className="absolute right-[40px] top-1/2 -translate-y-1/2 flex flex-col items-end shrink-0">
          {stage && (
            <span
              className="text-[60px] leading-[60px] text-white font-normal"
              style={{ fontFamily: "var(--font-american-captain)" }}
            >
              {stage}
            </span>
          )}
          {(matchName || day) && (
            <div
              className="flex items-center gap-8 text-[40px] leading-[40px] text-white font-normal"
              style={{ fontFamily: "var(--font-american-captain)" }}
            >
              {matchName && <span>{matchName}</span>}
              {day && <span>{day}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
