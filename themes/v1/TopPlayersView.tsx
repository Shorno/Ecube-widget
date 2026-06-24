"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import PlayerCard from "./_components/PlayerCard";
import { useTopPlayers } from "@/hooks/widget-data";

type Props = { tournamentID: string; preview?: boolean };

export default function TopPlayersView({
  tournamentID,
  preview = false,
}: Props) {
  const { players, info, ready } = useTopPlayers(tournamentID, { preview });
  const [stageReady, setStageReady] = useState(false);
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

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent px-16">
        <div ref={containerRef} className="flex flex-col pb-8">
          <div className="anim-title opacity-0">
            <Title title="MATCH TOP PLAYERS" data={info} size="rankings" />
          </div>

          <div className="mt-12 flex items-start gap-8">
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
