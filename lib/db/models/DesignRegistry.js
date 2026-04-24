import mongoose from "mongoose";

// One document per design variant.
// bundle must match a key in the BUNDLE_MAP in lib/design/registry.js.
const designRegistrySchema = new mongoose.Schema(
  {
    _id:    { type: String, required: true }, // e.g. "mythical", "pro-league"
    bundle: { type: String, required: true }, // must match a key in BUNDLE_MAP
    label:  { type: String, required: true }, // display name in settings UI
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const DesignRegistry =
  mongoose.models.DesignRegistry ||
  mongoose.model("DesignRegistry", designRegistrySchema, "DESIGN_REGISTRY");

export default DesignRegistry;
