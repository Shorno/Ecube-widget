// Hit GET /api/admin/seed-designs after each deploy that adds new design bundles.
// Upserts any BUNDLE_MAP key not yet in DESIGN_REGISTRY with safe defaults.
// Existing documents are NOT overwritten — labels/flags set in the DB are preserved.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import { requireAdmin } from "@/lib/auth/session";
import { invalidateDesignCache } from "@/lib/design/registry";

// Keep in sync with BUNDLE_MAP in lib/design/registry.js
const KNOWN_DESIGNS = [
  { _id: "default",  bundle: "default",  label: "Default",  isDefault: false, isExclusive: false },
  { _id: "mythical", bundle: "mythical", label: "Mythical", isDefault: false, isExclusive: false },
  { _id: "v1",       bundle: "v1",       label: "V1",       isDefault: true,  isExclusive: false },
  // Add new designs here as you create their folders.
  // isDefault: true  → auto-granted to every new user
  // isExclusive: true → manually granted only (paid/special designs)
];

export async function GET() {
  await requireAdmin();
  await connectDB();

  const results = [];
  for (const design of KNOWN_DESIGNS) {
    await DesignRegistry.findByIdAndUpdate(
      design._id,
      { $setOnInsert: { ...design, active: true, description: "", assignedTo: [], isDefault: design.isDefault ?? false } },
      { upsert: true },
    );
    results.push(design._id);
  }

  invalidateDesignCache();
  return NextResponse.json({ seeded: results });
}
