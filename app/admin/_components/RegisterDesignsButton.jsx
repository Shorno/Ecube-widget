"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RegisterDesignsButton() {
  const [status, setStatus] = useState("idle");

  async function register() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/seed-designs");
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const count = data.seeded?.length ?? 0;
      setStatus(`ok:${count}`);
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const isLoading = status === "loading";
  const isOk = status.startsWith("ok:");
  const isError = status === "error";
  const count = isOk ? status.split(":")[1] : null;

  return (
    <Button
      onClick={register}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className={[
        "border text-sm transition-colors",
        isOk
          ? "border-emerald-700 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300"
          : isError
            ? "border-red-700 bg-red-950/30 text-red-400 hover:bg-red-950/50 hover:text-red-300"
            : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800 hover:text-white",
      ].join(" ")}
    >
      {isLoading
        ? "Registering…"
        : isOk
          ? `✓ ${count} design${count !== "1" ? "s" : ""} registered`
          : isError
            ? "Failed — retry"
            : "Register Designs"}
    </Button>
  );
}
