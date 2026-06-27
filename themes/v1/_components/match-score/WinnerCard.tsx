import Image from "next/image";
import { GiChickenOven } from "react-icons/gi";
import { cn } from "@/lib/utils";
import type { TeamRow, WWCPlayer } from "@/types/widgets";
import DecorativeCorner from "./DecorativeCorner";
import RankBadge from "./RankBadge";
import StatsHeader, {
  StatsValues,
  STATS_BLOCK_WIDTH,
  MATCH_RANK_COL_WIDTH,
  MATCH_ROW_WIDTH,
  MATCH_TEAM_COL_WIDTH,
} from "./StatsHeader";

type Props = {
  team: TeamRow;
  players?: WWCPlayer[];
  className?: string;
};

const PORTRAIT_HEIGHT = 264.78;
const STATS_HEADER_HEIGHT = 30;
const PANEL_HEIGHT = PORTRAIT_HEIGHT + STATS_HEADER_HEIGHT;
const PORTRAIT_BG =
  "linear-gradient(158.82deg, #D9D9D9 3.56%, #FFFFFF 54.6%, #D9D9D9 109.21%)";
const TEAM_SECTION_WIDTH = MATCH_RANK_COL_WIDTH + MATCH_TEAM_COL_WIDTH;

export default function WinnerCard({ team, players = [], className }: Props) {
  const portraits = players.slice(0, 4);
  const centerPortraits = portraits.length > 0 && portraits.length < 4;
  const portraitImageClassName = centerPortraits
    ? "h-[246px] w-[164px] shrink-0 object-cover object-top"
    : "h-[246px] w-full max-w-[164px] object-cover object-top";

  return (
    <div className={cn("relative", className)} style={{ width: MATCH_ROW_WIDTH }}>
      {/* Portrait + left header column share one continuous background */}
      <div className="relative w-full" style={{ height: `${PANEL_HEIGHT}px` }}>
        <div
          className="absolute inset-x-0 top-0"
          style={{ height: `${PORTRAIT_HEIGHT}px` }}
        >
          <DecorativeCorner />
        </div>

        <div
          className="absolute inset-0 z-10 overflow-hidden rounded-t-[15px]"
          style={{ background: PORTRAIT_BG }}
        >
          <div className="relative" style={{ height: `${PORTRAIT_HEIGHT}px` }}>
            <RankBadge rank={team.position} variant="winner" />

            <div className="absolute top-0 right-5 z-20 grid size-[82px] place-content-center">
              <GiChickenOven className="text-widget-primary text-5xl" />
            </div>

            <div
              className={cn(
                "h-full gap-1 px-2 pt-14",
                centerPortraits
                  ? "flex items-end justify-center"
                  : "grid grid-cols-4 items-end justify-items-center",
              )}
            >
              {portraits.length > 0
                ? portraits.map((player, idx) => (
                    <Image
                      key={player.player_id ?? idx}
                      src={player.player_imageUrl || ""}
                      alt={player.player_name}
                      width={164}
                      height={246}
                      priority
                      className={portraitImageClassName}
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

        <div
          className="absolute inset-x-0 bottom-0 z-20 flex"
          style={{ height: `${STATS_HEADER_HEIGHT}px` }}
        >
          <div className="shrink-0" style={{ width: TEAM_SECTION_WIDTH }} />
          <StatsHeader
            variant="winner"
            style={{ width: STATS_BLOCK_WIDTH }}
          />
        </div>
      </div>

      <div
        className="border-widget-secondary-dark from-widget-gradient-to to-widget-gradient-from relative z-10 box-border flex h-[61px] items-center border bg-gradient-to-r px-4"
        style={{ width: MATCH_ROW_WIDTH }}
      >
        <p
          className="font-secondary text-widget-text-3 min-w-0 shrink-0 truncate text-[25px] leading-[30px] font-bold uppercase"
          style={{ width: TEAM_SECTION_WIDTH }}
        >
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
