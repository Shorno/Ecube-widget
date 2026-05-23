import { cn } from "@/lib/utils";
import Image from "next/image";
import type { TopPlayer } from "@/types/widgets";

type Props = {
  player: TopPlayer;
  className?: string;
  rank?: number;
  size?: "large" | "small";
};

export default function TopPlayersGroupCard({
  player,
  className,
  rank,
  size = "large",
}: Props) {
  const sm = size === "small";
  return (
    <div
      className={cn(
        "from-widget-primary font-secondary to-widget-primary-accent border-widget-secondary flex w-full shrink-0 overflow-hidden border-r-4 bg-linear-to-b",
        className,
        sm && "max-h-81.75",
      )}
    >
      <div className="relative flex w-full flex-col">
        <div className="flex h-full flex-col items-center justify-center">
          <Image
            src={player?.player_imageUrl || ""}
            alt={player?.player_ign ?? ""}
            width={sm ? 130 : 350}
            height={sm ? 250 : 500}
            className={cn("object-contain", sm && "h-auto w-auto")}
          />
        </div>
        <div className="absolute bottom-0 left-0 flex w-full items-end">
          <div
            className={cn(
              "bg-widget-bg grid h-42 w-42 place-content-center",
              sm && "h-20 w-20",
            )}
          >
            <Image
              src={player?.team_logoUrl || ""}
              alt={player?.team_name ?? ""}
              width={sm ? 75 : 160}
              height={sm ? 75 : 160}
              className={cn("object-cover p-2", sm && "h-auto w-auto")}
            />
          </div>
          <div className="flex-1">
            <div
              className={cn(
                "text-widget-text-3 to-widget-primary from-widget-primary-accent bg-linear-to-r text-center text-[40px]",
                sm && "text-[20px]",
              )}
            >
              {player?.player_ign}
            </div>
            <div
              className={cn(
                "text-widget-text-1 from-widget-secondary to-widget-secondary-accent bg-linear-to-r text-center text-[60px] leading-20",
                sm && "text-[30px]",
              )}
            >
              {player?.player_ign}
            </div>
          </div>
        </div>
      </div>
      <div className={cn("w-100", sm && "w-35.5")}>
        <StatsCard sm={sm} rankonly value={rank || ""} label="Rank" />
        <StatsCard sm={sm} value={player?.kills} label="ELIMINATIONS" />
        <StatsCard sm={sm} value={player?.damages} label="DAMAGESS" />
        <StatsCard sm={sm} value={player?.assists} label="ASSISTS" />
      </div>
    </div>
  );
}

const StatsCard = ({
  sm,
  rankonly,
  value,
  label,
}: {
  sm?: boolean;
  rankonly?: boolean;
  value: string | number | undefined;
  label: string;
}) => {
  return (
    <div>
      <div
        className={cn(
          "font-secondary text-widget-secondary from-widget-v1-forest to-widget-primary-accent grid h-34.25 place-content-center bg-linear-to-b text-[70px]",
          !rankonly &&
            "from-widget-bg to-widget-bg text-widget-text-2 bg-linear-to-b text-[100px]",
          sm && !rankonly && "h-15.75 text-[40px]",
          sm && rankonly && "h-16.5 text-[26px]",
        )}
      >
        {!rankonly ? (
          <span className="">{value}</span>
        ) : (
          <span className="uppercase">Rank #{value}</span>
        )}
      </div>
      {!rankonly && (
        <div
          className={cn(
            "to-widget-primary font-primary text-widget-text-3 from-widget-primary-accent grid h-11.25 place-content-center bg-linear-to-r text-[30px]",
            sm && !rankonly && "font-secondary h-auto text-[16px]",
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
};
