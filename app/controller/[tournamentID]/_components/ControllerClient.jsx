"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import EcubeBrand from "@/components/common/EcubeBrand";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AFTER_MATCH_WIDGETS, getWidgetPath } from "@/lib/widget-catalog";

export default function ControllerClient({
  userId,
  userName = "",
  tournamentId,
  tournamentName,
  allTournaments,
}) {
  const [scoreGroupView, setScoreGroupView] = useState("");
  const [activeUrl, setActiveUrl] = useState(undefined);
  const [activeLabel, setActiveLabel] = useState(null);
  const [sendStatus, setSendStatus] = useState("idle");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setScoreGroupView(localStorage.getItem("scoreGroupView") ?? "");

    fetch(`/api/sse/state?tournamentId=${tournamentId}`)
      .then((r) => r.json())
      .then(({ url, label }) => {
        setActiveUrl(url ?? null);
        setActiveLabel(label ?? null);
      })
      .catch(() => setActiveUrl(null));

    const es = new EventSource(`/api/sse?tournamentId=${tournamentId}`);
    es.addEventListener("widget-status", (e) => {
      const { widgetUrl, failedImages } = JSON.parse(e.data);
      setLoadError({ widgetUrl, failedImages });
    });

    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendCommand(url, label) {
    setSendStatus("sending");
    try {
      const res = await fetch("/api/sse/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, label, tournamentId }),
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

  const displayUrl = origin
    ? `${origin}/${userId}/${tournamentId}/display`
    : "";

  function copyDisplayUrl() {
    navigator.clipboard.writeText(displayUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function getWidgetUrl(widget) {
    const url = getWidgetPath(widget, userId, tournamentId);
    if (!url) return null;
    const extra =
      widget.id === "after-match-score-group" && scoreGroupView
        ? `?view=${scoreGroupView}`
        : "";
    return `${url}${extra}`;
  }

  const hasMultipleTournaments = allTournaments.length > 1;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800">
        {/* Row 1 — logo + tournament info | brand pill */}
        <div className="flex items-center justify-between border-b border-gray-700 px-5 py-3">
          <div className="flex items-center gap-3">
            <Image src="/EcubeOG.svg" width={26} height={26} alt="ECube" />
            <span className="h-4 w-px bg-gray-600" />
            {hasMultipleTournaments && (
              <Link
                href="/controller"
                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
              >
                ← Tournaments
              </Link>
            )}
            <div>
              {tournamentName && (
                <span className="block text-sm leading-tight font-bold text-white">
                  {tournamentName}
                </span>
              )}
              <span className="font-mono text-xs text-gray-500">
                {tournamentId}
              </span>
            </div>
          </div>
          <EcubeBrand />
        </div>

        {/* Row 2 — live status center | username + controls */}
        <div className="flex items-center justify-between border-b border-gray-700 px-5 py-2.5">
          {/* Live status */}
          <div className="flex-1">
            {activeLabel && activeUrl ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-green-400 uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                LIVE — {activeLabel}
              </span>
            ) : (
              <span className="text-xs tracking-widest text-gray-600 uppercase">
                No widget active
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-3">
            {sendStatus === "sending" && (
              <span className="text-xs font-bold text-yellow-400">
                Sending…
              </span>
            )}
            {sendStatus === "sent" && (
              <span className="text-xs font-bold text-green-400">Sent ✓</span>
            )}
            {sendStatus === "error" && (
              <span className="text-xs font-bold text-red-400">Error ✗</span>
            )}
            {userName && (
              <span className="text-sm text-gray-400">{userName}</span>
            )}
            <Select
              value={scoreGroupView || "default"}
              onValueChange={(v) => {
                const val = v === "default" ? "" : v;
                setScoreGroupView(val);
                localStorage.setItem("scoreGroupView", val);
              }}
            >
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Score Group: Default</SelectItem>
                <SelectItem value="full">Score Group: Full</SelectItem>
              </SelectContent>
            </Select>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded border border-blue-600 bg-blue-700/30 px-3 py-1.5 text-xs font-bold tracking-wider text-blue-300 uppercase transition-colors hover:bg-blue-700/60 hover:text-white"
            >
              ⚙ Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Load error banner */}
      {loadError && (
        <div className="border-b border-red-700 bg-red-950 px-5 py-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold tracking-widest text-red-400 uppercase">
                ⚠ Widget hidden — image failed to load
              </p>
              <p className="mb-1 text-xs text-red-500">
                Widget:{" "}
                <span className="font-mono text-red-300">
                  {loadError.widgetUrl}
                </span>
              </p>
              {loadError.failedImages.map((url, i) => (
                <p key={i} className="truncate font-mono text-xs text-red-400">
                  ✗ {url}
                </p>
              ))}
            </div>
            <button
              onClick={() => setLoadError(null)}
              className="my-auto shrink-0 bg-red-900 p-4 text-xs font-bold text-red-100 hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Display URL bar */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-800 bg-gray-950 px-5 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-bold tracking-widest text-gray-500 uppercase">
            Sources
          </span>
          <span className="h-3 w-px shrink-0 bg-gray-700" />
          <span className="truncate font-mono text-xs text-blue-400">
            {displayUrl}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={copyDisplayUrl}
            className={[
              "border px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors",
              copied
                ? "border-green-500 bg-green-950 text-green-400"
                : "border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400",
            ].join(" ")}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <Link
            href={`/${userId}/${tournamentId}/display`}
            target="_blank"
            className="border border-gray-600 px-3 py-1 text-xs font-bold tracking-wider text-gray-400 uppercase hover:border-blue-500 hover:text-blue-400"
          >
            Open ↗
          </Link>
          <Link
            href={`/${userId}/${tournamentId}/widgets`}
            target="_blank"
            className="border border-gray-600 px-3 py-1 text-xs font-bold tracking-wider text-gray-400 uppercase hover:border-blue-500 hover:text-blue-400"
          >
            Individual Links
          </Link>
        </div>
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
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-orange-500" />
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              After-Match Widgets
            </span>
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
  const base =
    "h-14 w-full px-2 text-center text-xs font-bold uppercase tracking-wide leading-tight border-2 transition-colors";
  const styles = {
    green: {
      inactive:
        "bg-green-950 border-green-800 text-green-400 hover:bg-green-900 hover:border-green-600",
      active:
        "bg-green-700 border-green-400 text-white ring-2 ring-green-400 ring-offset-1 ring-offset-gray-900",
    },
    orange: {
      inactive:
        "bg-orange-950 border-orange-800 text-orange-400 hover:bg-orange-900 hover:border-orange-600",
      active:
        "bg-orange-600 border-orange-400 text-white ring-2 ring-orange-400 ring-offset-1 ring-offset-gray-900",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        isActive ? styles[color].active : styles[color].inactive,
        disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
