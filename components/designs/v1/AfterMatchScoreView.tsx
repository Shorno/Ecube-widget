"use client";

// DUMMY token-test card. Replace with the real design when ready.

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAfterMatchScore } from "@/hooks/widget-data";
import { useWidgetTheme } from "@/hooks/useWidgetTheme";
import WidgetStage from "@/components/common/WidgetStage";

export default function AfterMatchScoreView({
  tournamentID,
}: {
  tournamentID: string;
}) {
  const { winner, col1, info, ready } = useAfterMatchScore(tournamentID);
  const { theme } = useWidgetTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageReady, setStageReady] = useState(false);

  useGSAP(
    () => {
      if (!ready || !stageReady) return;
      gsap.set(".anim-row", { opacity: 0, x: -30 });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".anim-row", { opacity: 1, x: 0, stagger: 0.07, duration: 0.55 });
    },
    { scope: containerRef, dependencies: [ready, stageReady] },
  );

  // Don't render until data arrives
  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <div
        ref={containerRef}
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: "transparent" }}
      >
        <div className="w-150 space-y-3 rounded-xl border border-white/10 p-6">
          {/* Header — gradient + Unsplash image */}
          <div
            className="anim-row flex items-center gap-4 rounded-lg px-5 py-3"
            style={{
              background: `linear-gradient(var(--widget-gradient-angle), var(--widget-gradient-from), var(--widget-gradient-to))`,
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&h=80&fit=crop&q=80"
              width={56}
              height={56}
              alt="tournament"
              priority
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-widget-text-1 font-bold tracking-wide uppercase">
                {theme?.tournamentName ??
                  info?.stage_name ??
                  "After Match Score"}
              </p>
              <p className="text-widget-text-2 text-xs">
                {info?.game_stage} · {info?.game_day}
              </p>
            </div>
          </div>

          {/* Winner */}
          {winner && (
            <div className="anim-row bg-widget-primary flex items-center gap-3 rounded px-4 py-2.5">
              <span className="text-widget-v1-gold w-6 text-center font-bold">
                #1
              </span>
              <span className="text-widget-text-1 flex-1 font-semibold">
                {winner.team_name}
              </span>
              <span className="text-widget-secondary text-sm">
                {winner.positionPoints}
              </span>
              <span className="text-widget-primary-accent font-bold">
                {winner.totalPoints} PTS
              </span>
            </div>
          )}

          {/* Remaining teams */}
          {col1.slice(0, 5).map((team) => (
            <div
              key={team.team_id}
              className="anim-row bg-widget-primary-dark flex items-center gap-3 rounded px-4 py-2"
            >
              <span className="text-widget-text-3 w-6 text-center text-sm">
                #{team.position}
              </span>
              <span className="text-widget-text-1 flex-1 text-sm">
                {team.team_name}
              </span>
              <span className="text-widget-secondary-accent text-sm font-bold">
                {team.totalPoints}
              </span>
            </div>
          ))}

          {/* v1 Gold bar */}
          <div className="anim-row bg-widget-v1-gold rounded px-4 py-1.5 text-center">
            <p className="text-widget-text-2 text-[10px] font-bold tracking-widest uppercase">
              v1Gold · change in Settings → Colors → v1 Extras
            </p>
          </div>
        </div>
      </div>
    </WidgetStage>
  );
}
