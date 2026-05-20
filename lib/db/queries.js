import { cache } from "react";
import { connectDB } from "./mongoose";
import User from "./models/User";

const TTL = 5 * 60 * 1000; // 5 minutes
if (!globalThis.__userCache) globalThis.__userCache = new Map();

export function invalidateUserCache(userId) {
  globalThis.__userCache.delete(String(userId));
}

// React cache() deduplicates within a single render pass.
// globalThis.__userCache persists across requests with a 5-min TTL.
// Invalidated immediately when the user saves settings.
export const getUser = cache(async (userId) => {
  const key = String(userId);
  const hit = globalThis.__userCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  await connectDB();
  const user = await User.findById(userId).lean();
  globalThis.__userCache.set(key, { data: user, expiresAt: Date.now() + TTL });
  return user;
});

// Lightweight projection — only the fields needed for authorization checks.
export const getUserTournaments = cache(async (userId) => {
  await connectDB();
  const user = await User.findById(userId, { allowedTournamentIds: 1 }).lean();
  return user?.allowedTournamentIds ?? [];
});
