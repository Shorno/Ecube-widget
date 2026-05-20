"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function DesignsPanel({ initialDesigns }) {
  const [designs, setDesigns] = useState(initialDesigns);
  const [confirmDelete, setConfirmDelete] = useState(null); // designId pending delete

  async function toggle(id, field, value) {
    const res = await fetch(`/api/admin/designs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setDesigns((prev) =>
        prev.map((d) => (d._id === id ? { ...d, [field]: value } : d)),
      );
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Update failed");
    }
  }

  async function deleteDesign(id) {
    const res = await fetch(`/api/admin/designs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDesigns((prev) => prev.filter((d) => d._id !== id));
      toast.success("Design deleted");
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Delete failed");
    }
    setConfirmDelete(null);
  }

  return (
    <div className="rounded border border-gray-800 bg-gray-900/60">
      <div className="border-b border-gray-800 px-5 py-3">
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Design Registry
        </p>
        <p className="mt-0.5 text-xs text-gray-600">
          <span className="text-amber-400/80">Default</span> designs are
          auto-granted to every new user.{" "}
          <span className="text-blue-400/80">Exclusive</span> designs require
          manual assignment.
        </p>
      </div>
      <div className="divide-y divide-gray-800/60">
        {designs.map((d) => (
          <div key={d._id} className="flex items-center gap-4 px-5 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{d.label}</p>
                {d.isDefault && (
                  <Badge
                    variant="outline"
                    className="border-amber-700/60 text-[11px] text-amber-400"
                  >
                    Default
                  </Badge>
                )}
                {d.isExclusive && (
                  <Badge
                    variant="outline"
                    className="border-blue-700/60 text-[11px] text-blue-400"
                  >
                    Exclusive
                  </Badge>
                )}
                {!d.active && (
                  <Badge
                    variant="outline"
                    className="border-red-700/60 text-[11px] text-red-400"
                  >
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="font-mono text-xs text-gray-600">{d._id}</p>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-400">
              Auto-grant
              <Switch
                checked={d.isDefault}
                onCheckedChange={(v) => toggle(d._id, "isDefault", v)}
              />
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-400">
              Exclusive
              <Switch
                checked={d.isExclusive}
                onCheckedChange={(v) => toggle(d._id, "isExclusive", v)}
              />
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-400">
              Active
              <Switch
                checked={d.active}
                onCheckedChange={(v) => toggle(d._id, "active", v)}
              />
            </label>

            {confirmDelete === d._id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Sure?</span>
                <button
                  onClick={() => deleteDesign(d._id)}
                  className="rounded border border-red-700 bg-red-950 px-2 py-1 text-xs font-bold text-red-400 hover:bg-red-900"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="rounded border border-gray-700 px-2 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(d._id)}
                className="rounded border border-gray-800 px-2 py-1 text-xs text-gray-600 transition-colors hover:border-red-800 hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {designs.length === 0 && (
          <p className="px-5 py-6 text-sm text-gray-600">
            No designs registered yet. Click "Register Designs" above.
          </p>
        )}
      </div>
    </div>
  );
}
