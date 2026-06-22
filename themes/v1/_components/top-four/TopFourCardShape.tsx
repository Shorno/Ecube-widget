"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/** Angular gold-framed card shell — Figma Top Four team bar */
export default function TopFourCardShape({
  className,
  style,
}: Props) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 280 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-0 h-full w-full", className)}
      style={style}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="28" x2="280" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--widget-gradient-from, #0A5C4E)" />
          <stop offset="100%" stopColor="var(--widget-primary, #00473C)" />
        </linearGradient>
      </defs>
      <path
        d="M8 1.5 H264 L276 13.5 V48 L268 54.5 H12 L1.5 44 V8 Z"
        fill={`url(#${gradientId})`}
        stroke="var(--widget-secondary-accent, #C9A227)"
        strokeWidth="2"
      />
      <path
        d="M264 48 L276 54.5"
        stroke="var(--widget-secondary-accent, #C9A227)"
        strokeWidth="2"
      />
    </svg>
  );
}
