"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import OverallRankingColumn from "./_components/overall-rankings/OverallRankingColumn";
import { OVERALL_COLUMN_GAP } from "./_components/overall-rankings/OverallStatsHeader";
import { useOverallRankings } from "@/hooks/widget-data";

type Props = { tournamentID: string; preview?: boolean };

export default function AfterMatchScoreGroupView({ tournamentID, preview = false }: Props) {
  const { col1, col2, info, ready } = useOverallRankings(tournamentID, { preview });
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-header-left", { opacity: 0, x: -100 });
      gsap.set(".anim-header-right", { opacity: 0, x: 100 });
      gsap.set(".anim-row-left", { opacity: 0, x: -220 });
      gsap.set(".anim-row-right", { opacity: 0, x: 220 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })
        .to(".anim-header-left", { opacity: 1, x: 0, duration: 1.0 }, "<0.2")
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

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent px-16">
        <div
          ref={containerRef}
          className="mx-auto flex flex-col items-center pb-8"
        >
          <div className="anim-title flex justify-center opacity-0">
            <Title title="OVERALL RANKINGS" data={info} size="overall" />
          </div>

          <div
            className="mt-4 flex justify-center"
            style={{ gap: OVERALL_COLUMN_GAP }}
          >
            <OverallRankingColumn
              teams={col1}
              headerClassName="anim-header-left opacity-0"
              rowClassName="anim-row-left opacity-0"
            />
            <OverallRankingColumn
              teams={col2}
              headerClassName="anim-header-right opacity-0"
              rowClassName="anim-row-right opacity-0"
            />
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
