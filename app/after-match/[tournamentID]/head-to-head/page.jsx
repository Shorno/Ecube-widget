"use client";
import Layout from "@/components/layout";
import Title from "@/components/Title";
import { use, useRef } from "react";
import { useGetHeadToHeadQuery } from "@/lib/services/widget-api";
import Image from "next/image";
import WidgetStage from "@/components/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const statsConfig = [
  { label: "Damages", key: "total_damages" },
  { label: "Knocks", key: "total_knocks" },
  { label: "Eliminations", key: "total_kills" },
  { label: "Surv.Time", key: "total_survival_time" },
  { label: "Total Points", key: "totalPoints" },
];

function HeadToHead({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetHeadToHeadQuery({ tournamentID });
  const containerRef = useRef(null);
  const getMaxSurvivalTime = (team) => {
    const players = team?.players ?? [];
    if (!players.length) return null;
    return (
      players.reduce((best, p) =>
        (p?.survival_time_display?.minute ?? 0) >
        (best?.survival_time_display?.minute ?? 0)
          ? p
          : best,
      ).survival_time_display?.text ?? null
    );
  };

  const teamA = data?.data?.[0]
    ? {
        ...data.data[0],
        total_survival_time: getMaxSurvivalTime(data.data[0]),
      }
    : null;
  const teamB = data?.data?.[1]
    ? {
        ...data.data[1],
        total_survival_time: getMaxSurvivalTime(data.data[1]),
      }
    : null;

  useGSAP(
    () => {
      if (!data || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -30 });
      gsap.set(".anim-team-left", { opacity: 0, x: -60 });
      gsap.set(".anim-team-right", { opacity: 0, x: 60 });
      gsap.set(".anim-row", { opacity: 0, y: 30 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Title drops in from top
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 0.8 })

        // 2. Both team banners slide in from their sides simultaneously
        .to(".anim-team-left", { opacity: 1, x: 0, duration: 0.9 }, "<0.1")
        .to(".anim-team-right", { opacity: 1, x: 0, duration: 0.9 }, "<")

        // 3. Compare rows stagger up
        .to(
          ".anim-row",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: { each: 0.08, from: "start" },
          },
          "<0.2",
        );
    },
    { scope: containerRef, dependencies: [data] },
  );

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
    <div ref={containerRef}>
    <Layout top>
      <div className="anim-title opacity-0">
        <Title title="Team Head-to-Head" data={data?.info} />
      </div>
      <div className="wrapper">
        <div className="grid grid-cols-4 gap-4">
          <Teambanner team={teamA} className="anim-team-left opacity-0" />
          <div className="col-span-2 flex h-100 flex-col gap-5.5">
            {statsConfig.map((stat, idx) => (
              <CompareRow
                key={idx}
                teamA={teamA}
                label={stat.label}
                teamB={teamB}
                statKey={stat.key}
              />
            ))}
          </div>
          <Teambanner team={teamB} className="anim-team-right opacity-0" />
        </div>
      </div>
    </Layout>
    </div>
    </WidgetStage>
  );
}

export default HeadToHead;

const Teambanner = ({ team, className = "" }) => {
  return (
    <div className={className}>
      <p className="bg-primary p-2 text-center text-3xl font-bold text-white">
        {team?.team_name || ""}
      </p>
      <div className="bg-primary-shade-two grid place-content-center p-2">
        {team?.team_logoUrl ? (
          <Image
            width={400}
            height={400}
            src={team?.team_logoUrl}
            alt="Team Logo"
            priority
          />
        ) : (
          <div className="h-100 w-100 bg-gray-800" />
        )}
      </div>
    </div>
  );
};

const CompareRow = ({ teamA, label, teamB, statKey }) => {
  return (
    <div className="anim-row opacity-0 bg-primary grid grid-cols-4 gap-4 p-3">
      <div className="bg-primary-shade-two col-span-1 p-2 text-center text-3xl font-bold text-white">
        {teamA?.[statKey] ?? 0}
      </div>
      <div className="bg-primary-shade-one col-span-2 mx-auto w-full p-2 text-center text-3xl font-medium text-white uppercase">
        {label}
      </div>
      <div className="bg-primary-shade-two col-span-1 p-2 text-center text-3xl font-bold text-white">
        {teamB?.[statKey] ?? null}
      </div>
    </div>
  );
};
