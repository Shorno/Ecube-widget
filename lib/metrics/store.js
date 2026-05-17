// In-memory ring buffer for API request metrics.
// Survives Next.js HMR via globalThis. Lost on process restart — this is dev/staging visibility.
// For durable storage wire up Layer 2 (Axiom / BetterStack).

const MAX = 1000;

if (!globalThis.__metricsStore) {
  globalThis.__metricsStore = { entries: [], cursor: 0 };
}

const store = globalThis.__metricsStore;

/**
 * Record one completed request.
 * @param {{ route: string, method: string, status: number, durationMs: number }} entry
 */
export function record({ route, method, status, durationMs }) {
  const entry = { route, method, status, durationMs, ts: Date.now() };
  if (store.entries.length < MAX) {
    store.entries.push(entry);
  } else {
    store.entries[store.cursor] = entry;
    store.cursor = (store.cursor + 1) % MAX;
  }
}

/**
 * Returns per-route aggregated summary sorted by request count descending.
 */
export function getSummary() {
  const groups = {};

  for (const e of store.entries) {
    const k = `${e.method} ${e.route}`;
    if (!groups[k]) groups[k] = { route: e.route, method: e.method, durations: [], errors: 0, lastTs: 0 };
    groups[k].durations.push(e.durationMs);
    if (e.status >= 400) groups[k].errors++;
    if (e.ts > groups[k].lastTs) groups[k].lastTs = e.ts;
  }

  return Object.values(groups)
    .map(({ route, method, durations, errors, lastTs }) => {
      const sorted = [...durations].sort((a, b) => a - b);
      const count  = sorted.length;
      const p50    = sorted[Math.floor(count * 0.5)] ?? 0;
      const p95    = sorted[Math.floor(count * 0.95)] ?? 0;
      const avg    = Math.round(sorted.reduce((s, v) => s + v, 0) / count);
      return { route, method, count, avg, p50, p95, errors, lastTs };
    })
    .sort((a, b) => b.count - a.count);
}

export function getRaw() {
  return [...store.entries].sort((a, b) => b.ts - a.ts);
}
