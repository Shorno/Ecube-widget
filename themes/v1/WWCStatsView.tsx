"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import PlayerCard from "./_components/PlayerCard";
import { useWWC } from "@/hooks/widget-data";
import type { TopPlayer, WWCPlayer } from "@/types/widgets";

type Props = { tournamentID: string };

function toTopPlayer(p: WWCPlayer): TopPlayer {
  return {
    player_id: p.player_id ?? "",
    player_name: p.player_name,
    player_ign: p.player_ign,
    player_imageUrl: p.player_imageUrl,
    team_id: p.team_id,
    team_name: p.team_name,
    team_clanTag: p.team_clanTag,
    team_logoUrl: p.team_logoUrl,
    kills: p.kills,
    damages: p.damages,
    assists: p.assists,
    knocks: p.knocks,
    survival_time_display: p.survival_time_display,
  };
}

export default function WWCStatsView({ tournamentID }: Props) {
  const { team, players, info, ready } = useWWC(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-card", { opacity: 0, y: 80 });
      gsap.set(".anim-center", { opacity: 0, scale: 0.8 });

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
        )
        .to(".anim-center", { opacity: 1, scale: 1, duration: 0.9 }, "<0.3");
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready) return null;

  const leftPlayers = players.slice(0, 2);
  const rightPlayers = players.slice(2, 4);

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent">
        <div ref={containerRef} className="h-full w-full">
          <div className="anim-title flex justify-center opacity-0">
            <Title title="WWCD Team Stats" data={info} />
          </div>

          <div className="mt-12 flex items-center justify-between px-4">
            {/* left — players 1 & 2 */}
            <div className="flex gap-8">
              {leftPlayers.map((p, idx) => (
                <PlayerCard
                  key={p.player_id ?? idx}
                  player={toTopPlayer(p)}
                  rank={idx + 1}
                  hideTeamLogo
                  stats={[
                    { label: "Eliminations", value: p.kills },
                    { label: "Damage", value: p.damages },
                    { label: "Assists", value: p.assists },
                    { label: "Knocks", value: p.knocks },
                  ]}
                />
              ))}
            </div>

            {/* center — team logo + total elims */}
            <div className="anim-center flex flex-col items-center h-full gap-10 justify-between opacity-0">
              {team?.team_logoUrl && (
                <Image
                  src={team.team_logoUrl}
                  alt={team.team_name}
                  width={352}
                  height={352}
                  className="object-contain"
                />
              )}
              <div className="text-center">
                <p className="font-primary text-[140px] leading-none">
                  {team?.total_kills ?? 0}
                </p>
                <p className="font-primary text-[80px] tracking-widest uppercase">
                  Elims
                </p>
              </div>
            </div>

            {/* right — players 3 & 4 */}
            <div className="flex gap-8">
              {rightPlayers.map((p, idx) => (
                <PlayerCard
                  key={p.player_id ?? idx}
                  player={toTopPlayer(p)}
                  rank={idx + 3}
                  hideTeamLogo
                  stats={[
                    { label: "Eliminations", value: p.kills },
                    { label: "Damage", value: p.damages },
                    { label: "Assists", value: p.assists },
                    { label: "Knocks", value: p.knocks },
                  ]}
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
