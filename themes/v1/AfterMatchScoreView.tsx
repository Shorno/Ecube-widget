"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import MatchRankingsTitle from "./_components/match-score/MatchRankingsTitle";
import WinnerCard from "./_components/match-score/WinnerCard";
import RankingColumn from "./_components/match-score/RankingColumn";
import { useAfterMatchScore, useWWC } from "@/hooks/widget-data";

type Props = { tournamentID: string };

export default function AfterMatchScoreView({ tournamentID }: Props) {
  const { winner, col1, col2, info, ready } =
    useAfterMatchScore(tournamentID);
  const { players } = useWWC(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-winner", { opacity: 0, x: -100 });
      gsap.set(".anim-header-right", { opacity: 0, x: 100 });
      gsap.set(".anim-row-left", { opacity: 0, x: -220 });
      gsap.set(".anim-row-right", { opacity: 0, x: 220 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })
        .to(".anim-winner", { opacity: 1, x: 0, duration: 1.0 }, "<0.2")
        .to(".anim-header-right", { opacity: 1, x: 0, duration: 1.0 }, "<")
        .to(
          ".anim-row-left",
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            stagger: { each: 0.08, from: "start" },
          },
          "<0.2",
        )
        .to(
          ".anim-row-right",
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            stagger: { each: 0.08, from: "start" },
          },
          "<",
        );
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready || !winner) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent pl-16 pr-10">
        <div ref={containerRef} className="mx-auto flex h-full w-full max-w-[1720px] flex-col justify-between pb-8">
          <div className="anim-title opacity-0">
            <MatchRankingsTitle data={info} />
          </div>

          <div className="grid w-full grid-cols-2 items-start gap-x-12">
            <div className="flex w-full flex-col gap-[2px] pt-[31px]">
              <div className="anim-winner w-full opacity-0">
                <WinnerCard team={winner} players={players} />
              </div>
              <RankingColumn
                teams={col1}
                className="w-full"
                rowClassName="anim-row-left opacity-0"
              />
            </div>

            <RankingColumn
              teams={col2}
              showHeader
              className="w-full min-w-0"
              headerClassName="anim-header-right opacity-0"
              rowClassName="anim-row-right opacity-0"
            />
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
