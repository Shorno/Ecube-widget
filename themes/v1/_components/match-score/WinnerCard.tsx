import Image from "next/image";
import { GiChickenOven } from "react-icons/gi";
import { cn } from "@/lib/utils";
import type { TeamRow, WWCPlayer } from "@/types/widgets";
import DecorativeCorner from "./DecorativeCorner";
import RankBadge from "./RankBadge";
import StatsHeader, { StatsValues, STATS_BLOCK_WIDTH } from "./StatsHeader";

type Props = {
  team: TeamRow;
  players?: WWCPlayer[];
  className?: string;
};

export default function WinnerCard({ team, players = [], className }: Props) {
  const portraits = players.slice(0, 4);

  return (
    <div className={cn("relative w-full h-[315.63px]", className)}>
      <DecorativeCorner />

      {/* Portrait panel — Rectangle 309 */}
      <div className="absolute left-0 top-0 z-10 w-full h-[264.78px] overflow-hidden rounded-[15px] bg-[linear-gradient(158.82deg,#D9D9D9_3.56%,#FFFFFF_54.6%,#D9D9D9_109.21%)] px-2 pt-[18px]">
        <RankBadge rank={team.position} variant="winner" />

        {/* Chicken grill icon container — Mask group */}
        <div className="absolute top-0 right-[20px] z-20 flex h-[91.93px] w-[81.2px] items-center justify-center bg-transparent">
          <GiChickenOven className="text-widget-primary text-5xl" />
        </div>

        <div className="grid grid-cols-4 items-end justify-items-center gap-1">
          {portraits.length > 0
            ? portraits.map((player, idx) => (
                <Image
                  key={player.player_id ?? idx}
                  src={player.player_imageUrl || ""}
                  alt={player.player_name}
                  width={164}
                  height={246}
                  priority
                  className="h-[246px] w-full max-w-[164px] object-cover object-top"
                />
              ))
            : Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[246px] w-full max-w-[164px] bg-[#D9D9D9]/40"
                  aria-hidden
                />
              ))}
        </div>
      </div>

      {/* Yellow stats header — sits right above the bottom bar */}
      <StatsHeader
        variant="winner"
        className="absolute right-0 top-[226.26px] z-20"
        style={{ width: STATS_BLOCK_WIDTH }}
      />

      {/* Stats block bottom bar — Rectangle 310 */}
      <div className="absolute left-0 top-[254.26px] z-10 box-border flex h-[61.37px] w-full items-center border border-widget-secondary-dark bg-gradient-to-r from-widget-gradient-from to-widget-gradient-to px-4">
        <p className="font-secondary min-w-0 flex-1 truncate text-[25px] leading-[30px] font-bold text-white uppercase">
          {team.team_name}
        </p>
        <StatsValues
          positionPoints={team.positionPoints}
          killPoints={team.killPoints}
          totalPoints={team.totalPoints}
          variant="winner"
        />
      </div>
    </div>
  );
}
