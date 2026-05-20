"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useParams } from "next/navigation";
import { TeamRow } from "../_components/TeamRow";
import { TopFourView } from "../_components/TopFourView";

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

gsap.registerPlugin(Flip);

export default function OverallRanking() {
  const { tournamentID: rawTournamentID } = useParams();
  const tournamentID = Array.isArray(rawTournamentID)
    ? rawTournamentID[0]
    : rawTournamentID;

  const [teams, setTeams] = useState([]);
  const containerRef = useRef(null);
  const listPanelRef = useRef(null);
  const flipStateRef = useRef(null);
  const isFirstRender = useRef(true);
  const [showTopFour, setShowTopFour] = useState(false);
  const [topFourTeams, setTopFourTeams] = useState([]);
  const wasTopFourRef = useRef(false);
  const [observingTeamId, setObservingTeamId] = useState(null);
  const [isMatchConnected, setIsMatchConnected] = useState(false);

  useEffect(() => {
    if (!tournamentID) return;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;
    const wsBase = apiBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const ws = new WebSocket(`${wsBase}/tournament?id=${tournamentID}`);
    ws.onmessage = (event) => {
      let parsed;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }
      const { event: ev, data } = parsed;
      if (ev === "match-connected") setIsMatchConnected(true);
      if (ev === "MATCH_LIVE_RANK_DATA" && Array.isArray(data)) {
        if (!wasTopFourRef.current && containerRef.current)
          flipStateRef.current = Flip.getState(".team-row");
        setTeams([...data]);
      }
      if (ev === "SET_OBSERVING_PLAYER")
        setObservingTeamId(data?.player?.teamId ?? null);
    };
    ws.onerror = () => {};
    ws.onclose = () => setIsMatchConnected(false);
    return () => ws.close();
  }, [tournamentID]);

  useEffect(() => {
    if (!tournamentID) return;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;
    fetch(`${apiBase}/matches/active-match/rank-data/${tournamentID}`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        if (!wasTopFourRef.current && containerRef.current)
          flipStateRef.current = Flip.getState(".team-row");
        setTeams([...data]);
      })
      .catch(() => {});
  }, [tournamentID]);

  useEffect(() => {
    const aliveTeams = teams.filter(
      (t) => !t.players.every((p) => p.liveState === 5),
    );
    const isTopFour = aliveTeams.length <= 4 && aliveTeams.length > 0;
    if (isTopFour && !wasTopFourRef.current) {
      wasTopFourRef.current = true;
      setTopFourTeams(aliveTeams);
      if (listPanelRef.current) {
        gsap.to(listPanelRef.current, {
          x: "110vw",
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => setShowTopFour(true),
        });
      } else setShowTopFour(true);
    }
    if (wasTopFourRef.current && showTopFour) {
      const liveById = Object.fromEntries(teams.map((t) => [t.team._id, t]));
      setTopFourTeams((prev) =>
        prev.map((frozen) => {
          const live = liveById[frozen.team._id];
          if (!live) return frozen;
          return {
            ...frozen,
            players: live.players,
            winProbability: live.winProbability ?? frozen.winProbability,
          };
        }),
      );
    }
  }, [teams, showTopFour]);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (showTopFour) return;
    if (flipStateRef.current) {
      Flip.from(flipStateRef.current, {
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.05,
      });
      flipStateRef.current = null;
    }
  }, [teams, showTopFour]);

  if (!isMatchConnected) return null;

  return (
    <div className="relative h-screen w-screen font-sans">
      {showTopFour && topFourTeams.length > 0 && (
        <div className="fixed top-12 left-1/2 w-full max-w-275 -translate-x-1/2 px-4">
          <TopFourView teams={topFourTeams} observingTeamId={observingTeamId} />
        </div>
      )}
      {!showTopFour && teams.length > 0 && (
        <div
          ref={listPanelRef}
          className="fixed right-4 bottom-4 w-full max-w-100"
        >
          <div className="grid grid-cols-7 border-b border-white bg-linear-to-r from-blue-900 via-blue-400 to-blue-900 text-sm text-white">
            {tableHeader.map((h) => (
              <div
                key={h.key}
                className={cn(
                  "p-2 text-center",
                  h.label === "TEAM" && "col-span-3 text-left",
                )}
              >
                {h.label}
              </div>
            ))}
          </div>
          <div
            ref={containerRef}
            className="relative flex flex-col bg-slate-900"
          >
            {teams.map((entry, index) => (
              <TeamRow
                key={entry.team._id}
                entry={entry}
                isObserved={observingTeamId === entry.team._id}
                isOverall
                rank={index + 1}
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
