import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import Metric from "@/lib/db/models/Metric";
import { getSummary, getRaw } from "@/lib/metrics/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") ?? "summary"; // summary | raw | history
  const since = searchParams.get("since") ?? "1h"; // 1h | 6h | 24h | 7d | 30d
  const type = searchParams.get("type") ?? "all"; // all | api_request | sse_command | db_query

  // Real-time in-memory data (last 1000 requests, current process)
  if (view === "raw") {
    return NextResponse.json({
      entries: getRaw().slice(0, 200),
      source: "memory",
    });
  }

  if (view === "summary") {
    return NextResponse.json({ routes: getSummary(), source: "memory" });
  }

  // Historical data from MongoDB
  if (view === "history") {
    await connectDB();

    const sinceMs = {
      "1h": 3600000,
      "6h": 21600000,
      "24h": 86400000,
      "7d": 604800000,
      "30d": 2592000000,
    };
    const fromDate = new Date(Date.now() - (sinceMs[since] ?? sinceMs["1h"]));

    const match = { ts: { $gte: fromDate } };
    if (type !== "all") match.type = type;

    const [grouped, sseSummary] = await Promise.all([
      // Group by route+method — percentiles via $percentile (MongoDB 7+) or manual sort
      Metric.aggregate([
        { $match: match },
        { $sort: { durationMs: 1 } },
        {
          $group: {
            _id: { route: "$route", method: "$method", type: "$type" },
            count: { $sum: 1 },
            avg: { $avg: "$durationMs" },
            min: { $min: "$durationMs" },
            max: { $max: "$durationMs" },
            errors: { $sum: { $cond: [{ $gte: ["$status", 400] }, 1, 0] } },
            lastTs: { $max: "$ts" },
            durations: { $push: "$durationMs" },
          },
        },
        {
          $project: {
            route: "$_id.route",
            method: "$_id.method",
            type: "$_id.type",
            count: 1,
            avg: 1,
            min: 1,
            max: 1,
            errors: 1,
            lastTs: 1,
            // p50 and p95 from sorted array
            p50: {
              $arrayElemAt: [
                "$durations",
                { $floor: { $multiply: [{ $size: "$durations" }, 0.5] } },
              ],
            },
            p95: {
              $arrayElemAt: [
                "$durations",
                { $floor: { $multiply: [{ $size: "$durations" }, 0.95] } },
              ],
            },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // SSE command specific: average broadcastMs
      Metric.aggregate([
        { $match: { ...match, type: "sse_command" } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            avgTotal: { $avg: "$durationMs" },
            avgBroadcast: { $avg: "$meta.broadcastMs" },
            maxTotal: { $max: "$durationMs" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      source: "mongodb",
      since,
      type,
      routes: grouped.map((r) => ({ ...r, avg: Math.round(r.avg) })),
      sseSummary: sseSummary[0] ?? null,
    });
  }

  return NextResponse.json({ error: "Unknown view" }, { status: 400 });
}
