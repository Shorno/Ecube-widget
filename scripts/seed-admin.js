// Usage: node --env-file=.env scripts/seed-admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const URI = process.env.MONGODB_URI;
const DB = "WIDGET_CONTROL";

const userSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    email: { type: String, lowercase: true },
    passwordHash: String,
    role: String,
    isActive: Boolean,
    allowedTournamentIds: [String],
    themeConfig: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "USER_DATA");

await mongoose.connect(URI, { dbName: DB });

const passwordHash = await bcrypt.hash("admin", 12);

await User.findByIdAndUpdate(
  "effinity-admin",
  {
    $set: {
      name: "Admin",
      email: "admin",
      passwordHash,
      role: "admin",
      isActive: true,
      allowedTournamentIds: [],
      themeConfig: { designVariant: "default", colors: {} },
    },
  },
  { upsert: true, new: true },
);

console.log("✓ Admin seeded — email: admin  password: admin");
await mongoose.disconnect();
process.exit(0);
