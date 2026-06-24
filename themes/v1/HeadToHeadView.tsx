"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import TeamColumn from "./_components/head-to-head/TeamColumn";
import StatBox from "./_components/head-to-head/StatBox";
import StatIconColumn from "./_components/head-to-head/StatIconColumn";
import { useHeadToHead } from "@/hooks/widget-data";
import type { H2HTeam } from "@/types/widgets";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

const STATS_CONFIG = [
  { label: "TOTAL ELIMS", key: "total_kills" as const },
  { label: "TOTAL DAMAGE", key: "total_damages" as const },
  { label: "TOTAL KNOCKS", key: "total_knocks" as const },
  { label: "TOTAL HEALS", key: "total_heals" as const },
];

function getStatValue(team: H2HTeam | null, key: (typeof STATS_CONFIG)[number]["key"]) {
  if (!team) return 0;
  return team[key] ?? 0;
}

export default function HeadToHeadView({ tournamentID, preview = false }: Props) {
  const { teamA, teamB, info, ready } = useHeadToHead(tournamentID, { preview });
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current) return;

      // Use smaller translation distances and scale offsets to prevent rendering lag
      gsap.set(".anim-title", { opacity: 0, y: -20 });
      gsap.set(".anim-team-left", { opacity: 0, x: -40 });
      gsap.set(".anim-team-right", { opacity: 0, x: 40 });
      gsap.set(".anim-stat-left", { opacity: 0, x: -30 });
      gsap.set(".anim-stat-right", { opacity: 0, x: 30 });
      gsap.set(".anim-icons", { opacity: 0, scale: 0.96 });

      // Enable hardware acceleration (force3D: true) and use power4.out for a snappy start
      const tl = gsap.timeline({ defaults: { ease: "power4.out", force3D: true } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 0.8 })
        .to(".anim-team-left", { opacity: 1, x: 0, duration: 0.8 }, "<0.1")
        .to(".anim-team-right", { opacity: 1, x: 0, duration: 0.8 }, "<")
        .to(".anim-icons", { opacity: 1, scale: 1, duration: 0.6 }, "<0.05")
        .to(
          ".anim-stat-left",
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: { each: 0.05, from: "start" },
          },
          "<0.1",
        )
        .to(
          ".anim-stat-right",
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: { each: 0.05, from: "start" },
          },
          "<",
        )
        .from(
          ".anim-counter",
          {
            textContent: 0,
            duration: 1.0,
            ease: "power3.out",
            snap: { textContent: 1 },
          },
          "<0.05",
        );
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready || !teamA || !teamB) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent pl-16 pr-10">
        <div
          ref={containerRef}
          className="mx-auto flex h-full w-full max-w-[1720px] flex-col gap-8"
        >
          <div className="anim-title flex justify-center opacity-0">
            <Title title="TEAM HEAD 2 HEAD" data={info} />
          </div>

          <div className="bg-widget-primary grid w-full grid-cols-[1.25fr_1fr_0.5fr_1fr_1.25fr] gap-1">
            <TeamColumn
              teamName={teamA.team_name}
              logoUrl={teamA.team_logoUrl}
              className="anim-team-left opacity-0"
              side="left"
            />

            <div className="bg-widget-primary flex flex-col gap-1 h-full">
              {STATS_CONFIG.map((stat) => (
                <StatBox
                  key={stat.key}
                  label={stat.label}
                  value={getStatValue(teamA, stat.key)}
                  showLabel
                  className="anim-stat-left opacity-0"
                />
              ))}
            </div>

            <StatIconColumn className="anim-icons opacity-0" />

            <div className="bg-widget-primary flex flex-col gap-1 h-full">
              {STATS_CONFIG.map((stat) => (
                <StatBox
                  key={stat.key}
                  label={stat.label}
                  value={getStatValue(teamB, stat.key)}
                  showLabel
                  className="anim-stat-right opacity-0"
                />
              ))}
            </div>

            <TeamColumn
              teamName={teamB.team_name}
              logoUrl={teamB.team_logoUrl}
              className="anim-team-right opacity-0"
              side="right"
            />
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
