import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function LiveRankingHeader({ className }: Props) {
  return (
    <div
      className={cn(
        "relative h-[40px] w-[350px] shrink-0 select-none overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(90deg, var(--widget-gradient-from, #009980) 0%, var(--widget-gradient-to, #00332B) 100%)",
      }}
    >
      {/* Helmet Icon Background Block (Rectangle 289) */}
      <div
        className="absolute left-0 top-0 h-[40px] w-[48px] flex items-center justify-center"
        style={{ backgroundColor: "var(--widget-primary, #00473C)" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "32.66px",
            height: "32.66px",
            transform: "rotate(17.51deg)",
          }}
        >
          <Image
            src="/assets/head2head/helmet.svg"
            alt=""
            width={32}
            height={32}
            className="w-full h-full object-contain brightness-0 invert"
          />
        </div>
      </div>

      {/* TEAM Label */}
      <span
        className="absolute top-[14px] left-[59px] h-[18px] font-bold text-white uppercase"
        style={{
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        TEAM
      </span>

      {/* ALIVE Label */}
      <span
        className="absolute top-[14px] left-[200px] h-[18px] w-[50px] text-center font-bold text-white uppercase"
        style={{
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        ALIVE
      </span>

      {/* PTS Label */}
      <span
        className="absolute top-[14px] left-[255px] h-[18px] w-[40px] text-center font-bold text-white uppercase"
        style={{
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        PTS
      </span>

      {/* ELIMS Label */}
      <span
        className="absolute top-[14px] left-[300px] h-[18px] w-[40px] text-center font-bold text-white uppercase"
        style={{
          fontFamily: "var(--widget-font-primary), 'American Captain', sans-serif",
          fontSize: "18px",
          lineHeight: "18px",
        }}
      >
        ELIMS
      </span>
    </div>
  );
}
