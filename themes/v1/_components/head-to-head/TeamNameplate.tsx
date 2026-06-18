import { cn } from "@/lib/utils";

type Props = {
  name: string;
  className?: string;
  side?: "left" | "right";
};

export default function TeamNameplate({ name, className, side = "left" }: Props) {
  return (
    <div className={cn("relative w-full py-4", className)}>
      {/* Octagonal beveled nameplate with light-gray gradient background and dark green text */}
      <div
        className="bg-gradient-to-t from-[#E6EAF5] to-white text-widget-primary font-secondary relative mx-auto w-[88%] py-3 text-center text-[28px] font-bold tracking-wide uppercase shadow-sm"
        style={{
          clipPath:
            "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
        }}
      >
        {name}
      </div>

      {/* Show left gold techy bracket only for the left team */}
      {side === "left" && (
        <div className="absolute top-1/2 left-[2%] h-[60px] w-[50px] -translate-y-1/2 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M45 4 H14 L4 14 V46 L14 56 H45"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 20 V40"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M20 4 H35"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="1.5"
            />
            <path
              d="M20 56 H35"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}

      {/* Show right gold techy bracket only for the right team */}
      {side === "right" && (
        <div className="absolute top-1/2 right-[2%] h-[60px] w-[50px] -translate-y-1/2 scale-x-[-1] pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M45 4 H14 L4 14 V46 L14 56 H45"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 20 V40"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M20 4 H35"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="1.5"
            />
            <path
              d="M20 56 H35"
              stroke="var(--widget-secondary-accent)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
