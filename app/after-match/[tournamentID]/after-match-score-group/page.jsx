"use client";

import Layout from "@/components/layout";
import Tableheader from "@/components/Tableheader";
import TableRow from "@/components/TableRow";
import Title from "@/components/Title";
import { useGetAfterMatchScoreGroupQuery } from "@/lib/services/widget-api";
import { use, useRef } from "react";
import { useSearchParams } from "next/navigation";
import WidgetStage from "@/components/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function AfterMatchScoreGroup({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetAfterMatchScoreGroupQuery({ tournamentID });
  const searchParams = useSearchParams();
  const containerRef = useRef(null);

  const teams = data?.data || [];
  const isFull = searchParams.get("view") === "full";
  const mid = Math.ceil(teams.length / 2);
  const colOne = isFull ? teams.slice(0, mid) : teams.slice(0, 8);
  const colTwo = isFull ? teams.slice(mid) : teams.slice(8, 16);

  useGSAP(
    () => {
      if (!data || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-header-left", { opacity: 0, x: -100 });
      gsap.set(".anim-header-right", { opacity: 0, x: 100 });
      gsap.set(".anim-row-left", { opacity: 0, x: -220 });
      gsap.set(".anim-row-right", { opacity: 0, x: 220 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Title drops from top
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })

        // 2. Both headers slide in from their sides simultaneously
        .to(".anim-header-left", { opacity: 1, x: 0, duration: 1.0 }, "<0.2")
        .to(".anim-header-right", { opacity: 1, x: 0, duration: 1.0 }, "<")

        // 3. Both columns stagger in simultaneously — left from left, right from right
        .to(
          ".anim-row-left",
          { opacity: 1, x: 0, duration: 1.1, stagger: { each: 0.08, from: "start" } },
          "<0.2",
        )
        .to(
          ".anim-row-right",
          { opacity: 1, x: 0, duration: 1.1, stagger: { each: 0.08, from: "start" } },
          "<", // same time as left column
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
        <Title title="Overall Standing" stageOnly data={data?.info} />
      </div>
      <div className="wrapper mx-auto grid h-auto! w-full! grid-cols-2 gap-4">
        <div className="mx-auto w-215 space-y-2">
          <div className="anim-header-left opacity-0"><Tableheader overall /></div>
          <div className="space-y-2">
            {colOne.map((team) => (
              <TableRow key={team.team_id} team={team} overall className="anim-row-left opacity-0" />
            ))}
          </div>
        </div>
        <div className="mx-auto w-215 space-y-2">
          <div className="anim-header-right opacity-0"><Tableheader overall /></div>
          <div className="space-y-2">
            {colTwo.map((team) => (
              <TableRow key={team.team_id} team={team} overall className="anim-row-right opacity-0" />
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </div>
    </WidgetStage>
  );
}

export default AfterMatchScoreGroup;
