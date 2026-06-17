import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const STAT_COLS = ["WWCD", "POS", "ELIMS"] as const;
const STAT_COL_WIDTH = 100;
const TOTAL_COL_WIDTH = 126;

export const OVERALL_STAT_COL_WIDTH = STAT_COL_WIDTH;
export const OVERALL_TOTAL_COL_WIDTH = TOTAL_COL_WIDTH;

export default function OverallStatsHeader({ className }: Props) {
  return (
    <div className={cn("flex min-w-0 flex-1 items-stretch", className)}>
      <div
        className="box-border flex h-[34px] min-w-0 flex-1 items-center pl-[20px] font-bold text-white uppercase"
        style={{
          fontFamily: "var(--font-secondary)",
          fontSize: "23px",
        }}
      >
        TEAM
      </div>
      {STAT_COLS.map((label) => (
        <div
          key={label}
          className="box-border grid h-[34px] w-[100px] shrink-0 place-content-center font-bold text-white uppercase"
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "23px",
          }}
        >
          {label}
        </div>
      ))}
      <div
        className="grid h-[34px] w-[126px] shrink-0 place-content-center font-bold text-white uppercase"
        style={{
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
          className="box-border flex h-[58px] w-[100px] shrink-0 items-center justify-center border-t border-b border-r border-widget-primary bg-[#FFFFFF] font-bold text-center text-widget-text-2"
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "31px",
          }}
        >
          {fmt(value)}
        </div>
      ))}
      <div
        className="box-border flex h-[58px] w-[126px] shrink-0 items-center justify-center border border-widget-secondary bg-gradient-to-br from-widget-primary to-widget-primary-accent font-bold text-center text-widget-text-3"
        style={{
          fontFamily: "var(--font-secondary)",
          fontSize: "33px",
        }}
      >
        {fmt(totalPoints)}
      </div>
    </>
  );
}
