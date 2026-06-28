import { cn } from "@/lib/utils";
import { getLiveRankingLayout } from "./layout";

type Props = {
  className?: string;
  showFullTeamName?: boolean;
};

export default function LiveRankingHeader({
  className,
  showFullTeamName = false,
}: Props) {
  const layout = getLiveRankingLayout(showFullTeamName);

  return (
    <div
      className={cn(
        "relative h-[40px] shrink-0 overflow-hidden select-none",
        className,
      )}
      style={{
        width: layout.panelWidth,
        background:
          "linear-gradient(90deg, var(--widget-gradient-from, #009980) 0%, var(--widget-gradient-to, #00332B) 100%)",
      }}
    >
      <div
        className="absolute top-0 left-0 flex h-[40px] w-[48px] items-center justify-center"
        style={{ backgroundColor: "var(--widget-primary, #00473C)" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "32.66px",
            height: "32.66px",
            transform: "rotate(17.51deg)",
          }}
        >
          <span
            className="block h-full w-full"
            aria-hidden
            style={{
              backgroundColor: "var(--widget-text-3)",
              maskImage: "url('/assets/head2head/helmet.svg')",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskImage: "url('/assets/head2head/helmet.svg')",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
          />
        </div>
      </div>

      <span
        className="font-primary text-widget-text-3 absolute top-[14px] h-[18px] font-bold uppercase"
        style={{
          left: layout.headerLabels.team,
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        TEAM
      </span>

      <span
        className="font-primary text-widget-text-3 absolute top-[14px] h-[18px] w-[50px] text-center font-bold uppercase"
        style={{
          left: layout.headerLabels.alive,
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        ALIVE
      </span>

      <span
        className="font-primary text-widget-text-3 absolute top-[14px] h-[18px] w-[40px] text-center font-bold uppercase"
        style={{
          left: layout.headerLabels.pts,
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        PTS
      </span>

      <span
        className="font-primary text-widget-text-3 absolute top-[14px] h-[18px] w-[40px] text-center font-bold uppercase"
        style={{
          left: layout.headerLabels.elims,
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        ELIMS
      </span>
    </div>
  );
}
