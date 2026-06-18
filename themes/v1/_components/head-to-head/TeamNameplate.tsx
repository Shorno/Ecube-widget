import { cn } from "@/lib/utils";

type Props = {
  name: string;
  className?: string;
};

export default function TeamNameplate({ name, className }: Props) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="bg-widget-primary-dark text-widget-text-3 font-secondary relative mx-auto w-[92%] py-3 text-center text-[28px] font-bold tracking-wide uppercase"
        style={{
          clipPath:
            "polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)",
        }}
      >
        {name}
      </div>

      <svg
        className="text-widget-secondary-accent absolute top-1/2 left-0 h-10 w-8 -translate-y-1/2"
        viewBox="0 0 118 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M1.11502 0.789919L33.7365 84.1493L50.7352 80.9194L68.3448 77.5732L85.9553 74.2272L103.071 70.9754L116.584 4.90061L1.11502 0.789919Z"
          fill="url(#h2hGoldLeft)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient
            id="h2hGoldLeft"
            x1="56.8003"
            y1="11.6164"
            x2="99.1269"
            y2="67.1814"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--widget-secondary-accent)" />
            <stop offset="1" stopColor="var(--widget-secondary-dark)" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="text-widget-secondary-accent absolute top-1/2 right-0 h-10 w-8 -translate-y-1/2 scale-x-[-1]"
        viewBox="0 0 118 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M1.11502 0.789919L33.7365 84.1493L50.7352 80.9194L68.3448 77.5732L85.9553 74.2272L103.071 70.9754L116.584 4.90061L1.11502 0.789919Z"
          fill="url(#h2hGoldRight)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient
            id="h2hGoldRight"
            x1="56.8003"
            y1="11.6164"
            x2="99.1269"
            y2="67.1814"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--widget-secondary-accent)" />
            <stop offset="1" stopColor="var(--widget-secondary-dark)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
