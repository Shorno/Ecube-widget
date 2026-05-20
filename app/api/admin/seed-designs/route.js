// POST /api/admin/seed-designs — full sync of DesignRegistry with BUNDLE_MAP.
// Upserts known designs (preserving existing flags) and deletes orphans
// (DB entries whose _id is no longer in BUNDLE_MAP).

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
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

  // Delete orphans — entries in DB that no longer exist in BUNDLE_MAP
  const { deletedCount } = await DesignRegistry.deleteMany({
    _id: { $nin: KNOWN_IDS },
  });

  invalidateDesignCache();
  return NextResponse.json({ seeded: KNOWN_IDS, deleted: deletedCount });
}
