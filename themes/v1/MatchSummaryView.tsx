"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import Title from "./_components/Title";
import SummaryDataBox from "./_components/match-summary/SummaryDataBox";
import { useMatchSummary } from "@/hooks/widget-data";
import type { MatchStats } from "@/types/widgets";
import { cn } from "@/lib/utils";

type Props = { tournamentID: string };

type StatKey = keyof Pick<
  MatchStats,
  | "total_damages"
  | "total_knocks"
  | "total_airdrops_looted"
  | "total_heals"
  | "total_kills"
  | "total_rescues"
>;

const STATS_CONFIG: {
  label: string;
  key: StatKey;
  padDigits?: number;
  icon: { src: string; label: string; width: number; height: number };
}[] = [
  {
    label: "TOTAL DAMAGES",
    key: "total_damages",
    icon: {
      src: "/assets/head2head/helmet.svg",
      label: "Total Damages",
      width: 88,
      height: 88,
    },
  },
  {
    label: "TOTAL KNOCKS",
    key: "total_knocks",
    icon: {
      src: "/assets/head2head/knock-out.svg",
      label: "Total Knocks",
      width: 96,
      height: 66,
    },
  },
  {
    label: "AIRDROP LOOTED",
    key: "total_airdrops_looted",
    padDigits: 2,
    icon: {
      src: "/assets/match-summary/airdrop.svg",
      label: "Airdrop Looted",
      width: 72,
      height: 72,
    },
  },
  {
    label: "TOTAL HEALS",
    key: "total_heals",
    icon: {
      src: "/assets/head2head/heal.svg",
      label: "Total Heals",
      width: 64,
      height: 64,
    },
  },
  {
    label: "TOTAL ELIMINATIONS",
    key: "total_kills",
    icon: {
      src: "/assets/head2head/target.svg",
      label: "Total Eliminations",
      width: 88,
      height: 88,
    },
  },
  {
    label: "TOTAL REVIVES",
    key: "total_rescues",
    icon: {
      src: "/assets/match-summary/revive.png",
      label: "Total Revives",
      width: 72,
      height: 72,
    },
  },
];

function getStatValue(stats: MatchStats, key: StatKey) {
  return stats[key] ?? 0;
}

export default function MatchSummaryView({ tournamentID }: Props) {
  const { stats, info, ready } = useMatchSummary(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current || !stats) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-databox", { opacity: 1, clipPath: "inset(100% 0 0 0)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })
        .addLabel("wipeStart", "<0.2")
        .to(
          ".anim-databox",
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.9,
            stagger: { each: 0.1, from: "start" },
          },
          "wipeStart",
        );

      const COUNT_END = 0.8;
      const STAGGER = 0.1;
      gsap.utils
        .toArray<HTMLElement>(".anim-count", containerRef.current)
        .forEach((el, i) => {
          const target = parseFloat(el.dataset.value ?? "0") || 0;
          const padDigits = (el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0) || 4;
          const obj = { val: 0 };
          tl.to(
            obj,
            {
              val: target,
              duration: COUNT_END - i * STAGGER,
              ease: "power1.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.val)).padStart(
                  padDigits,
                  "0",
                );
              },
            },
            `wipeStart+=${i * STAGGER}`,
          );
        });
    },
    { scope: containerRef, dependencies: [stageReady, stats] },
  );

  if (!ready || !stats) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="bg-transparent pl-16 pr-10">
        <div
          ref={containerRef}
          className="mx-auto flex w-full max-w-[1398px] flex-col pb-10"
        >
          <div className="anim-title opacity-0">
            <Title title="MATCH SUMMARY" data={info} />
          </div>

          <div className="grid w-full grid-cols-3 gap-x-[45px] gap-y-[41px] mt-[26px]">
            {STATS_CONFIG.map((stat) => (
              <SummaryDataBox
                key={stat.key}
                statKey={stat.key}
                label={stat.label}
                value={getStatValue(stats, stat.key)}
                icon={stat.icon}
                padDigits={stat.padDigits}
                className="anim-databox"
              />
            ))}
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
