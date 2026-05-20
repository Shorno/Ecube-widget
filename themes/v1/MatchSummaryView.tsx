"use client";

// DUMMY token-test card. Replace with the real design when ready.

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMatchSummary } from "@/hooks/widget-data";
import { useWidgetTheme } from "@/hooks/useWidgetTheme";
import WidgetStage from "@/components/common/WidgetStage";
import type { MatchStats } from "@/types/widgets";

const STATS: { key: keyof MatchStats; label: string }[] = [
  { key: "total_kills", label: "Eliminations" },
  { key: "total_knocks", label: "Knocks" },
  { key: "total_heals", label: "Heals" },
  { key: "total_assists", label: "Assists" },
  { key: "total_grenade_kills", label: "Grenade Elims" },
  { key: "total_vehicle_kills", label: "Vehicle Elims" },
];

export default function MatchSummaryView({
  tournamentID,
}: {
  tournamentID: string;
}) {
  const { stats, info, ready } = useMatchSummary(tournamentID);
  const { theme } = useWidgetTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageReady, setStageReady] = useState(false);

  useGSAP(
    () => {
      if (!ready || !stageReady) return;
      gsap.set(".anim-stat", { opacity: 0, scale: 0.85 });
      gsap.timeline({ defaults: { ease: "back.out(1.4)" } }).to(".anim-stat", {
        opacity: 1,
        scale: 1,
        stagger: 0.07,
        duration: 0.5,
      });
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
        <div className="w-150 space-y-4 rounded-xl border border-white/10 p-6">
          {/* Header — gradient + Unsplash image */}
          <div
            className="flex items-center gap-4 rounded-lg px-5 py-3"
            style={{
              background: `linear-gradient(var(--widget-gradient-angle), var(--widget-gradient-from), var(--widget-gradient-to))`,
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=80&h=80&fit=crop&q=80"
              width={56}
              height={56}
              alt="match"
              priority
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-widget-text-1 font-bold tracking-wide uppercase">
                {theme?.tournamentName ?? info?.stage_name ?? "Match Summary"}
              </p>
              <p className="text-widget-text-2 text-xs">
                {info?.game_name ?? "—"}
              </p>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ key, label }) => (
              <div
                key={key}
                className="anim-stat bg-widget-primary-dark rounded p-4 text-center"
              >
                <p className="text-widget-text-3 mb-1 text-[10px] tracking-wider uppercase">
                  {label}
                </p>
                <p className="text-widget-primary-accent text-3xl font-bold">
                  {stats?.[key] ?? "—"}
                </p>
              </div>
            ))}
          </div>

          {/* v1 Gold bar */}
          <div className="bg-widget-v1-gold rounded px-4 py-1.5 text-center">
            <p className="text-widget-text-2 text-[10px] font-bold tracking-widest uppercase">
              v1Gold · change in Settings → Colors → v1 Extras
            </p>
          </div>
        </div>
      </div>
    </WidgetStage>
  );
}
