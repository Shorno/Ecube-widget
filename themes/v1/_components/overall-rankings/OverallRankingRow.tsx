import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TeamRow } from "@/types/widgets";
import { OverallStatsValues } from "./OverallStatsHeader";

type Props = {
  team: TeamRow;
  isFirst?: boolean;
  className?: string;
};

export default function OverallRankingRow({
  team,
  className,
}: Props) {
  return (
    <div className={cn("relative flex h-[58px] w-full items-stretch", className)}>
      {/* RANK cell */}
      <div
        className="box-border flex h-[58px] w-[67px] shrink-0 items-center justify-center border border-widget-secondary bg-gradient-to-br from-widget-primary to-widget-primary-accent text-center text-widget-secondary"
        style={{
          fontFamily: "var(--font-anton)",
          fontSize: "36px",
        }}
      >
        {team.position}
      </div>

      {/* TEAM cell */}
      <div className="box-border flex h-[58px] min-w-0 flex-1 items-center border-t border-b border-r border-widget-primary bg-gradient-to-r from-[#D9DCEB] to-[#FFFFFF] pl-[20px]">
        {team.team_logoUrl && (
          <Image
            src={team.team_logoUrl}
            alt={team.team_name}
            width={44}
            height={44}
            className="mr-3 size-[44px] shrink-0 object-contain"
          />
        )}
        <p
          className="min-w-0 flex-1 truncate font-bold text-widget-text-2"
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "31px",
          }}
        >
          {team.team_name}
        </p>
      </div>

      <OverallStatsValues
        wwcd={team.wwcd}
        positionPoints={team.positionPoints}
        killPoints={team.killPoints}
        totalPoints={team.totalPoints}
      />
    </div>
  );
}
