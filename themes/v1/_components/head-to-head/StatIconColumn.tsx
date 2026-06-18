import { cn } from "@/lib/utils";
import StatIcon, { STAT_ROW_HEIGHT_PX } from "./StatIcon";

/** 2x prior 54px frame; width/height tuned per asset viewBox */
const STAT_ICONS = [
  {
    src: "/assets/head2head/target.svg",
    label: "Total Elims",
    width: 108,
    height: 108,
  },
  {
    src: "/assets/head2head/helmet.svg",
    label: "Total Damage",
    width: 108,
    height: 108,
  },
  {
    src: "/assets/head2head/knock-out.svg",
    label: "Total Knocks",
    width: 122,
    height: 83,
  },
  {
    src: "/assets/head2head/heal.svg",
    label: "Total Heals",
    width: 78,
    height: 78,
  },
] as const;

type Props = {
  className?: string;
};

export default function StatIconColumn({ className }: Props) {
  return (
    <div
      className={cn(
        "bg-widget-primary flex flex-col gap-1 h-full",
        className,
      )}
    >
      {STAT_ICONS.map((icon) => (
        <div
          key={icon.src}
          className="flex w-full items-center justify-center flex-1"
        >
          <StatIcon
            src={icon.src}
            label={icon.label}
            width={icon.width}
            height={icon.height}
          />
        </div>
      ))}
    </div>
  );
}
