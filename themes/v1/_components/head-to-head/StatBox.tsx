import { cn } from "@/lib/utils";
import { STAT_ROW_HEIGHT_PX } from "./StatIcon";

type Props = {
  label: string;
  value: number | string;
  className?: string;
  showLabel?: boolean;
};

export default function StatBox({
  label,
  value,
  className,
  showLabel = true,
}: Props) {
  return (
    <div
      className={cn(
        "bg-gradient-to-t from-[#E6EAF5] to-white flex flex-col justify-between items-center py-3 px-2 text-center flex-1",
        className,
      )}
    >
      {showLabel && (
        <span className="text-widget-text-2 font-secondary text-[18px] leading-tight font-bold uppercase">
          {label}
        </span>
      )}
      <span className="font-primary text-widget-text-2 anim-counter text-[56px] leading-none">
        {value}
      </span>
    </div>
  );
}
