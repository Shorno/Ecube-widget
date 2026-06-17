import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const STAT_COLS = ["WWCD", "POS", "ELIMS"] as const;
const STAT_COL_WIDTH = 90;
const TOTAL_COL_WIDTH = 90;

export const OVERALL_STAT_COL_WIDTH = STAT_COL_WIDTH;
export const OVERALL_TOTAL_COL_WIDTH = TOTAL_COL_WIDTH;

export default function OverallStatsHeader({ className }: Props) {
  return (
    <div className={cn("flex min-w-0 flex-1 items-stretch", className)}>
      <div
        className="font-secondary box-border flex h-[30px] min-w-0 flex-1 items-center border border-l-0 border-widget-secondary-accent bg-widget-primary pl-[30px] font-bold text-white uppercase"
        style={{ clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div className="min-w-0 flex-1 text-left text-[22px] leading-[26px]">
          TEAM
        </div>
        {STAT_COLS.map((label) => (
          <div
            key={label}
            className="shrink-0 text-center text-[22px] leading-[26px]"
            style={{ width: STAT_COL_WIDTH }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        className="font-secondary grid shrink-0 place-content-center border border-l-0 border-widget-secondary-accent bg-widget-primary font-bold text-white uppercase"
        style={{ width: TOTAL_COL_WIDTH }}
      >
        <span className="text-[22px] leading-[26px]">TOTAL</span>
      </div>
    </div>
  );
}

export function OverallStatsValues({
  wwcd,
  positionPoints,
  killPoints,
  totalPoints,
  className,
}: {
  wwcd?: number;
  positionPoints?: number;
  killPoints?: number;
  totalPoints?: number;
  className?: string;
}) {
  const fmt = (v?: number) => String(v ?? 0).padStart(2, "0");
  const stats = [wwcd, positionPoints, killPoints];

  return (
    <>
      <div
        className={cn(
          "font-secondary flex min-w-0 flex-1 items-center justify-end pr-2 pl-[30px] font-bold text-widget-text-2",
          className,
        )}
      >
        {stats.map((value, i) => (
          <div
            key={i}
            className="shrink-0 text-center text-[25px] leading-[30px]"
            style={{ width: STAT_COL_WIDTH }}
          >
            {fmt(value)}
          </div>
        ))}
      </div>
      <div
        className="font-secondary grid shrink-0 place-content-center bg-widget-primary font-bold text-widget-text-3"
        style={{ width: TOTAL_COL_WIDTH }}
      >
        <span className="text-center text-[25px] leading-[30px]">
          {fmt(totalPoints)}
        </span>
      </div>
    </>
  );
}
