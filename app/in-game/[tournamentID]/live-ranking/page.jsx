"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TeamRow } from "./TeamRow";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useParams } from "next/navigation";
import { useGetLiveRankingQuery } from "@/lib/services/widget-api";
import { initialData } from "./components/initialData";

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

// --- MAIN APP COMPONENT ---
export default function App() {
  const [teams, setTeams] = useState(() =>
    [...initialData].sort((a, b) => a.rank - b.rank),
  );

  // --- 🚧 SIMULATOR CODE TO REMOVE 🚧 ---
  const [isSimulating, setIsSimulating] = useState(true);
  // ----------------------------------------

  const containerRef = useRef(null);
  const flipStateRef = useRef(null);
  const isFirstRender = useRef(true);

  // --- 🔌 REAL API INTEGRATION 🔌 ---
  const { tournamentID: rawTournamentID } = useParams();
  const tournamentID = Array.isArray(rawTournamentID)
    ? rawTournamentID[0]
    : rawTournamentID;

  const { data: liveRankingData } = useGetLiveRankingQuery(
    { tournamentID },
    { skip: !tournamentID || isSimulating },
  );

  useEffect(() => {
    if (isSimulating || !liveRankingData || !containerRef.current) return;

    flipStateRef.current = Flip.getState(".team-row");
    setTeams([...liveRankingData].sort((a, b) => a.rank - b.rank));
  }, [isSimulating, liveRankingData]);
  // ------------------------------------

  // --- 🚧 SIMULATOR CODE TO REMOVE 🚧 ---
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTeams((prevTeams) => {
        const newTeams = JSON.parse(JSON.stringify(prevTeams));
        const numTeamsToUpdate = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numTeamsToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * newTeams.length);
          const pointsToAdd = Math.floor(Math.random() * 5) + 1;

          newTeams[randomIndex].kills += pointsToAdd;
          newTeams[randomIndex].overAllPoints += pointsToAdd;
        }

        if (Math.random() > 0.2) {
          const randomTeam =
            newTeams[Math.floor(Math.random() * newTeams.length)];
          const alivePlayers = randomTeam.players.filter(
            (p) => p.liveState !== 5,
          );

          if (alivePlayers.length > 0) {
            const p =
              alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
            p.healths = Math.max(
              0,
              p.healths - (Math.floor(Math.random() * 40) + 10),
            );

            if (p.healths === 0) {
              p.liveState = 5; // Eliminated
            } else if (p.healths <= 30) {
              p.liveState = 4; // Knocked
            } else {
              p.liveState = 0; // Alive
            }
          }
        }

        newTeams.sort((a, b) => b.overAllPoints - a.overAllPoints);
        newTeams.forEach((team, index) => (team.rank = index + 1));

        if (containerRef.current) {
          flipStateRef.current = Flip.getState(".team-row");
        }

        return newTeams;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);
  // ----------------------------------------

  // 3. The GSAP Flip Layout Animation
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (flipStateRef.current) {
      Flip.from(flipStateRef.current, {
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.05,
      });

      flipStateRef.current = null;
    }
  }, [teams]);

  return (
    <div className="relative h-screen w-screen font-sans">
      {/* --- 🚧 SIMULATOR CODE TO REMOVE 🚧 --- */}
      <div className="absolute top-4 left-4 z-50 rounded-lg border border-slate-700 bg-slate-800 p-4 text-white shadow-xl">
        <h2 className="mb-2 font-bold text-blue-400">Simulator Controls</h2>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`w-full rounded  px-4 py-2 text-sm font-bold transition-colors ${isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
        >
          {isSimulating ? "Pause Simulation" : "Start Simulation"}
        </button>
      </div>
      {/* ---------------------------------------- */}

      <div className="fixed right-4 bottom-4 w-full max-w-100">
        {/* table header */}
        <div className="grid grid-cols-7 border-b border-white bg-linear-to-r from-blue-900 via-blue-400 to-blue-900 text-sm text-white">
          {tableHeader.map((header) => (
            <div
              key={header.key}
              className={cn(
                "p-2 text-center",
                header.label === "TEAM" && "col-span-3 text-left",
                header.label === "Rank" && "ml-1 text-left",
              )}
            >
              {header.label}
            </div>
          ))}
        </div>

        {/* team rows Container */}
        <div ref={containerRef} className="relative flex flex-col bg-slate-900">
          {teams.map((entry, i) => (
            <TeamRow key={entry.team._id} entry={entry} index={i} />
          ))}
        </div>

        {/* state indicator */}
        <div className="flex h-10 items-center justify-start gap-4 bg-blue-950 p-4">
          {stateList.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <div className={cn("h-4 w-4", s.color)}></div>
              <span className="text-xs text-white">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
