import Image from "next/image";
import type { TopPlayer } from "@/types/widgets";

type StatEntry = { label: string; value: string | number | undefined };

type Props = {
  player: TopPlayer;
  rank: number;
  hideTeamLogo?: boolean;
  stats?: StatEntry[];
};

export default function PlayerCard({
  player,
  rank,
  hideTeamLogo,
  stats,
}: Props) {
  return (
    <div className="anim-card from-widget-primary to-widget-primary-accent flex min-w-83.75 shrink-0 flex-col bg-linear-to-b opacity-0">
      {/* image area */}
      <div className="relative z-20 overflow-hidden">
        <Image
          priority
          src={player.player_imageUrl || ""}
          alt={player.player_name}
          width={248}
          height={371}
          className="mx-auto mt-12 -mb-16 h-92.75 w-62 object-cover object-top"
        />

        {/* team logo — top right */}
        {!hideTeamLogo && player.team_logoUrl && (
          <div className="absolute inset-0 -z-1 grid place-content-center">
            <Image
              className="mx-auto"
              src={player.team_logoUrl}
              alt={player.team_name ?? ""}
              width={315}
              height={315}
            />
          </div>
        )}
      </div>

      {/* player name */}
      <div className="px-2">
        <div className="to-widget-primary from-widget-primary-accent bg-linear-to-r text-center">
          <p className="text-widget-text-3 font-secondary truncate text-[40px] uppercase">
            {player.player_ign ?? player.player_name}
          </p>
        </div>
      </div>

      {/* stats */}
      <div className="my-2 flex flex-col gap-2">
        {(
          stats ?? [
            { label: "Eliminations", value: player.kills },
            { label: "Damage", value: player.damages },
            { label: "Assists", value: player.assists },
            { label: "Surv. Time", value: player.survival_time_display?.text },
          ]
        ).map((s) => (
          <StatRow key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      {/* rank badge — top left */}
      <div className="from-widget-primary-dark font-secondary to-widget-primary-accent absolute -top-20 -left-18 grid h-20 w-20 translate-1/2 place-content-center bg-linear-to-b [clip-path:polygon(18%_11%,98%_28%,63%_94%,18%_71%)]">
        <span className="text-widget-text-3 text-2xl font-bold">#{rank}</span>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="font-primary flex w-full items-center px-2 py-1 text-center text-[28px]">
      <span className="bg-widget-bg text-widget-text-1 flex-1 uppercase">
        {label}
      </span>
      <div className="text-widget-text-2 w-1.5 bg-transparent"></div>
      <span className="text-widget-text-2 bg-widget-secondary flex-1 uppercase">
        {value ?? "0000"}
      </span>
    </div>
  );
}
