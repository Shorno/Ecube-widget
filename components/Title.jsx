import { cn } from "@/lib/utils";

const Title = ({ title, subtitle, data, stageOnly, side = false }) => {
  // Split once to avoid repeating work
  const words = title.split(" ");
  const titleMain = words[0];

  // Recombine everything after the first word
  const titlehightlight = words.slice(1).join(" ");

  const game_stage = data?.stage_name || data?.game_stage;
  const game_day = data?.day || data?.game_day;
  const game_name = data?.match_name || data?.game_name;

  return (
    <div className="mx-auto w-max text-center text-white uppercase">
      <div className={cn(side && "flex items-end gap-4")}>
        <h1
          className={cn(
            "title-main mb-2 text-7xl font-extrabold",
            side && "mb-0",
          )}
        >
          {titleMain}{" "}
          <span className={cn("text-primary-shade-one", side && "text-white")}>
            {titlehightlight}
          </span>
        </h1>

        {data && !side && (
          <p className="bg-primary-shade-one title-sub mx-auto w-max p-1 px-2 text-3xl">
            {stageOnly
              ? `${game_stage}`
              : `${game_stage} - ${game_day} - ${game_name}`}
          </p>
        )}
        {data && side && (
          <div className="text-white font-bold">
            <p className="text-3xl">{game_stage}</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xl">{game_day}</p>
              <p className="text-xl">{game_name}</p>
            </div>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="bg-primary-shade-one title-sub mx-auto w-max p-1 text-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Title;
