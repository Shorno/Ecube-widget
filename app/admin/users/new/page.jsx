"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function objToDateStr(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateStrToObj(str) {
  if (!str) return undefined;
  return new Date(str + "T12:00:00");
}

function formatDisplay(str) {
  if (!str) return null;
  return new Date(str + "T12:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm]         = useState({ name: "", email: "", password: "", subscriptionExpiry: "" });
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [calOpen, setCalOpen]   = useState(false);

  function set(field) {
    return (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to create user"); return; }
      toast.success("User created.");
      router.push(`/admin/users/${data._id}`);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm"
          className="text-gray-500 hover:bg-gray-800 hover:text-gray-200">
          <Link href="/admin">← Dashboard</Link>
        </Button>
        <h1 className="text-2xl font-bold text-white">New User</h1>
      </div>

      <div className="rounded border border-gray-800 bg-gray-900/60 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-400">Name</Label>
            <Input value={form.name} onChange={set("name")} placeholder="Team Alpha" required
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-600" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-400">Email</Label>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="alpha@team.com" required
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-600" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-400">Password <span className="font-normal text-gray-600">(min 8 chars)</span></Label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
                required
                minLength={8}
                className="border-gray-700 bg-gray-800 pr-10 text-white placeholder:text-gray-600"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-300"
                aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-400">
              Subscription Expiry <span className="font-normal text-gray-600">(optional)</span>
            </Label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger
                className="inline-flex h-10 w-full items-center gap-2 rounded border border-gray-700 bg-gray-800 px-3 text-sm hover:bg-gray-700 focus:outline-none"
              >
                <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
                {form.subscriptionExpiry
                  ? <span className="text-white">{formatDisplay(form.subscriptionExpiry)}</span>
                  : <span className="text-gray-500">Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 font-sans" align="start" side="top" sideOffset={8}>
                <Calendar
                  mode="single"
                  selected={dateStrToObj(form.subscriptionExpiry)}
                  onSelect={(date) => {
                    setForm((p) => ({ ...p, subscriptionExpiry: objToDateStr(date) }));
                    setCalOpen(false);
                  }}
                  classNames={{ root: "bg-gray-900 font-sans" }}
                />
              </PopoverContent>
            </Popover>
            {form.subscriptionExpiry && (
              <button type="button" onClick={() => setForm((p) => ({ ...p, subscriptionExpiry: "" }))}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors">
                Clear date
              </button>
            )}
          </div>

          <div className="rounded border border-gray-800 bg-gray-950/60 px-4 py-3">
            <p className="text-sm text-gray-500">
              A unique ID is generated as <span className="font-mono text-gray-400">effinity-{"{16chars}"}</span>.
              Tournament IDs, designs and color themes are assigned after creation.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-pink-600 font-semibold text-white hover:from-violet-500 hover:to-pink-500">
            {loading ? "Creating…" : "Create User"}
          </Button>
        </form>
      </div>
    </div>
  );
}
