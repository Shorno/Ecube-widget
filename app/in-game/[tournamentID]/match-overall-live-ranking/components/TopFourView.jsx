"use client";
import { useRef, useEffect, useCallback, createRef, useState } from "react";
import gsap from "gsap";
import { TopFourCard } from "./TopFourCard";

function isTeamEliminated(players) {
  return players.length > 0 && players.every((p) => p.liveState === 5);
}

export function TopFourView({ teams, observingTeamId = null }) {
  // Tracks which team IDs are still visible in the DOM.
  // When a card's exit animation finishes, its ID is removed → flex re-centers.
  const [visibleIds, setVisibleIds] = useState(
    () => new Set(teams.map((t) => t.team._id)),
  );

  // Stable ref map: { [teamId]: React.RefObject<HTMLDivElement> }
  const cardRefs = useRef({});
  teams.forEach((entry) => {
    if (!cardRefs.current[entry.team._id]) {
      cardRefs.current[entry.team._id] = createRef();
    }
  });

  const exitedIds = useRef(new Set());

  const runExitAnimation = useCallback((el, teamId) => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Remove from visibleIds → card unmounts → flex container re-centers
        setVisibleIds((prev) => {
          const next = new Set(prev);
          next.delete(teamId);
          return next;
        });
      },
    });

    // Phase 1: red flash
    tl.to(el, { backgroundColor: "rgba(239,68,68,0.4)", duration: 0.15, ease: "power1.in" })
      .to(el, { backgroundColor: "rgba(239,68,68,0)",   duration: 0.15, ease: "power1.out" })
      // Phase 2: death rattle
      .to(el, {
        keyframes: { x: [0, -7, 7, -5, 5, -3, 3, 0], easeEach: "none" },
        duration: 0.32,
        ease: "none",
      })
      // Phase 3: fall out downward
      .to(el, { y: 70, opacity: 0, scale: 0.88, duration: 0.45, ease: "power2.in" });
  }, []);

  useEffect(() => {
    teams.forEach((entry) => {
      const id = entry.team._id;
      if (isTeamEliminated(entry.players) && !exitedIds.current.has(id)) {
        exitedIds.current.add(id);
        const el = cardRefs.current[id]?.current;
        if (el) runExitAnimation(el, id);
      }
    });
  }, [teams, runExitAnimation]);

  const visibleTeams = teams.filter((t) => visibleIds.has(t.team._id));

  return (
    <div className="flex items-start justify-center gap-4">
      {visibleTeams.map((entry, i) => (
        <TopFourCard
          key={entry.team._id}
          ref={cardRefs.current[entry.team._id]}
          entry={entry}
          entranceDelay={i * 0.1}
          isObserved={observingTeamId === entry.team._id}
        />
      ))}
    </div>
  );
}
