"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AFTER_MATCH_WIDGETS,
  IN_GAME_WIDGETS,
  getWidgetPath,
  getWidgetPlaceholder,
} from "@/lib/widget-catalog";

export default function WidgetsPage() {
  const [origin, setOrigin] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const saved = localStorage.getItem("tournamentId") ?? "";
    setTournamentId(saved);
    setIsSaved(!!saved);
  }, []);

  function copy(url) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  }

  const tid = isSaved ? tournamentId.trim() : "";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-gray-700 bg-gray-800 px-5 py-3">
        <Link
          href="/controller"
          className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-white"
        >
          ← Controller
        </Link>
        <span className="h-3 w-px bg-gray-600" />
        <span className="text-xs font-bold tracking-widest text-white uppercase">
          Individual Widget Links
        </span>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 p-5">
        {/* Display URL */}
        <section>
          <SectionLabel
            color="blue"
            title="Multi-Widget Display (BROADCASTER Browser Source)"
          />
          <div className="mt-3">
            <UrlRow
              label="Display"
              url={`${origin}/display`}
              copiedUrl={copiedUrl}
              onCopy={copy}
              origin={origin}
            />
          </div>
        </section>

        {/* Tournament ID shared for all route-based widgets */}
        <section>
          <SectionLabel
            color="blue"
            title="Tournament ID (Used Across Widgets)"
          />
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tournament ID"
              value={tournamentId}
              onChange={(e) => {
                setTournamentId(e.target.value);
                setIsSaved(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tournamentId.trim()) {
                  localStorage.setItem("tournamentId", tournamentId.trim());
                  setIsSaved(true);
                }
              }}
              className="w-44 border border-gray-600 bg-gray-950 px-2 py-1.5 text-xs text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
            />
            {!isSaved && tournamentId.trim() && (
              <button
                onClick={() => {
                  localStorage.setItem("tournamentId", tournamentId.trim());
                  setIsSaved(true);
                }}
                className="bg-blue-600 px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-blue-500"
              >
                Save
              </button>
            )}
            {isSaved && (
              <span className="text-xs font-bold text-blue-400">ID: {tid}</span>
            )}
          </div>
        </section>

        {/* In-game */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-green-500" />
            <span className="text-xs font-bold tracking-widest text-green-400 uppercase">
              In-Game Widgets
            </span>
            {tid ? (
              <span className="text-xs text-gray-500">— Tournament: {tid}</span>
            ) : (
              <span className="text-xs text-gray-600">
                — Save a Tournament ID to enable
              </span>
            )}
            <span className="h-px flex-1 bg-gray-700" />
          </div>
          <div className="mt-3 space-y-2">
            {IN_GAME_WIDGETS.map((w) => {
              const path = getWidgetPath(w, tid);
              const url = toDisplayUrl(path, origin);
              return (
                <UrlRow
                  key={w.id}
                  label={w.label}
                  url={url}
                  placeholder={toDisplayUrl(getWidgetPlaceholder(w), origin)}
                  copiedUrl={copiedUrl}
                  onCopy={copy}
                  origin={origin}
                  disabled={!path}
                />
              );
            })}
          </div>
        </section>

        {/* After-match */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-orange-500" />
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              After-Match Widgets
            </span>
            {tid ? (
              <span className="text-xs text-gray-500">— Tournament: {tid}</span>
            ) : (
              <span className="text-xs text-gray-600">
                — Save a Tournament ID to enable
              </span>
            )}
            <span className="h-px flex-1 bg-gray-700" />
          </div>

          <div className="space-y-2">
            {AFTER_MATCH_WIDGETS.map((w) => {
              const path = getWidgetPath(w, tid);
              const url = toDisplayUrl(path, origin);
              return (
                <UrlRow
                  key={w.id}
                  label={w.label}
                  url={url}
                  placeholder={toDisplayUrl(getWidgetPlaceholder(w), origin)}
                  copiedUrl={copiedUrl}
                  onCopy={copy}
                  origin={origin}
                  disabled={!path}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionLabel({ color, title }) {
  const accent = {
    green: "bg-green-500 text-green-400",
    blue: "bg-blue-500 text-blue-400",
  };
  const [bg, text] = accent[color].split(" ");
  return (
    <div className="flex items-center gap-3">
      <span className={`block h-4 w-1 ${bg} shrink-0 rounded-sm`} />
      <span className={`text-xs font-bold tracking-widest uppercase ${text}`}>
        {title}
      </span>
      <span className="h-px flex-1 bg-gray-700" />
    </div>
  );
}

function UrlRow({
  label,
  url,
  placeholder,
  copiedUrl,
  onCopy,
  origin,
  disabled,
}) {
  const isCopied = Boolean(url) && copiedUrl === url;
  const isExternalUrl = typeof url === "string" && /^https?:\/\//i.test(url);
  const openHref = !url ? null : isExternalUrl ? url : url.replace(origin, "");
  const display = url ?? placeholder;

  return (
    <div className="flex items-center gap-2 border border-gray-700 bg-gray-800 px-3 py-2">
      {/* Label */}
      <span className="w-44 shrink-0 truncate text-xs font-bold tracking-wide text-gray-300 uppercase">
        {label}
      </span>

      {/* URL */}
      <span
        className={[
          "flex-1 truncate font-mono text-xs",
          disabled ? "text-gray-600" : "text-blue-300",
        ].join(" ")}
      >
        {display}
      </span>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!disabled && url && isExternalUrl && (
          <a
            href={openHref}
            target="_blank"
            rel="noreferrer"
            className="border border-gray-600 px-2 py-1 text-xs font-bold text-gray-400 transition-colors hover:border-gray-400 hover:text-white"
          >
            Open ↗
          </a>
        )}
        {!disabled && url && !isExternalUrl && (
          <Link
            href={openHref}
            target="_blank"
            className="border border-gray-600 px-2 py-1 text-xs font-bold text-gray-400 transition-colors hover:border-gray-400 hover:text-white"
          >
            Open ↗
          </Link>
        )}
        <button
          onClick={() => !disabled && url && onCopy(url)}
          disabled={disabled}
          className={[
            "border px-2 py-1 text-xs font-bold transition-colors",
            isCopied
              ? "border-green-500 bg-green-950 text-green-400"
              : disabled
                ? "cursor-not-allowed border-gray-700 text-gray-700"
                : "cursor-pointer border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400",
          ].join(" ")}
        >
          {isCopied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function toDisplayUrl(path, origin) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path}`;
}
