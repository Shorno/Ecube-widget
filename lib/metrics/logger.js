import { connectDB } from "@/lib/db/mongoose";
import Metric from "@/lib/db/models/Metric";
import { record } from "./store";

// Writes one metric document to MongoDB with w:0 (fire-and-forget, no ack wait).
// Called inside next/server after() — never blocks the response.
async function persist(doc) {
  try {
    await connectDB();
    await Metric.collection.insertOne(doc, { writeConcern: { w: 0 } });
  } catch {
    // Metrics are non-critical — never throw, never affect the request
  }
}

export async function flushLogs() {
  // No-op — kept so call sites don't need changing
}

/**
 * Log an API request with timing.
 * Writes to in-memory ring buffer (real-time dashboard) + MongoDB (history).
 */
export function logRequest({ route, method, status, durationMs, extra = {} }) {
  record({ route, method, status, durationMs });
  return persist({
    route,
    method,
    status,
    durationMs,
    type: "api_request",
    meta: extra,
    ts: new Date(),
  });
}

/**
 * Log an SSE command broadcast.
 * Tracks total duration and the raw broadcast() call time separately.
 */
export function logSSECommand({
  tournamentId,
  url,
  label,
  durationMs,
  broadcastMs,
}) {
  record({
    route: "/api/sse/command",
    method: "POST",
    status: 200,
    durationMs,
  });
  return persist({
    route: "/api/sse/command",
    method: "POST",
    status: 200,
    durationMs,
    type: "sse_command",
    meta: { tournamentId, url, label, broadcastMs },
    ts: new Date(),
  });
}

/**
 * Log a MongoDB query with timing.
 * Usage: const t = Date.now(); await Model.find(...); logDBQuery({ collection, op, durationMs: Date.now()-t });
 */
export function logDBQuery({ collection, op, durationMs }) {
  return persist({
    route: `db:${collection}`,
    method: op,
    status: 200,
    durationMs,
    type: "db_query",
    meta: { collection, op },
    ts: new Date(),
  });
}
