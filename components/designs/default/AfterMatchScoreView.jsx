"use client";

import { useRef, useState } from "react";
import HighLightTeam from "@/components/widgets/HighLightTeam";
import Layout from "@/components/common/Layout";
import Tableheader from "@/components/widgets/Tableheader";
import TableRow from "@/components/widgets/TableRow";
import Title from "@/components/common/Title";
import { useGetAfterMatchScoreQuery } from "@/lib/services/widget-api";
import WidgetStage from "@/components/common/WidgetStage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AfterMatchScoreView({ tournamentID }) {
  const { data }     = useGetAfterMatchScoreQuery({ tournamentID });
  const containerRef = useRef(null);
  const [stageReady, setStageReady] = useState(false);

  const teamOne = data?.data?.[0] || {};
  const colOne  = data?.data?.slice(1, 7) || [];
  const colTwo  = data?.data?.slice(7, 16) || [];

  useGSAP(
    () => {
      if (!data || !stageReady || !containerRef.current) return;
      gsap.set(".anim-title",        { opacity: 0, y: -40 });
      gsap.set(".anim-highlight",    { opacity: 0, x: -100 });
      gsap.set(".anim-header-left",  { opacity: 0, x: -100 });
      gsap.set(".anim-header-right", { opacity: 0, x: 100 });
      gsap.set(".anim-row-left",     { opacity: 0, x: -220 });
      gsap.set(".anim-row-right",    { opacity: 0, x: 220 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".anim-title",        { opacity: 1, y: 0, duration: 1.0 })
        .to(".anim-highlight",    { opacity: 1, x: 0, duration: 1.0 }, "<0.2")
        .to(".anim-header-left",  { opacity: 1, x: 0, duration: 1.0 }, "<")
        .to(".anim-header-right", { opacity: 1, x: 0, duration: 1.0 }, "<")
        .to(".anim-row-left",  { opacity: 1, x: 0, duration: 1.1, stagger: { each: 0.08, from: "start" } }, "<0.2")
        .to(".anim-row-right", { opacity: 1, x: 0, duration: 1.1, stagger: { each: 0.08, from: "start" } }, "<");
    },
    { scope: containerRef, dependencies: [data, stageReady] },
  );

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data} onReady={() => setStageReady(true)}>
      <div ref={containerRef}>
        <Layout top>
          <div className="anim-title opacity-0">
            <Title title="Match Standing" stageOnly data={data?.info} />
          </div>
          <div className="wrapper mx-auto grid h-auto! w-full! grid-cols-2 gap-4">
            <div className="mx-auto w-215 space-y-2">
              <div className="anim-highlight opacity-0"><HighLightTeam teamOne={teamOne} /></div>
              <div className="anim-header-left opacity-0"><Tableheader /></div>
              <div className="space-y-2">
                {colOne.map((team) => (
                  <TableRow key={team.team_id} team={team} className="anim-row-left opacity-0" />
                ))}
              </div>
            </div>
            <div className="mx-auto w-215 space-y-2">
              <div className="anim-header-right opacity-0"><Tableheader /></div>
              <div className="space-y-2">
                {colTwo.map((team) => (
                  <TableRow key={team.team_id} team={team} className="anim-row-right opacity-0" />
                ))}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </WidgetStage>
  );
}
