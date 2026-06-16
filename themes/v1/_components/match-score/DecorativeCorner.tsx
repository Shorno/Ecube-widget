"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import CornerTopShape from "./shapes/CornerTopShape";
import CornerSideShape from "./shapes/CornerSideShape";

type Props = {
  className?: string;
};

/**
 * Figma Group 60 — decorative shards behind the winner portrait card.
 * Positions relative to portrait panel top-left (Rectangle 309).
 *
 * Top-left shapes: custom paths from public/assets/cusotm-shapes/ (position/size only).
 * Bottom-right shapes: Figma rect + matrix (no custom export provided).
 */
export default function DecorativeCorner({ className }: Props) {
  const goldRightId = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-visible",
        className,
      )}
      aria-hidden
    >
      {/* Rectangle 307 — primary palette */}
      <CornerTopShape
        className="absolute"
        fill="var(--widget-primary)"
        stroke="var(--widget-secondary-accent)"
        style={{
          left: "-16.66px",
          top: "-50.68px",
          width: "229px",
          height: "142px",
        }}
      />

      {/* Rectangle 301 — secondary palette (not primary) */}
      <CornerSideShape
        className="absolute"
        gradientFrom="var(--widget-secondary)"
        gradientTo="var(--widget-secondary-dark)"
        stroke="var(--widget-secondary-accent)"
        style={{
          left: "-53.48px",
          top: "0px",
          width: "118px",
          height: "85px",
        }}
      />

      {/* Rectangle 312 — bottom-right gold shard (Figma rect, no custom export) */}
      <svg
        className="absolute overflow-visible"
        style={{
          right: "-5.48px",
          top: "97.32px",
          width: "115.95px",
          height: "96.06px",
          transform: "matrix(-0.98, -0.2, -0.2, 0.98, 0, 0)",
        }}
        viewBox="0 0 115.95 96.06"
        aria-hidden
      >
        <defs>
          <linearGradient
            id={goldRightId}
            x1="37.51%"
            y1="0%"
            x2="83.91%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--widget-secondary-accent)" />
            <stop offset="100%" stopColor="var(--widget-secondary-dark)" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="115.95"
          height="96.06"
          fill={`url(#${goldRightId})`}
          stroke="var(--widget-secondary-accent)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Rectangle 311 — bottom-right green shard */}
      <svg
        className="absolute overflow-visible"
        style={{
          right: "-2.95px",
          top: "132.39px",
          width: "94.56px",
          height: "116.14px",
          transform: "matrix(-0.55, 0.84, 0.84, 0.55, 0, 0)",
        }}
        viewBox="0 0 94.56 116.14"
        aria-hidden
      >
        <rect
          x="0"
          y="0"
          width="94.56"
          height="116.14"
          fill="var(--widget-primary)"
          stroke="var(--widget-secondary-accent)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
