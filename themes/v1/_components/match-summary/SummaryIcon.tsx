import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  label: string;
  className?: string;
  width: number;
  height: number;
  colorVar?: string;
};

export default function SummaryIcon({
  src,
  label,
  className,
  width,
  height,
  colorVar = "--widget-text-3",
}: Props) {
  if (src.includes("heal.svg") || src.endsWith(".png")) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center",
          className,
        )}
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
