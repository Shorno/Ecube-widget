"use client";
import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { use, useRef } from "react";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";
import Image from "next/image";
import WidgetStage from "@/components/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function WWCStats({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetWwcdTeamStatsQuery({ tournamentID });
  const team = data?.data?.players || {};
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!data || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-team-left", { opacity: 0, x: -80 });
      gsap.set(".anim-card", { opacity: 0, y: 60 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })
        .to(".anim-team-left", { opacity: 1, x: 0, duration: 1.0 }, "<0.2")
        .to(
          ".anim-card",
          { opacity: 1, y: 0, duration: 0.8, stagger: { each: 0.08, from: "start" } },
          "<0.2",
        );
    },
    { scope: containerRef, dependencies: [data] },
  );

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
      <div ref={containerRef}>
        <Layout top className={""}>
          <div className="anim-title opacity-0">
            <Title title={"WWCD Stats"} data={data?.info} />
          </div>
          <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
            {/* team stats */}
            <div className="anim-team-left space-y-8 uppercase opacity-0">
              <div className="bg-primary-shade-two mx-auto ">
                <p className="bg-primary-shade-one p-1 text-center text-2xl font-bold text-white">
                  {data?.data?.team_name}
                </p>
                <Image
                  priority
                  src={data?.data?.team_logoUrl}
                  width={152}
                  height={152}
                  alt=""
                  className="mx-auto p-2"
                />
              </div>

              <Databox title="Eliminations" value={data?.data?.total_kills} />
              <Databox title="Total Damage" value={data?.data?.total_damages} />
            </div>

            {/* player stats */}
            <div className="grid grid-cols-4 gap-4">
              {team?.map((player) => (
                <div key={player.id} className="anim-card opacity-0">
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </div>
    </WidgetStage>
  );
}

export default WWCStats;

const Databox = ({ title, value }) => {
  return (
    <div className="bg-primary relative w-55 px-18 py-8">
      <div className="bg-primary-shade-one absolute -top-3.75 left-1/2 h-7.5 translate-x-[-50%] p-1 whitespace-nowrap">
        {title}
      </div>
      <p className="text-center text-5xl font-bold text-black">{value}</p>
    </div>
  );
};
