"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import EcubeBrand from "@/components/common/EcubeBrand";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { VARIANT_DEFAULTS } from "@/themes/catalog";
import { RgbaColorPicker } from "react-colorful";

function merge(saved, defaults) {
  function pick(s, d) {
    if (typeof d === "object" && d !== null && !Array.isArray(d)) {
      const out = {};
      for (const k of Object.keys(d)) out[k] = pick(s?.[k], d[k]);
      return out;
    }
    if (typeof s === "string" && s !== "") return s;
    return d ?? "";
  }
  return pick(saved, defaults);
}

function toHex(val) {
  if (!val || typeof val !== "string") return "#000000";
  const t = val.trim();
  if (/^#[0-9a-f]{6}$/i.test(t)) return t;
  if (/^#[0-9a-f]{3}$/i.test(t)) {
    const [, r, g, b] = t.match(/^#(.)(.)(.)/);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  // Parse rgba/rgb so the native color picker displays the right swatch
  const m = t.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    const h = (n) => parseInt(n).toString(16).padStart(2, "0");
    return `#${h(m[1])}${h(m[2])}${h(m[3])}`;
  }
  return "#000000";
}

export default function SettingsClient({
  userId,
  userName = "",
  variant: initialVariant,
  font: initialFont,
  fontSecondary: initialFontSecondary = "rajdhani",
  savedColors,
  defaults: initialDefaults,
  allowedDesignIds,
  allowedTournamentIds = [],
  tournamentNames = {},
  tournamentColors: initialTournamentColors = {},
  tournamentFonts: initialTournamentFonts = {},
  tournamentSecondaryFonts: initialTournamentSecondaryFonts = {},
  widgetFonts,
  predefinedThemes = [],
  designExtras = [],
  tournamentDesigns = {},
}) {
  const router = useRouter();
  const hasTournaments = allowedTournamentIds.length > 0;

  // Global fallback settings
  const [activeVariant, setActiveVariant] = useState(initialVariant);
  const [activeFont, setActiveFont] = useState(initialFont);
  const [activeFontSecondary, setActiveFontSecondary] =
    useState(initialFontSecondary);
  const [colors, setColors] = useState(() =>
    merge(savedColors, initialDefaults),
  );

  // Per-tournament overrides
  const [tournamentColors, setTournamentColors] = useState(
    initialTournamentColors,
  );
  const [tournamentFonts, setTournamentFonts] = useState(
    initialTournamentFonts,
  );
  const [tournamentSecondaryFonts, setTournamentSecondaryFonts] = useState(
    initialTournamentSecondaryFonts,
  );

  // Auto-select the first tournament; null = global (only when no tournaments)
  const [scope, setScope] = useState(() => allowedTournamentIds[0] ?? null);

  const [saving, setSaving] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const CUSTOM_KEY = `effinity-custom-themes-${userId}`;
  const [customThemes, setCustomThemes] = useState([]);
  const [newThemeName, setNewThemeName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      if (raw) setCustomThemes(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived scoped values ─────────────────────────────────────────────────
  // When a tournament is selected its overrides take priority; global colors
  // act as the fallback so every token always has a value.
  const scopedColors = scope
    ? merge(tournamentColors[scope] ?? {}, colors)
    : colors;
  const scopedFont = scope
    ? (tournamentFonts[scope] ?? activeFont)
    : activeFont;
  const scopedFontSecondary = scope
    ? (tournamentSecondaryFonts[scope] ?? activeFontSecondary)
    : activeFontSecondary;

  // ── Color helpers ─────────────────────────────────────────────────────────
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
        [scope]: applyDeep(prev[scope] ?? { ...colors }),
      }));
    } else {
      setColors((prev) => applyDeep(prev));
    }
  }

  function resetColors() {
    const variant = scope
      ? (tournamentDesigns[scope] ?? activeVariant)
      : activeVariant;
    const fresh = merge(
      {},
      VARIANT_DEFAULTS[variant] ?? VARIANT_DEFAULTS.default,
    );
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

  function handleFontChange(key) {
    if (scope) {
      setTournamentFonts((prev) => ({ ...prev, [scope]: key }));
    } else {
      setActiveFont(key);
    }
  }

  function handleSecondaryFontChange(key) {
    if (scope) {
      setTournamentSecondaryFonts((prev) => ({ ...prev, [scope]: key }));
    } else {
      setActiveFontSecondary(key);
    }
  }

  function clearTournamentOverrides(tid) {
    setTournamentColors((prev) => {
      const n = { ...prev };
      delete n[tid];
      return n;
    });
    setTournamentFonts((prev) => {
      const n = { ...prev };
      delete n[tid];
      return n;
    });
    setTournamentSecondaryFonts((prev) => {
      const n = { ...prev };
      delete n[tid];
      return n;
    });
  }

  // ── Custom themes ─────────────────────────────────────────────────────────
  function saveCustomTheme() {
    const name = newThemeName.trim();
    if (!name) return;
    const theme = {
      key: `custom-${Date.now()}`,
      label: name,
      swatches: [
        scopedColors.primary,
        scopedColors.secondary,
        scopedColors.bg,
      ].filter(Boolean),
      colors: structuredClone(scopedColors),
    };
    const next = [...customThemes, theme];
    setCustomThemes(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    setNewThemeName("");
    toast.success(`Theme "${name}" saved.`);
  }

  function deleteCustomTheme(key) {
    const next = customThemes.filter((t) => t.key !== key);
    setCustomThemes(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
  }

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designVariant: activeVariant,
          font: activeFont,
          fontSecondary: activeFontSecondary,
          colors,
          tournamentColors,
          tournamentFonts,
          tournamentSecondaryFonts,
          // tournamentDesigns intentionally excluded — owned by /settings/design
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Saved — reload your OBS sources to apply.", { id });
      } else {
        toast.error(data.error ?? "Save failed", { id });
      }
    } catch {
      toast.error("Network error", { id });
    } finally {
      setSaving(false);
    }
  }

  const scopeName = scope ? tournamentNames[scope] || scope : null;

  return (
    <div className="flex h-screen flex-col bg-gray-900 font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 shrink-0 bg-gray-800">
        {/* Row 1 — logo + title | username (center) | brand */}
        <div className="flex items-center border-b border-gray-700 px-6 py-3">
          <div className="flex flex-1 items-center gap-3">
            <Image src="/EcubeOG.svg" width={26} height={26} alt="ECube" />
            <span className="h-4 w-px bg-gray-700" />
            <span className="text-sm font-semibold text-white">
              Theme Settings
            </span>
          </div>
          <div className="flex flex-1 justify-center">
            {userName && (
              <span className="text-sm text-gray-400">{userName}</span>
            )}
          </div>
          <div className="flex flex-1 justify-end">
            <EcubeBrand />
          </div>
        </div>

        {/* Row 2 — back link + tabs | logout + save */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-2.5">
          <div className="flex items-center gap-2">
            <Link
              href={scope ? `/controller/${scope}` : "/controller"}
              className="mr-2 text-sm text-gray-500 transition-colors hover:text-gray-200"
            >
              ← Controller
            </Link>
            {hasTournaments && (
              <>
                <span className="h-4 w-px bg-gray-800" />
                {allowedTournamentIds.map((tid) => (
                  <button
                    key={tid}
                    onClick={() => setScope(tid)}
                    className={[
                      "flex flex-col items-start rounded border px-3 py-1 text-sm font-medium transition-all",
                      scope === tid
                        ? "border-blue-500 bg-blue-950/50 text-blue-300"
                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300",
                    ].join(" ")}
                  >
                    <span className="leading-tight">
                      {tournamentNames[tid] || tid}
                    </span>
                    {tournamentNames[tid] && (
                      <span
                        className={[
                          "font-mono text-[10px] leading-tight",
                          scope === tid ? "text-blue-400/70" : "text-gray-600",
                        ].join(" ")}
                      >
                        {tid}
                      </span>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLogoutOpen(true)}
              className="text-sm text-gray-600 transition-colors hover:text-red-400"
            >
              Logout
            </button>
            <Button
              onClick={save}
              disabled={saving}
              className="bg-blue-600 font-semibold text-white hover:bg-blue-500"
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Tournament context bar */}
      {scope && (
        <div className="flex shrink-0 items-center justify-between border-b border-amber-900/40 bg-amber-950/20 px-6 py-2">
          <div className="w-30"></div>
          <p className="text-xs text-amber-400/80">
            Editing colors for{" "}
            <span className="font-semibold text-amber-300">{scopeName}</span>.
            Changes apply only to this tournament.
          </p>
          <div className="flex w-30 justify-end">
            {(tournamentColors[scope] || tournamentFonts[scope]) && (
              <button
                onClick={() => clearTournamentOverrides(scope)}
                className="text-xs text-gray-500 transition-colors hover:text-red-400"
              >
                Clear overrides
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Design + Font */}
        <ScrollArea className="w-85 shrink-0 border-r border-gray-800">
          <div className="space-y-6 p-5">
            <PanelSection title="Design">
              {allowedDesignIds.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No designs assigned. Contact your admin.
                </p>
              ) : (
                <div className="rounded border border-gray-800 bg-gray-800/60 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Active design</span>
                    <span className="font-semibold text-blue-300">
                      {activeVariant}
                    </span>
                  </div>
                  <Link
                    href="/settings/design"
                    className="mt-3 flex items-center justify-end text-xs text-gray-600 transition-colors hover:text-blue-400"
                  >
                    Change design →
                  </Link>
                </div>
              )}
            </PanelSection>

            <PanelSection title="Font">
              <div className="space-y-2">
                {widgetFonts.map((f) => {
                  const isActive = scopedFont === f.key;
                  const isOverride = scope && tournamentFonts[scope] === f.key;
                  const isInherited =
                    scope && !tournamentFonts[scope] && activeFont === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => handleFontChange(f.key)}
                      className={[
                        "flex w-full items-center justify-between rounded border px-4 py-2.5 text-left transition-all",
                        isActive
                          ? "border-blue-500 bg-blue-950/40"
                          : "border-gray-700 hover:border-gray-600",
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <p
                          className={[
                            "text-xs",
                            isActive ? "text-blue-400" : "text-gray-500",
                          ].join(" ")}
                        >
                          {f.label}
                        </p>
                        <p
                          className="truncate text-sm font-semibold text-white"
                          style={{ fontFamily: f.css }}
                        >
                          {f.sample}
                        </p>
                      </div>
                      {isOverride && (
                        <span className="ml-3 shrink-0 text-[10px] font-semibold text-blue-400">
                          ✓
                        </span>
                      )}
                      {isInherited && (
                        <span className="ml-3 shrink-0 text-[10px] text-gray-500">
                          Inherited
                        </span>
                      )}
                      {!scope && isActive && (
                        <span className="ml-3 shrink-0 text-[10px] font-semibold text-blue-400">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </PanelSection>
          </div>
        </ScrollArea>

        {/* RIGHT — Themes + Colors */}
        <ScrollArea className="flex-1">
          <div className="space-y-5 p-5">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Quick Themes
                </p>
                <p className="mb-2 text-xs text-gray-500">
                  Click to apply a preset palette.
                </p>
                {predefinedThemes.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {predefinedThemes.map((theme) => (
                      <ThemeCard
                        key={theme.key}
                        theme={theme}
                        onApply={() => applyTheme(theme.colors)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  My Themes
                </p>
                {customThemes.length > 0 ? (
                  <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {customThemes.map((theme) => (
                      <ThemeCard
                        key={theme.key}
                        theme={theme}
                        onApply={() => applyTheme(theme.colors)}
                        onDelete={() => deleteCustomTheme(theme.key)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mb-2 text-xs text-gray-600">
                    No saved themes yet.
                  </p>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveCustomTheme();
                      }
                    }}
                    placeholder="Theme name…"
                    className="h-8 flex-1 border-gray-700 bg-gray-800 text-sm text-white placeholder:text-gray-600"
                  />
                  <Button
                    onClick={saveCustomTheme}
                    disabled={!newThemeName.trim()}
                    className="h-8 shrink-0 bg-gray-700 px-3 text-xs font-medium text-white hover:bg-gray-600 disabled:opacity-40"
                  >
                    Save current
                  </Button>
                </div>
              </div>
            </div>

            {/* Active tournament indicator — shown inside the color editor so
                the user always knows which tournament's colors they're changing */}
            {scope && (
              <div className="flex items-center gap-3 rounded-lg border border-blue-500/40 bg-blue-950/30 px-4 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                <p className="text-sm text-blue-200">
                  Editing colors for{" "}
                  <span className="font-semibold text-white">{scopeName}</span>
                  <span className="ml-2 font-mono text-xs text-blue-400/70">
                    {scope}
                  </span>
                </p>
                <span className="ml-auto text-xs text-blue-400/60">
                  tournament only
                </span>
              </div>
            )}

            {/* Color groups */}
            <div className="grid grid-cols-2 gap-3">
              <ColorGroup
                title="Primary"
                value={scopedColors}
                onChange={setColor}
                fields={["primary", "primaryDark", "primaryAccent"]}
                labels={["Primary", "Primary Dark", "Primary Accent"]}
              />
              <ColorGroup
                title="Secondary"
                value={scopedColors}
                onChange={setColor}
                fields={["secondary", "secondaryDark", "secondaryAccent"]}
                labels={["Secondary", "Secondary Dark", "Secondary Accent"]}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorGroup
                title="Text"
                value={scopedColors}
                onChange={setColor}
                cols={3}
                fields={["text1", "text2", "text3"]}
                labels={["Text 1", "Text 2", "Text 3"]}
              />
              <ColorGroup
                title="Status"
                value={scopedColors}
                onChange={setColor}
                cols={3}
                fields={["statusAlive", "statusKnocked", "statusDead"]}
                labels={["Alive", "Knocked", "Dead"]}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorGroup
                title="Background"
                value={scopedColors}
                onChange={setColor}
                cols={1}
                fields={["bg"]}
                labels={["Background"]}
              />
              <ColorGroup
                title="Gradient"
                value={scopedColors}
                onChange={setColor}
                cols={3}
                fields={["gradientFrom", "gradientTo", "gradientAngle"]}
                labels={["From", "To", "Angle"]}
                textFields={["gradientAngle"]}
              />
            </div>

            {/* Design-specific extras — only shown when the active design
                has tokens beyond the standard set (e.g. v1Gold for v1) */}
            {designExtras.length > 0 && (
              <ColorGroup
                title={`${activeVariant} Extras`}
                value={scopedColors}
                onChange={setColor}
                fields={designExtras.map((t) => t.key)}
                labels={designExtras.map((t) => t.label)}
                cols={designExtras.length === 1 ? 1 : 2}
              />
            )}

            <div className="flex justify-end pb-2">
              <button
                onClick={resetColors}
                className="text-sm text-gray-500 transition-colors hover:text-gray-400"
              >
                Reset {scopeName ?? "default"} colors to {activeVariant}{" "}
                defaults
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Logout */}
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
            <AlertDialogAction
              onClick={doLogout}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ThemeCard({ theme, onApply, onDelete }) {
  return (
    <div className="group relative flex flex-col gap-2 rounded border border-gray-700 bg-gray-800/60 p-3 transition-all hover:border-gray-500 hover:bg-gray-800/60">
      <button onClick={onApply} className="flex flex-col gap-2 text-left">
        <div className="flex gap-1">
          {theme.swatches.map((c, i) => (
            <div
              key={i}
              className="h-4 w-4 shrink-0 rounded-sm border border-gray-700/50"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <p className="text-xs leading-tight font-medium text-gray-300">
          {theme.label}
        </p>
      </button>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1.5 right-1.5 hidden rounded p-0.5 text-gray-600 group-hover:block hover:text-red-400"
          title="Delete"
        >
          ×
        </button>
      )}
    </div>
  );
}

function PanelSection({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function ColorGroup({
  title,
  value,
  onChange,
  fields,
  labels,
  cols = 2,
  textFields = [],
}) {
  return (
    <div className="space-y-3 rounded border border-gray-800 bg-gray-800/60 p-3">
      <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
        {title}
      </h3>
      <div
        className={
          cols === 1
            ? "space-y-3"
            : cols === 3
              ? "grid grid-cols-3 gap-x-4 gap-y-3"
              : "grid grid-cols-2 gap-x-4 gap-y-3"
        }
      >
        {fields.map((field, i) =>
          textFields.includes(field) ? (
            <TextInput
              key={field}
              label={labels[i]}
              value={value?.[field] ?? ""}
              onChange={(v) => onChange([field], v)}
            />
          ) : (
            <ColorInput
              key={field}
              label={labels[i]}
              value={value?.[field] ?? ""}
              onChange={(v) => onChange([field], v)}
            />
          ),
        )}
      </div>
    </div>
  );
}

function parseRgba(val) {
  if (!val || typeof val !== "string") return { r: 0, g: 0, b: 0, a: 1 };
  const m = val.match(
    /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/,
  );
  if (m)
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
  // fallback: parse hex
  const hex = toHex(val);
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: 1,
  };
}

function rgbaObjToString({ r, g, b, a }) {
  const alpha = parseFloat(a.toFixed(2));
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

function ColorInput({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const rgba = parseRgba(value);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-400">{label}</Label>
      <div className="flex items-center gap-1.5">
        {/* Swatch — opens the RGBA picker popover */}
        <div ref={wrapRef} className="relative shrink-0">
          <button
            type="button"
            className="h-6 w-6 rounded border border-gray-600 transition-colors hover:border-gray-400"
            style={{ backgroundColor: value || "transparent" }}
            onClick={() => setOpen((p) => !p)}
          />
          {open && (
            <div className="absolute top-8 left-0 z-50 rounded border border-gray-700 bg-gray-900 p-2 shadow-xl">
              <RgbaColorPicker
                color={rgba}
                onChange={(c) => onChange(rgbaObjToString(c))}
              />
            </div>
          )}
        </div>
        {/* Editable rgba string */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="rgba(0, 0, 0, 1)"
          className="h-6 w-36 min-w-0 border-gray-700 bg-gray-800 font-mono text-[10px] text-white placeholder:text-gray-700"
        />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-400">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="135deg"
        className="h-6 w-28 min-w-0 border-gray-700 bg-gray-800 font-mono text-[10px] text-white placeholder:text-gray-700"
      />
    </div>
  );
}
