import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TeamRow } from "@/types/widgets";
import RankBadge from "./RankBadge";
import { StatsValues, STATS_BLOCK_WIDTH, MATCH_TEAM_COL_WIDTH } from "./StatsHeader";

type Props = {
  team: TeamRow;
  isFirst?: boolean;
  className?: string;
};

export default function RankingRow({ team, isFirst = false, className }: Props) {
  return (
    <div className={cn("relative h-12 w-full", className)}>
      {/* Full-width row bar — Figma Rectangle 321 */}
      <div
        className={cn(
          "absolute inset-0 box-border border-b border-r border-l border-widget-primary bg-[linear-gradient(90deg,#FFFFFF_0%,#D9DCEB_100%)]",
          isFirst && "border-t"
        )}
        style={{ clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0 100%)" }}
      />

      <div className="relative flex h-full w-full items-stretch">
        <RankBadge rank={team.position} variant="row" isFirst={isFirst} className="relative z-10 origin-bottom-left" />

        <div
          className="flex shrink-0 items-center pl-[20px] pr-2"
          style={{ width: MATCH_TEAM_COL_WIDTH }}
        >
          {team.team_logoUrl && (
            <Image
              src={team.team_logoUrl}
              alt={team.team_name}
              width={33}
              height={33}
              className="size-[33px] shrink-0 object-contain mr-3"
            />
          )}
          <p className="font-secondary min-w-0 flex-1 truncate text-[25px] leading-[30px] font-bold text-widget-text-2 uppercase">
            {team.team_name}
          </p>
        </div>

        <div
          className="flex shrink-0 items-center justify-end pr-3"
          style={{ width: STATS_BLOCK_WIDTH }}
        >
          <StatsValues
            positionPoints={team.positionPoints}
            killPoints={team.killPoints}
            totalPoints={team.totalPoints}
            variant="row"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
