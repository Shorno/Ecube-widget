"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function TeamNameSwitch({ className, size = "sm" }) {
  const [showFullTeamName, setShowFullTeamName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        setShowFullTeamName(data.themeConfig?.showFullTeamName === true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleChange(checked) {
    setShowFullTeamName(checked);
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showFullTeamName: checked }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
    } catch (err) {
      setShowFullTeamName(!checked);
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
        checked={showFullTeamName}
        onCheckedChange={handleChange}
        disabled={loading || saving}
      />
      <span className="text-xs font-bold tracking-wide text-gray-400 uppercase">
        Full Team Name
      </span>
    </label>
  );
}
