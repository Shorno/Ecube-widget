"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function ObserverHighlightSwitch({ className, size = "sm" }) {
  const [showObserverHighlight, setShowObserverHighlight] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        setShowObserverHighlight(
          data.themeConfig?.showObserverHighlight !== false,
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleChange(checked) {
    setShowObserverHighlight(checked);
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showObserverHighlight: checked }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
    } catch (err) {
      setShowObserverHighlight(!checked);
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <label
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap",
        (loading || saving) && "pointer-events-none opacity-60",
        className,
      )}
    >
      <Switch
        size={size}
        checked={showObserverHighlight}
        onCheckedChange={handleChange}
        disabled={loading || saving}
      />
      <span className="text-xs font-bold tracking-wide text-gray-400 uppercase">
        Observer Highlight
      </span>
    </label>
  );
}
