"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AFTER_MATCH_WIDGETS, IN_GAME_WIDGETS, getWidgetPath } from "@/lib/widget-catalog";

export default function ControllerPage() {
  const [tournamentId, setTournamentId]         = useState("");
  const [isSaved, setIsSaved]                   = useState(false);
  const [scoreGroupView, setScoreGroupView]      = useState("");
  const [activeUrl, setActiveUrl]               = useState(undefined);
  const [activeLabel, setActiveLabel]           = useState(null);
  const [sendStatus, setSendStatus]             = useState("idle");
  const [origin, setOrigin]                     = useState("");
  const [copied, setCopied]                     = useState(false);
  const [loadError, setLoadError]               = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tournamentId") ?? "";
    setTournamentId(saved);
    setIsSaved(!!saved);
    setScoreGroupView(localStorage.getItem("scoreGroupView") ?? "");
    setOrigin(window.location.origin);

    if (saved) {
      fetch(`/api/sse/state?tournamentId=${saved}`)
        .then((r) => r.json())
        .then(({ url, label }) => {
          setActiveUrl(url ?? null);
          setActiveLabel(label ?? null);
        })
        .catch(() => setActiveUrl(null));
    }

    const es = new EventSource(`/api/sse?tournamentId=${saved || ""}`);
    es.addEventListener("widget-status", (e) => {
      const { widgetUrl, failedImages } = JSON.parse(e.data);
      setLoadError({ widgetUrl, failedImages });
    });

    return () => es.close();
  }, []);

  async function sendCommand(url, label) {
    setSendStatus("sending");
    try {
      const res = await fetch("/api/sse/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, label, tournamentId: tournamentId.trim() }),
      });
      if (res.ok) {
        setActiveUrl(url);
        setActiveLabel(label);
        setLoadError(null);
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

  const tid        = isSaved ? tournamentId.trim() : "";
  const displayUrl = tid ? `${origin}/${tid}/display` : "";

  function copyDisplayUrl() {
    navigator.clipboard.writeText(displayUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function getWidgetUrl(widget) {
    const url = getWidgetPath(widget, tid);
    if (!url) return null;
    const extra = widget.id === "after-match-score-group" && scoreGroupView ? `?view=${scoreGroupView}` : "";
    return `${url}${extra}`;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">EFFINITY</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs font-bold tracking-widest text-white uppercase">Controller</span>
          </div>

          <div className="flex-1 text-center">
            {activeLabel && activeUrl ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-green-400 uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                LIVE — {activeLabel}
              </span>
            ) : (
              <span className="text-xs tracking-widest text-gray-600 uppercase">No widget active</span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {sendStatus === "sending" && <span className="text-xs font-bold text-yellow-400">Sending…</span>}
            {sendStatus === "sent"    && <span className="text-xs font-bold text-green-400">Sent ✓</span>}
            {sendStatus === "error"   && <span className="text-xs font-bold text-red-400">Error ✗</span>}

            <select
              value={scoreGroupView}
              onChange={(e) => {
                setScoreGroupView(e.target.value);
                localStorage.setItem("scoreGroupView", e.target.value);
              }}
              className="border border-gray-600 bg-gray-900 px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="">Score Group: Default</option>
              <option value="full">Score Group: Full</option>
            </select>

            <input
              type="text"
              placeholder="Tournament ID"
              value={tournamentId}
              onChange={(e) => { setTournamentId(e.target.value); setIsSaved(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="w-36 border border-gray-600 bg-gray-900 px-2 py-1.5 text-xs text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
            />
            {!isSaved && tournamentId.trim() && (
              <button
                onClick={handleSave}
                className="bg-blue-600 px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase hover:bg-blue-500"
              >
                Save
              </button>
            )}
            {isSaved && <span className="text-xs font-bold text-blue-400">ID: {tid}</span>}
          </div>
        </div>
      </header>

      {/* Load error banner */}
      {loadError && (
        <div className="border-b border-red-700 bg-red-950 px-5 py-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold tracking-widest text-red-400 uppercase">⚠ Widget hidden — image failed to load</p>
              <p className="mb-1 text-xs text-red-500">Widget: <span className="font-mono text-red-300">{loadError.widgetUrl}</span></p>
              {loadError.failedImages.map((url, i) => (
                <p key={i} className="truncate font-mono text-xs text-red-400">✗ {url}</p>
              ))}
            </div>
            <button onClick={() => setLoadError(null)} className="my-auto shrink-0 bg-red-900 p-4 text-xs font-bold text-red-100 hover:text-red-300">Dismiss</button>
          </div>
        </div>
      )}

      {/* Display URL bar */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-800 bg-gray-950 px-5 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-bold tracking-widest text-gray-500 uppercase">OBS Source</span>
          <span className="h-3 w-px shrink-0 bg-gray-700" />
          <span className="truncate font-mono text-xs text-blue-400">
            {displayUrl || <span className="text-gray-600">Save a Tournament ID to generate display URL</span>}
          </span>
        </div>
        {displayUrl && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={copyDisplayUrl}
              className={[
                "border px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors",
                copied ? "border-green-500 bg-green-950 text-green-400" : "border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400",
              ].join(" ")}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <Link
              href={`/${tid}/display`}
              target="_blank"
              className="border border-gray-600 px-3 py-1 text-xs font-bold tracking-wider text-gray-400 uppercase hover:border-blue-500 hover:text-blue-400"
            >
              Open ↗
            </Link>
            <Link
              href={`/${tid}/widgets`}
              target="_blank"
              className="border border-gray-600 px-3 py-1 text-xs font-bold tracking-wider text-gray-400 uppercase hover:border-purple-500 hover:text-purple-400"
            >
              Individual Links
            </Link>
          </div>
        )}
      </div>

      {/* Widget buttons */}
      <main className="space-y-7 p-5">
        <div>
          <button
            onClick={() => sendCommand(null, "Clear Screen")}
            className={[
              "h-9 border px-6 text-xs font-bold tracking-widest uppercase transition-colors",
              activeUrl === null && activeLabel === "Clear Screen"
                ? "border-red-500 bg-red-900 text-red-300"
                : "border-gray-600 bg-gray-800 text-gray-400 hover:border-red-700 hover:text-red-400",
            ].join(" ")}
          >
            ⬛ Clear Screen
          </button>
        </div>

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-green-500" />
            <span className="text-xs font-bold tracking-widest text-green-400 uppercase">In-Game Widgets</span>
            {tid ? (
              <span className="text-xs text-gray-500">— Tournament: {tid}</span>
            ) : (
              <span className="text-xs text-gray-600">— Save a Tournament ID to enable</span>
            )}
            <span className="h-px flex-1 bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {IN_GAME_WIDGETS.map((w) => {
              const url = getWidgetUrl(w);
              return (
                <WidgetBtn
                  key={w.id}
                  label={w.label}
                  color="green"
                  isActive={activeUrl === url}
                  disabled={!url}

                  onClick={url ? () => sendCommand(url, w.label) : undefined}
                />
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-orange-500" />
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">After-Match Widgets</span>
            {tid ? (
              <span className="text-xs text-gray-500">— Tournament: {tid}</span>
            ) : (
              <span className="text-xs text-gray-600">— Save a Tournament ID to enable</span>
            )}
            <span className="h-px flex-1 bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {AFTER_MATCH_WIDGETS.map((w) => {
              const url = getWidgetUrl(w);
              return (
                <WidgetBtn
                  key={w.id}
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
    green:  { inactive: "bg-green-950 border-green-800 text-green-400 hover:bg-green-900 hover:border-green-600", active: "bg-green-700 border-green-400 text-white ring-2 ring-green-400 ring-offset-1 ring-offset-gray-900" },
    orange: { inactive: "bg-orange-950 border-orange-800 text-orange-400 hover:bg-orange-900 hover:border-orange-600", active: "bg-orange-600 border-orange-400 text-white ring-2 ring-orange-400 ring-offset-1 ring-offset-gray-900" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[base, isActive ? styles[color].active : styles[color].inactive, disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"].join(" ")}
    >
      {label}
    </button>
  );
}
