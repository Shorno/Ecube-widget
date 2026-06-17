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
  isFirst = false,
  className,
}: Props) {
  return (
    <div className={cn("relative h-12 w-full", className)}>
      <div
        className={cn(
          "absolute inset-0 box-border border-r border-b border-l border-widget-primary bg-[linear-gradient(90deg,#FFFFFF_0%,#D9DCEB_100%)]",
          isFirst && "border-t",
        )}
        style={{
          clipPath: "polygon(15px 0, calc(100% - 90px) 0, calc(100% - 90px) 100%, 0 100%)",
        }}
      />

      <div className="relative flex h-full w-full items-stretch">
        <div
          className={cn(
            "box-border grid h-12 w-[67px] shrink-0 place-content-center border-r border-b border-l border-widget-secondary bg-gradient-to-br from-widget-primary to-widget-primary-accent text-[30px] leading-[45px] text-widget-secondary skew-x-[-17deg]",
            isFirst && "border-t",
          )}
          style={{ fontFamily: "var(--font-anton)" }}
        >
          <span className="inline-block skew-x-[17deg]">{team.position}</span>
        </div>

        <div className="flex min-w-0 flex-1 items-center pl-[20px]">
          {team.team_logoUrl && (
            <Image
              src={team.team_logoUrl}
              alt={team.team_name}
              width={33}
              height={33}
              className="mr-3 size-[33px] shrink-0 object-contain"
            />
          )}
          <p className="font-secondary min-w-0 flex-1 truncate text-[25px] leading-[30px] font-bold text-widget-text-2 uppercase">
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
    </div>
  );
}
