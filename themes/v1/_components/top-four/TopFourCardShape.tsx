"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  primaryColor?: string;
  primaryDarkColor?: string;
  primaryAccentColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
};

/** Angular gold-framed card shell — Figma Top Four team bar */
export default function TopFourCardShape({
  className,
  style,
  width = 301,
  height = 79,
  primaryColor = "var(--widget-primary, #00473C)",
  primaryDarkColor = "var(--widget-primary-dark, #00332B)",
  primaryAccentColor = "var(--widget-primary-dark, #00332B)",
  gradientStartColor,
  gradientStopColor,
}: Props) {
  const gradientId = useId().replace(/:/g, "");
  const useGradient = gradientStartColor != null && gradientStopColor != null;

  const sy = height / 79;
  const sx = (x: number) => (x < 150.5 ? x * sy : width - (301 - x) * sy);
  const syVal = (y: number) => y * sy;
  const p = (x: number, y: number) => `${sx(x)} ${syVal(y)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-0 h-full w-full", className)}
      style={style}
      aria-hidden
    >
      <defs>
        {useGradient && (
          <linearGradient
            id={gradientId}
            x1={width / 2}
            y1={10 * sy}
            x2={width / 2}
            y2={71 * sy}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={gradientStartColor} />
            <stop offset="1" stopColor={gradientStopColor} />
          </linearGradient>
        )}
      </defs>
      <path
        d={`M ${p(301, 57)} L ${p(284, 74)} H ${sx(301)} V ${syVal(57)} Z`}
        fill={primaryDarkColor}
      />
      <path
        d={`M ${p(7, 61.6346)} V ${syVal(8.98077)} H ${sx(17.1034)} L ${p(20.7118, 11.8269)} H ${sx(30.8153)} L ${p(32.9803, 8.98077)} H ${sx(126.798)} L ${p(128.241, 6.84615)} H ${sx(241.544)} L ${p(242.988, 4)} H ${sx(287.01)} L ${p(300, 17.5192)} V ${syVal(51.6731)} L ${p(277.628, 74.4423)} H ${sx(224.224)} L ${p(217.729, 78)} H ${sx(183.089)} L ${p(180.924, 74.4423)} H ${sx(164.325)} L ${p(161.438, 78)} H ${sx(58.2389)} L ${p(54.6305, 73.0192)} H ${sx(19.2685)} L ${p(7, 61.6346)} Z`}
        fill={primaryDarkColor}
      />
      <path
        d={`M ${p(17, 79)} H ${sx(54.6763)} L ${p(52.5, 76)} H ${sx(18)} L ${p(5.03597, 63.3273)} V ${syVal(5.15455)} H ${sx(18.705)} L ${p(20.8633, 8.1)} H ${sx(32.3741)} L ${p(34.5324, 5.15455)} L ${p(100, 5.89091)} L ${p(94.2446, 0)} H ${sx(67.6259)} L ${p(65.4676, 2.20909)} H ${sx(33.813)} L ${p(30.9353, 5.89091)} H ${sx(22.3022)} L ${p(19.4245, 2.20909)} H ${sx(2.8777)} V ${syVal(17.6727)} H ${sx(0)} V ${syVal(36.8182)} H ${sx(2.8777)} V ${syVal(64.8)} L ${p(17, 79)} Z`}
        fill={primaryAccentColor}
      />
      <path
        d={`M ${p(60, 71)} H ${sx(22.5)} L ${p(10.5, 60)} V ${syVal(10)} H ${sx(15)} L ${p(19.5, 14.5)} H ${sx(31.5)} L ${p(35, 10)} H ${sx(77)} H ${sx(173.997)} L ${p(176.808, 12.8372)} H ${sx(232.335)} L ${p(234.444, 10)} H ${sx(286.457)} L ${p(297, 21.3488)} V ${syVal(48.3023)} L ${p(275.211, 71)} H ${sx(60)} Z`}
        fill={useGradient ? `url(#${gradientId})` : primaryColor}
      />
    </svg>
  );
}
