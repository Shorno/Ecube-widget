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
        "bg-widget-bg flex h-[19px] shrink-0 items-center justify-start pl-[5px] select-none",
        className,
      )}
      style={{ width: panelWidth }}
    >
      {/* ALIVE */}
      <div className="mr-[20px] flex shrink-0 items-center gap-[4px]">
        <div className="bg-widget-status-alive size-[12px]" />
        <span
          className="font-primary text-widget-text-1 leading-none font-bold uppercase"
          style={{
            fontSize: "18px",
            lineHeight: "1",
          }}
        >
          ALIVE
        </span>
      </div>

      {/* KNOCKED */}
      <div className="mr-[20px] flex shrink-0 items-center gap-[4px]">
        <div className="bg-widget-status-knocked size-[12px]" />
        <span
          className="font-primary text-widget-text-1 leading-none font-bold uppercase"
          style={{
            fontSize: "18px",
            lineHeight: "1",
          }}
        >
          KNOCKED
        </span>
      </div>

      {/* ELIMINATED */}
      <div className="flex shrink-0 items-center gap-[4px]">
        <div className="bg-widget-status-dead size-[12px]" />
        <span
          className="font-primary text-widget-text-1 leading-none font-bold uppercase"
          style={{
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
