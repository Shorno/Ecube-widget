"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  /** Called once the one-shot animation finishes so the row can settle to its grayed state. */
  onDone: () => void;
};

const KNOCKED = "var(--widget-status-knocked, #FF0000)";

/**
 * One-shot inline elimination effect layered over a live-ranking row:
 * red flash → light shine sweep → "ELIMINATED" stamp, then it clears itself.
 */
export default function EliminationFlash({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const flash = root.querySelector<HTMLElement>("[data-flash]");
      const shine = root.querySelector<HTMLElement>("[data-shine]");
      const stamp = root.querySelector<HTMLElement>("[data-stamp]");
      if (!flash || !shine || !stamp) return;

      const tl = gsap.timeline({ onComplete: onDone });

      tl.set(root, { autoAlpha: 1 })
        .fromTo(
          flash,
          { opacity: 0 },
          { opacity: 0.9, duration: 0.12, ease: "power2.out" },
        )
        .fromTo(
          shine,
          { xPercent: -160 },
          { xPercent: 260, duration: 0.55, ease: "power2.inOut" },
          0.05,
        )
        .fromTo(
          stamp,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(1.8)" },
          0.1,
        )
        .to(flash, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.7)
        .to(
          stamp,
          { opacity: 0, scale: 1.06, duration: 0.3, ease: "power2.in" },
          0.9,
        );

      return () => tl.kill();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div
        data-flash
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, color-mix(in srgb, ${KNOCKED} 70%, black) 0%, ${KNOCKED} 45%, color-mix(in srgb, ${KNOCKED} 78%, black) 100%)`,
          opacity: 0,
        }}
      />
      <div
        data-shine
        className="absolute inset-y-0 left-0 w-1/3"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
          transform: "skewX(-18deg)",
          filter: "blur(1px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          data-stamp
          className="font-secondary text-widget-text-3 font-black uppercase"
          style={{
            fontSize: "26px",
            letterSpacing: "0.25em",
            opacity: 0,
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          ELIMINATED
        </span>
      </div>
    </div>
  );
}
