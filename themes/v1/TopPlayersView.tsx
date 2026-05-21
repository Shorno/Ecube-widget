"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import PlayerCard from "./_components/PlayerCard";
import { useTopPlayers } from "@/hooks/widget-data";
type Props = { tournamentID: string };

export default function TopPlayersView({ tournamentID }: Props) {
  const { players, info, ready } = useTopPlayers(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-card", { opacity: 0, y: 80 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })
        .to(
          ".anim-card",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: { each: 0.08, from: "start" },
          },
          "<0.3",
        );
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent">
        <div ref={containerRef} className="h-full w-full">
          <div className="anim-title opacity-0">
            <Title title="Top Players" data={info} />
          </div>

          <div className="mt-12 flex items-center gap-8 px-4">
            {players.map((player, idx: number) => (
              <PlayerCard
                key={player.player_id ?? idx}
                player={player}
                rank={idx + 1}
              />
            ))}
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
