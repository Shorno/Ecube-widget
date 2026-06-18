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
        "bg-[#E6EAF5] flex flex-col justify-between px-4 py-3",
        className,
      )}
      style={{ height: STAT_ROW_HEIGHT_PX }}
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
