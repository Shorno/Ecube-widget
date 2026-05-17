"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AFTER_MATCH_WIDGETS, IN_GAME_WIDGETS, getWidgetPath } from "@/lib/widget-catalog";

export default function ControllerClient({ userId, allowedTournamentIds }) {
  const [tournamentId, setTournamentId]     = useState("");
  const [scoreGroupView, setScoreGroupView] = useState("");
  const [activeUrl, setActiveUrl]           = useState(undefined);
  const [activeLabel, setActiveLabel]       = useState(null);
  const [sendStatus, setSendStatus]         = useState("idle");
  const [origin, setOrigin]                 = useState("");
  const [copied, setCopied]                 = useState(false);
  const [loadError, setLoadError]           = useState(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setScoreGroupView(localStorage.getItem("scoreGroupView") ?? "");

    // Restore last selected tournament ID (must be in allowedTournamentIds)
    const saved = localStorage.getItem(`effinity-tid-${userId}`) ?? "";
    const initial = allowedTournamentIds.includes(saved)
      ? saved
      : (allowedTournamentIds[0] ?? "");
    setTournamentId(initial);

    if (initial) {
      fetch(`/api/sse/state?tournamentId=${initial}`)
        .then((r) => r.json())
        .then(({ url, label }) => {
          setActiveUrl(url ?? null);
          setActiveLabel(label ?? null);
        })
        .catch(() => setActiveUrl(null));
    }

    const es = new EventSource(`/api/sse?tournamentId=${initial || ""}`);
    es.addEventListener("widget-status", (e) => {
      const { widgetUrl, failedImages } = JSON.parse(e.data);
      setLoadError({ widgetUrl, failedImages });
    });

    return () => es.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTidChange(e) {
    const tid = e.target.value;
    setTournamentId(tid);
    localStorage.setItem(`effinity-tid-${userId}`, tid);
    setActiveUrl(undefined);
    setActiveLabel(null);
    setLoadError(null);
  }

  async function sendCommand(url, label) {
    setSendStatus("sending");
    try {
      const res = await fetch("/api/sse/command", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url, label, tournamentId: tournamentId.trim() }),
      });
      if (res.ok) {
        setActiveUrl(url);
        setActiveLabel(label);
        setLoadError(null);
        setSendStatus("sent");
        setTimeout(() => setSendStatus("idle"), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setSendStatus("error");
        toast.error(data.error ?? "Failed to send command");
        setTimeout(() => setSendStatus("idle"), 2000);
      }
    } catch {
      setSendStatus("error");
      toast.error("Network error — could not reach server");
      setTimeout(() => setSendStatus("idle"), 2000);
    }
  }

  const tid        = tournamentId.trim();
  const displayUrl = tid ? `${origin}/${userId}/${tid}/display` : "";

  function copyDisplayUrl() {
    navigator.clipboard.writeText(displayUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function getWidgetUrl(widget) {
    const url = getWidgetPath(widget, userId, tid);
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

            <Select
              value={scoreGroupView || "default"}
              onValueChange={(v) => {
                const val = v === "default" ? "" : v;
                setScoreGroupView(val);
                localStorage.setItem("scoreGroupView", val);
              }}
            >
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Score Group: Default</SelectItem>
                <SelectItem value="full">Score Group: Full</SelectItem>
              </SelectContent>
            </Select>

            {allowedTournamentIds.length === 0 ? (
              <span className="text-xs text-red-400">No tournaments assigned</span>
            ) : allowedTournamentIds.length === 1 ? (
              <span className="text-xs font-bold text-blue-400">ID: {tid}</span>
            ) : (
              <Select value={tournamentId} onValueChange={(v) => handleTidChange({ target: { value: v } })}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allowedTournamentIds.map((id) => (
                    <SelectItem key={id} value={id}>{id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Link
              href="/settings"
              className="border border-gray-700 px-3 py-1.5 text-xs font-bold tracking-wider text-gray-400 uppercase hover:border-gray-500 hover:text-white"
            >
              Settings
            </Link>
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
          <span className="shrink-0 text-xs font-bold tracking-widest text-gray-500 uppercase">Sources</span>
          <span className="h-3 w-px shrink-0 bg-gray-700" />
          <span className="truncate font-mono text-xs text-blue-400">
            {displayUrl || <span className="text-gray-600">No tournament ID selected</span>}
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
              href={`/${userId}/${tid}/display`}
              target="_blank"
              className="border border-gray-600 px-3 py-1 text-xs font-bold tracking-wider text-gray-400 uppercase hover:border-blue-500 hover:text-blue-400"
            >
              Open ↗
            </Link>
            <Link
              href={`/${userId}/${tid}/widgets`}
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
              <span className="text-xs text-gray-600">— No tournament selected</span>
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
              <span className="text-xs text-gray-600">— No tournament selected</span>
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
