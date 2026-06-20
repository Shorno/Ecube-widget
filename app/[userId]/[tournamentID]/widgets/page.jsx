"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AFTER_MATCH_WIDGETS,
  IN_GAME_WIDGETS,
  getWidgetPath,
  getWidgetPlaceholder,
} from "@/lib/widget-catalog";
import TeamFlagsSwitch from "@/components/common/TeamFlagsSwitch";

export default function WidgetsPage() {
  const { userId, tournamentID } = useParams();
  const [origin, setOrigin] = useState("");
  const [scoreGroupView, setScoreGroupView] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setScoreGroupView(localStorage.getItem("scoreGroupView") ?? "");
  }, []);

  function copy(url) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  }

  const tid = tournamentID ?? "";

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white">
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
        {tid && (
          <span className="text-xs text-gray-500">— Tournament: {tid}</span>
        )}
      </header>

      <main className="mx-auto max-w-4xl space-y-8 p-5">
        <section>
          <SectionLabel
            color="blue"
            title="Multi-Widget Display (OBS Browser Source)"
          />
          <div className="mt-3">
            <UrlRow
              label="Display"
              url={tid ? `${origin}/${userId}/${tid}/display` : null}
              placeholder={`${origin}/{userId}/{tournamentId}/display`}
              copiedUrl={copiedUrl}
              onCopy={copy}
              origin={origin}
              disabled={!tid}
            />
          </div>
        </section>

        <section>
          <SectionLabel color="blue" title="Score Group View" />
          <div className="mt-3 flex items-center gap-2">
            <Select
              value={scoreGroupView || "default"}
              onValueChange={(v) => {
                const val = v === "default" ? "" : v;
                setScoreGroupView(val);
                localStorage.setItem("scoreGroupView", val);
              }}
            >
              <SelectTrigger className="w-52 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (8 / 8)</SelectItem>
                <SelectItem value="full">
                  Full (split all teams evenly)
                </SelectItem>
              </SelectContent>
            </Select>
            {scoreGroupView === "full" && (
              <span className="text-xs font-bold text-blue-400">
                Full mode active
              </span>
            )}
          </div>
        </section>

        <section>
          <SectionLabel color="blue" title="Team Flags" />
          <div className="mt-3">
            <TeamFlagsSwitch />
            <p className="mt-2 text-xs text-gray-500">
              Applies to overall live ranking. Refresh the OBS browser source
              after changing.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-green-500" />
            <span className="text-xs font-bold tracking-widest text-green-400 uppercase">
              In-Game Widgets
            </span>
            <span className="h-px flex-1 bg-gray-700" />
          </div>
          <div className="mt-3 space-y-2">
            {IN_GAME_WIDGETS.map((w) => {
              const path = getWidgetPath(w, userId, tid);
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

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-4 w-1 shrink-0 rounded-sm bg-orange-500" />
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              After-Match Widgets
            </span>
            <span className="h-px flex-1 bg-gray-700" />
          </div>
          <div className="space-y-2">
            {AFTER_MATCH_WIDGETS.map((w) => {
              const path = getWidgetPath(w, userId, tid);
              const extra =
                w.id === "after-match-score-group" && scoreGroupView
                  ? `?view=${scoreGroupView}`
                  : "";
              const url = toDisplayUrl(path ? `${path}${extra}` : null, origin);
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
  const accents = {
    green: { bar: "bg-green-500", text: "text-green-400" },
    blue: { bar: "bg-blue-500", text: "text-blue-400" },
  };
  const { bar, text } = accents[color] ?? accents.blue;
  return (
    <div className="flex items-center gap-3">
      <span className={`block h-4 w-1 shrink-0 rounded-sm ${bar}`} />
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
      <span className="w-44 shrink-0 truncate text-xs font-bold tracking-wide text-gray-300 uppercase">
        {label}
      </span>
      <span
        className={[
          "flex-1 truncate font-mono text-xs",
          disabled ? "text-gray-600" : "text-blue-300",
        ].join(" ")}
      >
        {display}
      </span>
      <div className="flex shrink-0 items-center gap-1">
        {!disabled &&
          url &&
          (isExternalUrl ? (
            <a
              href={openHref}
              target="_blank"
              rel="noreferrer"
              className="border border-gray-600 px-2 py-1 text-xs font-bold text-gray-400 transition-colors hover:border-gray-400 hover:text-white"
            >
              Open ↗
            </a>
          ) : (
            <Link
              href={openHref}
              target="_blank"
              className="border border-gray-600 px-2 py-1 text-xs font-bold text-gray-400 transition-colors hover:border-gray-400 hover:text-white"
            >
              Open ↗
            </Link>
          ))}
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
