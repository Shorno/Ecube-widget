"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { TeamRow } from "../components/TeamRow";
import { TopFourView } from "../components/TopFourView";

const tableHeader = [
  { label: "Rank",  key: "rank"    },
  { label: "TEAM",  key: "player"  },
  { label: "ALIVE", key: "score"   },
  { label: "PTS",   key: "kills"   },
  { label: "ELMIS", key: "assists" },
];

const stateList = [
  { label: "ALIVE",      color: "bg-green-500" },
  { label: "KNOCKED",    color: "bg-red-500"   },
  { label: "ELIMINATED", color: "bg-gray-500"  },
];

function sortByPoints(data) {
  return [...data].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
}

export default function App() {
  const [teams,           setTeams]           = useState([]);
  const [showTopFour,     setShowTopFour]      = useState(false);
  const [topFourTeams,    setTopFourTeams]     = useState([]);
  const wasTopFourRef = useRef(false);
  const [observingTeamId, setObservingTeamId]  = useState(null);
  const [isMatchConnected,setIsMatchConnected] = useState(false);

  const { tournamentID: rawTournamentID } = useParams();
  const tournamentID = Array.isArray(rawTournamentID)
    ? rawTournamentID[0]
    : rawTournamentID;

  // --- WebSocket — events + live rank updates ---
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
        setTeams(sortByPoints(data));
      }

      if (eventName === "SET_OBSERVING_PLAYER") {
        setObservingTeamId(data?.player?.teamId ?? null);
      }
    };

    ws.onerror = (err) => console.error("LiveRanking WS error:", err);
    ws.onclose = () => setIsMatchConnected(false);

    return () => ws.close();
  }, [tournamentID]);

  // --- HTTP — initial rank data snapshot ---
  useEffect(() => {
    if (!tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;

    async function fetchRankData() {
      try {
        const res  = await fetch(`${apiBase}/matches/active-match/rank-data/${tournamentID}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setTeams(sortByPoints(data));
      } catch {
        // Network error on initial load — WS updates will still arrive
      }
    }

    fetchRankData();
  }, [tournamentID]);

  // Manage list ↔ top-four view transitions based on alive team count
  useEffect(() => {
    if (teams.length === 0) return;

    const aliveTeams = teams.filter(
      (t) => !(t.players ?? []).every((p) => p.liveState === 5),
    );

    // New match started — more than 4 alive while in top-four mode → reset
    if (wasTopFourRef.current && aliveTeams.length > 4) {
      wasTopFourRef.current = false;
      setTopFourTeams([]);
      setShowTopFour(false);
      return;
    }

    // Transition to top-four view
    if (!wasTopFourRef.current && aliveTeams.length <= 4 && aliveTeams.length > 0) {
      wasTopFourRef.current = true;
      setTopFourTeams(aliveTeams);
      setShowTopFour(true);
      return;
    }

    // Keep top-four player data live — only runs on genuine teams updates,
    // not when showTopFour flips (showTopFour is intentionally not in deps)
    if (wasTopFourRef.current) {
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
  }, [teams]);

  if (!isMatchConnected) return null;

  return (
    <div className="relative h-screen w-screen font-sans">
      {showTopFour && topFourTeams.length > 0 && (
        <div className="fixed top-12 left-1/2 w-full max-w-275 -translate-x-1/2 px-4">
          <TopFourView teams={topFourTeams} observingTeamId={observingTeamId} />
        </div>
      )}

      {!showTopFour && teams.length > 0 && (
        <div className="fixed right-4 bottom-4 w-full max-w-100">
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

          <div className="relative flex flex-col bg-slate-900">
            {teams.map((entry, index) => (
              <TeamRow
                key={entry.team._id}
                entry={entry}
                isObserved={observingTeamId === entry.team._id}
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
