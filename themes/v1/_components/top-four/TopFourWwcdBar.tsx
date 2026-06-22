import { cn } from "@/lib/utils";
import { TOP_FOUR_CARD_WIDTH, TOP_FOUR_WWCD_HEIGHT } from "./layout";

type Props = {
  winProbability: number;
  className?: string;
};

export default function TopFourWwcdBar({ winProbability, className }: Props) {
  return (
    <div
      className={cn("flex w-full overflow-hidden font-bold text-white", className)}
      style={{ width: TOP_FOUR_CARD_WIDTH, height: TOP_FOUR_WWCD_HEIGHT }}
    >
      <div
        className="flex flex-1 items-center justify-center font-primary text-xs uppercase tracking-wide"
        style={{ backgroundColor: "#4F63CE" }}
      >
        WWCD
      </div>
      <div
        className="flex flex-1 items-center justify-center font-primary text-xs"
        style={{ backgroundColor: "#3C41B4" }}
      >
        {Math.round(winProbability)}%
      </div>
    </div>
  );
}
