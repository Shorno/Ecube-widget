"use client";

import { useId, useState } from "react";

const TEAM_COLORS = [
  "#f59e0b",
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#fb7185",
  "#facc15",
  "#22d3ee",
  "#c084fc",
];

export function teamColor(teamId) {
  const numericId = Number(teamId);
  const index = Number.isFinite(numericId)
    ? Math.abs(Math.trunc(numericId)) % TEAM_COLORS.length
    : 0;
  return TEAM_COLORS[index];
}

export function safeTeamLogoUrl(value) {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  try {
    const protocol = new URL(url).protocol;
    return protocol === "http:" || protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export default function TeamLogoGlyph({
  teamId,
  logoUrl,
  observed = false,
  radius = 8,
}) {
  const [hasFailed, setHasFailed] = useState(false);
  const clipId = useId();
  const safeLogoUrl = safeTeamLogoUrl(logoUrl);
  const showLogo = Boolean(safeLogoUrl && !hasFailed);
  const innerRadius = radius - 1;

  return (
    <g
      data-team-id={String(teamId)}
      data-team-logo={showLogo ? "image" : "fallback"}
    >
      {showLogo ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <circle r={innerRadius} />
            </clipPath>
          </defs>
          <circle r={innerRadius} fill="#0c1220" />
          <image
            href={safeLogoUrl}
            x={-innerRadius}
            y={-innerRadius}
            width={innerRadius * 2}
            height={innerRadius * 2}
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${clipId})`}
            onError={() => setHasFailed(true)}
            pointerEvents="none"
          />
        </>
      ) : (
        <circle r={innerRadius} fill={teamColor(teamId)} />
      )}
      <circle
        r={radius}
        fill="none"
        stroke={observed ? "#ffffff" : "#0c1220"}
        strokeWidth={observed ? 3 : 1.5}
      />
    </g>
  );
}
