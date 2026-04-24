// ONE-TIME SEED ROUTE — delete this file after running.
// Hit GET /api/admin/seed-designs once to populate DESIGN_REGISTRY collection.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";

const DESIGNS = [
  { _id: "default",  bundle: "default",  label: "Default Theme",  active: true },
  { _id: "mythical", bundle: "mythical", label: "Mythical Theme",  active: false },
];

export async function GET() {
  await connectDB();

  const results = [];
  for (const design of DESIGNS) {
    await DesignRegistry.findByIdAndUpdate(design._id, design, { upsert: true, new: true });
    results.push(design._id);
  }

  return NextResponse.json({ seeded: results });
}
