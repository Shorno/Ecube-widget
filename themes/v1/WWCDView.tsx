"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";

type Props = { tournamentID: string };

export default function WWCDView(props: Props) {
  void props;
  const [stageReady, setStageReady] = useState(false);

  useGSAP(() => {
    if (!stageReady) return;
    gsap.set([".anim-header", ".anim-stats"], { opacity: 0, y: 30 });
    gsap
      .timeline({ defaults: { ease: "power3.out", duration: 0.55 } })
      .to(".anim-header", { opacity: 1, y: 0 })
      .to(".anim-stats", { opacity: 1, y: 0 }, "-=0.3");
  }, [stageReady]);

  return (
    <WidgetStage dataReady={true} onReady={() => setStageReady(true)}>
      <div className="relative h-screen w-screen bg-blue-950">
        <div className="anim-header absolute bottom-16 text-4xl font-bold text-white">
          Farabi
        </div>
      </div>
    </WidgetStage>
  );
}
