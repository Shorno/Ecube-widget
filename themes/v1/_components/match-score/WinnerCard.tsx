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

const PORTRAIT_HEIGHT = 264.78;

export default function WinnerCard({ team, players = [], className }: Props) {
  const portraits = players.slice(0, 4);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Portrait frame — overflow visible so corner shards render outside the card */}
      <div
        className="relative w-full"
        style={{ height: `${PORTRAIT_HEIGHT}px` }}
      >
        <DecorativeCorner />

        <div className="absolute inset-0 z-10 overflow-hidden rounded-[15px] bg-[linear-gradient(158.82deg,#D9D9D9_3.56%,#FFFFFF_54.6%,#D9D9D9_109.21%)]">
          <RankBadge rank={team.position} variant="winner" />

          <div className="absolute top-0 right-5 z-20 grid size-[82px] place-content-center">
            <GiChickenOven className="text-widget-primary text-5xl" />
          </div>

          <div className="grid h-full grid-cols-4 items-end justify-items-center gap-1 px-2 pt-14">
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
      </div>

      {/* Stats block */}
      <div className="relative z-10 w-full">
        <div className="flex w-full">
          <div className="min-w-0 flex-1" />
          <StatsHeader
            variant="winner"
            style={{ width: STATS_BLOCK_WIDTH }}
          />
        </div>
        <div className="border-widget-secondary-dark from-widget-gradient-to to-widget-gradient-from box-border flex h-[61px] items-center border bg-gradient-to-r px-4">
          <p className="font-secondary text-widget-text-3 min-w-0 flex-1 truncate text-[25px] leading-[30px] font-bold uppercase">
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
    </div>
  );
}
