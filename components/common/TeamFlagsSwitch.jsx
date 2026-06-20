"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function TeamFlagsSwitch({ className, size = "sm" }) {
  const [showTeamFlags, setShowTeamFlags] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        setShowTeamFlags(data.themeConfig?.showTeamFlags !== false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleChange(checked) {
    setShowTeamFlags(checked);
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showTeamFlags: checked }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
    } catch (err) {
      setShowTeamFlags(!checked);
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2",
        (loading || saving) && "pointer-events-none opacity-60",
        className,
      )}
    >
      <Switch
        size={size}
        checked={showTeamFlags}
        onCheckedChange={handleChange}
        disabled={loading || saving}
      />
      <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
        Team Flags
      </span>
    </label>
  );
}
