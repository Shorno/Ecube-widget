"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

function toDateInput(val) {
  if (!val) return "";
  return new Date(val).toISOString().split("T")[0];
}

function formatDisplay(dateStr) {
  if (!dateStr) return null;
  // use noon to avoid UTC midnight rolling to previous day in some timezones
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function dateStrToObj(dateStr) {
  if (!dateStr) return undefined;
  return new Date(dateStr + "T12:00:00");
}

function objToDateStr(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function subDaysLeft(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default function EditUserForm({ user, designs = [] }) {
  const defaultDesignIds = designs.filter((d) => d.isDefault).map((d) => d._id);
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(user.isActive);
  const [expiry, setExpiry] = useState(toDateInput(user.subscriptionExpiry));

  // Multi-design: allowedDesignIds = which designs this user can use
  const [allowedDesignIds, setAllowedDesignIds] = useState(
    user.allowedDesignIds?.length
      ? user.allowedDesignIds
      : [user.themeConfig?.designVariant ?? "default"],
  );
  // activeDesign = currently rendered design (themeConfig.designVariant)
  const [activeDesign, setActiveDesign] = useState(
    user.themeConfig?.designVariant ?? "default",
  );

  const [tidInput, setTidInput] = useState("");
  const [tidNameInput, setTidNameInput] = useState("");
  const [tids, setTids] = useState(user.allowedTournamentIds ?? []);
  const [tournamentNames, setTournamentNames] = useState(
    user.tournamentNames ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [calOpen, setCalOpen] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function toggleDesign(id) {
    setAllowedDesignIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((d) => d !== id);
        // If removing the active design, switch active to first remaining
        if (id === activeDesign && next.length > 0) setActiveDesign(next[0]);
        return next;
      }
      return [...prev, id];
    });
  }

  function setActive(id) {
    if (!allowedDesignIds.includes(id)) {
      setAllowedDesignIds((p) => [...p, id]);
    }
    setActiveDesign(id);
  }

  function addTid() {
    const v = tidInput.trim();
    const name = tidNameInput.trim();
    if (!v || !name || tids.includes(v)) return;
    setTids((p) => [...p, v]);
    setTournamentNames((p) => ({ ...p, [v]: name }));
    setTidInput("");
    setTidNameInput("");
  }

  function removeTid(tid) {
    setTids((p) => p.filter((t) => t !== tid));
    setTournamentNames((p) => {
      const n = { ...p };
      delete n[tid];
      return n;
    });
  }

  function copyUrl(path) {
    navigator.clipboard
      .writeText(`${window.location.origin}${path}`)
      .then(() => {
        setCopiedUrl(path);
        setTimeout(() => setCopiedUrl(null), 2000);
      });
  }

  async function save() {
    setSaving(true);
    const id = toast.loading("Saving…");
    try {
      const body = {
        name,
        email,
        isActive,
        allowedTournamentIds: tids,
        tournamentNames,
        allowedDesignIds,
        subscriptionExpiry: expiry || null,
        themeConfig: { ...user.themeConfig, designVariant: activeDesign },
      };
      if (password) body.password = password;
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed", { id });
        return;
      }
      toast.success("Changes saved.", { id });
      setPassword("");
      router.refresh();
    } catch {
      toast.error("Network error", { id });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error);
        return;
      }
      toast.success("User deleted.");
      router.push("/admin");
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(false);
    }
  }

  const daysLeft = subDaysLeft(expiry);
  const subColor =
    daysLeft === null
      ? "text-gray-500"
      : daysLeft < 0
        ? "text-red-400"
        : daysLeft <= 7
          ? "text-amber-400"
          : "text-emerald-400";
  const subLabel =
    daysLeft === null
      ? "No subscription"
      : daysLeft < 0
        ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`
        : daysLeft === 0
          ? "Expires today"
          : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:bg-gray-800 hover:text-gray-200"
          >
            <Link href="/admin">← Dashboard</Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{user.name}</h1>
            <p className="font-mono text-xs text-gray-600">{user._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setDeleteOpen(true)}
            disabled={deleting}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-red-950/40 hover:text-red-400"
          >
            Delete
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-blue-600 px-5 font-semibold text-white hover:from-blue-500 hover:to-blue-500"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* LEFT — Account + Subscription */}
        <div className="space-y-5 lg:col-span-2">
          <Section title="Account">
            <Field label="Name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 border-gray-700 bg-gray-800 text-sm text-white"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-gray-700 bg-gray-800 text-sm text-white"
              />
            </Field>
            <Field label="New Password" hint="Leave blank to keep current">
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 border-gray-700 bg-gray-800 pr-10 text-sm text-white placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-300"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>
            <div className="flex items-center justify-between rounded border border-gray-800 bg-gray-950/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Account Status</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {isActive
                    ? "Can access controller & widgets"
                    : "Access blocked"}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className={[
                    "text-xs font-semibold",
                    isActive ? "text-emerald-400" : "text-red-400",
                  ].join(" ")}
                >
                  {isActive ? "Active" : "Disabled"}
                </span>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
          </Section>

          <Section title="Subscription">
            <Field label="Expiry Date">
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger className="inline-flex h-10 w-full items-center gap-2 rounded border border-gray-700 bg-gray-800 px-3 text-sm hover:bg-gray-700 focus:outline-none">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
                  {expiry ? (
                    <span className="text-white">{formatDisplay(expiry)}</span>
                  ) : (
                    <span className="text-gray-500">Pick a date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 font-sans"
                  align="start"
                  side="top"
                  sideOffset={8}
                >
                  <Calendar
                    mode="single"
                    selected={dateStrToObj(expiry)}
                    onSelect={(date) => {
                      setExpiry(objToDateStr(date));
                      setCalOpen(false);
                    }}
                    classNames={{
                      root: "bg-gray-900 font-sans",
                      day: "text-gray-300",
                      today: "bg-gray-800 text-white",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <div
              className={[
                "flex items-center gap-2 text-sm font-medium",
                subColor,
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  daysLeft === null
                    ? "bg-gray-700"
                    : daysLeft < 0
                      ? "bg-red-500"
                      : daysLeft <= 7
                        ? "bg-amber-400"
                        : "bg-emerald-400",
                ].join(" ")}
              />
              {subLabel}
            </div>
            {expiry && (
              <button
                onClick={() => setExpiry("")}
                className="text-xs text-gray-600 transition-colors hover:text-red-400"
              >
                Clear subscription
              </button>
            )}
          </Section>
        </div>

        {/* RIGHT — Design + Tournaments + Widget Access */}
        <div className="space-y-5 lg:col-span-3">
          <Section title="Designs">
            {designs.length === 0 ? (
              <p className="text-sm text-gray-600">
                No designs registered. Click &quot;Register Designs&quot; first.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Check to grant access. Star to set as active design.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAllowedDesignIds(defaultDesignIds);
                      if (!defaultDesignIds.includes(activeDesign))
                        setActiveDesign(defaultDesignIds[0] ?? "default");
                    }}
                    className="text-xs text-amber-500/80 transition-colors hover:text-amber-400"
                  >
                    Reset to defaults
                  </button>
                </div>
                {designs.map((d) => {
                  const isAllowed = allowedDesignIds.includes(d._id);
                  const isActive = activeDesign === d._id;
                  return (
                    <div
                      key={d._id}
                      className={[
                        "flex items-center gap-3 rounded border px-4 py-3 transition-all",
                        isActive
                          ? "border-blue-500/60 bg-blue-950/30"
                          : isAllowed
                            ? "border-gray-700 bg-gray-800/40"
                            : "border-gray-800 opacity-50",
                      ].join(" ")}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isAllowed}
                        onChange={() => toggleDesign(d._id)}
                        className="h-4 w-4 cursor-pointer accent-blue-500"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                          {d.label}
                        </p>
                        <p className="font-mono text-[11px] text-gray-600">
                          {d._id}
                        </p>
                      </div>
                      {d.isDefault && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-amber-700/60 text-[11px] text-amber-400"
                        >
                          Default
                        </Badge>
                      )}
                      {d.isExclusive && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-blue-700/60 text-[11px] text-blue-400"
                        >
                          Exclusive
                        </Badge>
                      )}
                      {/* Set active */}
                      {isActive ? (
                        <span className="shrink-0 rounded bg-blue-700/40 px-2 py-0.5 text-xs font-semibold text-blue-300">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => setActive(d._id)}
                          className="shrink-0 rounded border border-gray-700 px-2 py-0.5 text-xs text-gray-500 transition-colors hover:border-blue-600 hover:text-blue-400"
                        >
                          Set Active
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <Section title="Allowed Tournaments">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={tidInput}
                  onChange={(e) => setTidInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTid();
                    }
                  }}
                  placeholder="Tournament ID *"
                  className="h-10 border-gray-700 bg-gray-800 font-mono text-sm text-white placeholder:text-gray-600"
                />
                <Input
                  value={tidNameInput}
                  onChange={(e) => setTidNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTid();
                    }
                  }}
                  placeholder="Display name *"
                  className="h-10 border-gray-700 bg-gray-800 text-sm text-white placeholder:text-gray-600"
                />
              </div>
              <Button
                onClick={addTid}
                disabled={
                  !tidInput.trim() ||
                  !tidNameInput.trim() ||
                  tids.includes(tidInput.trim())
                }
                className="h-9 w-full bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-40"
              >
                Add Tournament
              </Button>
            </div>
            {tids.length === 0 ? (
              <p className="text-xs text-gray-600">
                No tournaments assigned — user cannot use the controller.
              </p>
            ) : (
              <div className="space-y-1.5">
                {tids.map((tid) => (
                  <div
                    key={tid}
                    className="flex items-center gap-2 rounded border border-gray-700 bg-gray-800/50 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      {tournamentNames[tid] && (
                        <p className="truncate text-xs font-medium text-gray-300">
                          {tournamentNames[tid]}
                        </p>
                      )}
                      <p className="font-mono text-xs text-gray-500">{tid}</p>
                    </div>
                    <button
                      onClick={() => removeTid(tid)}
                      className="shrink-0 text-gray-600 transition-colors hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Widget Access">
            <div className="rounded border border-gray-800 bg-gray-950/60 px-4 py-3">
              <p className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase">
                User ID
              </p>
              <p className="mt-1 font-mono text-sm text-blue-400">{user._id}</p>
            </div>
            {tids.length === 0 ? (
              <p className="text-xs text-gray-500">
                Add tournament IDs above to generate display URLs.
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase">
                  Display URLs
                </p>
                {tids.map((tid) => {
                  const path = `/${user._id}/${tid}/display`;
                  const isCopied = copiedUrl === path;
                  return (
                    <div
                      key={tid}
                      className="flex items-center gap-2 rounded border border-gray-800 bg-gray-950/60 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-gray-400">
                          {tournamentNames[tid]
                            ? `${tournamentNames[tid]} · `
                            : ""}
                          {tid}
                        </p>
                        <p className="truncate font-mono text-xs text-gray-500">
                          {path}
                        </p>
                      </div>
                      <button
                        onClick={() => copyUrl(path)}
                        className={[
                          "shrink-0 rounded px-2 py-1 text-xs font-medium transition-colors",
                          isCopied
                            ? "bg-emerald-900/50 text-emerald-400"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white",
                        ].join(" ")}
                      >
                        {isCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>
      </div>

      {/* Delete modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {user.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold text-white">{user.name}</span> and
              all their data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded border border-gray-800 bg-gray-900/60 p-5">
      <h2 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-400">
        {label}
        {hint && (
          <span className="ml-2 font-normal text-gray-600">({hint})</span>
        )}
      </Label>
      {children}
    </div>
  );
}
