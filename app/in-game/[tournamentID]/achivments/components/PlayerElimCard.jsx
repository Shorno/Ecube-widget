"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PlayerElimCard({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.querySelectorAll(".elim-slide"),
      { x: (i) => (i % 2 === 0 ? -30 : 30), opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-1 text-center"
    >
      <span className="elim-slide text-xs tracking-wide text-orange-400 uppercase">
        Elimination
      </span>
      <div className="elim-slide flex items-center gap-3 text-lg">
        <span className="font-bold text-white">{data.causerPlayer?.ign}</span>
        <span className="text-red-500">⚔️</span>
        <span className="font-bold text-gray-500 line-through">
          {data.victimPlayer?.ign}
        </span>
      </div>
    </div>
  );
}
