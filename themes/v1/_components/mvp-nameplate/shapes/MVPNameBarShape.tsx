"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Light panel start — Figma #FFFFFF → widget-bg */
  gradientFrom?: string;
  /** Light panel end — Figma #D9D9D9 → bg muted with text-1 */
  gradientTo?: string;
};

/** Figma Rectangle 24 — 800×123 name bar (position/size only; fill via tokens). */
export default function MVPNameBarShape({
  className,
  style,
  gradientFrom = "var(--widget-bg)",
  gradientTo = "color-mix(in srgb, var(--widget-bg) 85%, var(--widget-text-1))",
}: Props) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 800 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      style={
        {
          ...style,
          "--mvp-bar-from": gradientFrom,
          "--mvp-bar-to": gradientTo,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="61.5"
          x2="800"
          y2="61.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="36.18%" style={{ stopColor: "var(--mvp-bar-from)" }} />
          <stop offset="95.25%" style={{ stopColor: "var(--mvp-bar-to)" }} />
        </linearGradient>
      </defs>
      <rect width="800" height="123" fill={`url(#${gradientId})`} />
    </svg>
  );
}
