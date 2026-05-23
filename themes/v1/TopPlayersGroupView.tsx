"use client";

import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import { useRef, useState } from "react";
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
      gsap.set(".anim-card", { opacity: 0, y: 80 });

      gsap
        .timeline({ defaults: { ease: "circ.out" } })
        .to(".anim-title", { opacity: 1, y: 0, duration: 0.5 })
        .to(
          ".anim-card",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: { each: 0.05, from: "start" },
          },
          "<0.15",
        );
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready) return null;

  const rankOne = players[0];
  const rest = players.slice(1, 5);

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent">
        <div ref={containerRef} className="h-full w-full">
          <div className="anim-title flex justify-center opacity-0">
            <Title title="ROAD TO MVP" data={info} />
          </div>
          <div className="mx-auto mt-16 grid grid-cols-2 gap-8 px-16">
            {/* rank #1 — large card */}
            <div className="anim-card shrink-0 opacity-0">
              <TopPlayersGroupCard
                className="shrink-0"
                rank={1}
                player={rankOne}
              />
            </div>

            {/* ranks 2–5 — small cards in 2×2 grid */}
            <div className="grid grid-cols-2 gap-x-4.5 gap-y-7">
              {rest.map((player, idx) => (
                <div
                  key={player.player_id ?? idx}
                  className="anim-card opacity-0"
                >
                  <TopPlayersGroupCard
                    size="small"
                    rank={idx + 2}
                    player={player}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
