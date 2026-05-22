import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  size?: "large" | "small";
  className?: string;
  rank?: number;
  playerName?: string;
  teamName?: string;
  playerImageSrc?: string;
  teamLogoSrc?: string;
};

export default function TopPlayersGroupCard({
  player,
  className,
  rank,
}: {
  player: any;
  className?: string;
  rank?: number;
}) {
  return (
    <div
      className={cn(
        "from-widget-primary font-primary to-widget-primary-accent border-widget-secondary flex w-full shrink-0 overflow-hidden border-r-4 bg-linear-to-b",
        className,
      )}
    >
      <div className="relative flex w-full flex-col">
        <div className="absolute bottom-0 left-0 flex w-full items-end">
          <div className="bg-widget-bg grid h-42 w-42 place-content-center">
            <Image
              src={player?.team_logoUrl}
              alt={player?.team_name}
              width={160}
              height={160}
              className="object-cover"
            />
          </div>
          <div className="from-widget-secondary to-widget-secondary-accent flex-1 bg-linear-to-r">
            <div className="text-widget-text-1 text-center text-[60px] leading-20">
              {player?.player_ign}
            </div>
          </div>
        </div>
      </div>
      <div className="w-100">
        <StatsCard rankonly value={rank || ""} label="Rank" />
        <StatsCard value={player?.kills} label="ELIMINATIONS" />
        <StatsCard value={player?.damages} label="DAMAGESS" />
        <StatsCard value={player?.assists} label="ASSISTS" />
      </div>
    </div>
  );
}

const StatsCard = ({
  rankonly,
  value,
  label,
}: {
  rankonly?: boolean;
  value: string | number;
  label: string;
}) => {
  return (
    <div>
      <div
        className={cn(
          "font-secondary text-widget-secondary from-widget-v1-forest to-widget-primary-accent grid h-34.25 place-content-center bg-linear-to-b text-[70px]",
          !rankonly &&
            "from-widget-bg to-widget-bg text-widget-text-2 bg-linear-to-b text-[100px]",
        )}
      >
        {!rankonly ? (
          <span className="">{value}</span>
        ) : (
          <span className="uppercase">Rank #{value}</span>
        )}
      </div>
      {!rankonly && (
        <div className="to-widget-primary font-primary text-widget-text-3 from-widget-primary-accent grid h-11.25 place-content-center bg-linear-to-r text-[30px]">
          {label}
        </div>
      )}
    </div>
  );
};
