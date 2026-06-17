import { cn } from "@/lib/utils";
import type { TeamRow } from "@/types/widgets";
import OverallRankingRow from "./OverallRankingRow";
import OverallStatsHeader from "./OverallStatsHeader";

type Props = {
  teams: TeamRow[];
  headerClassName?: string;
  rowClassName?: string;
  className?: string;
};

export default function OverallRankingColumn({
  teams,
  headerClassName,
  rowClassName,
  className,
}: Props) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col", className)}>
      <div className="mb-[2px] w-full">
        <div className="mb-[2px] flex w-full items-stretch">
          <div
            className={cn(
              "font-secondary grid h-[30px] w-[67px] shrink-0 place-content-center border border-widget-secondary-accent bg-widget-primary font-bold text-white uppercase",
              headerClassName,
            )}
          >
            <span className="text-[22px] leading-[26px]">RANK</span>
          </div>
          <OverallStatsHeader className={headerClassName} />
        </div>
      </div>

      <div className="relative flex w-full min-w-0 flex-col">
        {teams.map((team, idx) => (
          <OverallRankingRow
            key={team.team_id}
            team={team}
            isFirst={idx === 0}
            className={rowClassName}
          />
        ))}
      </div>
    </div>
  );
}
