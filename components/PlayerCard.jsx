import { cn } from "@/lib/utils";
import Image from "next/image";

const PlayerCard = ({ player, showTeamLogo = false, type = "", rank }) => {
  return (
    <div className="relative flex flex-col">
      {/* <div className={cn("bg-primary", rank===1 && "bg-yellow-800")}> */}
      <div className={cn("bg-primary")}>
        <div className="relative h-70 w-70 overflow-hidden px-16">
          <Image
            className="absolute inset-0 bottom-0 left-1/2 mt-8 -translate-x-1/2 object-cover"
            priority
            src={player?.player_imageUrl}
            width={200}
            height={200}
            alt=""
          />
        </div>
        <p className="bg-primary-shade-one p-2 text-center text-2xl">
          {player?.player_name}
        </p>
      </div>

      <div className="grid h-full flex-1 grid-cols-2 bg-black p-2">
        <div className="border-primary border-r-2 border-b bg-black">
          <p className="text-center text-lg font-normal uppercase">Elimis</p>
          <p className="text-center text-3xl">{player?.kills}</p>
        </div>
        <div className="border-primary border-b border-l-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">Damage</p>
          <p className="text-center text-3xl">
            {type === "MATCH" || type === "OVERALL"
              ? player?.damages
              : player?.damages}
          </p>
        </div>
        <div className="border-primary border-t-2 border-r-2 bg-black">
          <p className="mt-1 text-center text-lg font-normal uppercase">
            Assists
          </p>
          <p className="text-center text-3xl">
            {type === "MATCH" || type === "OVERALL"
              ? player?.assists
              : player?.assists}
          </p>
        </div>
        <div className="border-primary border-t-2 border-l-2 bg-black">
          <p className="mt-1 text-center text-lg font-normal uppercase">
            {type === "OVERALL" ? "E/M Ratio" : "Survival Time"}
          </p>
          <p className="text-center text-3xl">
            {type === "OVERALL"
              ? player?.kd
              : player?.survival_time_display?.text}
          </p>
        </div>
      </div>
      {player?.team_logo && showTeamLogo && (
        <div className="absolute top-0 left-0 bg-black/20">
          <Image
            priority
            src={player?.team_logo}
            width={64}
            height={64}
            alt=""
          />
        </div>
      )}
      {rank && (
        <p
          className={cn(
            "absolute top-2 right-2 text-center text-3xl font-bold",
            rank === 1 ? "text-yellow-500" : "text-silver",
          )}
        >
          #{rank}
        </p>
      )}
    </div>
  );
};

export default PlayerCard;
