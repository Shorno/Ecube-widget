"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Timer } from "lucide-react";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import { useMapRotation } from "@/hooks/widget-data";
import { cn } from "@/lib/utils";
import Title from "./_components/Title";
import type { MapRotationMatch } from "@/types/widgets";

type Props = { tournamentID: string };

const MAP_IMAGES: Record<string, string> = {
  ERANGEL: "/assets/map-rotation/maps/erangel.webp",
  MIRAMAR: "/assets/map-rotation/maps/miramar.webp",
  RONDO: "/assets/map-rotation/maps/rondo.webp",
  SANHOK: "/assets/map-rotation/maps/sanhok.webp",
  TAEGO: "/assets/map-rotation/maps/taego.webp",
  VIKENDI: "/assets/map-rotation/maps/vikendi.webp",
};

const CARD_WIDTH = 728;
const CARD_HEIGHT = 198;
const COL_GAP = 27;
const COL_2_LEFT = CARD_WIDTH + COL_GAP;
const GRID_WIDTH = CARD_WIDTH * 2 + COL_GAP;
const ROW_STEP = 208;
const SINGLE_CARD_LEFT = (GRID_WIDTH - CARD_WIDTH) / 2;

function getMapRotationGridHeight(totalCount: number) {
  const rowCount = Math.max(1, Math.ceil(totalCount / 2));
  return (rowCount - 1) * ROW_STEP + CARD_HEIGHT;
}

function getMapRotationCardPosition(
  index: number,
  totalCount: number,
): { left: number; top: number } {
  const row = Math.floor(index / 2);
  const col = index % 2;
  const top = row * ROW_STEP;
  const isLastCard = index === totalCount - 1;
  const hasOddLastRow = totalCount % 2 === 1;

  if (isLastCard && hasOddLastRow) {
    return { left: SINGLE_CARD_LEFT, top };
  }

  return { left: col === 0 ? 0 : COL_2_LEFT, top };
}

function formatMatchLabel(match: MapRotationMatch, index: number) {
  const matchNumber = match.index ?? index + 1;
  return `MATCH ${String(matchNumber).padStart(2, "0")}`;
}

function isPlaceholderMap(map?: string | null) {
  if (!map) return true;
  const normalized = map.trim().toLowerCase();
  return (
    normalized === "" ||
    normalized === "tbd" ||
    normalized === "to be determined" ||
    normalized === "to be defined"
  );
}

function hasDisplayableMatchInfo(match: MapRotationMatch) {
  if (isCompleted(match)) return true;
  return !isPlaceholderMap(match.map);
}

// Ensure first word of map name is uppercase, rest is handled as standard
function mapName(match: MapRotationMatch) {
  return match.map?.trim() || "";
}

function mapImage(match: MapRotationMatch) {
  const key = mapName(match).trim().toUpperCase();
  return MAP_IMAGES[key] ?? "";
}

function isCompleted(match: MapRotationMatch) {
  return match.winner_team !== null && match.winner_team !== undefined;
}

function winnerLogo(match: MapRotationMatch) {
  return match.winner_team?.team?.logo || "";
}

function winnerClanTag(match: MapRotationMatch) {
  return match.winner_team?.team?.clanTag || "";
}

function winnerPoints(match: MapRotationMatch) {
  return match.winner_team?.points ?? 0;
}

