import mongoose from "mongoose";

// Nested color structure — matches the Tournalink theme API shape.
// Stored in DB, injected as CSS custom properties in [userId]/layout.jsx.
const colorGroupSchema = new mongoose.Schema(
  {
    DEFAULT:    String,
    background: String,
    border:     String,
    dark:       String,
  },
  { _id: false },
);

const statusSchema = new mongoose.Schema(
  { alive: String, knocked: String, dead: String },
  { _id: false },
);

const gradientSchema = new mongoose.Schema(
  { start: String, end: String },
  { _id: false },
);

const themeColorsSchema = new mongoose.Schema(
  {
    primary:    { type: colorGroupSchema, default: () => ({}) },
    secondary:  { type: colorGroupSchema, default: () => ({}) },
    status:     { type: statusSchema,     default: () => ({}) },
    background: String,
    text:       String,
    gradient:   { type: gradientSchema,   default: () => ({}) },
  },
  { _id: false },
);

const themeConfigSchema = new mongoose.Schema(
  {
    designVariant: { type: String, default: "default" },
    font:          { type: String, default: "oswald" }, // key from WIDGET_FONTS
    colors:        { type: themeColorsSchema, default: () => ({}) },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    _id:                  { type: String, required: true }, // "effinity-{nanoid(16)}"
    name:                 { type: String, required: true },
    email:                { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:         { type: String, required: true },
    role:                 { type: String, enum: ["admin", "user"], default: "user" },
    isActive:             { type: Boolean, default: true },
    allowedTournamentIds: { type: [String], default: [] },
    allowedDesignIds:     { type: [String], default: ["default"] }, // designs this user may use
    subscriptionExpiry:   { type: Date, default: null },            // null = no subscription set
    // Per-tournament design overrides: { "TRN-001": "mythical", "TRN-002": "default" }
    // Lookup priority: tournamentDesigns[tid] → themeConfig.designVariant → "default"
    // Note: tournament IDs must not contain "." (use "-" or "_" as separators).
    // Per-tournament design overrides: { "TRN-001": "mythical" }
    tournamentDesigns:    { type: Object, default: {} },
    // Display names for each tournament: { "TRN-001": "PUBG Champions League" }
    tournamentNames:      { type: Object, default: {} },
    // Per-tournament color overrides: { "TRN-001": { primary: {...}, ... } }
    // Falls back to themeConfig.colors if not set for a given tournament.
    tournamentColors:     { type: Object, default: {} },
    // Per-tournament font overrides: { "TRN-001": "rajdhani" }
    // Falls back to themeConfig.font if not set for a given tournament.
    tournamentFonts:      { type: Object, default: {} },
    themeConfig:          { type: themeConfigSchema, default: () => ({}) },
  },
  { timestamps: true },
);

// In dev, delete the cached model so schema changes are picked up on hot-reload.
// Without this, Mongoose strict mode silently strips new fields from $set operations.
if (process.env.NODE_ENV !== "production") delete mongoose.models.User;
const User = mongoose.models.User || mongoose.model("User", userSchema, "USER_DATA");

export default User;
