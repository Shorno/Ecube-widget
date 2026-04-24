import mongoose from "mongoose";

// Generic color slots — mapped to CSS variables in lib/design/catalog.js:
//   color1 → --primary
//   color2 → --primary-shade-one
//   color3 → --primary-shade-two
//   color4 → --custom-yellow
//   color5 → --custom-green
const colorSchema = new mongoose.Schema(
  {
    color1: String,
    color2: String,
    color3: String,
    color4: String,
    color5: String,
  },
  { _id: false },
);

const themeConfigSchema = new mongoose.Schema(
  {
    designVariant: { type: String, default: "default" },
    colors: { type: colorSchema, default: () => ({}) },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    _id:       { type: String, required: true }, // synced from external API's user._id
    email:     { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName:  { type: String, default: "" },
    themeConfig: { type: themeConfigSchema, default: () => ({}) },
  },
  { timestamps: true },
);

// Prevent model re-registration in Next.js dev hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema, "USER_DATA");

export default User;
