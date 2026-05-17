"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DesignPickerClient({
  activeVariant: initialVariant,
  allowedDesignIds,
  allowedTournamentIds,
  tournamentDesigns: initialTournamentDesigns,
  tournamentNames = {},
}) {
  const [activeVariant, setActiveVariant]         = useState(initialVariant);
  const [tournamentDesigns, setTournamentDesigns] = useState(initialTournamentDesigns);
  const [saving, setSaving]                       = useState(false);

  // scope: null = editing global default, tid = editing that tournament's override
  const [scope, setScope] = useState(null);

  const scopedActive = scope ? (tournamentDesigns[scope] ?? null) : null;
  const effectiveActive = scope ? (tournamentDesigns[scope] ?? activeVariant) : activeVariant;

  function selectDesign(d) {
    if (scope) {
      setTournamentDesigns((prev) => ({ ...prev, [scope]: d }));
    } else {
      setActiveVariant(d);
    }
  }

  function clearTournamentDesign(tid) {
    setTournamentDesigns((prev) => { const n = { ...prev }; delete n[tid]; return n; });
  }

  async function save() {
    setSaving(true);
    const id = toast.loading("Saving…");
    try {
      const res = await fetch("/api/user/settings", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ designVariant: activeVariant, tournamentDesigns }),
      });
      const data = await res.json();
      if (res.ok) toast.success("Design saved.", { id });
      else        toast.error(data.error ?? "Save failed", { id });
    } catch {
      toast.error("Network error", { id });
    } finally {
      setSaving(false);
    }
  }

  const hasTournaments = allowedTournamentIds.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 font-sans text-white">

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/settings"
              className="rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-200">
              ← Settings
            </Link>
            <span className="h-4 w-px bg-gray-800" />
            <span className="text-sm font-semibold text-white">Select Design</span>
          </div>
          <Button onClick={save} disabled={saving}
            className="bg-gradient-to-r from-violet-600 to-pink-600 font-semibold text-white hover:from-violet-500 hover:to-pink-500">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        {/* Scope picker */}
        {hasTournaments && (
          <div className="flex items-center justify-center gap-2 border-t border-gray-800/60 px-6 py-2.5">
            <span className="shrink-0 text-sm font-bold uppercase tracking-widest text-gray-500">Scope:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <ScopeTab label="All Tournaments" active={scope === null} onClick={() => setScope(null)} />
              {allowedTournamentIds.map((tid) => (
                <ScopeTab
                  key={tid}
                  label={tournamentNames[tid] || tid}
                  sublabel={tournamentNames[tid] ? tid : null}
                  active={scope === tid}
                  onClick={() => setScope(tid)}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Context bar for tournament scope */}
      {scope && (
        <div className="flex shrink-0 items-center justify-between border-b border-amber-900/40 bg-amber-950/20 px-6 py-2">
          <p className="text-xs text-amber-400/80">
            Overriding design for <span className="font-semibold text-amber-300">{tournamentNames[scope] || scope}</span>.
            Without an override it uses the global default ({activeVariant}).
          </p>
          {tournamentDesigns[scope] && (
            <button onClick={() => clearTournamentDesign(scope)}
              className="text-xs text-gray-600 transition-colors hover:text-red-400">
              Clear override
            </button>
          )}
        </div>
      )}

      {/* Design grid */}
      <main className="p-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
          {scope
            ? `Design for ${tournamentNames[scope] || scope}`
            : "Global default design"}
        </p>
        <p className="mb-5 text-xs text-gray-600">
          {scope
            ? "This overrides the global default for this tournament only."
            : "Applied to all tournaments unless a per-tournament override is set."}
        </p>

        {allowedDesignIds.length === 0 ? (
          <p className="text-sm text-gray-600">No designs assigned. Contact your admin.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allowedDesignIds.map((d) => {
              const isExplicit  = scope ? tournamentDesigns[scope] === d : activeVariant === d;
              const isInherited = scope && !tournamentDesigns[scope] && activeVariant === d;

              return (
                <button key={d} onClick={() => selectDesign(d)}
                  className={[
                    "flex flex-col items-start rounded border p-5 text-left transition-all",
                    isExplicit
                      ? "border-violet-500 bg-violet-950/40 ring-1 ring-violet-500/30"
                      : isInherited
                        ? "border-gray-500 bg-gray-800/60"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-900/60",
                  ].join(" ")}
                >
                  {/* Placeholder preview block */}
                  <div className="mb-3 h-20 w-full rounded border border-gray-700 bg-gray-800/60 flex items-center justify-center">
                    <span className="font-mono text-xs text-gray-600">{d}</span>
                  </div>
                  <p className={["text-sm font-semibold",
                    isExplicit ? "text-violet-300" : isInherited ? "text-gray-300" : "text-white",
                  ].join(" ")}>{d}</p>
                  <div className="mt-1 flex gap-1.5">
                    {isExplicit  && <Badge variant="outline" className="border-violet-600/60 text-[11px] text-violet-400">Active</Badge>}
                    {isInherited && <Badge variant="outline" className="border-gray-600 text-[11px] text-gray-500">Inherited</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function ScopeTab({ label, sublabel, active, onClick }) {
  return (
    <button onClick={onClick}
      className={[
        "flex items-center gap-2 rounded border px-4 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-violet-500 bg-violet-950/50 text-violet-300"
          : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300",
      ].join(" ")}
    >
      {label}
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
    </button>
  );
}
