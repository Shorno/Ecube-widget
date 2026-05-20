// POST /api/admin/seed-designs — full sync of DesignRegistry with BUNDLE_MAP.
// Upserts known designs (preserving existing flags) and deletes orphans
// (DB entries whose _id is no longer in BUNDLE_MAP).

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import User from "@/lib/db/models/User";
import { requireAdmin } from "@/lib/auth/session";
import { invalidateDesignCache } from "@/themes/registry";

// Keep _id and bundle in sync with BUNDLE_MAP in themes/registry.js.
// isDefault: true  → auto-granted to every new user
// isExclusive: true → manually granted only (paid/special designs)
const KNOWN_DESIGNS = [
  {
    _id: "default",
    bundle: "default",
    label: "Default",
    isDefault: false,
    isExclusive: false,
  },
  {
    _id: "v1",
    bundle: "v1",
    label: "V1",
    isDefault: true,
    isExclusive: false,
  },
];

const KNOWN_IDS = KNOWN_DESIGNS.map((d) => d._id);

export async function GET() {
  await requireAdmin();
  await connectDB();

  // Upsert known designs — $setOnInsert preserves existing label/flag changes
  for (const design of KNOWN_DESIGNS) {
    await DesignRegistry.findByIdAndUpdate(
      design._id,
      {
        $setOnInsert: {
          ...design,
          active: true,
          description: "",
          assignedTo: [],
        },
      },
      { upsert: true },
    );
  }

  // Delete orphans from registry
  await DesignRegistry.deleteMany({ _id: { $nin: KNOWN_IDS } });

  // Always clean users against KNOWN_IDS — covers orphans already gone from registry
  // 1. Find any design IDs in users that are not in KNOWN_IDS
  const allUserDesignIds = await User.distinct("allowedDesignIds");
  const staleIds = allUserDesignIds.filter((id) => !KNOWN_IDS.includes(id));

  if (staleIds.length > 0) {
    await Promise.all([
      // Remove stale designs from allowedDesignIds
      User.updateMany(
        { allowedDesignIds: { $in: staleIds } },
        { $pull: { allowedDesignIds: { $in: staleIds } } },
      ),
      // Reset global designVariant if it points to a stale design
      User.updateMany(
        { "themeConfig.designVariant": { $in: staleIds } },
        { $set: { "themeConfig.designVariant": "default" } },
      ),
      // Remove per-tournament overrides pointing to stale designs
      User.updateMany(
        {},
        [
          {
            $set: {
              tournamentDesigns: {
                $arrayToObject: {
                  $filter: {
                    input: { $objectToArray: "$tournamentDesigns" },
                    cond: { $not: { $in: ["$$this.v", staleIds] } },
                  },
                },
              },
            },
          },
        ],
        { updatePipeline: true },
      ),
    ]);
  }

  invalidateDesignCache();
  return NextResponse.json({
    seeded: KNOWN_IDS,
    usersFixed: staleIds.length > 0 ? staleIds : [],
  });
}
