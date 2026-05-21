"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import { useWWC } from "@/hooks/widget-data";

type Props = { tournamentID: string };

export default function WWCDView({ tournamentID }: Props) {
  const { ready } = useWWC(tournamentID);
  const [stageReady, setStageReady] = useState(false);

  useGSAP(() => {
    if (!stageReady) return;
    gsap.set([".anim-header", ".anim-stats"], { opacity: 0, y: 30 });
    gsap
      .timeline({ defaults: { ease: "power3.out", duration: 0.55 } })
      .to(".anim-header", { opacity: 1, y: 0 })
      .to(".anim-stats", { opacity: 1, y: 0 }, "-=0.3");
  }, [stageReady]);

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <div className="relative h-screen w-screen bg-red-900">
        <div className="absolute bottom-16 w-full p-16 pb-0">
          {/* bottom ribbon */}
          <div className="bg-widget-bg relative mx-auto flex w-326 items-center justify-between text-[60px]">
            <div className="text-widget-text-2 font-secondary pl-11">TEAM</div>
            <div className="flex items-center gap-2 p-2">
              <div className="bg-widget-primary text-widget-text-3 grid h-20.75 w-64.5 place-content-center">
                Day99
              </div>
              <div className="bg-widget-primary text-widget-text-3 grid h-20.75 w-64.5 place-content-center">
                Match 99
              </div>
            </div>
            {/* team logo */}
            <div className="from-widget-primary to-widget-primary-accent border-widget-secondary-accent absolute bottom-22 -left-16 grid h-49.75 w-61.75 place-content-center border bg-linear-to-b"></div>
          </div>
        </div>
      </div>
    </WidgetStage>
  );
}
