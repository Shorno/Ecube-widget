"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import { useWWC } from "@/hooks/widget-data";
import { cn } from "@/lib/utils";
import type { WWCPlayer } from "@/types/widgets";
import Image from "next/image";

type Props = { tournamentID: string };

export default function WWCDView({ tournamentID }: Props) {
  const { team, players, info, ready } = useWWC(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady) return;

      gsap.set(".anim-ribbon", { opacity: 0, y: -40 });
      gsap.set(".anim-title", { opacity: 0, scale: 0.8 });
      gsap.set(".anim-player", { opacity: 0, y: 80 });

      gsap
        .timeline({ defaults: { ease: "circ.out" } })
        .to(".anim-player", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: { each: 0.05, from: "start" },
        })
        .to(".anim-ribbon", { opacity: 1, y: 0, duration: 0.5 }, "<")
        .to(".anim-title", { opacity: 1, scale: 1, duration: 0.6 }, "<0.2");
    },
    { scope: containerRef, dependencies: [stageReady] },
  );

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <div
        ref={containerRef}
        className="relative h-screen w-screen overflow-hidden"
      >
        <div className="absolute bottom-12 w-full p-16 pb-0 uppercase">
          {/* bottom ribbon */}
          <div className="anim-ribbon bg-widget-bg relative mx-auto flex w-326 items-center justify-between text-[60px] opacity-0">
            {/* one ribbon start */}
            <div className="text-widget-text-2 font-secondary relative z-50 pl-11">
              {team?.team_name}
            </div>
            <div className="relative z-50 flex items-center gap-2 p-2">
              <div className="bg-widget-primary text-widget-text-3 grid h-20.75 w-64.5 place-content-center px-3 text-center text-[44px] leading-none whitespace-nowrap">
                {info?.day}
              </div>
              <div className="bg-widget-primary text-widget-text-3 grid h-20.75 w-64.5 place-content-center px-3 text-center text-[44px] leading-none whitespace-nowrap">
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
            {/* one ribbon end */}

            {/* players and wwcd title */}
            <div className="absolute right-0 bottom-full left-0 z-10">
              <div className="relative z-10 flex items-end justify-center">
                {players
                  .filter(
                    (player): player is WWCPlayer & { player_imageUrl: string } =>
                      Boolean(player?.player_imageUrl),
                  )
                  .slice(0, 4)
                  .map((player, index) => (
                    <div
                      key={player.player_id ?? index}
                      className={cn(
                        "anim-player opacity-0",
                        index > 0 && "-ml-52",
                      )}
                    >
                      <Image
                        src={player.player_imageUrl}
                        alt={player.player_name ?? ""}
                        width={443}
                        height={663}
                      />
                    </div>
                  ))}
                {/* WWCD title */}
                <div className="anim-title text-widget-text-3 absolute -top-12 -z-10 w-full text-center text-[240px] leading-[0.9] uppercase opacity-0">
                  <span>WINNER WINNER</span>
                  <br />
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
