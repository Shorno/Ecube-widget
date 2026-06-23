import Image from "next/image";
import { cn } from "@/lib/utils";
import TeamNameplate from "./TeamNameplate";

type Props = {
  teamName: string;
  logoUrl?: string;
  className?: string;
  side?: "left" | "right";
};

export default function TeamColumn({ teamName, logoUrl, className, side = "left" }: Props) {
  return (
    <div
      className={cn(
        "bg-widget-primary relative flex min-h-[520px] flex-col items-center justify-center px-4 pb-16",
        className,
      )}
    >
      {/* Side gold bracket/highlight on the outer edge */}
      {side === "left" ? (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none">
          <svg width="6" height="180" viewBox="0 0 6 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0 V40 L5 50 V130 L1 140 V180" stroke="var(--widget-secondary-accent)" strokeWidth="2" />
            <path d="M5 60 V120" stroke="var(--widget-secondary-accent)" strokeWidth="1" />
          </svg>
        </div>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end scale-x-[-1] pointer-events-none">
          <svg width="6" height="180" viewBox="0 0 6 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0 V40 L5 50 V130 L1 140 V180" stroke="var(--widget-secondary-accent)" strokeWidth="2" />
            <path d="M5 60 V120" stroke="var(--widget-secondary-accent)" strokeWidth="1" />
          </svg>
        </div>
      )}

      <div className="grid flex-1 place-content-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${teamName} logo`}
            width={280}
            height={280}
            className="object-contain"
            priority
          />
        ) : (
          <span className="font-primary text-widget-text-3 text-[120px] font-bold uppercase tracking-wider select-none leading-none opacity-90">
            LOGO
          </span>
        )}
      </div>

      <div className="absolute right-0 bottom-0 left-0">
        <TeamNameplate name={teamName} side={side} />
      </div>
    </div>
  );
}
