"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WidgetStage from "@/components/common/WidgetStage";
import Layout from "@/components/common/Layout";
import { useLiveMatchInfo, useMatchStartOverlay } from "@/hooks/widget-data";
import { cn } from "@/lib/utils";
import type { LiveMatchInfo, MatchInfo } from "@/types/widgets";

type Props = { tournamentID: string; preview?: boolean };

const MAP_IMAGES: Record<string, string> = {
  ERANGEL: "/assets/map-rotation/maps/erangel.webp",
  MIRAMAR: "/assets/map-rotation/maps/miramar.webp",
  RONDO: "/assets/map-rotation/maps/rondo.webp",
  SANHOK: "/assets/map-rotation/maps/sanhok.webp",
  TAEGO: "/assets/map-rotation/maps/taego.webp",
  VIKENDI: "/assets/map-rotation/maps/vikendi.webp",
};

function displayMatchName(match: LiveMatchInfo, info: MatchInfo | null) {
  return match.name || info?.match_name || "MATCH";
}

function displayMapName(match: LiveMatchInfo, info: MatchInfo | null) {
  return match.map || info?.match_map || "TBD";
}

function displayStageName(match: LiveMatchInfo, info: MatchInfo | null) {
  return match.stage_name || info?.stage_name || "";
}

function displayBanner(match: LiveMatchInfo, info: MatchInfo | null) {
  return match.banner_image_url || info?.match_banner_image_url || "";
}

function displayMapImage(mapName: string) {
  return MAP_IMAGES[mapName.trim().toUpperCase()] ?? "";
}

