"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useLiveCircleTimer, useLiveOverallRanking } from "@/hooks/widget-data";
import CircleCountdown from "@/components/common/CircleCountdown";
import { TeamRow } from "@/app/[userId]/[tournamentID]/in-game/_components/TeamRow";
import TopFourLayer from "@/themes/v1/_components/top-four/TopFourLayer";

gsap.registerPlugin(Flip);

const tableHeader = [
  { label: "Rank", key: "rank" },
  { label: "TEAM", key: "player" },
  { label: "ALIVE", key: "score" },
  { label: "PTS", key: "kills" },
  { label: "ELMIS", key: "assists" },
];

const stateList = [
  { label: "ALIVE", color: "bg-green-500" },
  { label: "KNOCKED", color: "bg-red-500" },
  { label: "ELIMINATED", color: "bg-gray-500" },
];

function teamId(entry) {
  return entry.team?.id ?? entry.team?._id ?? String(entry.position);
}

export default function LiveOverallRankingView({
  tournamentID,
  showTeamFlags = true,
  showFullTeamName = false,
  showObserverHighlight = true,
  preview = false,
  isOverall = true,
  sortBy = "overAllPoints",
}) {
  const {
    teams,
    showTopFour,
    topFourTeams,
    observingTeamId,
    ready,
  } = useLiveOverallRanking(tournamentID, { preview, sortBy });
  const { timer: circleTimer, triggerCircle } = useLiveCircleTimer(
    tournamentID,
    { preview },
  );

  const containerRef = useRef(null);
  const listPanelRef = useRef(null);
  const flipStateRef = useRef(null);
  const isFirstRenderRef = useRef(true);
  const isAnimatingRef = useRef(false);
  const pendingDataRef = useRef(null);
  const sidebarHiddenRef = useRef(false);
  const [displayTeams, setDisplayTeams] = useState([]);

  const applyTeams = useCallback((newData) => {
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
  }, []);

  useEffect(() => {
    if (teams.length === 0) return;
    applyTeams(teams);
  }, [teams, applyTeams]);

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
          applyTeams(next);
        }
      },
    });
    flipStateRef.current = null;
  }, [displayTeams, applyTeams]);

  useEffect(() => {
    if (!showTopFour || sidebarHiddenRef.current) return;

    if (listPanelRef.current) {
      sidebarHiddenRef.current = true;
      gsap.to(listPanelRef.current, {
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
      if (listPanelRef.current) gsap.killTweensOf(listPanelRef.current);
    };
  }, []);

  if (!ready) return null;

  const activeObservingTeamId = showObserverHighlight ? observingTeamId : null;

  return (
    <div className="relative h-screen w-screen font-sans">
      <CircleCountdown timer={circleTimer} />

      {preview && (
        <button
          type="button"
          onClick={triggerCircle}
          className="fixed top-5 right-5 z-50 rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100"
        >
          Trigger Circle
        </button>
      )}

      {showTopFour && topFourTeams.length > 0 && (
        <TopFourLayer
          teams={topFourTeams}
          observingTeamId={activeObservingTeamId}
          showTeamFlags={showTeamFlags}
          showFullTeamName={showFullTeamName}
        />
      )}

      {!showTopFour && displayTeams.length > 0 && (
        <div
          ref={listPanelRef}
          className="fixed right-4 bottom-4 w-full max-w-100"
        >
          <div className="grid grid-cols-7 border-b border-white bg-linear-to-r from-blue-900 via-blue-400 to-blue-900 text-sm text-white">
            {tableHeader.map((header) => (
              <div
                key={header.key}
                className={cn(
                  "p-2 text-center",
                  header.label === "TEAM" && "col-span-3 text-left",
                )}
              >
                {header.label}
              </div>
            ))}
          </div>

          <div
            ref={containerRef}
            className="relative flex flex-col bg-slate-900"
          >
            {displayTeams.map((entry) => (
              <TeamRow
                key={teamId(entry)}
                entry={entry}
                isObserved={activeObservingTeamId === teamId(entry)}
                isOverall={isOverall}
                rank={sortBy === "points" ? entry.matchRank : entry.position}
              />
            ))}
          </div>

          <div className="flex h-10 items-center justify-start gap-4 bg-blue-950 p-4">
            {stateList.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className={cn("h-4 w-4", s.color)} />
                <span className="text-xs text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
