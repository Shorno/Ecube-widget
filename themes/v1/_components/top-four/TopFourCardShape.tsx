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
      viewBox="0 0 301 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-0 h-full w-full", className)}
      style={style}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="150.5" y1="10" x2="150.5" y2="71" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--widget-secondary-dark, #C6A646)" />
          <stop offset="1" stopColor="var(--widget-secondary-accent, #D4BC75)" />
        </linearGradient>
      </defs>
      <path
        d="M301 57L284 74H301V57Z"
        fill="var(--widget-primary-dark, #00332B)"
      />
      <path
        d="M7 61.6346V8.98077H17.1034L20.7118 11.8269H30.8153L32.9803 8.98077H126.798L128.241 6.84615H241.544L242.988 4H287.01L300 17.5192V51.6731L277.628 74.4423H224.224L217.729 78H183.089L180.924 74.4423H164.325L161.438 78H58.2389L54.6305 73.0192H19.2685L7 61.6346Z"
        fill="var(--widget-primary-dark, #00332B)"
      />
      <path
        d="M17 79H54.6763L52.5 76H18L5.03597 63.3273V5.15455H18.705L20.8633 8.1H32.3741L34.5324 5.15455L100 5.89091L94.2446 0H67.6259L65.4676 2.20909H33.813L30.9353 5.89091H22.3022L19.4245 2.20909H2.8777V17.6727H0V36.8182H2.8777V64.8L17 79Z"
        fill="var(--widget-primary-accent, #00AD91)"
      />
      <path
        d="M60 71H22.5L10.5 60V10H15L19.5 14.5H31.5L35 10H77H173.997L176.808 12.8372H232.335L234.444 10H286.457L297 21.3488V48.3023L275.211 71H60Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}
