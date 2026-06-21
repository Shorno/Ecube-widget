"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import WidgetStage from "@/components/common/WidgetStage";
import { useLiveOverallRanking } from "@/hooks/widget-data";
import type { LiveRankEntry } from "@/types/live-rank";
import { TopFourView } from "@/app/[userId]/[tournamentID]/in-game/_components/TopFourView";
import LiveRankingHeader from "./_components/live-ranking/LiveRankingHeader";
import LiveRankingRow from "./_components/live-ranking/LiveRankingRow";
import LiveRankingLegend from "./_components/live-ranking/LiveRankingLegend";
import LiveRankingPreviewControls from "./_components/live-ranking/LiveRankingPreviewControls";
import TeamEliminationLayer from "./_components/team-elimination/TeamEliminationLayer";
import { getLiveRankingLayout } from "./_components/live-ranking/layout";

gsap.registerPlugin(Flip);

type Props = { tournamentID: string; showTeamFlags?: boolean; showFullTeamName?: boolean; preview?: boolean };

function teamId(entry: LiveRankEntry) {
  return entry.team.id ?? entry.team._id ?? String(entry.rank);
}

export default function LiveOverallRankingView({
  tournamentID,
  showTeamFlags = true,
  showFullTeamName = false,
  preview = false,
}: Props) {
  const rankingLayout = getLiveRankingLayout(showFullTeamName);
  const {
    teams,
    observingTeamId,
    ready,
    currentElimination,
    isVisible: eliminationVisible,
    isLocked: eliminationLocked,
    triggerPreview,
    triggerObservingPreview,
    onExitComplete,
  } = useLiveOverallRanking(tournamentID, { preview });

  const [showTopFour, setShowTopFour] = useState(false);
  const [topFourTeams, setTopFourTeams] = useState<LiveRankEntry[]>([]);
  const wasTopFourRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listPanelRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const isFirstRenderRef = useRef(true);
  const isAnimatingRef = useRef(false);
  const pendingDataRef = useRef<LiveRankEntry[] | null>(null);
  const [displayTeams, setDisplayTeams] = useState<LiveRankEntry[]>([]);
  const applyTeamsRef = useRef<(data: LiveRankEntry[]) => void>(() => {});

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
    if (displayTeams.length === 0) return;

    const aliveTeams = displayTeams.filter(
      (t) => !(t.players ?? []).every((p) => p.liveState === 5),
    );

    if (wasTopFourRef.current && aliveTeams.length > 4) {
      wasTopFourRef.current = false;
      setTopFourTeams([]);
      setShowTopFour(false);
      return;
    }

    if (
      !wasTopFourRef.current &&
      aliveTeams.length <= 4 &&
      aliveTeams.length > 0
    ) {
      wasTopFourRef.current = true;
      const captured = aliveTeams;

      if (listPanelRef.current) {
        gsap.to(listPanelRef.current, {
          x: "110%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            setTopFourTeams(captured);
            setShowTopFour(true);
          },
        });
      } else {
        setTopFourTeams(captured);
        setShowTopFour(true);
      }
      return;
    }

    if (wasTopFourRef.current) {
      const liveById = Object.fromEntries(displayTeams.map((t) => [teamId(t), t]));
      setTopFourTeams((prev) =>
        prev.map((frozen) => {
          const live = liveById[teamId(frozen)];
          if (!live) return frozen;
          return {
            ...frozen,
            players: live.players,
            winProbability: live.winProbability ?? frozen.winProbability,
          };
        }),
      );
    }
  }, [displayTeams]);

  useEffect(() => {
    return () => {
      if (listPanelRef.current) gsap.killTweensOf(listPanelRef.current);
    };
  }, []);

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => {}}>
      <div className="relative h-screen w-screen overflow-hidden">
        {preview && (
          <>
            <div className="fixed top-2 left-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow-300 uppercase">
              Preview mode
            </div>
            <LiveRankingPreviewControls
              onTriggerObserver={triggerObservingPreview}
              onTriggerElimination={triggerPreview}
              eliminationLocked={eliminationLocked}
            />
          </>
        )}

        <TeamEliminationLayer
          currentElimination={currentElimination}
          isVisible={eliminationVisible}
          onExitComplete={onExitComplete}
          preview={preview}
          isLocked={eliminationLocked}
          showTeamFlags={showTeamFlags}
          showFullTeamName={showFullTeamName}
        />

        {showTopFour && topFourTeams.length > 0 && (
          <div className="fixed top-12 left-1/2 w-full max-w-[1100px] -translate-x-1/2 px-4">
            <TopFourView
              teams={topFourTeams}
              observingTeamId={observingTeamId}
            />
          </div>
        )}

        {!showTopFour && displayTeams.length > 0 && (
          <div
            ref={listPanelRef}
            className="absolute right-0 flex h-[709px] flex-col overflow-hidden select-none"
            style={{ top: "247px", width: rankingLayout.panelWidth }}
          >
            <LiveRankingHeader showFullTeamName={showFullTeamName} />

            <div
              ref={containerRef}
              className="flex h-[650px] w-full flex-col overflow-hidden"
            >
              {displayTeams.map((entry, index) => (
                <LiveRankingRow
                  key={teamId(entry)}
                  entry={entry}
                  rank={index + 1}
                  isObserved={observingTeamId === teamId(entry)}
                  showTeamFlags={showTeamFlags}
                  showFullTeamName={showFullTeamName}
                />
              ))}
            </div>

            <LiveRankingLegend showFullTeamName={showFullTeamName} />
          </div>
        )}
      </div>
    </WidgetStage>
  );
}
