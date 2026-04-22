"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useParams } from "next/navigation";
import FirstBloodCard from "./components/FirstBloodCard";
import PlayerElimCard from "./components/PlayerElimCard";
import AchievementCard from "./components/AchievementCard";
import TeamElimCard from "./components/TeamElimCard";
import PlaceholderCard from "./components/PlaceholderCard";

// Expanded list of allowed events
const ALLOWED_EVENTS = [
  "vehicle_elimination",
  "grenade_elimination",
  "FIRST_BLOOD",
  "PLAYER_ACHIEVEMENT",
  "TEAM_ELIMINATION",
];
// --- MAIN COMPONENT ---

export default function Achivments() {
  const queueRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const bannerRef = useRef(null);

  const [currentEvent, setCurrentEvent] = useState(null);

  const { tournamentID: rawTournamentID } = useParams();
  const tournamentID = Array.isArray(rawTournamentID)
    ? rawTournamentID[0]
    : rawTournamentID;

  const processQueue = () => {
    if (isAnimatingRef.current || queueRef.current.length === 0) {
      return;
    }
    isAnimatingRef.current = true;
    const nextEvent = queueRef.current.shift();
    setCurrentEvent(nextEvent);
  };

  useEffect(() => {
    if (!currentEvent || !bannerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        setCurrentEvent(null);
        processQueue();
      },
    });

    // Parent slide-in/out logic
    tl.fromTo(
      bannerRef.current,
      { y: -120, opacity: 0 },
      { y: 20, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
    )
      // Increased hold duration so internal animations can play
      .to({}, { duration: 3.5 })
      .to(bannerRef.current, {
        y: -120,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

    return () => {
      tl.kill();
    };
  }, [currentEvent]);

  useEffect(() => {
    if (!tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) {
      console.warn(
        "Achivments: NEXT_PUBLIC_API_BASE_URL is not set — WebSocket skipped",
      );
      return;
    }

    const wsBase = apiBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const ws = new WebSocket(`${wsBase}/tournament?id=${tournamentID}`);

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const { event: eventName, data } = parsed;

        if (ALLOWED_EVENTS.includes(eventName)) {
          queueRef.current.push({
            id: crypto.randomUUID(),
            eventName,
            data,
          });
          processQueue();
        }
      } catch (err) {
        console.error("WebSocket parsing error:", err);
      }
    };

    return () => ws.close();
  }, [tournamentID]);

  // Determine which UI to show based on the event type
  const renderEventContent = () => {
    if (!currentEvent) return null;

    switch (currentEvent.eventName) {
      case "FIRST_BLOOD":
        return <FirstBloodCard data={currentEvent.data} />;
      case "PLAYER_ELIMINATION":
        return <PlayerElimCard data={currentEvent.data} />;
      case "PLAYER_ACHIEVEMENT":
        return <AchievementCard data={currentEvent.data} />;
      case "TEAM_ELIMINATION":
        return <TeamElimCard data={currentEvent.data} />;
      case "vehicle_elimination":
      case "grenade_elimination":
      default:
        return <PlaceholderCard eventName={currentEvent.eventName} />;
    }
  };

  return (
    <div className="pointer-events-none relative flex h-screen w-screen justify-center overflow-hidden bg-transparent">
      {currentEvent && (
        <div
          ref={bannerRef}
          className="absolute top-0 z-50 flex min-w-87.5 flex-col items-center rounded-lg border border-slate-700 bg-slate-900/90 p-4 text-white shadow-2xl backdrop-blur-md"
        >
          {renderEventContent()}
        </div>
      )}
    </div>
  );
}
