import { cn } from "@/lib/utils";
import type { MatchInfo } from "@/types/widgets";

type TitleSize = "lg" | "md";

const TITLE_SIZES = {
  lg: {
    row: "h-[180px]",
    title: "text-[180px] leading-[180px]",
    meta: "h-[180px] py-[8px]",
    stage: "text-[80px] leading-[80px]",
    detail: "text-[50px] leading-[50px]",
  },
  // Compact — meta fonts scaled to 2/3 of lg so both columns fit 120px equally.
  md: {
    row: "h-[120px]",
    title: "text-[120px] leading-[120px]",
    meta: "h-[120px] py-[5px]",
    stage: "text-[53px] leading-[53px]",
    detail: "text-[33px] leading-[33px]",
  },
} as const;

type Props = {
  title: string;
  subtitle?: string;
  data?: MatchInfo | null;
  stageOnly?: boolean;
  size?: TitleSize;
  className?: string;
};

export default function Title({
  title,
  subtitle,
  data,
  stageOnly,
  size = "lg",
  className,
}: Props) {
  const words = title.split(" ");
  const titleMain = words[0];
  const titleHighlight = words.slice(1).join(" ");

  const stage = data?.stage_name || data?.game_stage;
  const day = data?.day || data?.game_day;
  const matchName = data?.match_name || data?.game_name;
  const sizes = TITLE_SIZES[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-stretch gap-8 uppercase",
        sizes.row,
        className,
      )}
    >
      <h1
        className={cn(
          "font-primary flex shrink-0 items-start font-normal text-widget-text-3 tracking-[-0.01em]",
          sizes.title,
          sizes.row,
        )}
      >
        {titleMain} {titleHighlight}
      </h1>

      {(data || subtitle) && (
        <div className={cn("flex flex-col justify-between", sizes.meta)}>
          {data && stage && (
            <span
              className={cn(
                "font-primary font-normal text-widget-text-3",
                sizes.stage,
              )}
            >
              {stage}
            </span>
          )}
          {data && !stageOnly && (day || matchName) && (
            <span
              className={cn(
                "font-primary font-normal text-widget-text-3",
                sizes.detail,
              )}
            >
              {matchName && <span className="mr-14">{matchName}</span>}
              {day && <span>{day}</span>}
            </span>
          )}
          {subtitle && (
            <span
              className={cn(
                "font-primary font-normal text-widget-text-3",
                sizes.detail,
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
