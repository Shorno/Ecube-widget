import mongoose from "mongoose";

const designRegistrySchema = new mongoose.Schema(
  {
    _id:         { type: String, required: true }, // matches BUNDLE_MAP key + folder name
    bundle:      { type: String, required: true }, // must match a key in BUNDLE_MAP
    label:       { type: String, required: true }, // shown in admin dropdown
    description: { type: String, default: "" },    // optional notes
    active:      { type: Boolean, default: true },
    isDefault:   { type: Boolean, default: false }, // auto-granted to every new user
    isExclusive: { type: Boolean, default: false }, // manually granted only, not shown freely
    assignedTo:  { type: [String], default: [] },   // userIds this design is meant for
  },
  { timestamps: true },
);

if (process.env.NODE_ENV !== "production") delete mongoose.models.DesignRegistry;
const DesignRegistry =
  mongoose.models.DesignRegistry ||
  mongoose.model("DesignRegistry", designRegistrySchema, "DESIGN_REGISTRY");

export default DesignRegistry;
