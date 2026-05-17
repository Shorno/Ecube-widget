"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VARIANT_DEFAULTS } from "@/lib/design/catalog";

function merge(saved, defaults) {
  function pick(s, d) {
    if (typeof d === "object" && d !== null && !Array.isArray(d)) {
      const out = {};
      for (const k of Object.keys(d)) out[k] = pick(s?.[k], d[k]);
      return out;
    }
    return s ?? d ?? "";
  }
  return pick(saved, defaults);
}

function toHex(val) {
  if (!val) return "#000000";
  const t = val.trim();
  if (/^#[0-9a-f]{6}$/i.test(t)) return t;
  if (/^#[0-9a-f]{3}$/i.test(t)) {
    const [, r, g, b] = t.match(/^#(.)(.)(.)/);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
}

export default function SettingsClient({
  variant: initialVariant,
  font: initialFont,
  savedColors,
  defaults: initialDefaults,
  allowedDesignIds,
  allowedTournamentIds,
  tournamentDesigns: initialTournamentDesigns,
  tournamentNames    = {},
  tournamentColors:  initialTournamentColors = {},
  tournamentFonts:   initialTournamentFonts  = {},
  widgetFonts,
  predefinedThemes = [],
}) {
  const router = useRouter();

  // Global defaults
  const [activeVariant, setActiveVariant]   = useState(initialVariant);
  const [activeFont, setActiveFont]         = useState(initialFont);
  const [colors, setColors]                 = useState(() => merge(savedColors, initialDefaults));

  // Per-tournament overrides
  const [tournamentDesigns, setTournamentDesigns] = useState(initialTournamentDesigns ?? {});
  const [tournamentColors, setTournamentColors]   = useState(initialTournamentColors);
  const [tournamentFonts, setTournamentFonts]     = useState(initialTournamentFonts);

  // null = global scope; a tid string = tournament scope
  const [scope, setScope] = useState(null);

  const [saving, setSaving]     = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // ── Derived values for current scope ──────────────────────────────────────
  const scopedVariant = scope ? (tournamentDesigns[scope] ?? "") : activeVariant;
  const scopedFont    = scope ? (tournamentFonts[scope]   ?? "") : activeFont;
  const scopedColors  = scope
    ? (tournamentColors[scope] ?? merge({}, colors))
    : colors;

  // ── Variant ───────────────────────────────────────────────────────────────
  function handleVariantChange(v) {
    if (scope) {
      setTournamentDesigns((prev) => {
        if (v === "") { const n = { ...prev }; delete n[scope]; return n; }
        return { ...prev, [scope]: v };
      });
    } else {
      setActiveVariant(v);
      const nd = VARIANT_DEFAULTS[v] ?? VARIANT_DEFAULTS.default;
      setColors((prev) => merge(prev, nd));
    }
  }

  // ── Font ──────────────────────────────────────────────────────────────────
  function handleFontChange(key) {
    if (scope) {
      setTournamentFonts((prev) => {
        if (key === "") { const n = { ...prev }; delete n[scope]; return n; }
        return { ...prev, [scope]: key };
      });
    } else {
      setActiveFont(key);
    }
  }

  // ── Colors ────────────────────────────────────────────────────────────────
  function setColor(path, value) {
    function applyDeep(obj) {
      const next = structuredClone(obj);
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (!cur[path[i]]) cur[path[i]] = {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
      return next;
    }
    if (scope) {
      setTournamentColors((prev) => ({
        ...prev,
        [scope]: applyDeep(prev[scope] ?? merge({}, colors)),
      }));
    } else {
      setColors((prev) => applyDeep(prev));
    }
  }

  function resetColors() {
    const fresh = merge({}, VARIANT_DEFAULTS[activeVariant] ?? VARIANT_DEFAULTS.default);
    if (scope) {
      setTournamentColors((prev) => ({ ...prev, [scope]: fresh }));
    } else {
      setColors(fresh);
    }
  }

  function applyTheme(themeColors) {
    if (scope) {
      setTournamentColors((prev) => ({ ...prev, [scope]: themeColors }));
    } else {
      setColors(themeColors);
    }
  }

  function clearTournamentOverrides(tid) {
    setTournamentDesigns((prev) => { const n = { ...prev }; delete n[tid]; return n; });
    setTournamentColors((prev)  => { const n = { ...prev }; delete n[tid]; return n; });
    setTournamentFonts((prev)   => { const n = { ...prev }; delete n[tid]; return n; });
    if (scope === tid) setScope(null);
  }

  const effectiveVariant = scope
    ? (tournamentDesigns[scope] || activeVariant)
    : activeVariant;

  // ── Save ──────────────────────────────────────────────────────────────────
  async function doLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function save() {
    setSaving(true);
    const id = toast.loading("Saving…");
    try {
      const res = await fetch("/api/user/settings", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          designVariant: activeVariant,
          font: activeFont,
          colors,
          tournamentDesigns,
          tournamentColors,
          tournamentFonts,
        }),
      });
      const data = await res.json();
      if (res.ok) toast.success("Saved — reload your OBS sources to apply.", { id });
      else        toast.error(data.error ?? "Save failed", { id });
    } catch {
      toast.error("Network error", { id });
    } finally {
      setSaving(false);
    }
  }

  const scopeLabel = scope ? (tournamentNames[scope] || scope) : null;
  const hasTournaments = allowedTournamentIds.length > 0;

  return (
    <div className="flex h-screen flex-col bg-gray-950 font-sans text-white">

      {/* Sticky header */}
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/controller"
              className="rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-200">
              ← Controller
            </Link>
            <span className="h-4 w-px bg-gray-800" />
            <span className="text-sm font-semibold text-white">Theme Settings</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLogoutOpen(true)}
              className="text-sm text-gray-600 transition-colors hover:text-red-400"
            >
              Logout
            </button>
            <Button onClick={save} disabled={saving}
              className="bg-gradient-to-r from-violet-600 to-pink-600 font-semibold text-white hover:from-violet-500 hover:to-pink-500">
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Tournament scope picker — only shown when user has tournaments */}
        {hasTournaments && (
          <div className="flex items-center justify-center gap-2 border-t border-gray-800/60 px-6 py-2.5">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-600">Scope:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <ScopeTab
                label="All Tournaments"
                active={scope === null}
                onClick={() => setScope(null)}
              />
              {allowedTournamentIds.map((tid) => {
                const hasOverride =
                  Boolean(tournamentDesigns[tid]) ||
                  Boolean(tournamentColors[tid]) ||
                  Boolean(tournamentFonts[tid]);
                return (
                  <ScopeTab
                    key={tid}
                    label={tournamentNames[tid] || tid}
                    sublabel={tournamentNames[tid] ? tid : null}
                    active={scope === tid}
                    hasOverride={hasOverride}
                    onClick={() => setScope(tid)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Per-scope context bar */}
      {scope && (
        <div className="flex shrink-0 items-center justify-between border-b border-amber-900/40 bg-amber-950/20 px-6 py-2">
          <p className="text-xs text-amber-400/80">
            Editing overrides for <span className="font-semibold text-amber-300">{tournamentNames[scope] || scope}</span>.
            {" "}Changes here apply only to this tournament.
          </p>
          <button
            onClick={() => clearTournamentOverrides(scope)}
            className="text-xs text-gray-600 transition-colors hover:text-red-400">
            Clear all overrides
          </button>
        </div>
      )}

      {/* 2-column body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Design + Font */}
        <ScrollArea className="w-[340px] shrink-0 border-r border-gray-800">
          <div className="space-y-6 p-5">

            <PanelSection title="Design">
              <p className="mb-3 text-xs text-gray-500">
                {scope
                  ? "Overrides the design for this tournament. Clear overrides to revert."
                  : "Applied to all tournaments unless a tournament override is set."}
              </p>
              {allowedDesignIds.length === 0 ? (
                <p className="text-sm text-gray-600">No designs assigned. Contact your admin.</p>
              ) : (
                <div className="space-y-2">
                  {allowedDesignIds.map((d) => {
                    // In tournament scope: highlight the explicit override; if no override,
                    // highlight whichever design matches the global default (inherited).
                    const override   = scope ? tournamentDesigns[scope] : null;
                    const isExplicit = override === d;
                    const isInherited = scope && !override && activeVariant === d;
                    const isActive   = scope ? isExplicit : activeVariant === d;
                    return (
                      <button key={d} onClick={() => handleVariantChange(d)}
                        className={[
                          "flex w-full items-center justify-between rounded border px-4 py-3 text-left transition-all",
                          isExplicit  ? "border-violet-500 bg-violet-950/40 ring-1 ring-violet-500/30"
                          : isInherited ? "border-gray-500 bg-gray-800/60"
                          : isActive    ? "border-violet-500 bg-violet-950/40 ring-1 ring-violet-500/30"
                                        : "border-gray-700 hover:border-gray-600",
                        ].join(" ")}>
                        <div>
                          <p className={["text-sm font-semibold", (isExplicit || isActive) ? "text-violet-300" : isInherited ? "text-gray-300" : "text-white"].join(" ")}>{d}</p>
                          <p className="font-mono text-[10px] text-gray-600">{d}</p>
                        </div>
                        {isExplicit && <Badge variant="outline" className="border-violet-600/60 text-[11px] text-violet-400">Active</Badge>}
                        {isInherited && <Badge variant="outline" className="border-gray-600 text-[11px] text-gray-500">Inherited</Badge>}
                        {!scope && isActive && <Badge variant="outline" className="border-violet-600/60 text-[11px] text-violet-400">Active</Badge>}
                      </button>
                    );
                  })}
                </div>
              )}
            </PanelSection>

            <PanelSection title="Font">
              <p className="mb-3 text-xs text-gray-500">
                {scope
                  ? "Overrides the font for this tournament. Clear overrides to revert."
                  : "Applied to all tournaments unless a tournament override is set."}
              </p>
              <div className="space-y-2">
                {widgetFonts.map((f) => {
                  const override    = scope ? tournamentFonts[scope] : null;
                  const isExplicit  = override === f.key;
                  const isInherited = scope && !override && activeFont === f.key;
                  const isActive    = scope ? isExplicit : activeFont === f.key;
                  return (
                    <button key={f.key} onClick={() => handleFontChange(f.key)}
                      className={[
                        "flex w-full items-center justify-between rounded border px-4 py-2.5 text-left transition-all",
                        isExplicit   ? "border-violet-500 bg-violet-950/40"
                        : isInherited ? "border-gray-500 bg-gray-800/60"
                        : isActive    ? "border-violet-500 bg-violet-950/40"
                                      : "border-gray-700 hover:border-gray-600",
                      ].join(" ")}>
                      <div className="min-w-0">
                        <p className={["text-xs", (isExplicit || isActive) ? "text-violet-400" : isInherited ? "text-gray-400" : "text-gray-500"].join(" ")}>{f.label}</p>
                        <p className="truncate text-sm font-semibold text-white" style={{ fontFamily: f.css }}>
                          {f.sample}
                        </p>
                      </div>
                      {isExplicit  && <span className="ml-3 shrink-0 text-[10px] font-semibold text-violet-400">✓</span>}
                      {isInherited && <span className="ml-3 shrink-0 text-[10px] text-gray-500">Inherited</span>}
                      {!scope && isActive && <span className="ml-3 shrink-0 text-[10px] font-semibold text-violet-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            </PanelSection>

          </div>
        </ScrollArea>

        {/* RIGHT — Themes + Colors */}
        <ScrollArea className="flex-1">
          <div className="max-w-2xl space-y-5 p-5">

            {/* Quick themes */}
            {predefinedThemes.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Quick Themes {scopeLabel ? <span className="normal-case text-amber-500/70">({scopeLabel})</span> : null}
                </p>
                <p className="text-xs text-gray-500">Click to fill colors for the selected scope. Press Save to apply.</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {predefinedThemes.map((theme) => (
                    <button key={theme.key}
                      onClick={() => applyTheme(theme.colors)}
                      className="flex flex-col gap-2 rounded border border-gray-700 bg-gray-900/60 p-3 text-left transition-all hover:border-gray-500 hover:bg-gray-800/60">
                      <div className="flex gap-1">
                        {theme.swatches.map((c, i) => (
                          <div key={i} className="h-4 w-4 shrink-0 rounded-sm border border-gray-700/50"
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <p className="text-xs font-medium leading-tight text-gray-300">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color groups */}
            <ColorGroup title="Primary" path={["primary"]}
              value={scopedColors.primary} onChange={setColor}
              fields={["DEFAULT","background","border","dark"]}
              labels={["Default","Background","Border","Dark"]}
            />
            <ColorGroup title="Secondary" path={["secondary"]}
              value={scopedColors.secondary} onChange={setColor}
              fields={["DEFAULT","background","border","dark"]}
              labels={["Default","Background","Border","Dark"]}
            />
            <ColorGroup title="Status" path={["status"]}
              value={scopedColors.status} onChange={setColor}
              fields={["alive","knocked","dead"]}
              labels={["Alive","Knocked","Dead"]}
            />
            <ColorGroup title="Global" path={[]}
              value={{ background: scopedColors.background, text: scopedColors.text, gradStart: scopedColors.gradient?.start, gradEnd: scopedColors.gradient?.end }}
              onChange={(path, v) => {
                if (path[0] === "gradStart") setColor(["gradient","start"], v);
                else if (path[0] === "gradEnd") setColor(["gradient","end"], v);
                else setColor(path, v);
              }}
              fields={["background","text","gradStart","gradEnd"]}
              labels={["Background","Text","Gradient Start","Gradient End"]}
            />

            <div className="flex justify-end pb-2">
              <button onClick={resetColors}
                className="text-xs text-gray-600 transition-colors hover:text-gray-400">
                Reset {scopeLabel ?? "default"} colors to {effectiveVariant} defaults
              </button>
            </div>

          </div>
        </ScrollArea>
      </div>

      {/* Logout confirmation */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="bg-red-600 text-white hover:bg-red-500">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ScopeTab({ label, sublabel, active, hasOverride, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 rounded border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-violet-500 bg-violet-950/50 text-violet-300"
          : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300",
      ].join(" ")}
    >
      {label}
      {sublabel && <span className="font-mono text-[9px] text-gray-600">{sublabel}</span>}
      {hasOverride && <span className={active ? "text-violet-400" : "text-amber-500"}>●</span>}
    </button>
  );
}

function PanelSection({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">{title}</p>
      {children}
    </div>
  );
}

function ColorGroup({ title, path, value, onChange, fields, labels }) {
  return (
    <div className="space-y-3 rounded border border-gray-800 bg-gray-900/60 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {fields.map((field, i) => (
          <ColorInput
            key={field}
            label={labels[i]}
            value={value?.[field] ?? ""}
            onChange={(v) => onChange([...(path.length ? path : []), field], v)}
          />
        ))}
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  const pickerRef = useRef(null);

  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-medium text-gray-500">{label}</Label>
      <div className="flex items-center gap-1.5">
        <div className="relative shrink-0">
          <div
            className="h-6 w-6 cursor-pointer rounded border border-gray-600 transition-colors hover:border-gray-400"
            style={{ backgroundColor: value || "transparent" }}
            onClick={() => pickerRef.current?.click()}
          />
          <input
            ref={pickerRef}
            type="color"
            value={toHex(value)}
            onChange={(e) => onChange(e.target.value)}
            className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
            tabIndex={-1}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000 or rgba(…)"
          className="h-6 w-36 min-w-0 border-gray-700 bg-gray-800 font-mono text-[10px] text-white placeholder:text-gray-700"
        />
      </div>
    </div>
  );
}