export default function MatchStartView({ tournamentID, preview = false }: Props) {
  const { match, info, ready } = useLiveMatchInfo(tournamentID, { preview });
  const {
    isVisible,
    isLocked,
    shouldRender,
    show,
    triggerPreview,
    onExitComplete,
  } = useMatchStartOverlay({ preview });
  const liveMatch = match as LiveMatchInfo | null;
  const matchInfo = info as MatchInfo | null;
  const [stageReady, setStageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    if (preview || !tournamentID || !ready || !liveMatch) return;

    const es = new EventSource(`/api/sse?tournamentId=${tournamentID}`);
    es.addEventListener("match-start-trigger", show);

    return () => es.close();
  }, [preview, tournamentID, ready, liveMatch, show]);

  const handleExitComplete = useCallback(() => {
    onExitComplete();
  }, [onExitComplete]);

  useGSAP(
    () => {
      if (!stageReady || !containerRef.current) return;

      if (isVisible) {
        wasVisibleRef.current = true;
        gsap.set(".anim-start-shape", { opacity: 0, scale: 0.94, y: 34 });
        gsap.set(".anim-start-panel", { opacity: 0, y: -18 });
        gsap.set(".anim-start-title", { opacity: 0, y: 18 });
        gsap.set(".anim-start-banner", { opacity: 0, y: 42 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".anim-start-shape", {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
        })
          .to(
            ".anim-start-panel",
            { opacity: 1, y: 0, duration: 0.72 },
            "<0.12",
          )
          .to(
            ".anim-start-title",
            { opacity: 1, y: 0, duration: 0.62 },
            "<0.18",
          )
          .to(
            ".anim-start-banner",
            { opacity: 1, y: 0, duration: 0.72 },
            "<0.1",
          );
        return;
      }

      if (!wasVisibleRef.current) return;

      gsap.to(
        [
          ".anim-start-shape",
          ".anim-start-panel",
          ".anim-start-title",
          ".anim-start-banner",
        ],
        {
          opacity: 0,
          y: 28,
          duration: 0.45,
          ease: "power2.in",
          stagger: 0.04,
          onComplete: handleExitComplete,
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [stageReady, isVisible, handleExitComplete],
    },
  );

  if (!ready || !liveMatch) return null;

  const matchName = displayMatchName(liveMatch, matchInfo).toUpperCase();
  const mapName = displayMapName(liveMatch, matchInfo).toUpperCase();
  const stageName = displayStageName(liveMatch, matchInfo).toUpperCase();
  const bannerSrc = displayBanner(liveMatch, matchInfo);
  const mapImageSrc = displayMapImage(mapName);
  const panelImageSrc = mapImageSrc || bannerSrc;

  return (
    <WidgetStage
      dataReady={ready && isVisible}
      onReady={() => setStageReady(true)}
    >
      <Layout className="bg-transparent">
        {preview && (
          <>
            <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
              Preview mode
            </div>
            <div className="fixed top-2 right-2 z-50 flex gap-2">
              <button
                type="button"
                onClick={triggerPreview}
                disabled={isLocked}
                className={cn(
                  "rounded border px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider uppercase",
                  isLocked
                    ? "cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-yellow-500/60 bg-black/70 text-yellow-300 hover:bg-yellow-500/20",
                )}
              >
                Trigger Match Start
              </button>
            </div>
          </>
        )}

        {shouldRender && (
          <div
            ref={containerRef}
            className="relative flex h-screen w-screen items-center justify-center overflow-hidden"
          >
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                width: "552.53px",
                height: "495.78px",
              }}
            >
              <div
                className="relative shrink-0"
                style={{
                  width: "1220px",
                  height: "760px",
                  transform: "scale(0.45289)",
                  transformOrigin: "center center",
                }}
              >
                <div
                  className="anim-start-shape border-widget-secondary-dark bg-widget-primary-dark absolute top-[96px] left-[126px] h-[360px] w-[520px] opacity-0"
                  style={{
                    clipPath: "polygon(18% 0, 100% 8%, 78% 100%, 0 72%)",
                    borderWidth: 4,
                  }}
                />
                <div
                  className="anim-start-shape border-widget-secondary-accent absolute top-[160px] left-[64px] h-[432px] w-[360px] bg-widget-secondary opacity-0"
                  style={{
                    clipPath: "polygon(0 32%, 100% 4%, 78% 100%, 18% 100%)",
                  }}
                />
                <div
                  className="anim-start-shape border-widget-secondary-dark absolute top-[122px] right-[58px] h-[320px] w-[490px] bg-widget-secondary opacity-0"
                  style={{
                    clipPath: "polygon(8% 18%, 100% 0, 98% 88%, 0 100%)",
                  }}
                />
                <div
                  className="anim-start-shape border-widget-secondary-accent bg-widget-primary-dark absolute right-[18px] bottom-[170px] h-[270px] w-[340px] opacity-0"
                  style={{
                    clipPath: "polygon(0 0, 82% 0, 100% 54%, 22% 100%)",
                    borderWidth: 4,
                  }}
                />

                <section
                  className={cn(
                    "anim-start-panel border-widget-text-1 absolute top-[176px] left-[214px] z-30 h-[362px] w-[872px] overflow-hidden rounded-[34px] border-2 bg-widget-bg opacity-0 shadow-[0_24px_42px_rgba(0,0,0,0.4)]",
                  )}
                >
                  {panelImageSrc && (
                    <Image
                      src={panelImageSrc}
                      alt={`${matchName} ${mapName}`}
                      fill
                      priority
                      className="object-cover opacity-[0.58] grayscale-[0.06] saturate-[0.9]"
                      unoptimized={!mapImageSrc}
                    />
                  )}
                  <div className="absolute inset-0 bg-widget-bg/38" aria-hidden />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.62), rgba(255,255,255,0.28) 58%, rgba(255,255,255,0.14))",
                    }}
                    aria-hidden
                  />

                  {stageName && (
                    <div className="anim-start-title absolute top-[56px] left-0 z-20 flex w-full justify-center opacity-0">
                      <span className="font-secondary text-widget-secondary text-[72px] leading-[72px] font-bold tracking-[0.14em] uppercase">
                        {stageName}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 flex h-full items-center justify-center px-12 pt-20">
                    <h1 className="font-primary text-widget-text-1 flex max-w-full items-center gap-9 text-center text-[82px] leading-[82px] font-normal uppercase">
                      <span className="truncate">{matchName}</span>
                      <span className="bg-widget-text-1 block h-[96px] w-[5px] shrink-0" />
                      <span className="truncate">{mapName}</span>
                    </h1>
                  </div>
                </section>

                <div
                  className="anim-start-banner absolute bottom-[54px] left-[108px] z-40 flex h-[206px] w-[1080px] items-center justify-center bg-gradient-to-r from-widget-gradient-from to-widget-primary-dark opacity-0 shadow-[0_20px_34px_rgba(0,0,0,0.35)]"
                  style={{
                    clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
                  }}
                >
                  <span className="font-primary text-widget-text-3 text-[116px] leading-[116px] font-normal uppercase">
                    MATCH STARTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </WidgetStage>
  );
}
