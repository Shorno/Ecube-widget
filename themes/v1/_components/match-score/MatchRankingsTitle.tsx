import { cn } from "@/lib/utils";
import type { MatchInfo } from "@/types/widgets";

const TITLE_HEIGHT = 160;

type Props = {
  data?: MatchInfo | null;
  className?: string;
};

export default function MatchRankingsTitle({ data, className }: Props) {
  const stage = data?.stage_name || data?.game_stage;
  const day = data?.day || data?.game_day;
  const matchName = data?.match_name || data?.game_name;
  const font = "var(--font-american-captain)";

  return (
    <div
      className={cn(
        "flex shrink-0 items-stretch gap-8 uppercase",
        className,
      )}
      style={{ height: `${TITLE_HEIGHT}px` }}
    >
      <h1
        className="shrink-0 text-[160px] leading-[160px] font-normal tracking-[-0.01em] whitespace-nowrap text-white"
        style={{ fontFamily: font, height: `${TITLE_HEIGHT}px` }}
      >
        MATCH RANKINGS
      </h1>

      {(stage || matchName || day) && (
        <div
          className="flex flex-col justify-between py-2"
          style={{ height: `${TITLE_HEIGHT}px` }}
        >
          {stage && (
            <span
              className="text-[60px] leading-[60px] font-normal text-white"
              style={{ fontFamily: font }}
            >
              {stage}
            </span>
          )}
          {(matchName || day) && (
            <div
              className="flex items-center gap-8 text-[40px] leading-[40px] font-normal text-white"
              style={{ fontFamily: font }}
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
