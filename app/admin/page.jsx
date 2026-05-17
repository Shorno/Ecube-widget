import Link from "next/link";
import { Suspense } from "react";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RegisterDesignsButton from "./_components/RegisterDesignsButton";
import SearchInput from "./_components/SearchInput";
import TableFilters from "./_components/TableFilters";

const PER_PAGE = 10;

// Sort field → MongoDB sort object
const SORT_MAP = {
  name:         { name: 1 },
  "-name":      { name: -1 },
  email:        { email: 1 },
  "-email":     { email: -1 },
  tournaments:  { tournamentCount: -1, name: 1 },
  "-tournaments":{ tournamentCount: 1, name: 1 },
  expiry:       { subscriptionExpiry: 1, name: 1 },
  "-expiry":    { subscriptionExpiry: -1, name: 1 },
  status:       { isActive: -1, name: 1 },
  "-status":    { isActive: 1, name: 1 },
  design:       { "themeConfig.designVariant": 1, name: 1 },
  "-design":    { "themeConfig.designVariant": -1, name: 1 },
};
const DEFAULT_SORT = { createdAt: -1 };

function buildHref(overrides, current) {
  const p = new URLSearchParams();
  const merged = { ...current, ...overrides };
  if (merged.q)      p.set("q",      merged.q);
  if (merged.sort)   p.set("sort",   merged.sort);
  if (merged.status) p.set("status", merged.status);
  if (merged.sub)    p.set("sub",    merged.sub);
  if (merged.page && merged.page > 1) p.set("page", String(merged.page));
  const qs = p.toString();
  return `/admin${qs ? `?${qs}` : ""}`;
}

function subStatus(expiry) {
  if (!expiry) return "none";
  const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (days < 0)  return "expired";
  if (days <= 7) return "soon";
  return "active";
}

function daysLabel(expiry) {
  if (!expiry) return null;
  const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (days < 0)  return `${Math.abs(days)}d ago`;
  if (days === 0) return "Today";
  return `${days}d left`;
}

