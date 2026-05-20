import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
if (!URI) throw new Error("MONGODB_URI environment variable is not set");
const DB = "WIDGET_CONTROL";

// Singleton pattern — survives Next.js hot-module-replacement in dev.
if (!globalThis.__mongooseConn) {
  globalThis.__mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  const cache = globalThis.__mongooseConn;

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(URI, { dbName: DB, bufferCommands: false })
      .then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
