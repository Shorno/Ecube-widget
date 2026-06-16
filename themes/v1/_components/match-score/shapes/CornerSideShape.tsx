"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Secondary palette gradient start */
  gradientFrom?: string;
  /** Secondary palette gradient end */
  gradientTo?: string;
  stroke?: string;
};

/** Figma Rectangle 301 — side corner plaque */
export default function CornerSideShape({
  className,
  style,
  gradientFrom = "var(--widget-secondary)",
  gradientTo = "var(--widget-secondary-dark)",
  stroke = "var(--widget-secondary-accent)",
}: Props) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 118 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      style={
        {
          ...style,
          "--corner-side-from": gradientFrom,
          "--corner-side-to": gradientTo,
          "--corner-side-stroke": stroke,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="56.8003"
          y1="11.6164"
          x2="99.1269"
          y2="67.1814"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" style={{ stopColor: "var(--corner-side-from)" }} />
          <stop
            offset="100%"
            style={{ stopColor: "var(--corner-side-to)" }}
          />
        </linearGradient>
      </defs>
      <path
        d="M1.11502 0.789919L33.7365 84.1493L50.7352 80.9194L68.3448 77.5732L85.9553 74.2272L103.071 70.9754L116.584 4.90061L1.11502 0.789919Z"
        fill={`url(#${gradientId})`}
        stroke="var(--corner-side-stroke)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
