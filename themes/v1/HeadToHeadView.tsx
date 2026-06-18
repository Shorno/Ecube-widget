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

type Props = { tournamentID: string };

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

export default function HeadToHeadView({ tournamentID }: Props) {
  const { teamA, teamB, info, ready } = useHeadToHead(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-team-left", { opacity: 0, x: -100 });
      gsap.set(".anim-team-right", { opacity: 0, x: 100 });
      gsap.set(".anim-stat-left", { opacity: 0, x: -80 });
      gsap.set(".anim-stat-right", { opacity: 0, x: 80 });
      gsap.set(".anim-icons", { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })
        .to(".anim-team-left", { opacity: 1, x: 0, duration: 1.0 }, "<0.2")
        .to(".anim-team-right", { opacity: 1, x: 0, duration: 1.0 }, "<")
        .to(".anim-icons", { opacity: 1, scale: 1, duration: 0.8 }, "<0.1")
        .to(
          ".anim-stat-left",
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: { each: 0.08, from: "start" },
          },
          "<0.15",
        )
        .to(
          ".anim-stat-right",
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: { each: 0.08, from: "start" },
          },
          "<",
        )
        .from(
          ".anim-counter",
          {
            textContent: 0,
            duration: 1.2,
            ease: "power2.out",
            snap: { textContent: 1 },
          },
          "<0.1",
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
          <div className="anim-title opacity-0">
            <Title title="TEAM HEAD 2 HEAD" data={info} />
          </div>

          <div className="bg-widget-primary grid w-full grid-cols-[1.25fr_1fr_0.5fr_1fr_1.25fr] gap-1">
            <TeamColumn
              teamName={teamA.team_name}
              logoUrl={teamA.team_logoUrl}
              className="anim-team-left opacity-0"
            />

            <div className="flex flex-col gap-1 py-3">
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

            <div className="flex flex-col gap-1 py-3">
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
            />
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
