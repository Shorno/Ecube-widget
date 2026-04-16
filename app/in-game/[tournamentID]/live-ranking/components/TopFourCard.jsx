import { forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import Image from "next/image";

function getPlayerBarColor(liveState) {
  if (liveState === 0 || liveState === 3) return "bg-green-500";
  if (liveState === 4) return "bg-red-500";
  return "bg-gray-500";
}

// forwardRef so TopFourView can drive the exit animation on the root element.
export const TopFourCard = forwardRef(function TopFourCard(
  { entry, entranceDelay = 0, isObserved = false },
  ref,
) {
  useEffect(() => {
    const el = typeof ref === "function" ? null : ref?.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: entranceDelay },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminated = entry.players.every((p) => p.liveState === 5);
  const hasWinProb = entry.winProbability !== null;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-64 shrink-0 flex-col border-b-2 border-l-4 bg-blue-900",
        isObserved ? "border-blue-400 border-l-yellow-400" : "border-blue-400",
      )}
    >
      {/* Main row — logo, name, health bars */}
      <div className="flex h-14 items-center">
        {/* Logo + name */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden px-2">
          <Image
            src={entry.team.logoImageUrl}
            alt={entry.team.name}
            width={28}
            height={28}
            className="shrink-0 rounded object-contain"
            unoptimized
          />
          <span className="truncate text-sm font-bold uppercase text-white">
            {entry.team.name}
          </span>
        </div>

        {/* Player health bars with blue-zone indicator */}
        <div className="flex h-full items-center gap-0.75 bg-blue-700 px-2">
          {entry.players.map((player, idx) => (
            <div key={idx} className="relative">
              <div className="flex h-8 w-1.25 flex-col justify-end overflow-hidden rounded-[1px] bg-gray-800/40">
                <div
                  className={cn(
                    "w-full transition-all duration-500 ease-out",
                    getPlayerBarColor(player.liveState),
                  )}
                  style={{ height: `${player.healths}%` }}
                />
              </div>
              {player.isOutsideZone && player.liveState !== 5 && (
                <div
                  className="pointer-events-none absolute -inset-0.5 animate-pulse rounded-sm"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(147,197,253,0.95) 0%, rgba(59,130,246,0.55) 45%, transparent 100%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Win probability — horizontal strip at the bottom, only when backend sends values */}
      {hasWinProb && (
        <div className="flex h-7 w-full">
          <div className="flex flex-1 items-center justify-center bg-[#4F63CE] text-xs font-bold text-white">
            WWCD
          </div>
          <div className="flex flex-1 items-center justify-center bg-[#3C41B4] text-xs font-bold text-white">
            {entry.winProbability}%
          </div>
        </div>
      )}

      {/* Dark overlay when fully eliminated */}
      {eliminated && (
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
      )}

      {/* Observer highlight */}
      {isObserved && (
        <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-yellow-400/80" />
      )}
    </div>
  );
});
