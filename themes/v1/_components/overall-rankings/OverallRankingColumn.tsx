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
      <div className="w-full">
        <div className="flex w-full items-stretch h-[34px] bg-gradient-to-r from-widget-primary-accent to-widget-primary">
          <div
            className={cn(
              "grid h-[34px] w-[67px] shrink-0 place-content-center font-bold text-white uppercase",
              headerClassName,
            )}
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "23px",
            }}
          >
            RANK
          </div>
          <OverallStatsHeader className={headerClassName} />
        </div>
      </div>

      <div className="relative flex w-full min-w-0 flex-col">
        {teams.map((team) => (
          <OverallRankingRow
            key={team.team_id}
            team={team}
            className={rowClassName}
          />
        ))}
      </div>
    </div>
  );
}
