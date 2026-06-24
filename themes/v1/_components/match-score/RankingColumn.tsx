import { cn } from "@/lib/utils";
import type { TeamRow } from "@/types/widgets";
import RankingRow from "./RankingRow";
import StatsHeader, {
  MATCH_RANK_COL_WIDTH,
  MATCH_ROW_WIDTH,
  MATCH_TEAM_COL_WIDTH,
} from "./StatsHeader";

type Props = {
  teams: TeamRow[];
  showHeader?: boolean;
  rowClassName?: string;
  headerClassName?: string;
  className?: string;
};

export default function RankingColumn({
  teams,
  showHeader = false,
  rowClassName,
  headerClassName,
  className,
}: Props) {
  return (
    <div
      className={cn("flex shrink-0 flex-col", className)}
      style={{ width: MATCH_ROW_WIDTH }}
    >
      {showHeader && (
        <div
          className="z-10 flex items-stretch"
          style={{ width: MATCH_ROW_WIDTH }}
        >
          <div
            className="shrink-0"
            style={{ width: MATCH_RANK_COL_WIDTH + MATCH_TEAM_COL_WIDTH }}
          />
          <StatsHeader variant="column" className={headerClassName} />
        </div>
      )}
      <div className="relative flex w-full min-w-0 flex-col">
        {teams.map((team, idx) => (
          <RankingRow
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
