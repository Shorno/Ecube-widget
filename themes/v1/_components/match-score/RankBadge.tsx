import { cn } from "@/lib/utils";

type Props = {
  rank: number;
  variant?: "row" | "winner";
  isFirst?: boolean;
  className?: string;
};

export default function RankBadge({
  rank,
  variant = "row",
  isFirst = false,
  className,
}: Props) {
  if (variant === "winner") {
    return (
      <span
        className="font-anton text-widget-text-2 absolute top-[5.63px] left-[20.52px] z-20 text-[55px] leading-[83px]"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        #{rank}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "box-border grid h-12 w-[67px] shrink-0 place-content-center border-b border-r border-l border-widget-secondary bg-gradient-to-br from-widget-primary to-widget-primary-accent text-[30px] leading-[45px] text-widget-text-3 skew-x-[-17deg]",
        isFirst && "border-t",
        className,
      )}
      style={{ fontFamily: "var(--font-anton)" }}
    >
      <span className="skew-x-[17deg] inline-block">{rank}</span>
    </div>
  );
}
