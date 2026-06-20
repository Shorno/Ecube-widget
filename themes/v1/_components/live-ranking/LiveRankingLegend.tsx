import { cn } from "@/lib/utils";
import { getLiveRankingLayout } from "./layout";

type Props = {
  className?: string;
  showFullTeamName?: boolean;
};

export default function LiveRankingLegend({
  className,
  showFullTeamName = false,
}: Props) {
  const { panelWidth } = getLiveRankingLayout(showFullTeamName);

  return (
    <div
      className={cn(
        "flex h-[19px] shrink-0 select-none items-center justify-start bg-white pl-[5px]",
        className,
      )}
      style={{ width: panelWidth }}
    >
      {/* ALIVE */}
      <div className="flex items-center gap-[4px] mr-[20px] shrink-0">
        <div
          className="size-[12px]"
          style={{ backgroundColor: "#00FFD5" }}
        />
        <span
          className="font-bold text-black uppercase leading-none"
          style={{
            fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
            fontSize: "18px",
            lineHeight: "1",
          }}
        >
          ALIVE
        </span>
      </div>

      {/* KNOCKED */}
      <div className="flex items-center gap-[4px] mr-[20px] shrink-0">
        <div
          className="size-[12px]"
          style={{ backgroundColor: "#FF0000" }}
        />
        <span
          className="font-bold text-black uppercase leading-none"
          style={{
            fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
            fontSize: "18px",
            lineHeight: "1",
          }}
        >
          KNOCKED
        </span>
      </div>

      {/* ELIMINATED */}
      <div className="flex items-center gap-[4px] shrink-0">
        <div
          className="size-[12px]"
          style={{ backgroundColor: "#4E4E4E" }}
        />
        <span
          className="font-bold text-black uppercase leading-none"
          style={{
            fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
            fontSize: "18px",
            lineHeight: "1",
          }}
        >
          ELIMINATED
        </span>
      </div>
    </div>
  );
}
