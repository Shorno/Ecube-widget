import { cn } from "@/lib/utils";
import type { MatchInfo } from "@/types/widgets";

type Props = {
  title: string;
  subtitle?: string;
  data?: MatchInfo | null;
  stageOnly?: boolean;
  className?: string;
};

export default function Title({
  title,
  subtitle,
  data,
  stageOnly,
  className,
}: Props) {
  const words = title.split(" ");
  const titleMain = words[0];
  const titleHighlight = words.slice(1).join(" ");

  const stage = data?.stage_name || data?.game_stage;
  const day = data?.day || data?.game_day;
  const matchName = data?.match_name || data?.game_name;

  return (
    <div className={cn("flex shrink-0 items-end gap-8 uppercase", className)}>
      {/* left — main title, first word plain, rest in primary color */}
      <h1 className="font-primary text-widget-text-3 text-[140px] leading-none tracking-tighter">
        {titleMain} {titleHighlight}
      </h1>

      {/* right — match meta stacked */}
      {(data || subtitle) && (
        <div className="mb-2 flex flex-col justify-center">
          {data && stage && (
            <span className="text-widget-text-3 text-[44px] leading-none">
              {stage}
            </span>
          )}
          {data && !stageOnly && (day || matchName) && (
            <span className="text-widget-text-3 text-[44px] leading-none">
              {matchName && <span className="mr-14">{matchName}</span>}
              {day && <span>{day}</span>}
            </span>
          )}
          {subtitle && (
            <span className="text-widget-text-3 text-[44px] leading-none">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
