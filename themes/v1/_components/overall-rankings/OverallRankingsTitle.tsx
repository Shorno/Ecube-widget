import { cn } from "@/lib/utils";
import type { MatchInfo } from "@/types/widgets";

type Props = {
  data?: MatchInfo | null;
  className?: string;
};

export default function OverallRankingsTitle({ data, className }: Props) {
  const stage = data?.stage_name || data?.game_stage;
  const day = data?.day || data?.game_day;
  const matchName = data?.match_name || data?.game_name;

  return (
    <div className={cn("relative h-[200px] w-full uppercase", className)}>
      <h1
        className="absolute top-1/2 left-0 -translate-y-1/2 text-[160px] leading-[160px] font-normal tracking-[-0.01em] whitespace-nowrap text-white"
        style={{ fontFamily: "var(--font-american-captain)" }}
      >
        OVERALL RANKINGS
      </h1>

      {(stage || matchName || day) && (
        <div className="absolute top-1/2 right-[40px] flex -translate-y-1/2 shrink-0 flex-col items-end">
          {stage && (
            <span
              className="text-[60px] leading-[60px] font-normal text-white"
              style={{ fontFamily: "var(--font-american-captain)" }}
            >
              {stage}
            </span>
          )}
          {(matchName || day) && (
            <div
              className="flex items-center gap-8 text-[40px] leading-[40px] font-normal text-white"
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
