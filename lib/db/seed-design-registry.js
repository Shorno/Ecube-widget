// Run once to seed the DESIGN_REGISTRY collection.
// Usage: node lib/db/seed-design-registry.js
import { connectDB } from "./mongoose.js";
import DesignRegistry from "./models/DesignRegistry.js";

const DESIGNS = [
  { _id: "default",  bundle: "default",  label: "Default Theme",  active: true },
  { _id: "mythical", bundle: "mythical", label: "Mythical Theme",  active: false },
];

await connectDB();

for (const design of DESIGNS) {
  await DesignRegistry.findByIdAndUpdate(design._id, design, { upsert: true });
  console.log(`Seeded: ${design._id}`);
}

console.log("Done.");
process.exit(0);
