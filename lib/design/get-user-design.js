import { cache } from "react";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

// React cache() deduplicates this call within a single render pass.
// If layout.jsx AND the widget page both call this with the same userId,
// MongoDB is only hit once per request.
export const getUserDesign = cache(async (userId) => {
  try {
    await connectDB();
    const user = await User.findById(userId, { "themeConfig.designVariant": 1 }).lean();
    return user?.themeConfig?.designVariant ?? "default";
  } catch {
    return "default";
  }
});
