"use client";

import { useRef, useState } from "react";
import Layout from "@/components/common/Layout";
import Tableheader from "@/components/widgets/Tableheader";
import TableRow from "@/components/widgets/TableRow";
import Title from "@/components/common/Title";
import WidgetStage from "@/components/common/WidgetStage";
import { useAfterMatchScoreGroup } from "@/hooks/widget-data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AfterMatchScoreGroupView({ tournamentID, preview = false }) {
  const { winner, col1, col2, info, ready } = useAfterMatchScoreGroup(
    tournamentID,
    { preview },
  );
  const containerRef = useRef(null);
  const [stageReady, setStageReady] = useState(false);

  const teams = winner ? [winner, ...col1, ...col2] : [...col1, ...col2];
  const colOne = teams.slice(0, 8);
  const colTwo = teams.slice(8, 16);

  useGSAP(
    () => {
      if (!ready || !stageReady || !containerRef.current) return;
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
    { scope: containerRef, dependencies: [ready, stageReady] },
  );

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <div ref={containerRef}>
        <Layout top>
          <div className="anim-title opacity-0">
            <Title title="Overall Standing" stageOnly data={info} />
          </div>
          <div className="wrapper mx-auto grid h-auto! w-full! grid-cols-2 gap-4">
            <div className="mx-auto w-215 space-y-2">
              <div className="anim-header-left opacity-0">
                <Tableheader overall />
              </div>
              <div className="space-y-2">
                {colOne.map((team) => (
                  <TableRow
                    key={team.team_id}
                    team={team}
                    overall
                    className="anim-row-left opacity-0"
                  />
                ))}
              </div>
            </div>
            <div className="mx-auto w-215 space-y-2">
              <div className="anim-header-right opacity-0">
                <Tableheader overall />
              </div>
              <div className="space-y-2">
                {colTwo.map((team) => (
                  <TableRow
                    key={team.team_id}
                    team={team}
                    overall
                    className="anim-row-right opacity-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </WidgetStage>
  );
}
