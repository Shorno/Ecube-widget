import { cn } from "@/lib/utils";
import { TOP_FOUR_CARD_WIDTH, TOP_FOUR_WWCD_HEIGHT } from "./layout";

type Props = {
  winProbability: number;
  className?: string;
};

export default function TopFourWwcdBar({ winProbability, className }: Props) {
  return (
    <div
      className={cn("relative font-bold text-widget-text-3", className)}
      style={{ width: TOP_FOUR_CARD_WIDTH, height: TOP_FOUR_WWCD_HEIGHT }}
    >
      {/* Background SVG Shape and Borders */}
      <svg
        width={TOP_FOUR_CARD_WIDTH}
        height={TOP_FOUR_WWCD_HEIGHT}
        viewBox="0 0 301 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        {/* Left Section Background (WWCD) */}
        <path
          d="M9 0 H150.5 V26 H22 L9 13 Z"
          fill="var(--widget-v1-wwcd-from, #4F63CE)"
        />
        {/* Right Section Background (Win Probability %) */}
        <path
          d="M150.5 0 H292 V13 L279 26 H150.5 Z"
          fill="var(--widget-v1-wwcd-to, #3C41B4)"
        />
        {/* Outer Border Frame */}
        <path
          d="M7 0 H294 V14 L280 28 H21 L7 14 Z"
          stroke="var(--widget-primary-dark, #00332B)"
          strokeWidth="2"
          fill="none"
        />
        {/* Inner Border Accent */}
        <path
          d="M8.5 0 H292.5 V13.5 L279 27 H22 L8.5 13.5 Z"
          stroke="var(--widget-primary-accent, #00AD91)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Overlay Text Content */}
      <div
        className="absolute bottom-0 top-0 flex items-center justify-center font-primary text-xs uppercase tracking-wide"
        style={{ left: 9, width: 141.5 }}
      >
        WWCD
      </div>
      <div
        className="absolute bottom-0 top-0 flex items-center justify-center font-primary text-xs"
        style={{ left: 150.5, width: 141.5 }}
      >
        {Math.round(winProbability)}%
      </div>
    </div>
  );
}
