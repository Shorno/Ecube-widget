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
