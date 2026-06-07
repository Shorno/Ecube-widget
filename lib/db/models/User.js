import mongoose from "mongoose";

// Colors stored as a flat key-value object.
// Keys match TOKEN_MAP in lib/design/catalog.js:
//   primary, primaryDark, primaryAccent,
//   secondary, secondaryDark, secondaryAccent,
//   text1…text5, bg,
//   gradientFrom, gradientTo, gradientAngle,
//   statusAlive, statusKnocked, statusDead
const themeConfigSchema = new mongoose.Schema(
  {
    designVariant: { type: String, default: "default" },
    // Tracks which design the saved colors belong to.
    // When this differs from designVariant, the settings page ignores saved
    // colors and shows the new design's defaults instead.
    colorDesignVariant: { type: String, default: "" },
    font: { type: String, default: "oswald" },
    fontSecondary: { type: String, default: "rajdhani" },
    // Tracks which design the saved fonts belong to, mirroring colorDesignVariant.
    // When this differs from designVariant, the settings page ignores saved
    // fonts and shows the new design's font defaults instead.
    fontDesignVariant: { type: String, default: "" },
    colors: { type: Object, default: () => ({}) },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // "effinity-{nanoid(16)}"
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: true },
    allowedTournamentIds: { type: [String], default: [] },
    allowedDesignIds: { type: [String], default: ["default"] },
    subscriptionExpiry: { type: Date, default: null },
    // Per-tournament design overrides: { "TRN-001": "v1" }
    // Lookup priority: tournamentDesigns[tid] → themeConfig.designVariant → "default"
    tournamentDesigns: { type: Object, default: {} },
    // Display names: { "TRN-001": "PUBG Champions League" }
    tournamentNames: { type: Object, default: {} },
    // Per-tournament flat color overrides: { "TRN-001": { primary: "#ff0000", ... } }
    tournamentColors: { type: Object, default: {} },
    // Per-tournament font overrides: { "TRN-001": "rajdhani" }
    tournamentFonts: { type: Object, default: {} },
    // Per-tournament per-design color overrides: { "TRN-001": { "v1": {...}, "default": {...} } }
    // Wins over tournamentColors (legacy). Empty object for a design = use design defaults.
    tournamentDesignColors: { type: Object, default: {} },
    // Per-tournament secondary font overrides: { "TRN-001": "bebas-neue" }
    tournamentSecondaryFonts: { type: Object, default: {} },
    themeConfig: { type: themeConfigSchema, default: () => ({}) },
  },
  { timestamps: true },
);

// In dev, delete the cached model so schema changes are picked up on hot-reload.
if (process.env.NODE_ENV !== "production") delete mongoose.models.User;
const User =
  mongoose.models.User || mongoose.model("User", userSchema, "USER_DATA");

export default User;
