"use client";

import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { use, useRef } from "react";
import { useGetTopPlayersGroupQuery } from "@/lib/services/widget-api";
import WidgetStage from "@/components/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function TopPlayersGroup({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetTopPlayersGroupQuery({ tournamentID });
  const team = data?.data || [];
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!data || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-card", { opacity: 0, y: 60 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 }).to(
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
        <Layout top>
          <div className="anim-title opacity-0">
            <Title title="Overall Top Players" stageOnly data={data?.info} />
          </div>
          <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
            <div className="grid grid-cols-5 gap-4">
              {team?.map((player, idx) => (
                <div key={player.id} className="anim-card opacity-0">
                  <PlayerCard
                    player={player}
                    type="OVERALL"
                    rank={idx + 1}
                    showTeamLogo
                  />
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </div>
    </WidgetStage>
  );
}

export default TopPlayersGroup;
