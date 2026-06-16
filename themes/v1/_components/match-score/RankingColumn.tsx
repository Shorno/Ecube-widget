import { cn } from "@/lib/utils";
import type { TeamRow } from "@/types/widgets";
import RankingRow from "./RankingRow";
import StatsHeader from "./StatsHeader";

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
    <div className={cn("flex w-full min-w-0 flex-col", className)}>
      {showHeader && (
        <div className="z-10 flex w-full items-stretch">
          <div className="min-w-0 flex-1" />
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
