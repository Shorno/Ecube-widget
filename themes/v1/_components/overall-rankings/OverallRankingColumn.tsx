import { cn } from "@/lib/utils";
import type { TeamRow } from "@/types/widgets";
import OverallRankingRow from "./OverallRankingRow";
import OverallStatsHeader, {
  OVERALL_RANK_COL_WIDTH,
  OVERALL_ROW_WIDTH,
} from "./OverallStatsHeader";

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
    <div
      className={cn("flex shrink-0 flex-col", className)}
      style={{ width: OVERALL_ROW_WIDTH }}
    >
      <div>
        <div
          className="flex items-stretch h-[34px] bg-gradient-to-r from-widget-primary-accent to-widget-primary"
          style={{ width: OVERALL_ROW_WIDTH }}
        >
          <div
            className={cn(
              "grid h-[34px] shrink-0 place-content-center font-bold text-white uppercase",
              headerClassName,
            )}
            style={{
              width: OVERALL_RANK_COL_WIDTH,
              fontFamily: "var(--font-secondary)",
              fontSize: "23px",
            }}
          >
            RANK
          </div>
          <OverallStatsHeader className={headerClassName} />
        </div>
      </div>

      <div className="relative flex flex-col">
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
