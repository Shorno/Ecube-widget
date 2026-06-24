import { cn } from "@/lib/utils";

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
        "box-border bg-gradient-to-b from-white to-[#D9DCEB] border border-[#8000FF] flex flex-col justify-between items-center py-4 px-2 text-center w-full h-full",
        className,
      )}
    >
      {showLabel && (
        <span className="text-widget-text-2 font-secondary text-[30px] leading-[36px] font-bold uppercase">
          {label}
        </span>
      )}
      <span className="font-primary text-widget-text-2 anim-counter text-[64px] leading-none mb-1">{value}</span>
    </div>
  );
}
