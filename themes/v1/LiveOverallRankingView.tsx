"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import WidgetStage from "@/components/common/WidgetStage";
import { useLiveOverallRanking } from "@/hooks/widget-data";
import type { LiveRankEntry } from "@/types/live-rank";
import LiveRankingHeader from "./_components/live-ranking/LiveRankingHeader";
import LiveRankingRow from "./_components/live-ranking/LiveRankingRow";
import LiveRankingLegend from "./_components/live-ranking/LiveRankingLegend";
import LiveRankingPreviewControls from "./_components/live-ranking/LiveRankingPreviewControls";
import TopFourLayer from "./_components/top-four/TopFourLayer";
import {
  getLiveRankingBroadcastLayout,
  getLiveRankingLayout,
  LIVE_RANKING_MAP_SAFE_TOP,
} from "./_components/live-ranking/layout";

gsap.registerPlugin(Flip);

type Props = {
  tournamentID: string;
  showTeamFlags?: boolean;
  showFullTeamName?: boolean;
  showObserverHighlight?: boolean;
  preview?: boolean;
};

function teamId(entry: LiveRankEntry) {
  return entry.team.id ?? entry.team._id ?? String(entry.rank);
}

export default function LiveOverallRankingView({
  tournamentID,
  showTeamFlags = true,
  showFullTeamName = false,
  showObserverHighlight = true,
  preview = false,
}: Props) {
  const rankingLayout = getLiveRankingLayout(showFullTeamName);
  const {
    teams,
    showTopFour,
    topFourTeams,
    observingTeamId,
    ready,
    triggerObservingPreview,
    triggerTopFourPreview,
  } = useLiveOverallRanking(tournamentID, { preview });

  const containerRef = useRef<HTMLDivElement>(null);
  const slidePanelRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const isFirstRenderRef = useRef(true);
  const isAnimatingRef = useRef(false);
  const pendingDataRef = useRef<LiveRankEntry[] | null>(null);
  const sidebarHiddenRef = useRef(false);
  const [displayTeams, setDisplayTeams] = useState<LiveRankEntry[]>([]);
  const [viewportHeight, setViewportHeight] = useState(1080);
  const applyTeamsRef = useRef<(data: LiveRankEntry[]) => void>(() => {});

  useEffect(() => {
    function syncViewport() {
      setViewportHeight(window.innerHeight);
    }
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  applyTeamsRef.current = (newData) => {
    if (isAnimatingRef.current) {
      pendingDataRef.current = newData;
      return;
    }
    if (containerRef.current && !isFirstRenderRef.current) {
      flipStateRef.current = Flip.getState(
        containerRef.current.querySelectorAll("[data-flip-id]"),
      );
    }
    isFirstRenderRef.current = false;
    setDisplayTeams(newData);
  };

  useEffect(() => {
    if (teams.length === 0) return;
    applyTeamsRef.current(teams);
  }, [teams]);

  useLayoutEffect(() => {
    if (!flipStateRef.current) return;
    isAnimatingRef.current = true;
    Flip.from(flipStateRef.current, {
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
        if (pendingDataRef.current) {
          const next = pendingDataRef.current;
          pendingDataRef.current = null;
          applyTeamsRef.current(next);
        }
      },
    });
    flipStateRef.current = null;
  }, [displayTeams]);

  useEffect(() => {
    if (!showTopFour || sidebarHiddenRef.current) return;

    if (slidePanelRef.current) {
      sidebarHiddenRef.current = true;
      gsap.to(slidePanelRef.current, {
        x: "110%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    } else {
      sidebarHiddenRef.current = true;
    }
  }, [showTopFour]);

  useEffect(() => {
    return () => {
      if (slidePanelRef.current) gsap.killTweensOf(slidePanelRef.current);
    };
  }, []);

  const activeObservingTeamId = showObserverHighlight ? observingTeamId : null;
  const broadcastLayout =
    displayTeams.length > 0
      ? getLiveRankingBroadcastLayout(
          displayTeams.length,
          rankingLayout.panelWidth,
          viewportHeight,
        )
      : null;

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => {}}>
      <div className="relative h-screen w-screen overflow-hidden">
        {preview && (
          <>
            <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
              Preview mode
            </div>
            <div
              className="pointer-events-none absolute top-0 right-0 z-40 border border-dashed border-yellow-400/50 bg-yellow-400/5"
              style={{
                width: rankingLayout.panelWidth + 32,
                height: LIVE_RANKING_MAP_SAFE_TOP,
              }}
              aria-hidden
            >
              <span className="absolute bottom-1 left-2 font-mono text-[9px] text-yellow-400/80 uppercase">
                Map safe zone
              </span>
            </div>
            <LiveRankingPreviewControls
              onTriggerObserver={triggerObservingPreview}
              onTriggerTopFour={triggerTopFourPreview}
              topFourActive={showTopFour}
            />
          </>
        )}

        {showTopFour && topFourTeams.length > 0 && (
          <TopFourLayer
            teams={topFourTeams}
            observingTeamId={activeObservingTeamId}
            showTeamFlags={showTeamFlags}
            showFullTeamName={showFullTeamName}
          />
        )}

        {!showTopFour && displayTeams.length > 0 && broadcastLayout && (
          <div className="select-none" style={broadcastLayout.outer}>
            <div
              ref={slidePanelRef}
              className="flex flex-col overflow-hidden"
              style={{
                width: broadcastLayout.inner.width,
                maxHeight: broadcastLayout.inner.maxHeight,
              }}
            >
              <LiveRankingHeader showFullTeamName={showFullTeamName} />

              <div
                ref={containerRef}
                className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
              >
                {displayTeams.map((entry, index) => (
                  <LiveRankingRow
                    key={teamId(entry)}
                    entry={entry}
                    rank={index + 1}
                    isObserved={activeObservingTeamId === teamId(entry)}
                    showTeamFlags={showTeamFlags}
                    showFullTeamName={showFullTeamName}
                  />
                ))}
              </div>

              <LiveRankingLegend showFullTeamName={showFullTeamName} />
            </div>
          </div>
        )}
      </div>
    </WidgetStage>
  );
}
