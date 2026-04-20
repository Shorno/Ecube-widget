"use client";

import { use, useRef } from "react";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout";
import WidgetStage from "@/components/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function WwcTwo({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetWwcdTeamStatsQuery({ tournamentID });
  const team = data?.data?.players || [];
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!data || !containerRef.current) return;

      gsap.set(".anim-player", { opacity: 0, y: 80 });
      gsap.set(".anim-big-title", { opacity: 0, scale: 0.8 });
      gsap.set(".anim-team-header", { opacity: 0, y: -40 });
      gsap.set(".anim-databox", { opacity: 0, y: 40 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".anim-player", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: { each: 0.08, from: "start" },
      })
        .to(".anim-team-header", { opacity: 1, y: 0, duration: 0.9 }, "<")
        .to(
          ".anim-databox",
          { opacity: 1, y: 0, duration: 0.7, stagger: { each: 0.1, from: "start" } },
          "<",
        )
        .to(".anim-big-title", { opacity: 1, scale: 1, duration: 1.2 }, "<0.5");
    },
    { scope: containerRef, dependencies: [data] },
  );

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
      <div ref={containerRef}>
        <Layout>
          <div className="absolute bottom-16 z-10 h-auto w-full px-16">
            <div className="anim-team-header relative z-10 mx-auto mb-8 flex max-h-45 w-max opacity-0">
              <div className="grid aspect-square place-content-center bg-black px-4">
                <Image
                  priority
                  src={data?.data?.team_logoUrl}
                  alt="Team Logo"
                  className="aspect-square"
                  width={100}
                  height={100}
                />
              </div>
              <div className="bg-primary-shade-two grid place-content-center px-24">
                <p className="text-5xl font-extrabold">{data?.data?.team_name}</p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-3 gap-8">
              <div className="anim-databox opacity-0">
                <DataBox title="Elimanations" data={data?.data?.total_kills} />
              </div>
              <div className="anim-databox opacity-0">
                <DataBox title="Total Damage" data={data?.data?.total_damages} />
              </div>
              <div className="anim-databox opacity-0">
                <DataBox title="Total Points" data={data?.data?.totalPoints} />
              </div>
            </div>

            {/* player images */}
            <div className="absolute bottom-0 left-1/2 z-5 flex -translate-x-1/2">
              {team?.map((player, index) => (
                <div
                  key={player.id}
                  className={cn("anim-player relative opacity-0", {
                    "-ml-28": index !== 0,
                    [`z-[${index}]`]: index !== team.length - 1,
                    "-z-10": index === team.length - 1,
                  })}
                >
                  <Image
                    priority
                    src={player.player_imageUrl}
                    width={600}
                    height={750}
                    alt={player.name}
                    className="h-187.5 w-150 scale-x-150"
                  />
                </div>
              ))}
              <p className="anim-big-title text-primary absolute -top-10 left-1/2 -z-20 w-max -translate-x-1/2 text-center text-[220px] leading-70 font-extrabold uppercase opacity-0">
                <span className="stroked-text">Winner </span>
                Winner
                <br />
                Chicken <span className="stroked-text">Dinner </span>
              </p>
            </div>
          </div>
        </Layout>
      </div>
    </WidgetStage>
  );
}

export default WwcTwo;

const DataBox = ({ title, data }) => {
  return (
    <div className="">
      <h1 className="bg-primary-shade-two p-2 text-center text-3xl uppercase">
        {title}
      </h1>
      <div className="grid place-content-center bg-black p-8 text-7xl font-extrabold">
        {data}
      </div>
    </div>
  );
};
