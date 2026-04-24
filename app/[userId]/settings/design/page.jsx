"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { VARIANTS, COLOR_TO_CSS_VAR } from "@/lib/design/catalog";

const COLOR_LABELS = {
  color1: "Primary Color",
  color2: "Secondary (Shade 1)",
  color3: "Tertiary (Shade 2)",
  color4: "Accent",
  color5: "Border / Dark",
};

export default function DesignSettingsPage() {
  const { userId }  = useParams();
  const router      = useRouter();

  const [variant, setVariant]   = useState("default");
  const [colors, setColors]     = useState({ ...VARIANTS.default });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);

  // Load current config from DB
  useEffect(() => {
    fetch(`/api/user-config?userId=${userId}`)
      .then((r) => r.json())
      .then(({ themeConfig }) => {
        if (!themeConfig) return;
        const v = themeConfig.designVariant ?? "default";
        setVariant(v);
        setColors({ ...VARIANTS[v] ?? VARIANTS.default, ...(themeConfig.colors ?? {}) });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  // Live preview — inject CSS vars into the page
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(COLOR_TO_CSS_VAR).forEach(([slot, cssVar]) => {
      if (colors[slot]) root.style.setProperty(cssVar, colors[slot]);
    });
  }, [colors]);

  function handleVariantChange(v) {
    setVariant(v);
    setColors({ ...VARIANTS[v] ?? VARIANTS.default });
  }

  function handleColorChange(slot, value) {
    setColors((prev) => ({ ...prev, [slot]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeConfig: { designVariant: variant, colors } }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Theme Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Changes apply live — save to persist</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="border border-gray-700 px-4 py-1.5 text-xs text-gray-400 hover:text-white">← Back</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-8 space-y-8">
        {/* Variant selector */}
        <section>
          <h2 className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">Design Variant</h2>
          <div className="flex gap-3">
            {Object.keys(VARIANTS).map((v) => (
              <button
                key={v}
                onClick={() => handleVariantChange(v)}
                className={[
                  "border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                  variant === v
                    ? "border-blue-500 bg-blue-950 text-blue-300"
                    : "border-gray-700 text-gray-400 hover:border-gray-500",
                ].join(" ")}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* Color pickers */}
        <section>
          <h2 className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">Colors</h2>
          <div className="space-y-4">
            {Object.entries(COLOR_LABELS).map(([slot, label]) => (
              <div key={slot} className="flex items-center gap-4 border border-gray-800 bg-gray-900 px-4 py-3">
                <input
                  type="color"
                  value={colors[slot] || "#000000"}
                  onChange={(e) => handleColorChange(slot, e.target.value)}
                  className="h-10 w-16 cursor-pointer border-0 bg-transparent p-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-gray-500">{COLOR_TO_CSS_VAR[slot]}</p>
                </div>
                <span className="font-mono text-xs text-gray-400">{colors[slot]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Live preview */}
        <section>
          <h2 className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">Preview</h2>
          <div className="space-y-2">
            <div className="bg-primary h-10 flex items-center px-4 text-white text-sm font-bold">Primary</div>
            <div className="bg-primary-shade-one h-10 flex items-center px-4 text-white text-sm font-bold">Shade One</div>
            <div className="bg-primary-shade-two h-10 flex items-center px-4 text-white text-sm font-bold">Shade Two</div>
            <div className="bg-custom-yellow h-10 flex items-center px-4 text-black text-sm font-bold">Accent (Yellow)</div>
            <div className="bg-custom-green h-10 flex items-center px-4 text-white text-sm font-bold">Border (Green)</div>
          </div>
        </section>
      </main>
    </div>
  );
}
