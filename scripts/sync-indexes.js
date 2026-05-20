/**
 * Syncs MongoDB indexes for all models to match the current schema definitions.
 * Run this after schema changes that add or modify indexes.
 *
 * Usage:
 *   node scripts/sync-indexes.js
 *   # or with dotenv:
 *   node -r dotenv/config scripts/sync-indexes.js
 */

import mongoose from "mongoose";
import User from "../lib/db/models/User.js";
import DesignRegistry from "../lib/db/models/DesignRegistry.js";
import Metric from "../lib/db/models/Metric.js";

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1);
}

async function syncIndexes() {
  await mongoose.connect(URI, {
    dbName: "WIDGET_CONTROL",
    bufferCommands: false,
  });
  console.log("Connected to MongoDB.");

  const models = [
    { model: User, name: "User" },
    { model: DesignRegistry, name: "DesignRegistry" },
    { model: Metric, name: "Metric" },
  ];

  for (const { model, name } of models) {
    try {
      await model.syncIndexes();
      console.log(`  ✓ ${name} — indexes synced`);
    } catch (err) {
      console.error(`  ✗ ${name} — ${err.message}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

syncIndexes().catch((err) => {
  console.error(err);
  process.exit(1);
});
