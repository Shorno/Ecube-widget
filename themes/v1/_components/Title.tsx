import { cn } from "@/lib/utils";
import type { MatchInfo } from "@/types/widgets";

type TitleSize = "lg" | "md" | "rankings" | "overall";
type DetailLayout = "inline" | "gap" | "justify-between";

const TITLE_SIZES = {
  lg: {
    row: "h-[180px]",
    title: "text-[180px] leading-[180px]",
    meta: "h-[180px] py-[8px]",
    stage: "text-[80px] leading-[80px]",
    detail: "text-[50px] leading-[50px]",
    detailLayout: "inline" as DetailLayout,
  },
  // Compact — meta fonts scaled to 2/3 of lg so both columns fit 120px equally.
  md: {
    row: "h-[120px]",
    title: "text-[120px] leading-[120px]",
    meta: "h-[120px] py-[5px]",
    stage: "text-[53px] leading-[53px]",
    detail: "text-[33px] leading-[33px]",
    detailLayout: "inline" as DetailLayout,
  },
  // Match rankings table — long label at full 160px row.
  rankings: {
    row: "h-[160px]",
    title: "text-[160px] leading-[160px] whitespace-nowrap",
    meta: "h-[160px] py-2",
    stage: "text-[60px] leading-[60px]",
    detail: "text-[40px] leading-[40px]",
    detailLayout: "gap" as DetailLayout,
  },
  // Overall rankings — 150px row; meta scaled from lg at 150/180.
  overall: {
    row: "h-[150px]",
    title: "block overflow-hidden text-[150px] leading-[150px] whitespace-nowrap",
    meta: "h-[150px] overflow-hidden py-[7px] items-end",
    stage: "shrink-0 whitespace-nowrap text-right text-[67px] leading-[67px]",
    detail: "w-full shrink-0 text-[42px] leading-[42px]",
    detailLayout: "justify-between" as DetailLayout,
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

  const detailText = cn(
    "font-primary font-normal text-widget-text-3",
    sizes.detail,
  );

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
        <div
          className={cn(
            "flex flex-col justify-between self-stretch",
            sizes.meta,
          )}
        >
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
            <>
              {sizes.detailLayout === "justify-between" && (
                <div className={cn("flex items-center justify-between", detailText)}>
                  {matchName && <span>{matchName}</span>}
                  {day && <span>{day}</span>}
                </div>
              )}
              {sizes.detailLayout === "gap" && (
                <div className={cn("flex items-center gap-8", detailText)}>
                  {matchName && <span>{matchName}</span>}
                  {day && <span>{day}</span>}
                </div>
              )}
              {sizes.detailLayout === "inline" && (
                <span className={detailText}>
                  {matchName && <span className="mr-14">{matchName}</span>}
                  {day && <span>{day}</span>}
                </span>
              )}
            </>
          )}
          {subtitle && <span className={detailText}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
