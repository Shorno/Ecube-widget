import { useId } from "react";
import { cn } from "@/lib/utils";
import { TOP_FOUR_CARD_WIDTH, TOP_FOUR_WWCD_HEIGHT } from "./layout";

type Props = {
  winProbability: number;
  className?: string;
};

export default function TopFourWwcdBar({ winProbability, className }: Props) {
  const leftGradId = useId().replace(/:/g, "");
  const rightGradId = useId().replace(/:/g, "");
  const rightSheenId = useId().replace(/:/g, "");

  return (
    <div
      className={cn("relative font-bold text-widget-text-3", className)}
      style={{ width: TOP_FOUR_CARD_WIDTH, height: TOP_FOUR_WWCD_HEIGHT }}
    >
      <svg
        width={TOP_FOUR_CARD_WIDTH}
        height={TOP_FOUR_WWCD_HEIGHT}
        viewBox="0 0 301 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient
            id={leftGradId}
            x1="9"
            y1="0"
            x2="150.5"
            y2="26.6"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--widget-v1-wwcd-from, var(--widget-gradient-from))" />
            <stop offset="1" stopColor="var(--widget-primary-accent)" />
          </linearGradient>
          <linearGradient
            id={rightGradId}
            x1="158"
            y1="0"
            x2="286"
            y2="26.6"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="var(--widget-gradient-from, var(--widget-primary-accent))"
            />
            <stop offset="42%" stopColor="var(--widget-primary)" />
            <stop
              offset="100%"
              stopColor="var(--widget-v1-wwcd-to, var(--widget-gradient-to))"
            />
          </linearGradient>
          <linearGradient
            id={rightSheenId}
            x1="221"
            y1="0"
            x2="221"
            y2="19.6"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M9 0 H150.5 V25.9 H22 L9 13.3 Z"
          fill={`url(#${leftGradId})`}
        />
        <path
          d="M150.5 0 H292 V13.3 L279 25.9 H150.5 Z"
          fill={`url(#${rightGradId})`}
        />
        <path
          d="M150.5 0 H292 V13.3 L279 25.9 H150.5 Z"
          fill={`url(#${rightSheenId})`}
        />
        <path
          d="M7 0 H294 V14 L280 28 H21 L7 14 Z"
          stroke="var(--widget-secondary-dark)"
          strokeWidth="1.25"
          fill="none"
        />
        <path
          d="M8.5 0 H292.5 V13.65 L279 27.3 H22 L8.5 13.65 Z"
          stroke="var(--widget-primary-accent)"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>

      <div
        className="absolute bottom-0 top-0 flex items-center justify-center font-primary text-[20px] leading-none uppercase tracking-[0.08em]"
        style={{ left: 9, width: 148 }}
      >
        WWCD
      </div>
      <div
        className="absolute bottom-0 top-0 flex items-center justify-center font-primary text-[18px] leading-none tracking-wide"
        style={{ left: 150.5, width: 141.5 }}
      >
        {Math.round(winProbability)}%
      </div>
    </div>
  );
}
