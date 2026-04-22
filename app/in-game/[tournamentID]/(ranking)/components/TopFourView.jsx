"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

function getPlayerBarColor(liveState) {
  if ([0, 1, 2, 3, 6].includes(liveState)) return "bg-green-500";
  if (liveState === 4) return "bg-red-500";
  return "bg-gray-500";
}

function isTeamEliminated(players) {
  if (!players || players.length === 0) return false;
  return players.every((p) => p.liveState === 5);
}

export function TopFourView({ teams, observingTeamId = null }) {
  const [visibleIds, setVisibleIds] = useState(() =>
    teams.filter((t) => !isTeamEliminated(t.players)).map((t) => t.team.id),
  );

  const exitedIds = useRef(new Set());
  const cardRefs = useRef({});
  const flipStateRef = useRef(null);
  const containerRef = useRef(null);

  // Staggered entrance — set initial state before paint, then animate in
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".top-four-card");
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // "The Drop" — watch for newly eliminated teams
  useEffect(() => {
    teams.forEach((entry) => {
      const id = entry.team.id;
      if (!isTeamEliminated(entry.players)) return;
      if (exitedIds.current.has(id)) return;
      exitedIds.current.add(id);

      const el = cardRefs.current[id];
      if (!el) return;

      const tl = gsap.timeline({
        onComplete: () => {
          flipStateRef.current = containerRef.current
            ? Flip.getState(
                containerRef.current.querySelectorAll(".top-four-card"),
              )
            : null;
          setVisibleIds((prev) => prev.filter((v) => v !== id));
        },
      });

      tl.to(el, { x: 5, duration: 0.05, repeat: 8, yoyo: true, ease: "none" })
        .set(el, { x: 0 })
        .to(el, { y: 100, opacity: 0, duration: 0.5, ease: "power2.in" });
    });
  }, [teams]);

  // Flip re-center after a card is removed from the DOM
  useLayoutEffect(() => {
    if (!flipStateRef.current || !containerRef.current) return;
    Flip.from(flipStateRef.current, {
      duration: 0.4,
      ease: "power2.inOut",
      absolute: true,
    });
    flipStateRef.current = null;
  }, [visibleIds]);

  const visibleTeams = teams.filter((t) => visibleIds.includes(t.team.id));

  return (
    <div ref={containerRef} className="flex items-start justify-center gap-4">
      {visibleTeams.map((entry) => {
        const eliminated = isTeamEliminated(entry.players);
        const hasWinProb = entry.winProbability != null;
        const hasBlueZone = entry.players.some(
          (p) => p.isOutsideZone && p.liveState !== 5,
        );

        return (
          <div
            key={entry.team.id}
            ref={(el) => {
              if (el) cardRefs.current[entry.team.id] = el;
            }}
            className={`top-four-card relative flex w-64 shrink-0 flex-col border-b-2 border-l-4 bg-blue-900 ${
              observingTeamId === entry.team.id
                ? "border-blue-400 border-l-yellow-400"
                : "border-blue-400"
            }`}
          >
            <div className="relative flex h-14 items-center">
              <div className="flex flex-1 items-center gap-2 overflow-hidden px-2">
                <Image
                  src={entry.team.logo}
                  alt={entry.team.name}
                  width={28}
                  height={28}
                  className="shrink-0 rounded object-contain"
                  unoptimized
                />
                <span className="truncate text-sm font-bold text-white uppercase">
                  {entry.team.name}
                </span>
              </div>

              <div className="flex h-full items-center gap-0.75 bg-blue-700 px-2">
                {entry.players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex h-8 w-1.25 flex-col justify-end overflow-hidden rounded-[1px] bg-gray-800/40"
                  >
                    <div
                      className={`w-full ${getPlayerBarColor(player.liveState)}`}
                      style={{ height: `${player.healths}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* {hasBlueZone && (
              <div
                className="pointer-events-none absolute inset-0 z-50"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(147,197,253,0.5) 100%, rgba(59,130,246,0.5) 100%, transparent 100%)",
                }}
              />
            )}
            */}

            {hasWinProb && (
              <div className="flex h-7 w-full">
                <div className="flex flex-1 items-center justify-center bg-[#4F63CE] text-xs font-bold text-white">
                  WWCD
                </div>
                <div className="flex flex-1 items-center justify-center bg-[#3C41B4] text-xs font-bold text-white">
                  {Math.round(entry.winProbability)}%
                </div>
              </div>
            )}

            {eliminated && (
              <div className="pointer-events-none absolute inset-0 bg-black/60" />
            )}

            {observingTeamId === entry.team.id && (
              <div className="pointer-events-none absolute inset-0 ring-2 ring-yellow-400/80 ring-inset" />
            )}
          </div>
        );
      })}
    </div>
  );
}
