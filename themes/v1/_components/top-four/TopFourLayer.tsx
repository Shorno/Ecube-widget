"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import type { LiveRankEntry } from "@/types/live-rank";
import TopFourCard from "./TopFourCard";
import { TOP_FOUR_GAP, TOP_FOUR_TOP_OFFSET } from "./layout";

gsap.registerPlugin(Flip);

function teamId(entry: LiveRankEntry) {
  return entry.team.id ?? entry.team._id ?? String(entry.rank);
}

function isTeamEliminated(players?: LiveRankEntry["players"]) {
  if (!players || players.length === 0) return false;
  return players.every((p) => p.liveState === 5);
}

type Props = {
  teams: LiveRankEntry[];
  observingTeamId?: string | null;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
};

export default function TopFourLayer({
  teams,
  observingTeamId = null,
  showTeamFlags = true,
  showFullTeamName = false,
}: Props) {
  const [visibleIds, setVisibleIds] = useState(() =>
    teams.filter((t) => !isTeamEliminated(t.players)).map((t) => teamId(t)),
  );

  const exitedIds = useRef(new Set<string>());
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!layerRef.current) return;
    gsap.fromTo(
      layerRef.current,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
    );
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".top-four-card");
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
    );
  }, []);

  useEffect(() => {
    teams.forEach((entry) => {
      const id = teamId(entry);
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

  useLayoutEffect(() => {
    if (!flipStateRef.current || !containerRef.current) return;
    Flip.from(flipStateRef.current, {
      duration: 0.4,
      ease: "power2.inOut",
      absolute: true,
    });
    flipStateRef.current = null;
  }, [visibleIds]);

  const visibleTeams = teams.filter((t) => visibleIds.includes(teamId(t)));

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed left-1/2 z-30 -translate-x-1/2"
      style={{ top: TOP_FOUR_TOP_OFFSET }}
    >
      <div
        ref={containerRef}
        className="flex items-start justify-center"
        style={{ gap: TOP_FOUR_GAP }}
      >
        {visibleTeams.map((entry, index) => {
          const id = teamId(entry);
          return (
            <div
              key={id}
              ref={(el) => {
                cardRefs.current[id] = el;
              }}
            >
              <TopFourCard
                entry={entry}
                rank={index + 1}
                isObserved={observingTeamId === id}
                showTeamFlags={showTeamFlags}
                showFullTeamName={showFullTeamName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
