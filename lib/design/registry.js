import { cache } from "react";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";

// BUNDLE_MAP is the only place in code that maps a bundle key → dynamic import.
// It must be a static object — the bundler needs explicit import() expressions
// to split code correctly. Template literals like `import(`./designs/${key}`)
// do not work reliably with Turbopack/Webpack.
//
// To add a new design:
//   1. Create components/designs/<key>/index.js with all component exports
//   2. Add one entry here
//   3. Insert a document into the DESIGN_REGISTRY MongoDB collection
//   4. Deploy — that's it. No other file needs changing.
const BUNDLE_MAP = {
  default:  () => import("@/components/designs/default"),
  // mythical: () => import("@/components/designs/mythical"),
};

// Fetches the bundle key for a variant from the DB.
// Falls back to "default" if the variant is unknown or DB is unreachable.
// React cache() deduplicates within a single render pass.
const resolveBundleKey = cache(async (variant) => {
  try {
    await connectDB();
    const entry = await DesignRegistry.findById(variant, { bundle: 1 }).lean();
    return entry?.bundle ?? "default";
  } catch {
    return "default";
  }
});

// Returns the component set for a given variant string.
// Usage in a Server Component page:
//   const { AfterMatchScore: View } = await getDesignRegistry(variant);
//   return <View tournamentID={tournamentID} />;
export async function getDesignRegistry(variant) {
  const bundleKey = await resolveBundleKey(variant);
  const loader = BUNDLE_MAP[bundleKey] ?? BUNDLE_MAP.default;
  return await loader();
}
