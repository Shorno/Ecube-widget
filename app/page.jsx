"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// const links = [
//   { href: "/rampdom", label: "RampDom" },
//   { href: "/elmis", label: "Elmis" },
//   { href: "/topfour", label: "Topfour" },
//   // { href: "/wwc", label: "WWC" },
//   { href: "/wwctwo", label: "WWC Two" },
//   { href: "/wwcstats", label: "WWC Stats" },
//   { href: "/matchsummary", label: "Match Sumary" },
//   { href: "/top-player-match", label: "Top Player Match" },
//   { href: "/top-players-group", label: "Top Players Group" },
//   { href: "/head-to-head", label: "Head to Head" },
// ];

const inGameLinks = [
  { href: "/rampdom", label: "RampDom" },
  { href: "/elmis", label: "Elmis" },
  { href: "/topfour", label: "Topfour" },
  { href: "/firstblood", label: "First Blood" },
];

const afterMatchRoutes = [
  { slug: "wwctwo", label: "WWC Two" },
  { slug: "wwcstats", label: "WWC Stats" },
  { slug: "matchsummary", label: "Match Summary" },
  { slug: "top-player-match", label: "Top Player Match" },
  { slug: "top-players-group", label: "Top Players Group" },
  { slug: "head-to-head", label: "Head to Head" },
  { slug: "mvp-match", label: "Mvp Match" },
  { slug: "mvp-group", label: "Mvp Group" },
  { slug: "after-match-score", label: "After Match Score" },
  { slug: "after-match-score-group", label: "After Match Score Group" },
];

export default function Home() {
  const [tournamentId, setTournamentId] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tournamentId") ?? "";
    setTournamentId(saved);
    setIsSaved(!!saved);
  }, []);

  function handleChange(e) {
    setTournamentId(e.target.value);
    setIsSaved(false);
  }

  function handleSave() {
    localStorage.setItem("tournamentId", tournamentId);
    setIsSaved(true);
  }

  return (
    <div className="grid h-screen place-content-around bg-transparent text-black">
      <nav className="mx-auto w-max max-w-3xl p-2">
        <div className="flex gap-12">
          {/* In-game widgets */}
          <div className="border-r border-black pr-12">
            <p className="mb-2 text-xl font-bold text-gray-500 uppercase">
              In Game Widget
            </p>
            <ul className="flex flex-col items-start gap-4">
              {inGameLinks.map((link) => (
                <li key={link.href} className="pr-2 text-2xl underline">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* After-match widgets */}
          <div>
            <p className="mb-2 text-xl font-bold text-gray-500 uppercase">
              After Match Widgets
            </p>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Tournament ID"
                value={tournamentId}
                onChange={handleChange}
                className={`flex-1 border px-2 py-1 text-sm ${
                  isSaved
                    ? "border-gray-300 text-gray-400"
                    : "border-black text-black"
                }`}
              />
              {!isSaved && tournamentId && (
                <button
                  onClick={handleSave}
                  className="border border-black cursor-pointer px-3 py-1 text-sm font-bold hover:bg-black hover:text-white"
                >
                  Save
                </button>
              )}
            </div>
            <ul className="flex flex-col items-start gap-4">
              {afterMatchRoutes.map((route) => (
                <li key={route.slug} className="pr-2 text-2xl">
                  {isSaved && tournamentId ? (
                    <Link
                      href={`/after-match/${tournamentId}/${route.slug}`}
                      className="underline"
                    >
                      {route.label}
                    </Link>
                  ) : (
                    <span className="text-gray-300">{route.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
