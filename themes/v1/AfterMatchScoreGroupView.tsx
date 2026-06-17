"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import OverallRankingsTitle from "./_components/overall-rankings/OverallRankingsTitle";
import OverallRankingColumn from "./_components/overall-rankings/OverallRankingColumn";
import {
  STATIC_INFO,
  STATIC_TEAMS,
} from "./_components/overall-rankings/static-data";

type Props = { tournamentID: string };

export default function AfterMatchScoreGroupView({ tournamentID: _tournamentID }: Props) {
  // TODO: wire useAfterMatchScoreGroup — reshape rows into col1 (1–10) / col2 (11–20)
  const info = STATIC_INFO;
  const col1 = STATIC_TEAMS.slice(0, 10);
  const col2 = STATIC_TEAMS.slice(10, 20);
  const ready = true;

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
      <Layout top className="bg-transparent pl-16 pr-10">
        <div
          ref={containerRef}
          className="mx-auto flex h-full w-full max-w-[1720px] flex-col justify-between pb-8"
        >
          <div className="anim-title opacity-0">
            <OverallRankingsTitle data={info} />
          </div>

          <div className="grid w-full grid-cols-2 items-start gap-x-12 pt-[31px]">
            <OverallRankingColumn
              teams={col1}
              className="w-full min-w-0"
              headerClassName="anim-header-left opacity-0"
              rowClassName="anim-row-left opacity-0"
            />
            <OverallRankingColumn
              teams={col2}
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
