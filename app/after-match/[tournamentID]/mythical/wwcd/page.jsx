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
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: { each: 0.1, from: "start" },
          },
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
          <div className="fixed bottom-16 z-10 h-[calc(100%-64px)] w-full overflow-hidden px-16">
            <div className="absolute bottom-0 w-full">
              <div className="relative z-10 mx-auto w-[70%]">
                <div className="relative mx-auto flex h-auto w-full items-center justify-between bg-white">
                  <p className="p-2 px-10 text-center text-custom-green text-5xl font-bold uppercase">
                    {data?.data?.team_name}
                  </p>
                  <div className="flex gap-3 p-3">
                    <div className="w-64.5 bg-[#00473C] p-3 text-center text-5xl font-bold uppercase">
                      {data?.info?.match_name}
                    </div>
                    <div className="w-64.5 bg-[#00473C] p-3 text-center text-5xl font-bold uppercase">
                      {data?.info?.day}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-46 -left-10 grid aspect-square w-50 place-content-center bg-linear-to-tl from-[#00B194] to-[#00473C]">
                  <Image
                    priority
                    src={data?.data?.team_logoUrl}
                    alt="Team Logo"
                    className="aspect-square"
                    width={180}
                    height={180}
                  />
                </div>
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
              <p className="anim-big-title absolute -top-25 left-1/2 -z-20 w-max -translate-x-1/2 text-center text-[220px] leading-70 font-extrabold text-white uppercase opacity-0">
                <span className="">Winner </span>
                Winner
                <br />
                Chicken <span className="">Dinner </span>
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
