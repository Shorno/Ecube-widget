"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FirstBloodCard({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.children,
      { scale: 0.5, opacity: 0, y: 20 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(2)",
      },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-1 text-center"
    >
      <span className="text-sm font-bold tracking-widest text-red-500 uppercase">
        First Blood
      </span>
      <div className="text-lg text-white">
        <span className="font-bold text-red-400">{data.causerPlayer?.ign}</span>
        <span className="mx-2 font-light text-gray-300">
          drew first blood on
        </span>
        <span className="font-bold text-gray-400 line-through">
          {data.victimPlayer?.ign}
        </span>
      </div>
    </div>
  );
}
