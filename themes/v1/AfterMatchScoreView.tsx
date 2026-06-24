"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import WinnerCard from "./_components/match-score/WinnerCard";
import RankingColumn from "./_components/match-score/RankingColumn";
import { MATCH_COLUMN_GAP, MATCH_LISTING_WIDTH, MATCH_ROW_WIDTH } from "./_components/match-score/StatsHeader";
import { useAfterMatchScore, useWWC } from "@/hooks/widget-data";

type Props = { tournamentID: string; preview?: boolean };

export default function AfterMatchScoreView({ tournamentID, preview = false }: Props) {
  const { winner, col1, col2, info, ready } = useAfterMatchScore(tournamentID, {
    preview,
  });
  const { players } = useWWC(tournamentID, { preview });
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
      <Layout top className="bg-transparent px-16">
        <div
          ref={containerRef}
          className="mx-auto flex flex-col pb-8"
          style={{ width: MATCH_LISTING_WIDTH }}
        >
          <div className="anim-title flex justify-center opacity-0">
            <Title title="MATCH RANKINGS" data={info} size="rankings" />
          </div>

          <div
            className="mt-6 grid items-start"
            style={{
              width: MATCH_LISTING_WIDTH,
              gap: `${MATCH_COLUMN_GAP}px`,
              gridTemplateColumns: `${MATCH_ROW_WIDTH}px ${MATCH_ROW_WIDTH}px`,
            }}
          >
            <div className="flex flex-col gap-[2px] pt-[31px]">
              <div className="anim-winner opacity-0" style={{ width: MATCH_ROW_WIDTH }}>
                <WinnerCard team={winner} players={players} />
              </div>
              <RankingColumn
                teams={col1}
                rowClassName="anim-row-left opacity-0"
              />
            </div>

            <RankingColumn
              teams={col2}
              showHeader
              headerClassName="anim-header-right opacity-0"
              rowClassName="anim-row-right opacity-0"
            />
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