export default async function AdminDashboard({ searchParams }) {
  const params = await searchParams;
  const q      = (params.q ?? "").trim();
  const sort   = params.sort ?? "";
  const status = params.status ?? "";
  const sub    = params.sub ?? "";
  const page   = Math.max(1, parseInt(params.page ?? "1", 10));
  const skip   = (page - 1) * PER_PAGE;

  const current = { q, sort, status, sub, page };

  await connectDB();

  const now            = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Build match stages
  const baseMatch = { role: { $ne: "admin" } };

  const searchMatch = q ? {
    $or: [
      { name:  { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  } : {};

  const statusMatch = status === "active"   ? { isActive: true }
    : status === "disabled" ? { isActive: false }
    : {};

  const subMatch = sub === "active"   ? { subscriptionExpiry: { $gte: sevenDaysLater } }
    : sub === "expiring" ? { subscriptionExpiry: { $gte: now, $lte: sevenDaysLater } }
    : sub === "expired"  ? { subscriptionExpiry: { $lt: now } }
    : sub === "none"     ? { $or: [{ subscriptionExpiry: null }, { subscriptionExpiry: { $exists: false } }] }
    : {};

  const match = { ...baseMatch, ...searchMatch, ...statusMatch, ...subMatch };
  const sortObj = SORT_MAP[sort] ?? DEFAULT_SORT;

  // Single aggregation with $facet for users + total + global stats
  const [agg] = await User.aggregate([
    { $match: match },
    { $project: { passwordHash: 0 } },
    { $addFields: { tournamentCount: { $size: { $ifNull: ["$allowedTournamentIds", []] } } } },
    { $facet: {
      users: [{ $sort: sortObj }, { $skip: skip }, { $limit: PER_PAGE }],
      total: [{ $count: "n" }],
    }},
  ]);

  // Global stats always from the whole user base (no search/filter)
  const [stats] = await User.aggregate([
    { $match: { role: { $ne: "admin" } } },
    { $facet: {
      total:    [{ $count: "n" }],
      active:   [{ $match: { isActive: true } }, { $count: "n" }],
      expiring: [{ $match: { subscriptionExpiry: { $gte: now, $lte: sevenDaysLater } } }, { $count: "n" }],
      expired:  [{ $match: { subscriptionExpiry: { $lt: now } } }, { $count: "n" }],
    }},
  ]);

  const users      = agg?.users ?? [];
  const total      = agg?.total[0]?.n ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const totalCustomers  = stats?.total[0]?.n    ?? 0;
  const activeCount     = stats?.active[0]?.n   ?? 0;
  const expiringCount   = stats?.expiring[0]?.n ?? 0;
  const expiredCount    = stats?.expired[0]?.n  ?? 0;

  const hasFilters = q || sort || status || sub;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {hasFilters
              ? `${total} of ${totalCustomers} customers`
              : `${totalCustomers} customer${totalCustomers !== 1 ? "s" : ""} registered`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RegisterDesignsButton />
          <Button asChild className="bg-gradient-to-r from-violet-600 to-pink-600 font-semibold text-white hover:from-violet-500 hover:to-pink-500">
            <Link href="/admin/users/new">+ New User</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total"         value={totalCustomers} color="text-white" />
        <StatCard label="Active"        value={activeCount}    color="text-emerald-400" />
        <StatCard label="Expiring Soon" value={expiringCount}  color="text-amber-400" sub="within 7 days" />
        <StatCard label="Expired"       value={expiredCount}   color="text-red-400" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AdminNavCard href="/admin/designs" label="Design Registry" desc="Manage bundles, isDefault, isExclusive" />
        <AdminNavCard href="/admin/metrics" label="API Metrics" desc="Latency, p50/p95, error rates" />
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <Suspense fallback={<div className="h-9 w-56 animate-pulse rounded border border-gray-800 bg-gray-800" />}>
          <SearchInput defaultValue={q} />
        </Suspense>
        <Suspense fallback={null}>
          <TableFilters status={status} sub={sub} />
        </Suspense>
        {hasFilters && (
          <Link href="/admin" className="ml-auto text-xs text-gray-500 hover:text-gray-300">
            Clear all ×
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded border border-gray-800 bg-gray-900/60">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <SortHead field="name"        label="Customer"     current={current} />
              <SortHead field="status"      label="Status"       current={current} />
              <SortHead field="expiry"      label="Subscription" current={current} />
              <SortHead field="design"      label="Design"       current={current} />
              <SortHead field="tournaments" label="Tournaments"  current={current} />
              <TableHead className="h-11" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const ss      = subStatus(u.subscriptionExpiry);
              const daysTxt = daysLabel(u.subscriptionExpiry);
              return (
                <TableRow key={u._id} className="border-gray-800/60 hover:bg-transparent">
                  <TableCell className="py-3.5 pl-5">
                    <p className="font-semibold text-white">{u.name || "—"}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{u.email}</p>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={["h-1.5 w-1.5 rounded-full", u.isActive ? "bg-emerald-400" : "bg-red-500"].join(" ")} />
                      <span className={["text-sm", u.isActive ? "text-emerald-400" : "text-red-400"].join(" ")}>
                        {u.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    {ss === "none" ? (
                      <span className="text-xs text-gray-600">—</span>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-400">
                          {new Date(u.subscriptionExpiry).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p className={["text-xs font-medium",
                          ss === "expired" ? "text-red-400" : ss === "soon" ? "text-amber-400" : "text-emerald-400",
                        ].join(" ")}>{daysTxt}</p>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {(u.allowedDesignIds?.length ? u.allowedDesignIds : [u.themeConfig?.designVariant ?? "default"]).map((d) => (
                        <Badge key={d} variant="outline"
                          className={["border-gray-700 font-mono text-[11px]",
                            d === u.themeConfig?.designVariant ? "border-violet-700/60 text-violet-400" : "text-gray-500",
                          ].join(" ")}>
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 text-center">
                    <span className={["text-sm font-medium", u.tournamentCount > 0 ? "text-white" : "text-gray-600"].join(" ")}>
                      {u.tournamentCount}
                    </span>
                  </TableCell>

                  <TableCell className="py-3.5 pr-5 text-right">
                    <Button asChild size="sm" className="bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      <Link href={`/admin/users/${u._id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center text-gray-600">
                  {hasFilters ? (
                    <>No customers match the current filters. <Link href="/admin" className="text-violet-400 underline hover:text-violet-300">Clear all.</Link></>
                  ) : (
                    <>No customers yet. <Link href="/admin/users/new" className="text-violet-400 underline hover:text-violet-300">Create your first one.</Link></>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {skip + 1}–{Math.min(skip + PER_PAGE, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <PagLink href={buildHref({ page: page - 1 }, current)} disabled={page <= 1}>← Prev</PagLink>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              // Show pages around current
              const p = totalPages <= 7 ? i + 1
                : page <= 4 ? i + 1
                : page >= totalPages - 3 ? totalPages - 6 + i
                : page - 3 + i;
              return (
                <Link key={p} href={buildHref({ page: p }, current)}
                  className={["inline-flex h-8 w-8 items-center justify-center rounded border text-xs transition-colors",
                    p === page ? "border-violet-600 bg-violet-950/50 text-violet-400 pointer-events-none"
                               : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white",
                  ].join(" ")}>{p}</Link>
              );
            })}
            <PagLink href={buildHref({ page: page + 1 }, current)} disabled={page >= totalPages}>Next →</PagLink>
          </div>
        </div>
      )}
    </div>
  );
}

function SortHead({ field, label, current }) {
  const asc   = current.sort === field;
  const desc  = current.sort === `-${field}`;
  const nextSort = desc ? field : asc ? "" : field;
  const nextDir  = asc ? `-${field}` : field;
  const href  = buildHref({ sort: desc ? "" : nextDir, page: 1 }, current);

  return (
    <TableHead className="h-11 text-xs font-semibold tracking-wider text-gray-500 uppercase first:pl-5">
      <Link href={href} className="inline-flex items-center gap-1 hover:text-gray-300 transition-colors">
        {label}
        <span className="text-gray-700">
          {asc ? " ↑" : desc ? " ↓" : " ↕"}
        </span>
      </Link>
    </TableHead>
  );
}

function PagLink({ href, disabled, children }) {
  return (
    <Link href={href} aria-disabled={disabled}
      className={["inline-flex h-8 items-center rounded border px-3 text-xs transition-colors",
        disabled ? "pointer-events-none border-gray-800 text-gray-700"
                 : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white",
      ].join(" ")}>
      {children}
    </Link>
  );
}

function AdminNavCard({ href, label, desc }) {
  return (
    <Link href={href}
      className="rounded border border-gray-800 bg-gray-900/60 px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-800/60">
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
    </Link>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <div className="rounded border border-gray-800 bg-gray-900/60 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
      <p className={["mt-2 text-3xl font-bold", color].join(" ")}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-600">{sub}</p>}
    </div>
  );
}
