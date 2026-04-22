"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TeamElimCard({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.querySelectorAll(".team-slam"),
      { scale: 2, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.2,
        ease: "bounce.out",
      },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col items-center gap-2 rounded bg-red-950/50 p-2 text-center"
    >
      <span className="team-slam text-sm font-black tracking-widest text-red-500 uppercase">
        Team Eliminated
      </span>
      <div className="team-slam text-xl font-bold text-gray-500 line-through">
        {data.victimTeam?.name}
      </div>
      <div className="team-slam mt-1 text-sm text-gray-300">
        Wiped out by{" "}
        <span className="font-bold text-white">{data.causerPlayer?.name}</span>
      </div>
    </div>
  );
}
