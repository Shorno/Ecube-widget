import { cache } from "react";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import User from "@/lib/db/models/User";

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
  v1:       () => import("@/components/designs/v1"),
  // mythical: () => import("@/components/designs/mythical"),
};

// ── In-process TTL cache for design registry lookups ─────────────────────────
// Avoids a MongoDB round-trip on every widget page load.
// TTL: 5 minutes. On admin "Register Designs", call invalidateDesignCache().
// Works per-process — fine for single-instance; each instance warms independently.
const CACHE_TTL_MS = 5 * 60 * 1000;
if (!globalThis.__designRegistryCache) {
  globalThis.__designRegistryCache = new Map(); // variant → { bundle, expiresAt }
}
const registryCache = globalThis.__designRegistryCache;

export function invalidateDesignCache() {
  registryCache.clear();
}

// Fetches the bundle key for a variant — DB only on cache miss or expiry.
// React cache() deduplicates within a single render pass on top of this.
const resolveBundleKey = cache(async (variant) => {
  const cached = registryCache.get(variant);
  if (cached && cached.expiresAt > Date.now()) return cached.bundle;

  try {
    await connectDB();
    const entry = await DesignRegistry.findById(variant, { bundle: 1 }).lean();
    const bundle = entry?.bundle ?? "default";
    registryCache.set(variant, { bundle, expiresAt: Date.now() + CACHE_TTL_MS });
    return bundle;
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

// Fetches a user's design bundle.
// Lookup priority: tournamentDesigns[tid] → themeConfig.designVariant → "default"
// Pass tournamentID to get the per-tournament override when set.
export async function getUserDesignRegistry(userId, tournamentID) {
  try {
    await connectDB();
    const user = await User.findById(userId, {
      "themeConfig.designVariant": 1,
      "tournamentDesigns": 1,
    }).lean();
    const variant =
      (tournamentID && user?.tournamentDesigns?.[tournamentID])
      ?? user?.themeConfig?.designVariant
      ?? "default";
    return getDesignRegistry(variant);
  } catch {
    return getDesignRegistry("default");
  }
}
