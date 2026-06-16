import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function DecorativeCorner({ className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0",
        className,
      )}
    >
      {/* Top-left green arrow decoration */}
      <svg
        className="absolute"
        style={{
          left: "-16.66px",
          top: "-87.68px",
          width: "220.39px",
          height: "116.14px",
          transform: "matrix(0.94, -0.35, -0.35, -0.94, 0, 0)",
          overflow: "visible",
        }}
        viewBox="0 0 220.39 116.14"
      >
        <path
          d="M 0 0 L 180 0 L 220.39 58.07 L 180 116.14 L 0 116.14 L 40 58.07 Z"
          fill="var(--widget-primary)"
          stroke="var(--widget-secondary-accent)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Top-left gold shard decoration */}
      <svg
        className="absolute"
        style={{
          left: "-53.48px",
          top: "0px",
          width: "115.95px",
          height: "96.06px",
          transform: "matrix(-0.98, -0.2, -0.2, 0.98, 0, 0)",
          overflow: "visible",
        }}
        viewBox="0 0 115.95 96.06"
      >
        <defs>
          <linearGradient id="gold-grad-left" x1="37.51%" y1="0%" x2="83.91%" y2="100%">
            <stop offset="0%" stopColor="var(--widget-secondary-accent)" />
            <stop offset="100%" stopColor="var(--widget-secondary-dark)" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="115.95"
          height="96.06"
          fill="url(#gold-grad-left)"
          stroke="var(--widget-secondary-accent)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Bottom-right gold shard decoration */}
      <svg
        className="absolute"
        style={{
          right: "-5.48px",
          top: "97.32px",
          width: "115.95px",
          height: "96.06px",
          transform: "matrix(-0.98, -0.2, -0.2, 0.98, 0, 0)",
          overflow: "visible",
        }}
        viewBox="0 0 115.95 96.06"
      >
        <defs>
          <linearGradient id="gold-grad-right" x1="37.51%" y1="0%" x2="83.91%" y2="100%">
            <stop offset="0%" stopColor="var(--widget-secondary-accent)" />
            <stop offset="100%" stopColor="var(--widget-secondary-dark)" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="115.95"
          height="96.06"
          fill="url(#gold-grad-right)"
          stroke="var(--widget-secondary-accent)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Bottom-right green shard decoration */}
      <svg
        className="absolute"
        style={{
          right: "-2.95px",
          top: "132.39px",
          width: "94.56px",
          height: "116.14px",
          transform: "matrix(-0.55, 0.84, 0.84, 0.55, 0, 0)",
          overflow: "visible",
        }}
        viewBox="0 0 94.56 116.14"
      >
        <path
          d="M 0 0 L 64.56 0 L 94.56 58.07 L 64.56 116.14 L 0 116.14 L 30 58.07 Z"
          fill="var(--widget-primary)"
          stroke="var(--widget-secondary-accent)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
