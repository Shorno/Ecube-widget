"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getTeamFlagDisplay, type TeamFlagFields } from "@/lib/utils/teamFlag";

export type { TeamFlagFields };

type Props = {
  team: TeamFlagFields;
  showTeamFlags?: boolean;
  className?: string;
  emojiClassName?: string;
  imageClassName?: string;
};

export default function TeamFlag({
  team,
  showTeamFlags = true,
  className,
  emojiClassName,
  imageClassName,
}: Props) {
  if (!showTeamFlags) return null;

  const flag = getTeamFlagDisplay(team);
  if (flag.kind === "none") return null;

  if (flag.kind === "emoji") {
    return (
      <span
        className={cn("leading-none", emojiClassName ?? "text-[18px]", className)}
        aria-hidden
      >
        {flag.value}
      </span>
    );
  }

  return (
    <Image
      src={flag.value}
      alt=""
      width={20}
      height={15}
      className={cn(
        "h-[15px] w-[20px] object-cover",
        imageClassName,
        className,
      )}
      unoptimized
    />
  );
}
