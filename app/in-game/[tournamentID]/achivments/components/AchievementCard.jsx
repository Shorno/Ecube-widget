"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AchievementCard({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { y: 30, opacity: 0, rotationX: -45 },
      { y: 0, opacity: 1, rotationX: 0, duration: 0.6, ease: "power3.out" },
    ).to(containerRef.current.querySelectorAll(".achiev-glow"), {
      textShadow: "0px 0px 15px rgba(250, 204, 21, 0.8)",
      duration: 0.5,
      yoyo: true,
      repeat: 3,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="perspective-1000 flex flex-col items-center gap-1 text-center"
    >
      <span className="text-xs tracking-widest text-yellow-300 uppercase">
        Achievement Unlocked
      </span>
      <div className="mt-1 text-xl text-white">
        <span className="font-bold">{data.player?.ign}</span>
        <span className="mx-2 font-light text-gray-300">earned</span>
        <span className="achiev-glow font-black tracking-wider text-yellow-400">
          {data.achievement}
        </span>
      </div>
    </div>
  );
}
