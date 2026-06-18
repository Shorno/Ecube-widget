import Image from "next/image";
import { cn } from "@/lib/utils";

/** Shared with StatBox — keep row heights in sync for icon/stat alignment */
export const STAT_ROW_HEIGHT_PX = 110;

type Props = {
  src: string;
  label: string;
  className?: string;
  width: number;
  height: number;
  /** CSS variable used for icon fill — defaults to white broadcast text */
  colorVar?: string;
};

export default function StatIcon({
  src,
  label,
  className,
  width,
  height,
  colorVar = "--widget-text-3",
}: Props) {
  if (src.includes("heal.svg")) {
    return (
      <div
        className={cn("relative shrink-0 flex items-center justify-center", className)}
        style={{ width, height }}
      >
        <Image
          src={src}
          alt={label}
          width={width}
          height={height}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("shrink-0", className)}
      style={{
        width,
        height,
        backgroundColor: `var(${colorVar})`,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
