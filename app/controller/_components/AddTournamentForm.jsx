"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddTournamentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [adding, setAdding] = useState(false);

  async function addTournament() {
    const tid = id.trim();
    const tname = name.trim();
    if (!tid || !tname) return;
    setAdding(true);
    try {
      const res = await fetch("/api/user/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: tid, tournamentName: tname }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`"${tname}" added.`);
        // Go straight to the new tournament's controller.
        router.push(`/controller/${tid}`);
      } else {
        toast.error(data.error ?? "Failed to add tournament");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-2 rounded border border-gray-700 bg-gray-800/40 p-4">
      <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
        Add a tournament
      </p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tournament name (required)"
        className="h-9 w-full border-gray-700 bg-gray-900 text-sm text-white placeholder:text-gray-600"
      />
      <div className="flex gap-2">
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTournament();
            }
          }}
          placeholder="Tournament ID"
          className="h-9 flex-1 border-gray-700 bg-gray-900 font-mono text-sm text-white placeholder:text-gray-600"
        />
        <Button
          onClick={addTournament}
          disabled={!id.trim() || !name.trim() || adding}
          className="h-9 shrink-0 bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40"
        >
          {adding ? "…" : "Add"}
        </Button>
      </div>
    </div>
  );
}
