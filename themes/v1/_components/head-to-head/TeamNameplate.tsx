import { cn } from "@/lib/utils";
import TopFourCardShape from "../top-four/TopFourCardShape";

type Props = {
  name: string;
  className?: string;
  side?: "left" | "right";
  style?: React.CSSProperties;
};

export default function TeamNameplate({ name, className, side = "left", style }: Props) {
  return (
    <div
      className={cn("absolute w-[435px] h-[123px] select-none pointer-events-none", className)}
      style={style}
    >
      {/* Background shape container — mirrored on the right side */}
      <div
        className={cn(
          "absolute inset-0 w-[435px] h-[123px]",
          side === "right" && "scale-x-[-1]"
        )}
      >
        <TopFourCardShape
          width={435}
          height={123}
          primaryDarkColor="var(--widget-secondary-dark, #C6A646)"
          primaryAccentColor="var(--widget-secondary-accent, #D4BC75)"
          gradientStartColor="#FFFFFF"
          gradientStopColor="#D9DCEB"
        />
      </div>

      {/* Name Text — positioned normally (not mirrored) */}
      <div
        className="font-primary font-bold text-center text-[50px] leading-[60px] absolute z-25 flex items-center justify-center truncate uppercase left-0 right-0 px-24"
        style={{
          top: "32px",
          height: "60px",
          color: "var(--widget-primary, #00473C)",
        }}
      >
        {name}
      </div>
    </div>
  );
}
