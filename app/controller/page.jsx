"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const IN_GAME_WIDGETS = [
  { href: "/rampdom",    label: "RampDom"     },
  { href: "/elmis",      label: "Elmis"        },
  { href: "/topfour",    label: "Top Four"     },
  { href: "/firstblood", label: "First Blood"  },
  { href: "/map",        label: "Map"          },
];

const AFTER_MATCH_WIDGETS = [
  { slug: "matchsummary",           label: "Match Summary"       },
  { slug: "mvp-match",              label: "MVP Match"           },
  { slug: "mvp-group",              label: "MVP Group"           },
  { slug: "head-to-head",           label: "Head to Head"        },
  { slug: "after-match-score",      label: "After Match Score"   },
  { slug: "after-match-score-group",label: "Score Group"         },
  { slug: "top-player-match",       label: "Top Player Match"    },
  { slug: "top-players-group",      label: "Top Players Group"   },
  { slug: "wwc",                    label: "WWC"                  },
  { slug: "wwctwo",                 label: "WWC Two"             },
  { slug: "wwcstats",               label: "WWC Stats"           },
];

export default function ControllerPage() {
  const [tournamentId, setTournamentId] = useState("");
  const [isSaved, setIsSaved]           = useState(false);
  const [activeUrl, setActiveUrl]       = useState(undefined);
  const [activeLabel, setActiveLabel]   = useState(null);
  const [sendStatus, setSendStatus]     = useState("idle");
  const [origin, setOrigin]             = useState("");
  const [copied, setCopied]             = useState(false);
  const [loadError, setLoadError]       = useState(null); // { widgetUrl, failedImages }

  useEffect(() => {
    const saved = localStorage.getItem("tournamentId") ?? "";
    setTournamentId(saved);
    setIsSaved(!!saved);

    setOrigin(window.location.origin);

    fetch("/api/sse/state")
      .then((r) => r.json())
      .then(({ url, label }) => { setActiveUrl(url ?? null); setActiveLabel(label ?? null); })
      .catch(() => setActiveUrl(null));

    // Listen for real-time events from the server
    const es = new EventSource("/api/sse");

    // A widget reported that one or more images failed to load
    es.addEventListener("widget-status", (e) => {
      const { widgetUrl, failedImages } = JSON.parse(e.data);
      setLoadError({ widgetUrl, failedImages });
    });

    // A new widget was activated — clear any previous load error
    es.addEventListener("widget-change", () => {
      setLoadError(null);
    });

    return () => es.close();
  }, []);

  async function sendCommand(url, label) {
    setSendStatus("sending");
    try {
      const res = await fetch("/api/sse/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, label }),
      });
      if (res.ok) {
        setActiveUrl(url);
        setActiveLabel(label);
        setSendStatus("sent");
        setTimeout(() => setSendStatus("idle"), 1200);
      } else {
        setSendStatus("error");
        setTimeout(() => setSendStatus("idle"), 2000);
      }
    } catch {
      setSendStatus("error");
      setTimeout(() => setSendStatus("idle"), 2000);
    }
  }

  function handleSave() {
    const trimmed = tournamentId.trim();
    if (!trimmed) return;
    localStorage.setItem("tournamentId", trimmed);
    setIsSaved(true);
  }

  const tid = isSaved ? tournamentId.trim() : "";
  const displayUrl = `${origin}/display`;

  function copyDisplayUrl() {
    navigator.clipboard.writeText(displayUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* ── Header ── */}
      <header className="bg-gray-800 border-b border-gray-700 px-5 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Branding */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">EFFINITY</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white">Controller</span>
          </div>

          {/* Live status */}
          <div className="flex-1 text-center">
            {activeLabel && activeUrl ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                LIVE — {activeLabel}
              </span>
            ) : (
              <span className="text-xs uppercase tracking-widest text-gray-600">No widget active</span>
            )}
          </div>

          {/* Tournament ID + send status */}
          <div className="flex items-center gap-3 shrink-0">
            {sendStatus === "sending" && <span className="text-xs font-bold text-yellow-400">Sending…</span>}
            {sendStatus === "sent"    && <span className="text-xs font-bold text-green-400">Sent ✓</span>}
            {sendStatus === "error"   && <span className="text-xs font-bold text-red-400">Error ✗</span>}

            <input
              type="text"
              placeholder="Tournament ID"
              value={tournamentId}
              onChange={(e) => { setTournamentId(e.target.value); setIsSaved(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="w-36 bg-gray-900 border border-gray-600 text-white text-xs px-2 py-1.5 outline-none focus:border-blue-500 placeholder:text-gray-600"
            />
            {!isSaved && tournamentId.trim() && (
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 transition-colors"
              >
                Save
              </button>
            )}
            {isSaved && (
              <span className="text-xs font-bold text-blue-400">ID: {tid}</span>
            )}
          </div>
        </div>
      </header>

      {/* ── Widget load error banner ── */}
      {loadError && (
        <div className="bg-red-950 border-b border-red-700 px-5 py-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">
                ⚠ Widget hidden — image failed to load
              </p>
              <p className="text-xs text-red-500 mb-1">
                Widget: <span className="font-mono text-red-300">{loadError.widgetUrl}</span>
              </p>
              <div className="space-y-0.5">
                {loadError.failedImages.map((url, i) => (
                  <p key={i} className="font-mono text-xs text-red-400 truncate">
                    ✗ {url}
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setLoadError(null)}
              className="shrink-0 text-xs text-red-600 hover:text-red-400 transition-colors font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── Display URL bar ── */}
      <div className="bg-gray-950 border-b border-gray-800 px-5 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 shrink-0">OBS Source</span>
          <span className="h-3 w-px bg-gray-700 shrink-0" />
          <span className="text-xs font-mono text-blue-400 truncate">{displayUrl}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyDisplayUrl}
            className={[
              "text-xs font-bold uppercase tracking-wider px-3 py-1 border transition-colors",
              copied
                ? "border-green-500 text-green-400 bg-green-950"
                : "border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400",
            ].join(" ")}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <Link
            href="/display"
            target="_blank"
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 border border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            Open ↗
          </Link>
          <Link
            href="/widgets"
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 border border-gray-700 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-colors"
          >
            Individual Links
          </Link>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="p-5 space-y-7">

        {/* Utility */}
        <div>
          <button
            onClick={() => sendCommand(null, "Clear Screen")}
            className={[
              "h-9 px-6 text-xs font-bold cursor-pointer uppercase tracking-widest border transition-colors",
              activeUrl === null && activeLabel === "Clear Screen"
                ? "bg-red-900 border-red-500 text-red-300"
                : "bg-gray-800 border-gray-600 text-gray-400 hover:border-red-700 hover:text-red-400",
            ].join(" ")}
          >
            ⬛ Clear Screen
          </button>
        </div>

        {/* ── In-Game ── */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-1 h-4 bg-green-500 rounded-sm shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-green-400">In-Game Widgets</span>
            <span className="flex-1 h-px bg-gray-700" />
          </div>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {IN_GAME_WIDGETS.map((w) => (
              <WidgetBtn
                key={w.href}
                label={w.label}
                color="green"
                isActive={activeUrl === w.href}
                onClick={() => sendCommand(w.href, w.label)}
              />
            ))}
          </div>
        </section>

        {/* ── After-Match ── */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-1 h-4 bg-orange-500 rounded-sm shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">After-Match Widgets</span>
            {tid
              ? <span className="text-xs text-gray-500">— Tournament: {tid}</span>
              : <span className="text-xs text-gray-600">— Save a Tournament ID to enable</span>
            }
            <span className="flex-1 h-px bg-gray-700" />
          </div>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {AFTER_MATCH_WIDGETS.map((w) => {
              const url = tid ? `/after-match/${tid}/${w.slug}` : null;
              return (
                <WidgetBtn
                  key={w.slug}
                  label={w.label}
                  color="orange"
                  isActive={activeUrl === url}
                  disabled={!url}
                  onClick={url ? () => sendCommand(url, w.label) : undefined}
                />
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

function WidgetBtn({ label, color, isActive, disabled, onClick }) {
  const base = "h-14 w-full px-2 text-center text-xs font-bold uppercase tracking-wide leading-tight border-2 transition-colors";

  const styles = {
    green: {
      inactive: "bg-green-950 border-green-800 text-green-400 hover:bg-green-900 hover:border-green-600",
      active:   "bg-green-700 border-green-400 text-white ring-2 ring-green-400 ring-offset-1 ring-offset-gray-900",
    },
    orange: {
      inactive: "bg-orange-950 border-orange-800 text-orange-400 hover:bg-orange-900 hover:border-orange-600",
      active:   "bg-orange-600 border-orange-400 text-white ring-2 ring-orange-400 ring-offset-1 ring-offset-gray-900",
    },
  };

  const colorStyle = isActive ? styles[color].active : styles[color].inactive;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        colorStyle,
        disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
