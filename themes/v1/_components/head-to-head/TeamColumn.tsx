import Image from "next/image";
import { cn } from "@/lib/utils";
import TeamNameplate from "./TeamNameplate";

type Props = {
  teamName: string;
  logoUrl?: string;
  className?: string;
};

export default function TeamColumn({ teamName, logoUrl, className }: Props) {
  return (
    <div
      className={cn(
        "bg-widget-primary relative flex min-h-[520px] flex-col items-center justify-center px-4 pb-16",
        className,
      )}
    >
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
          <div className="bg-widget-primary-dark h-[280px] w-[280px]" />
        )}
      </div>

      <div className="absolute right-0 bottom-0 left-0">
        <TeamNameplate name={teamName} />
      </div>
    </div>
  );
}
