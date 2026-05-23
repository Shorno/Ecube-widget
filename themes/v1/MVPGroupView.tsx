"use client";

import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import WidgetStage from "@/components/common/WidgetStage";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMVPGroup } from "@/hooks/widget-data";
import Image from "next/image";

export default function MVPGroupView({ tournamentID }: { tournamentID: string }) {
  const [stageReady, setStageReady] = useState(false);
  const { mvp, ready, info } = useMVPGroup(tournamentID);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady) return;

      gsap.set(".anim-title",  { opacity: 0, y: -40 });
      gsap.set(".anim-stat",   { opacity: 0, y: 80 });
      gsap.set(".anim-player", { opacity: 0, x: 60 });

      gsap
        .timeline({ defaults: { ease: "circ.out" } })
        .to(".anim-title",  { opacity: 1, y: 0, duration: 0.5 })
        .to(".anim-player", { opacity: 1, x: 0, duration: 0.6 }, "<0.1")
        .to(".anim-stat",   { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "<0.15")
        .from(
          ".anim-counter",
          { textContent: 0, duration: 1.2, ease: "power2.out", snap: { textContent: 1 } },
          "<",
        );
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent">
        <div ref={containerRef} className="">
          <div className="anim-title opacity-0">
            <Title title="TOURNAMENT MVP" data={info} />
          </div>
          <div className="mt-16 flex shrink-0 gap-26">
            <div className="flex shrink-0 flex-col justify-between gap-16">
              <div className="grid h-full shrink-0 grid-cols-2 gap-16">
                <div className="anim-stat opacity-0">
                  <MVPStatsBox label="TOTAL ELIMS" value={mvp?.kills || 0} />
                </div>
                <div className="anim-stat opacity-0">
                  <MVPStatsBox label="TOTAL DMGS" value={mvp?.damages || 0} />
                </div>
                <div className="anim-stat opacity-0">
                  <MVPStatsBox label="TOTAL KNOCK" value={mvp?.knocks || 0} />
                </div>
                <div className="anim-stat opacity-0">
                  <MVPStatsBox label="TOTAL HEALS" value={mvp?.heals || 0} />
                </div>
              </div>
            </div>
            <div className="anim-player relative px-10 opacity-0">
              <Image
                src={mvp?.player_imageUrl || ""}
                alt="MVP Avatar"
                width={440}
                height={740}
                className=""
              />
              <div className="absolute right-0 bottom-0 left-0">
                <div className="relatiev h-full w-full">
                  <div className="text-widget-text-1 bg-widget-secondary font-secondary mx-auto w-max px-36 text-xl text-[40px] font-bold">
                    {mvp?.team_name}
                  </div>
                  <div className="text-widget-text-1 bg-widget-bg font-secondary text-center text-[54px] [clip-path:polygon(0_0,100%_0,95%_100%,0%_100%)]">
                    {mvp?.player_ign}
                  </div>
                  <div className="from-widget-primary-dark to-widget-primary-accent absolute top-1/2 -left-16 grid aspect-square w-50 -translate-y-1/2 transform place-content-center bg-linear-to-b [clip-path:polygon(18%_11%,98%_28%,63%_94%,18%_71%)]">
                    <Image
                      src={mvp?.team_logoUrl || ""}
                      alt="MVP Avatar"
                      width={100}
                      height={100}
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}

const MVPStatsBox = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <div className="relative flex w-140 gap-0 h-full">
      <div className="text-widget-text-3 grid w-60 place-content-center">
        LOGO LEtter
      </div>
      <div className="bg-widget-bg font-primary text-widget-text-2 anim-counter grid h-full w-full place-content-center text-[100px]">
        {value}
      </div>
      <div className="text-widget-text-3 from-widget-primary to-widget-primary-accent font-secondary absolute -top-4 -right-4 w-70 bg-linear-to-r text-center text-[44px] [clip-path:polygon(8%_1%,100%_0,100%_100%,0%_100%)]">
        {label}
      </div>
    </div>
  );
};
