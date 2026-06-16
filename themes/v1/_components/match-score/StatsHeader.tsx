import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  variant?: "column" | "winner";
};

const COLUMNS = ["PLACE PTS", "ELIMS", "TOTAL PTS"] as const;

/** Figma stats block width — aligns header + row values */
export const STATS_BLOCK_WIDTH = 430;

const COL_WIDTH = "flex-1 min-w-0";

export default function StatsHeader({
  className,
  style,
  variant = "column",
}: Props) {
  const isWinner = variant === "winner";

  return (
    <div
      className={cn(
        "font-secondary box-border flex h-[30px] items-center justify-end font-bold uppercase pl-[30px]",
        isWinner ? "w-full" : "",
        isWinner
          ? "bg-widget-secondary text-widget-text-2"
          : "border border-widget-secondary-accent bg-widget-primary text-white",
        className,
      )}
      style={{
        clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0 100%)",
        width: isWinner ? undefined : STATS_BLOCK_WIDTH,
        ...style,
      }}
    >
      {COLUMNS.map((label) => (
        <div
          key={label}
          className={cn(COL_WIDTH, "text-center text-[22px] leading-[26px]")}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export function StatsValues({
  positionPoints,
  killPoints,
  totalPoints,
  className,
  variant = "row",
}: {
  positionPoints?: number;
  killPoints?: number;
  totalPoints?: number;
  className?: string;
  variant?: "row" | "winner";
}) {
  const fmt = (v?: number) => String(v ?? 0).padStart(2, "0");
  const values = [positionPoints, killPoints, totalPoints];

  if (variant === "winner") {
    return (
      <div
        className={cn(
          "font-secondary flex w-full items-center justify-end font-bold pl-11",
          className,
        )}
        style={{ width: STATS_BLOCK_WIDTH }}
      >
        <div
          className={cn(
            COL_WIDTH,
            "text-center text-[25px] leading-[30px] text-white",
          )}
        >
          {fmt(positionPoints)}
        </div>
        <div
          className={cn(
            COL_WIDTH,
            "text-center text-[25px] leading-[30px] text-white",
          )}
        >
          {fmt(killPoints)}
        </div>
        <div
          className={cn(
            COL_WIDTH,
            "text-center text-[25px] leading-[30px] text-widget-secondary",
          )}
        >
          {fmt(totalPoints)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "font-secondary flex w-full items-center justify-end font-bold text-widget-text-2 pl-[30px]",
        className,
      )}
    >
      {values.map((value, i) => (
        <div
          key={i}
          className={cn(COL_WIDTH, "text-center text-[25px] leading-[30px]")}
        >
          {fmt(value)}
        </div>
      ))}
    </div>
  );
}
