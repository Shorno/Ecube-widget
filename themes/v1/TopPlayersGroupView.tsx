"use client";

import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import { useEffect, useRef, useState } from "react";
import { useTopPlayersGroup } from "@/hooks/widget-data/useTopPlayersGroup";
import WidgetStage from "@/components/common/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TopPlayersGroupCard from "./_components/TopPlayersGroupCard";

type Props = { tournamentID: string };

export default function TopPlayersGroupView({ tournamentID }: Props) {
  const [stageReady, setStageReady] = useState(false);
  const { players, info, ready } = useTopPlayersGroup(tournamentID);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".anim-title", { opacity: 1, y: 0, duration: 1.0 });
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  useEffect(() => {
    console.log(players);
  }, [players]);

  if (!ready) return null;

  const rankOne = players[0];

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent">
        <div ref={containerRef} className="h-full w-full">
          <div className="anim-title flex justify-center opacity-0">
            <Title title="ROAD TO MVP" data={info} />
          </div>
          <div className="mx-auto mt-16 grid grid-cols-2 gap-8 px-16">
            <div className="shrink-0">
              <TopPlayersGroupCard className="shrink-0 w-214" rank={1} player={rankOne} />
            </div>
            <div className="grid grid-cols-2 gap-6"></div>
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
