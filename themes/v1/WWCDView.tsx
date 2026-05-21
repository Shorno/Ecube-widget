"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import { useWWC } from "@/hooks/widget-data";
import Image from "next/image";
import type { WWCPlayer } from "@/types/widgets";

type Props = { tournamentID: string };

export default function WWCDView({ tournamentID }: Props) {
  const { team, players, info, ready } = useWWC(tournamentID);
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
      <div className="relative h-screen w-screen overflow-x-hidden">
        <div className="absolute bottom-16 w-full p-16 pb-0 uppercase">
          {/* bottom ribbon */}
          <div className="bg-widget-bg relative mx-auto flex w-326 items-center justify-between text-[60px]">
            <div className="text-widget-text-2 font-secondary pl-11">
              {team?.team_name}
            </div>
            <div className="flex items-center gap-2 p-2">
              <div className="bg-widget-primary text-widget-text-3 grid h-20.75 w-64.5 place-content-center">
                {info?.day}
              </div>
              <div className="bg-widget-primary text-widget-text-3 grid h-20.75 w-64.5 place-content-center">
                {info?.match_name}
              </div>
            </div>
            {/* team logo */}
            <div className="from-widget-primary to-widget-primary-accent border-widget-secondary-accent absolute bottom-22 -left-16 z-20 grid h-49.75 w-61.75 place-content-center border bg-linear-to-b">
              <Image
                src={team?.team_logoUrl || ""}
                alt="Team Logo"
                width={128}
                height={128}
                className="max-h-32 max-w-32"
              />
            </div>

            {/* players and wwcd title */}
            <div className="absolute right-0 bottom-full left-0">
              <div className="relative flex items-end justify-center z-10">
                {players.map((player: WWCPlayer, index: number) => (
                  <div
                    key={player.name}
                    className={index !== 0 ? "-ml-52" : ""}
                  >
                    <Image
                      src={player.player_imageUrl || ""}
                      alt={player.name}
                      width={443}
                      height={663}
                      className=""
                    />
                  </div>
                ))}
                {/* WWCD title */}
                <div className="absolute -top-20 w-full -z-1 text-center text-[240px] uppercase leading-[0.9] text-widget-text-3">
                  <span>WINNER WINNER</span> <br />
                  CHICKEN DINER
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidgetStage>
  );
}
