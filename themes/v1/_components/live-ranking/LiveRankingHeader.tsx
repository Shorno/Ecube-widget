import Image from "next/image";
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
        "relative h-[40px] shrink-0 select-none overflow-hidden",
        className,
      )}
      style={{
        width: layout.panelWidth,
        background:
          "linear-gradient(90deg, var(--widget-gradient-from, #009980) 0%, var(--widget-gradient-to, #00332B) 100%)",
      }}
    >
      <div
        className="absolute left-0 top-0 flex h-[40px] w-[48px] items-center justify-center"
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
          <Image
            src="/assets/head2head/helmet.svg"
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-contain brightness-0 invert"
          />
        </div>
      </div>

      <span
        className="absolute top-[14px] h-[18px] font-bold text-white uppercase"
        style={{
          left: layout.headerLabels.team,
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        TEAM
      </span>

      <span
        className="absolute top-[14px] h-[18px] w-[50px] text-center font-bold text-white uppercase"
        style={{
          left: layout.headerLabels.alive,
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        ALIVE
      </span>

      <span
        className="absolute top-[14px] h-[18px] w-[40px] text-center font-bold text-white uppercase"
        style={{
          left: layout.headerLabels.pts,
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        PTS
      </span>

      <span
        className="absolute top-[14px] h-[18px] w-[40px] text-center font-bold text-white uppercase"
        style={{
          left: layout.headerLabels.elims,
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        ELIMS
      </span>
    </div>
  );
}
