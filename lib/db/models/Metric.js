import mongoose from "mongoose";

const metricSchema = new mongoose.Schema(
  {
    route:      { type: String, required: true },
    method:     { type: String, required: true },
    status:     { type: Number, required: true },
    durationMs: { type: Number, required: true },
    type:       { type: String, default: "api_request" }, // api_request | sse_command | db_query
    meta:       { type: Object, default: {} },            // extra fields (tournamentId, broadcastMs, etc.)
    ts:         { type: Date,   default: Date.now },
  },
  { _id: true, timestamps: false },
);

// Auto-delete documents older than 30 days — keeps the collection lean
metricSchema.index({ ts: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Fast queries by route + method for the metrics dashboard
metricSchema.index({ route: 1, method: 1, ts: -1 });

if (process.env.NODE_ENV !== "production") delete mongoose.models.Metric;
const Metric =
  mongoose.models.Metric ||
  mongoose.model("Metric", metricSchema, "METRICS");

export default Metric;
