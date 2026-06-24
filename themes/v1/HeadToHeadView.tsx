"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import StatBox from "./_components/head-to-head/StatBox";
import StatIcon from "./_components/head-to-head/StatIcon";
import TeamNameplate from "./_components/head-to-head/TeamNameplate";
import { useHeadToHead } from "@/hooks/widget-data";
import type { H2HTeam } from "@/types/widgets";

type Props = {
  tournamentID: string;
  preview?: boolean;
};

const STATS_CONFIG = [
  {
    label: "TOTAL ELIMS",
    key: "total_kills" as const,
    top: 256,
    height: 171,
    icon: "/assets/head2head/target.svg",
    iconW: 108,
    iconH: 108,
  },
  {
    label: "TOTAL DAMAGE",
    key: "total_damages" as const,
    top: 427,
    height: 170,
    icon: "/assets/head2head/helmet.svg",
    iconW: 108,
    iconH: 108,
  },
  {
    label: "TOTAL KNOCKS",
    key: "total_knocks" as const,
    top: 597,
    height: 171,
    icon: "/assets/head2head/knock-out.svg",
    iconW: 122,
    iconH: 83,
  },
  {
    label: "TOTAL HEALS",
    key: "total_heals" as const,
    top: 768,
    height: 170,
    icon: "/assets/head2head/heal.svg",
    iconW: 78,
    iconH: 78,
  },
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

      gsap.set(".anim-title", { opacity: 0, y: -20 });
      gsap.set(".anim-team-left", { opacity: 0, x: -40 });
      gsap.set(".anim-team-right", { opacity: 0, x: 40 });
      gsap.set(".anim-stat-left", { opacity: 0, x: -30 });
      gsap.set(".anim-stat-right", { opacity: 0, x: 30 });
      gsap.set(".anim-icons", { opacity: 0, scale: 0.96 });

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
      <Layout className="!p-0 bg-transparent w-[1920px] h-[1080px] relative overflow-hidden">
        <div ref={containerRef} className="w-[1920px] h-[1080px] relative select-none">
          
          {/* Main background container (Rectangle 2) */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: "228px",
              top: "256px",
              width: "1464px",
              height: "682px",
              background: "linear-gradient(180deg, var(--widget-primary, #00473C) 0%, var(--widget-gradient-from, #009980) 100%)",
            }}
          />

          {/* Vector 9 (Left side gold accent border) */}
          <div
            className="absolute bg-gradient-to-b from-[var(--widget-secondary-dark,#C6A646)] to-[var(--widget-secondary-accent,#D4BC75)]"
            style={{ left: "220px", top: "342px", width: "8px", height: "353px" }}
          />

          {/* Vector 10 (Right side gold accent border - matrix flipped) */}
          <div
            className="absolute bg-gradient-to-b from-[var(--widget-secondary-dark,#C6A646)] to-[var(--widget-secondary-accent,#D4BC75)] scale-x-[-1]"
            style={{ left: "1692px", top: "342px", width: "8px", height: "353px" }}
          />

          {/* Left Team Logo (LOGO) */}
          <div
            className="anim-team-left absolute z-15 flex items-center justify-center opacity-0"
            style={{ left: "310px", top: "522px", width: "246px", height: "150px" }}
          >
            {teamA.team_logoUrl ? (
              <Image
                src={teamA.team_logoUrl}
                alt={`${teamA.team_name} logo`}
                width={246}
                height={150}
                className="object-contain"
                unoptimized
                priority
              />
            ) : (
              <span className="font-primary text-widget-text-3 text-[150px] leading-[150px] uppercase select-none opacity-90">
                LOGO
              </span>
            )}
          </div>

          {/* Right Team Logo (LOGO) */}
          <div
            className="anim-team-right absolute z-15 flex items-center justify-center opacity-0"
            style={{ left: "1364px", top: "522px", width: "246px", height: "150px" }}
          >
            {teamB.team_logoUrl ? (
              <Image
                src={teamB.team_logoUrl}
                alt={`${teamB.team_name} logo`}
                width={246}
                height={150}
                className="object-contain"
                unoptimized
                priority
              />
            ) : (
              <span className="font-primary text-widget-text-3 text-[150px] leading-[150px] uppercase select-none opacity-90">
                LOGO
              </span>
            )}
          </div>

          {/* Team Nameplates (Group 9 and Group 10) */}
          <TeamNameplate
            name={teamA.team_name}
            side="left"
            className="anim-team-left opacity-0"
            style={{ left: "155px", top: "781px" }}
          />

          <TeamNameplate
            name={teamB.team_name}
            side="right"
            className="anim-team-right opacity-0"
            style={{ left: "1330px", top: "781px" }}
          />

          {/* Statistics Box Rows & Central Icons */}
          {STATS_CONFIG.map((stat) => (
            <div key={stat.key}>
              {/* Left Stats Box */}
              <div
                className="anim-stat-left absolute z-10 opacity-0"
                style={{
                  left: "622px",
                  top: `${stat.top}px`,
                  width: "244px",
                  height: `${stat.height}px`,
                }}
              >
                <StatBox
                  label={stat.label}
                  value={getStatValue(teamA, stat.key)}
                  showLabel
                />
              </div>

              {/* Right Stats Box */}
              <div
                className="anim-stat-right absolute z-10 opacity-0"
                style={{
                  left: "1054px",
                  top: `${stat.top}px`,
                  width: "244px",
                  height: `${stat.height}px`,
                }}
              >
                <StatBox
                  label={stat.label}
                  value={getStatValue(teamB, stat.key)}
                  showLabel
                />
              </div>

              {/* Central Stat Icon */}
              <div
                className="anim-icons absolute z-15 flex items-center justify-center opacity-0"
                style={{
                  left: "866px",
                  top: `${stat.top}px`,
                  width: "188px",
                  height: `${stat.height}px`,
                }}
              >
                <StatIcon
                  src={stat.icon}
                  label={stat.label}
                  width={stat.iconW}
                  height={stat.iconH}
                />
              </div>
            </div>
          ))}

          {/* Title Area */}
          <div
            className="anim-title font-primary absolute text-widget-text-3 text-center uppercase tracking-[-0.01em] opacity-0"
            style={{
              left: "355px",
              top: "103px",
              width: "854px",
              height: "162px",
              fontSize: "120px",
              lineHeight: "162px",
            }}
          >
            TEAM HEAD 2 HEAD
          </div>

          <div
            className="anim-title font-primary absolute text-widget-text-3 text-center uppercase opacity-0 whitespace-nowrap"
            style={{
              left: "1244px",
              top: "109px",
              minWidth: "322px",
              height: "80px",
              fontSize: "80px",
              lineHeight: "80px",
            }}
          >
            {info?.stage_name || info?.game_stage || "GRAND FINAL"}
          </div>

          <div
            className="anim-title font-primary absolute text-widget-text-3 uppercase opacity-0 whitespace-nowrap"
            style={{
              left: "1244px",
              top: "189px",
              width: "112px",
              height: "50px",
              fontSize: "50px",
              lineHeight: "50px",
            }}
          >
            {info?.day || info?.game_day || "DAY 99"}
          </div>

          <div
            className="anim-title font-primary absolute text-widget-text-3 text-right uppercase opacity-0 whitespace-nowrap"
            style={{
              left: "1414px",
              top: "189px",
              width: "152px",
              height: "50px",
              fontSize: "50px",
              lineHeight: "50px",
            }}
          >
            {info?.match_name || info?.game_name || "MATCH 99"}
          </div>

        </div>
      </Layout>
    </WidgetStage>
  );
}
