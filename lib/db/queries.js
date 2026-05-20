import { cache } from "react";
import { connectDB } from "./mongoose";
import User from "./models/User";

// React cache() deduplicates calls with the same userId within a single render pass.
// Both [userId]/layout.jsx and [userId]/[tournamentID]/layout.jsx call this —
// only one DB query fires per request.
export const getUser = cache(async (userId) => {
  await connectDB();
  return User.findById(userId).lean();
});

// Lightweight projection — only the fields needed for authorization checks.
// cache() deduplicates within a single request if called multiple times.
export const getUserTournaments = cache(async (userId) => {
  await connectDB();
  const user = await User.findById(userId, { allowedTournamentIds: 1 }).lean();
  return user?.allowedTournamentIds ?? [];
});
