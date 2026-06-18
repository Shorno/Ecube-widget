import { cn } from "@/lib/utils";
import SummaryIcon from "./SummaryIcon";

type IconConfig = {
  src: string;
  label: string;
  width: number;
  height: number;
};

type Props = {
  label: string;
  value: number;
  icon: IconConfig;
  className?: string;
  padDigits?: number;
  statKey?: string;
};

export default function SummaryDataBox({
  label,
  value,
  icon,
  className,
  padDigits = 4,
  statKey,
}: Props) {
  const displayValue = String(value).padStart(padDigits, "0");

  const leftGradId = `leftBoxGrad-${statKey || "default"}`;
  const rightGradId = `rightBoxGrad-${statKey || "default"}`;
  const outerGradId = `outerBoxGrad-${statKey || "default"}`;

  return (
    <div className={cn("relative w-[436px] h-[179px] select-none mx-auto shrink-0", className)}>
      {/* Background and Borders SVG */}
      <svg
        viewBox="0 0 436 179"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Vector 11 (Outer Card background gradient) */}
          <linearGradient id={outerGradId} x1="5.23%" y1="0%" x2="96.73%" y2="0%">
            <stop offset="5.23%" stopColor="#009980" />
            <stop offset="96.73%" stopColor="#00332B" />
          </linearGradient>

          {/* Vector 12 (Left Box background gradient - rotated 180) */}
          <linearGradient id={leftGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1A0033" />
            <stop offset="100%" stopColor="#00332B" />
          </linearGradient>

          {/* Vector 13 (Right Box background gradient - normal) */}
          <linearGradient id={rightGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00332B" />
            <stop offset="100%" stopColor="#1A0033" />
          </linearGradient>
        </defs>

        {/* Vector 11 (Outer Card Frame) */}
        <path
          d="M 0,10.5 L 6,10.5 L 6,0 L 22,0 L 22,10.5 L 147,10.5 L 147,0 L 380,0 L 396,10.5 L 436,50.5 L 436,168.5 L 420,168.5 L 420,179 L 404,179 L 404,168.5 L 270,168.5 L 270,179 L 250,179 L 250,168.5 L 22,168.5 L 22,179 L 6,179 L 6,168.5 Z"
          fill={`url(#${outerGradId})`}
          stroke="#C6A646"
          strokeWidth="1"
          strokeLinejoin="miter"
        />

        {/* Vector 12 (Left Box Area) */}
        <path
          d="M 6,10.5 L 143,10.5 L 143,168.5 L 6,168.5 L 6,156.5 L 0,156.5 L 0,22.5 L 6,22.5 Z"
          fill={`url(#${leftGradId})`}
          stroke="#D4BC75"
          strokeWidth="1"
        />

        {/* Vector 13 (Right Box Area) */}
        <path
          d="M 147,50.5 L 391,50.5 L 431,90.5 L 431,168.5 L 419,168.5 L 419,156.5 L 159,156.5 L 159,168.5 L 147,168.5 Z"
          fill={`url(#${rightGradId})`}
          stroke="#D4BC75"
          strokeWidth="1"
        />
      </svg>

      {/* HTML Content Overlays matching Figma CSS properties */}
      
      {/* Vector 12 Content (Left Box - Icon Area) */}
      <div className="absolute left-[6px] top-[10.5px] w-[137px] h-[158px] flex items-center justify-center">
        <SummaryIcon
          src={icon.src}
          label={icon.label}
          width={icon.width}
          height={icon.height}
        />
      </div>

      {/* Right Header Tab Content (Title Area) */}
      <div className="absolute left-[147px] top-[10.5px] w-[249px] h-[40px] flex items-center justify-center px-3">
        <span
          className={cn(
            "text-white font-secondary font-bold uppercase text-center select-none whitespace-nowrap",
            label.length > 15 ? "text-[23px] leading-[28px]" : "text-[30px] leading-[36px]"
          )}
          style={{ fontFamily: "var(--font-secondary), var(--font-barlow-condensed), sans-serif" }}
        >
          {label}
        </span>
      </div>

      {/* Vector 13 Content (Right Box - Value Area) */}
      <div className="absolute left-[147px] top-[50.5px] w-[284px] h-[118px] flex items-center justify-center">
        <span
          className="text-white font-primary anim-count text-[90px] leading-[90px] font-normal text-center select-none"
          data-value={value}
          data-pad={padDigits}
          style={{
            fontFamily: "var(--font-american-captain)",
          }}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}
