"use client";
import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  createRef,
  useState,
} from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { TopFourCard } from "./TopFourCard";

function isTeamEliminated(players) {
  return players.length > 0 && players.every((p) => p.liveState === 5);
}

export function TopFourView({ teams, observingTeamId = null }) {
  const [visibleIds, setVisibleIds] = useState(
    () => new Set(teams.map((t) => t.team._id)),
  );

  const cardRefs = useRef({});
  teams.forEach((entry) => {
    if (!cardRefs.current[entry.team._id]) {
      cardRefs.current[entry.team._id] = createRef();
    }
  });

  const exitedIds = useRef(new Set());
  const flipStateRef = useRef(null);

  const runExitAnimation = useCallback((el, teamId) => {
    const tl = gsap.timeline({
      onComplete: () => {
        flipStateRef.current = Flip.getState(".top-four-card");
        setVisibleIds((prev) => {
          const next = new Set(prev);
          next.delete(teamId);
          return next;
        });
      },
    });
    tl.to(el, {
      backgroundColor: "rgba(239,68,68,0.4)",
      duration: 0.15,
      ease: "power1.in",
    })
      .to(el, {
        backgroundColor: "rgba(239,68,68,0)",
        duration: 0.15,
        ease: "power1.out",
      })
      .to(el, {
        keyframes: { x: [0, -7, 7, -5, 5, -3, 3, 0], easeEach: "none" },
        duration: 0.32,
        ease: "none",
      })
      .to(el, {
        y: 70,
        opacity: 0,
        scale: 0.88,
        duration: 0.45,
        ease: "power2.in",
      });
  }, []);

  useLayoutEffect(() => {
    if (flipStateRef.current) {
      Flip.from(flipStateRef.current, { duration: 0.5, ease: "power2.inOut" });
      flipStateRef.current = null;
    }
  }, [visibleIds]);

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
