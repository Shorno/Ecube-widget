import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const STAT_COLS = ["WWCD", "POS", "ELIMS"] as const;

export const OVERALL_RANK_COL_WIDTH = 67;
export const OVERALL_TEAM_COL_WIDTH = 240;
export const OVERALL_STAT_COL_WIDTH = 88;
export const OVERALL_TOTAL_COL_WIDTH = 108;

export const OVERALL_ROW_WIDTH =
  OVERALL_RANK_COL_WIDTH +
  OVERALL_TEAM_COL_WIDTH +
  OVERALL_STAT_COL_WIDTH * STAT_COLS.length +
  OVERALL_TOTAL_COL_WIDTH;

/** Width of both ranking columns plus the gap between them. */
export const OVERALL_COLUMN_GAP = 40;
export const OVERALL_LISTING_WIDTH =
  OVERALL_ROW_WIDTH * 2 + OVERALL_COLUMN_GAP;

export default function OverallStatsHeader({ className }: Props) {
  return (
    <div className={cn("flex shrink-0 items-stretch", className)}>
      <div
        className="box-border flex h-[34px] shrink-0 items-center pl-4 font-bold text-white uppercase"
        style={{
          width: OVERALL_TEAM_COL_WIDTH,
          fontFamily: "var(--font-secondary)",
          fontSize: "23px",
        }}
      >
        TEAM
      </div>
      {STAT_COLS.map((label) => (
        <div
          key={label}
          className="box-border grid h-[34px] shrink-0 place-content-center font-bold text-white uppercase"
          style={{
            width: OVERALL_STAT_COL_WIDTH,
            fontFamily: "var(--font-secondary)",
            fontSize: "23px",
          }}
        >
          {label}
        </div>
      ))}
      <div
        className="grid h-[34px] shrink-0 place-content-center font-bold text-white uppercase"
        style={{
          width: OVERALL_TOTAL_COL_WIDTH,
          fontFamily: "var(--font-secondary)",
          fontSize: "23px",
        }}
      >
        TOTAL
      </div>
    </div>
  );
}

export function OverallStatsValues({
  wwcd,
  positionPoints,
  killPoints,
  totalPoints,
}: {
  wwcd?: number;
  positionPoints?: number;
  killPoints?: number;
  totalPoints?: number;
}) {
  const fmt = (v?: number) => String(v ?? 0).padStart(2, "0");
  const stats = [wwcd, positionPoints, killPoints];

  return (
    <>
      {stats.map((value, i) => (
        <div
          key={i}
          className="box-border flex h-[58px] shrink-0 items-center justify-center border-t border-b border-r border-widget-primary bg-[#FFFFFF] font-bold text-center text-widget-text-2"
          style={{
            width: OVERALL_STAT_COL_WIDTH,
            fontFamily: "var(--font-secondary)",
            fontSize: "31px",
          }}
        >
          {fmt(value)}
        </div>
      ))}
      <div
        className="box-border flex h-[58px] shrink-0 items-center justify-center border border-widget-secondary bg-gradient-to-br from-widget-primary to-widget-primary-accent font-bold text-center text-widget-text-3"
        style={{
          width: OVERALL_TOTAL_COL_WIDTH,
          fontFamily: "var(--font-secondary)",
          fontSize: "33px",
        }}
      >
        {fmt(totalPoints)}
      </div>
    </>
  );
}
