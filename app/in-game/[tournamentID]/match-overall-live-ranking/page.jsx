"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useParams } from "next/navigation";
// import { initialData } from "./components/initialData";
import { TeamRow } from "./components/TeamRow";
import { TopFourView } from "./components/TopFourView";

const tableHeader = [
  { label: "Rank", key: "rank" },
  { label: "TEAM", key: "player" },
  { label: "ALIVE", key: "score" },
  { label: "PTS", key: "kills" },
  { label: "ELMIS", key: "assists" },
];

const stateList = [
  { label: "ALIVE",      color: "bg-green-500" },
  { label: "KNOCKED",    color: "bg-red-500"   },
  { label: "ELIMINATED", color: "bg-gray-500"  },
];

gsap.registerPlugin(Flip);


export default function App() {
  // const [teams, setTeams] = useState(() =>
  //   [...initialData].sort((a, b) => a.rank - b.rank),
  // );
  const [teams, setTeams] = useState([]);

  // --- 🚧 SIMULATOR CODE (commented out for production) 🚧 ---
  // const [isSimulating, setIsSimulating] = useState(true);
  // const isSimulating = false;
  // ------------------------------------------------------------

  const containerRef  = useRef(null); // rows div — for GSAP Flip
  const listPanelRef  = useRef(null); // outer fixed div — for exit animation
  const flipStateRef  = useRef(null);
  const isFirstRender = useRef(true);

  // Top-four mode
  const [showTopFour,  setShowTopFour]  = useState(false);
  const [topFourTeams, setTopFourTeams] = useState([]);
  const wasTopFourRef = useRef(false);

  // Observed team (from SET_OBSERVING_PLAYER WebSocket event)
  const [observingTeamId, setObservingTeamId] = useState(null);

  // Widget visibility — driven by match-connected WebSocket event
  const [isMatchConnected, setIsMatchConnected] = useState(false);

  // --- 🔌 WEBSOCKET CONNECTION ---
  const { tournamentID: rawTournamentID } = useParams();
  const tournamentID = Array.isArray(rawTournamentID)
    ? rawTournamentID[0]
    : rawTournamentID;

  // --- 🔌 WEBSOCKET — events channel (/tournament?id=) ---
  useEffect(() => {
    if (!tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) {
      console.warn("LiveRanking: NEXT_PUBLIC_API_BASE_URL is not set — WebSocket skipped");
      return;
    }

    const wsBase = apiBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const ws     = new WebSocket(`${wsBase}/tournament?id=${tournamentID}`);

    ws.onmessage = (event) => {
      let parsed;
      try { parsed = JSON.parse(event.data); } catch { return; }

      const { event: eventName, data } = parsed;

      if (eventName === "match-connected") {
        setIsMatchConnected(true);
      }

      if (eventName === "MATCH_LIVE_RANK_DATA" && Array.isArray(data)) {
        if (!wasTopFourRef.current && containerRef.current) {
          flipStateRef.current = Flip.getState(".team-row");
        }
        setTeams([...data].sort((a, b) => a.rank - b.rank));
      }

      if (eventName === "SET_OBSERVING_PLAYER") {
        setObservingTeamId(data?.player?.teamId ?? null);
      }
    };

    ws.onerror = (err) => console.error("LiveRanking WS error:", err);
    ws.onclose = () => setIsMatchConnected(false);

    return () => ws.close();
  }, [tournamentID]);

  // --- 📡 HTTP — initial rank data snapshot (/matches/active-match/rank-data/) ---
  useEffect(() => {
    if (!tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;

    const url = `${apiBase}/matches/active-match/rank-data/${tournamentID}`;

    async function fetchRankData() {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        if (!wasTopFourRef.current && containerRef.current) {
          flipStateRef.current = Flip.getState(".team-row");
        }
        setTeams([...data].sort((a, b) => a.rank - b.rank));
      } catch {
        // Network error on initial load — WS updates will still arrive
      }
    }

    fetchRankData();
  }, [tournamentID]);
  // --------------------------------

  // --- 🚧 SIMULATOR useEffect (commented out for production) 🚧 ---
  // useEffect(() => {
  //   if (!isSimulating) return;
  //
  //   const interval = setInterval(() => {
  //     setTeams((prevTeams) => {
  //       const newTeams = JSON.parse(JSON.stringify(prevTeams));
  //
  //       const aliveTeams = newTeams.filter(
  //         (t) => !t.players.every((p) => p.liveState === 5),
  //       );
  //       if (aliveTeams.length === 0) return newTeams;
  //
  //       const numToScore = Math.floor(Math.random() * 2) + 1;
  //       for (let i = 0; i < numToScore; i++) {
  //         const scored = aliveTeams[Math.floor(Math.random() * aliveTeams.length)];
  //         const pts    = Math.floor(Math.random() * 3) + 1;
  //         scored.kills         += pts;
  //         scored.overAllPoints += pts;
  //       }
  //
  //       const target       = aliveTeams[Math.floor(Math.random() * aliveTeams.length)];
  //       const alivePlayers = target.players.filter((p) => p.liveState !== 5);
  //       if (alivePlayers.length > 0) {
  //         const p   = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
  //         p.healths = Math.max(0, p.healths - (Math.floor(Math.random() * 13) + 8));
  //         if (p.healths === 0)      { p.liveState = 5; p.isAlive = false; }
  //         else if (p.healths <= 30) { p.liveState = 4; }
  //         else                      { p.liveState = 0; }
  //       }
  //
  //       newTeams.sort((a, b) => b.overAllPoints - a.overAllPoints);
  //       newTeams.forEach((team, index) => (team.rank = index + 1));
  //
  //       if (containerRef.current) {
  //         flipStateRef.current = Flip.getState(".team-row");
  //       }
  //       return newTeams;
  //     });
  //   }, 1500);
  //
  //   return () => clearInterval(interval);
  // }, [isSimulating]);
  // -----------------------------------------------------------------

  // Detect ≤4 alive teams and trigger the list → top-four transition
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
      } else {
        setShowTopFour(true);
      }
    }

    if (wasTopFourRef.current && showTopFour) {
      const liveById = Object.fromEntries(teams.map((t) => [t.team._id, t]));
      setTopFourTeams((prev) =>
        prev.map((frozen) => {
          const live = liveById[frozen.team._id];
          if (!live) return frozen;
          return {
            ...frozen,
            players:        live.players,
            winProbability: live.winProbability ?? frozen.winProbability,
          };
        }),
      );
    }
  }, [teams, showTopFour]);

  // GSAP Flip layout animation — list view only
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
      {/* 🚧 SIMULATOR CONTROLS (commented out for production) 🚧 */}
      {/* <div className="absolute top-4 left-4 z-50 rounded-lg border border-slate-700 bg-slate-800 p-4 text-white shadow-xl">
        <h2 className="mb-2 font-bold text-blue-400">Simulator Controls</h2>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`w-full rounded px-4 py-2 text-sm font-bold transition-colors ${isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
        >
          {isSimulating ? "Pause Simulation" : "Start Simulation"}
        </button>
      </div> */}

      {/* TOP FOUR VIEW — mounts after list exits */}
      {showTopFour && (
        <div className="fixed top-12 left-1/2 w-full max-w-275 -translate-x-1/2 px-4">
          <TopFourView teams={topFourTeams} observingTeamId={observingTeamId} />
        </div>
      )}

      {/* LIST VIEW — animates out as one unit via listPanelRef */}
      {!showTopFour && (
        <div ref={listPanelRef} className="fixed right-4 bottom-4 w-full max-w-100">
          {/* Table header */}
          <div className="grid grid-cols-7 border-b border-white bg-linear-to-r from-blue-900 via-blue-400 to-blue-900 text-sm text-white">
            {tableHeader.map((header) => (
              <div
                key={header.key}
                className={cn(
                  "p-2 text-center",
                  header.label === "TEAM" && "col-span-3 text-left",
                  header.label === "Rank" && "text-center",
                )}
              >
                {header.label}
              </div>
            ))}
          </div>

          {/* Team rows */}
          <div ref={containerRef} className="relative flex flex-col bg-slate-900">
            {teams.map((entry) => (
              <TeamRow isOverall={false}
                key={entry.team._id}
                entry={entry}
                isObserved={observingTeamId === entry.team._id}
              />
            ))}
          </div>

          {/* State indicator */}
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
