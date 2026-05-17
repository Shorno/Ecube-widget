"use client";

import { useState, useEffect, useCallback } from "react";

function ms(n) {
  if (!n && n !== 0) return "—";
  if (n < 1000) return `${Math.round(n)}ms`;
  return `${(n / 1000).toFixed(1)}s`;
}

function p95Color(p95) {
  if (!p95) return "text-gray-600";
  if (p95 > 2000) return "text-red-400";
  if (p95 > 500)  return "text-amber-400";
  return "text-emerald-400";
}

const METHOD_COLORS = {
  GET:    "bg-blue-950/60 text-blue-400",
  POST:   "bg-green-950/60 text-green-400",
  PUT:    "bg-amber-950/60 text-amber-400",
  DELETE: "bg-red-950/60 text-red-400",
  PATCH:  "bg-violet-950/60 text-violet-400",
};

export default function MetricsPanel() {
  const [view,  setView]    = useState("summary"); // summary | history
  const [since, setSince]   = useState("1h");
  const [type,  setType]    = useState("all");
  const [data,  setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [auto,  setAuto]    = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const qs = view === "history"
        ? `?view=history&since=${since}&type=${type}`
        : `?view=${view}`;
      const res = await fetch(`/api/admin/metrics${qs}`);
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  }, [view, since, type]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!auto || view !== "summary") return;
    const t = setInterval(refresh, 10_000);
    return () => clearInterval(t);
  }, [auto, view, refresh]);

  const routes = data?.routes ?? [];
  const sse    = data?.sseSummary;

  return (
    <div className="rounded border border-gray-800 bg-gray-900/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-5 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">API Metrics</p>
          <p className="mt-0.5 text-xs text-gray-600">
            {view === "summary"
              ? "In-memory · last 1 000 requests · resets on restart"
              : `MongoDB · last ${since} · 30-day retention`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded border border-gray-700 text-xs">
            {["summary", "history"].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={["px-3 py-1.5 capitalize transition-colors",
                  view === v ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300",
                ].join(" ")}>
                {v}
              </button>
            ))}
          </div>

          {/* History filters */}
          {view === "history" && (
            <>
              <select value={since} onChange={(e) => setSince(e.target.value)}
                className="rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-gray-300">
                <option value="1h">Last 1h</option>
                <option value="6h">Last 6h</option>
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7d</option>
                <option value="30d">Last 30d</option>
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-gray-300">
                <option value="all">All types</option>
                <option value="api_request">API</option>
                <option value="sse_command">SSE</option>
                <option value="db_query">DB</option>
              </select>
            </>
          )}

          {view === "summary" && (
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)}
                className="accent-violet-500" />
              Auto 10s
            </label>
          )}

          <button onClick={refresh}
            className="rounded border border-gray-700 px-2 py-1.5 text-xs text-gray-400 hover:border-gray-500 hover:text-white transition-colors">
            Refresh
          </button>
        </div>
      </div>

      {/* SSE summary strip (history view only) */}
      {view === "history" && sse && (
        <div className="flex gap-6 border-b border-gray-800/60 bg-gray-950/40 px-5 py-2.5">
          <SseKV label="SSE commands" value={sse.count} />
          <SseKV label="Avg total" value={ms(sse.avgTotal)} />
          <SseKV label="Avg broadcast()" value={ms(sse.avgBroadcast)} highlight />
          <SseKV label="Max total" value={ms(sse.maxTotal)} />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="px-5 py-6 text-sm text-gray-600">Loading…</p>
      ) : routes.length === 0 ? (
        <p className="px-5 py-6 text-sm text-gray-600">No data yet. Make some API calls first.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-5 py-2">Route</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2 text-right">Count</th>
                <th className="px-3 py-2 text-right">Avg</th>
                <th className="px-3 py-2 text-right">p50</th>
                <th className="px-3 py-2 text-right">p95</th>
                <th className="px-3 py-2 text-right">Max</th>
                <th className="px-3 py-2 text-right">Errors</th>
                <th className="px-5 py-2 text-right">Last</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {routes.map((r) => {
                const key = `${r.method}-${r.route}`;
                return (
                  <tr key={key} className="hover:bg-gray-800/20">
                    <td className="px-5 py-2.5 font-mono text-gray-300">{r.route}</td>
                    <td className="px-3 py-2.5">
                      <span className={["rounded px-1.5 py-0.5 font-mono font-semibold",
                        METHOD_COLORS[r.method] ?? "bg-gray-800 text-gray-400",
                      ].join(" ")}>
                        {r.method}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-400">{r.count}</td>
                    <td className="px-3 py-2.5 text-right text-gray-400">{ms(r.avg)}</td>
                    <td className="px-3 py-2.5 text-right text-gray-400">{ms(r.p50)}</td>
                    <td className={["px-3 py-2.5 text-right font-semibold", p95Color(r.p95)].join(" ")}>
                      {ms(r.p95)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-500">{ms(r.max)}</td>
                    <td className="px-3 py-2.5 text-right">
                      {r.errors > 0
                        ? <span className="font-semibold text-red-400">{r.errors}</span>
                        : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="px-5 py-2.5 text-right text-gray-600">
                      {r.lastTs ? new Date(r.lastTs).toLocaleTimeString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SseKV({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
      <p className={["text-sm font-semibold", highlight ? "text-violet-300" : "text-white"].join(" ")}>{value}</p>
    </div>
  );
}
