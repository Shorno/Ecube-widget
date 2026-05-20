"use client";

import { useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useWWC } from "@/hooks/widget-data";
import WidgetStage from "@/components/common/WidgetStage";

export default function WWCDView({ tournamentID }: { tournamentID: string }) {
  const { team, players, ready } = useWWC(tournamentID);
  const [stageReady, setStageReady] = useState(false);

  useGSAP(() => {
    if (!stageReady) return;
    gsap.set([".anim-header", ".anim-stats", ".anim-players"], {
      opacity: 0,
      y: 30,
    });
    gsap
      .timeline({ defaults: { ease: "power3.out", duration: 0.55 } })
      .to(".anim-header", { opacity: 1, y: 0 })
      .to(".anim-stats", { opacity: 1, y: 0 }, "-=0.3")
      .to(".anim-players", { opacity: 1, y: 0, stagger: 0.08 }, "-=0.3");
  }, [stageReady]);

  if (!ready || !team) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <div className="bg-widget-bg relative h-screen w-screen overflow-hidden">
        <div className="absolute bottom-16 z-10 h-auto w-full px-16">
          {/* Team identity */}
          <div className="anim-header relative z-10 mx-auto mb-8 flex max-h-45 w-max">
            <div className="grid aspect-square place-content-center bg-black px-4">
              <Image
                priority
                src={team.team_image}
                alt={team.team_name}
                className="aspect-square object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="bg-widget-primary grid place-content-center px-24">
              <p className="font-primary text-5xl font-extrabold text-white">
                {team.team_name}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="anim-stats relative z-10 grid grid-cols-3 gap-8">
            <DataBox title="Eliminations" value={team.total_kills} />
            <DataBox title="Total Damage" value={team.total_damage} />
            <DataBox title="Total Points" value={team.total_points} />
          </div>

          {/* Players + WWCD text */}
          <div className="absolute bottom-0 left-1/2 z-5 flex -translate-x-1/2">
            {players.map(
              (player: Record<string, string | number>, index: number) => (
                <div
                  key={player.id ?? index}
                  className={cn("anim-players relative", {
                    "-ml-28": index !== 0,
                    [`z-[${index}]`]: index !== players.length - 1,
                    "-z-10": index === players.length - 1,
                  })}
                >
                  <Image
                    priority
                    src={player.image as string}
                    width={600}
                    height={750}
                    alt={(player.name as string) || "Player"}
                    className="h-187.5 w-150 scale-x-150"
                  />
                </div>
              ),
            )}
            <p className="text-widget-primary absolute -top-10 left-1/2 -z-20 w-max -translate-x-1/2 text-center text-[220px] leading-70 font-extrabold uppercase">
              <span className="stroked-text">Winner </span>Winner
              <br />
              Chicken <span className="stroked-text">Dinner </span>
            </p>
          </div>
        </div>
      </div>
    </WidgetStage>
  );
}

function DataBox({ title, value }: { title: string; value: string | number }) {
  return (
    <div>
      <h2 className="font-secondary bg-widget-primary p-2 text-center text-3xl text-white uppercase">
        {title}
      </h2>
      <div className="text-widget-text-1 grid place-content-center bg-black p-8 text-7xl font-extrabold">
        {value}
      </div>
    </div>
  );
}
