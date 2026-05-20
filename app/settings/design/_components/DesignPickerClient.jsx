"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EcubeBrand from "@/components/common/EcubeBrand";

export default function DesignPickerClient({
  activeVariant: initialVariant,
  allowedDesignIds,
  allowedTournamentIds = [],
  tournamentDesigns: initialTournamentDesigns = {},
  tournamentNames = {},
}) {
  const hasTournaments = allowedTournamentIds.length > 0;

  // Global fallback design
  const [activeVariant, setActiveVariant] = useState(initialVariant);

  // Per-tournament overrides
  const [tournamentDesigns, setTournamentDesigns] = useState(
    initialTournamentDesigns,
  );

  // Auto-select first tournament; null = global (only when no tournaments)
  const [scope, setScope] = useState(() => allowedTournamentIds[0] ?? null);

  const [saving, setSaving] = useState(false);

  const effectiveDesign = scope
    ? (tournamentDesigns[scope] ?? activeVariant)
    : activeVariant;

  function selectDesign(d) {
    if (scope) {
      setTournamentDesigns((prev) => ({ ...prev, [scope]: d }));
    } else {
      setActiveVariant(d);
    }
  }

  function clearOverride(tid) {
    setTournamentDesigns((prev) => {
      const n = { ...prev };
      delete n[tid];
      return n;
    });
  }

  async function save() {
    setSaving(true);
    const id = toast.loading("Saving…");
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designVariant: activeVariant,
          tournamentDesigns,
        }),
      });
      const data = await res.json();
      if (res.ok) toast.success("Design saved.", { id });
      else toast.error(data.error ?? "Save failed", { id });
    } catch {
      toast.error("Network error", { id });
    } finally {
      setSaving(false);
    }
  }

  const scopeName = scope ? tournamentNames[scope] || scope : null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <EcubeBrand />
            <span className="h-4 w-px bg-gray-700" />
            <Link
              href="/settings"
              className="rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-200"
            >
              ← Settings
            </Link>
            <span className="h-4 w-px bg-gray-800" />
            <span className="text-sm font-semibold text-white">
              Select Design
            </span>
          </div>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-blue-600 font-semibold text-white hover:bg-blue-500"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        {/* Per-tournament scope tabs — no "All Tournaments" */}
        {hasTournaments && (
          <div className="flex items-center justify-center gap-2 border-t border-gray-800/60 px-6 py-2.5">
            {allowedTournamentIds.map((tid) => (
              <button
                key={tid}
                onClick={() => setScope(tid)}
                className={[
                  "flex items-center gap-2 rounded border px-4 py-1.5 text-sm font-medium transition-all",
                  scope === tid
                    ? "border-blue-500 bg-blue-950/50 text-blue-300"
                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300",
                ].join(" ")}
              >
                <span className="flex flex-col items-start leading-tight">
                  <span>{tournamentNames[tid] || tid}</span>
                  {tournamentNames[tid] && (
                    <span className="font-mono text-[10px] text-gray-500">
                      {tid}
                    </span>
                  )}
                </span>
                {/* dot indicator when this tournament has an override */}
                {tournamentDesigns[tid] && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Tournament context bar */}
      {scope && (
        <div className="flex shrink-0 items-center justify-between border-b border-amber-900/40 bg-amber-950/20 px-6 py-2">
          <p className="text-xs text-amber-400/80">
            Selecting design for{" "}
            <span className="font-semibold text-amber-300">{scopeName}</span>.
            {!tournamentDesigns[scope] && (
              <span className="ml-1 text-gray-500">
                Using global default ({activeVariant}).
              </span>
            )}
          </p>
          {tournamentDesigns[scope] && (
            <button
              onClick={() => clearOverride(scope)}
              className="text-xs text-gray-500 transition-colors hover:text-red-400"
            >
              Clear override
            </button>
          )}
        </div>
      )}

      {/* Design grid */}
      <main className="p-6">
        <p className="mb-1 text-xs font-bold tracking-widest text-gray-500 uppercase">
          {scopeName ? `Design for ${scopeName}` : "Active design"}
        </p>
        <p className="mb-5 text-xs text-gray-600">
          {scope
            ? "Overrides the global default for this tournament only."
            : "Applies to all tournaments unless a per-tournament override is set."}
        </p>

        {allowedDesignIds.length === 0 ? (
          <p className="text-sm text-gray-600">
            No designs assigned. Contact your admin.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allowedDesignIds.map((d) => {
              const isExplicit = scope
                ? tournamentDesigns[scope] === d
                : activeVariant === d;
              const isInherited =
                scope && !tournamentDesigns[scope] && activeVariant === d;

              return (
                <button
                  key={d}
                  onClick={() => selectDesign(d)}
                  className={[
                    "flex flex-col items-start rounded border p-5 text-left transition-all",
                    isExplicit
                      ? "border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/30"
                      : isInherited
                        ? "border-gray-500 bg-gray-800/60"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-900/60",
                  ].join(" ")}
                >
                  <div className="mb-3 flex h-20 w-full items-center justify-center rounded border border-gray-700 bg-gray-800/60">
                    <span className="font-mono text-xs text-gray-600">{d}</span>
                  </div>
                  <p
                    className={[
                      "text-sm font-semibold",
                      isExplicit ? "text-blue-300" : "text-white",
                    ].join(" ")}
                  >
                    {d}
                  </p>
                  <div className="mt-1 flex gap-1.5">
                    {isExplicit && (
                      <Badge
                        variant="outline"
                        className="border-blue-600/60 text-[11px] text-blue-400"
                      >
                        Active
                      </Badge>
                    )}
                    {isInherited && (
                      <Badge
                        variant="outline"
                        className="border-gray-600 text-[11px] text-gray-500"
                      >
                        Inherited
                      </Badge>
                    )}
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