function MapRotationCard({
  match,
  index,
  position,
  className,
}: {
  match: MapRotationMatch;
  index: number;
  position: { left: number; top: number };
  className?: string;
}) {
  const completed = isCompleted(match);
  const logo = winnerLogo(match);
  const clanTag = winnerClanTag(match);
  const hasTime = Boolean(match.start_time);
  const imageSrc = mapImage(match);

  return (
    <article
      className={cn(
        "absolute z-10 box-border border-[4px] border-widget-secondary-dark select-none",
        className,
      )}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        background: "linear-gradient(90deg, var(--widget-gradient-from) 0%, var(--widget-primary) 100%)",
      }}
    >
      {/* Inner Image Container (Rectangle 39) */}
      <div
        className={cn(
          "absolute border border-widget-secondary-dark shadow-[-3px_0px_8.3px_rgba(0,0,0,0.76)] overflow-hidden bg-[#061d1a]",
          completed &&
            "grayscale-[0.9] saturate-[0.3] brightness-[0.72] contrast-[0.92]",
        )}
        style={{
          left: "22px",
          top: "21px",
          width: "684px",
          height: "164px",
        }}
      >
        {/* Map Banner Image */}
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={mapName(match)}
            fill
            className="object-cover opacity-90"
            priority={index < 2}
          />
        )}

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />

        {/* Right side gradient overlay (Rectangle 40) */}
        <div
          className="absolute inset-y-0 right-0 w-[288px] z-10"
          style={{
            background: "linear-gradient(50.43deg, rgba(0, 71, 60, 0) 48.18%, var(--widget-gradient-from) 92.67%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />
      </div>

      {/* Match number label box (Rectangle 36 overlay) */}
      <div
        className="absolute z-20 flex h-[50px] w-[170px] items-center justify-center border-r border-b border-widget-secondary-dark bg-gradient-to-r from-widget-gradient-from to-widget-primary px-2"
        style={{
          left: "22px",
          top: "21px",
        }}
      >
        <span className="font-primary text-white text-[44px] leading-[44px] font-normal uppercase select-none whitespace-nowrap">
          {formatMatchLabel(match, index)}
        </span>
      </div>

      {/* Map Name text (ERANGEL/MIRAMAR/etc.) */}
      {mapName(match) && (
        <div
          className="absolute z-20 flex h-[36px] items-center justify-end"
          style={{
            left: "608px",
            top: "28px",
            width: "91px",
          }}
        >
          <span className="font-secondary text-[30px] font-bold text-white uppercase text-right tracking-wider">
            {mapName(match)}
          </span>
        </div>
      )}

      {/* Centered Winner metrics layout inside the card middle area */}
      {completed && (
        <div
          className="absolute z-20 flex h-[164px] items-center justify-center gap-5"
          style={{
            left: "192px",
            top: "21px",
            width: "416px",
          }}
        >
          <div className="flex min-w-[91px] flex-col items-center justify-center gap-1.5">
            {logo && (
              <Image
                src={logo}
                alt={`${match.winner_team?.team?.name ?? "Winner"} logo`}
                width={78}
                height={78}
                className="size-[78px] object-contain"
                unoptimized
              />
            )}
            {clanTag && (
              <span className="font-secondary max-w-[120px] truncate text-center text-[24px] leading-[24px] font-bold tracking-wider text-white uppercase">
                {clanTag}
              </span>
            )}
          </div>
          <div className="h-[72px] w-[2px] bg-widget-secondary-dark/60" />
          <div className="flex items-baseline gap-1 select-none">
            <span className="font-primary text-white text-[68px] leading-[68px] font-normal">
              {String(winnerPoints(match))}
            </span>
            <span className="font-secondary text-white text-[22px] font-bold uppercase">
              PTS
            </span>
          </div>
        </div>
      )}

      {/* Bottom Right box panel (Stopwatch + start_time, conditionally rendered) */}
      {hasTime && (
        <div
          className="absolute z-20 flex h-[48px] w-[156px] items-center justify-end px-3 gap-2 border-t border-l border-widget-secondary-dark bg-gradient-to-l from-widget-primary to-widget-primary-dark"
          style={{
            left: "550px",
            top: "137px",
          }}
        >
          <Timer className="text-white size-[24px]" strokeWidth={2.5} />
          <span className="font-primary text-white text-[46px] leading-[46px] font-normal tracking-normal select-none">
            {match.start_time}
          </span>
        </div>
      )}
    </article>
  );
}

export default function MapRotationView({ tournamentID }: Props) {
  const { matches, info, ready } = useMapRotation(tournamentID);
  const rotationMatches = matches as MapRotationMatch[];
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayMatches = rotationMatches.filter(hasDisplayableMatchInfo);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current) return;

      gsap.set(".anim-title", { opacity: 0, y: -45 });
      gsap.set(".anim-map-card", { opacity: 0, y: 70, clipPath: "inset(100% 0 0 0)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 0.9 }).to(
        ".anim-map-card",
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 0.85,
          stagger: { each: 0.08, from: "start" },
        },
        "<0.18",
      );
    },
    { scope: containerRef, dependencies: [stageReady, displayMatches.length] },
  );

  if (!ready || displayMatches.length === 0) return null;

  const gridHeight = getMapRotationGridHeight(displayMatches.length);

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout top className="flex flex-col justify-center bg-transparent px-14">
        <div
          ref={containerRef}
          className="mx-auto flex flex-col"
          style={{ width: `${GRID_WIDTH}px` }}
        >
          {/* Centered Main Title (Re-used Title Component) */}
          <div className="anim-title flex justify-center opacity-0">
            <Title title="MAP ROTATION" data={info} size="rankings" />
          </div>

          {/* Cards grid list */}
          <div
            className="relative mt-[46px]"
            style={{ width: `${GRID_WIDTH}px`, height: `${gridHeight}px` }}
          >
            {displayMatches.map((match, index) => (
              <MapRotationCard
                key={match.id ?? index}
                match={match}
                index={index}
                position={getMapRotationCardPosition(
                  index,
                  displayMatches.length,
                )}
                className="anim-map-card opacity-0"
              />
            ))}
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
