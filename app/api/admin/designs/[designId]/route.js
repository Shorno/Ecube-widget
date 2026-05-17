import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import { requireAdmin } from "@/lib/auth/session";
import { bool, validate } from "@/lib/validation";
import { invalidateDesignCache } from "@/lib/design/registry";

export async function PATCH(request, { params }) {
  await requireAdmin();
  const { designId } = await params;

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const checks = {};
  if (body.isDefault   !== undefined) checks.isDefault   = bool(body.isDefault);
  if (body.isExclusive !== undefined) checks.isExclusive = bool(body.isExclusive);
  if (body.active      !== undefined) checks.active      = bool(body.active);

  const errors = validate(checks);
  if (errors) return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 });

  await connectDB();
  const $set = {};
  if (body.isDefault   !== undefined) $set.isDefault   = body.isDefault;
  if (body.isExclusive !== undefined) $set.isExclusive = body.isExclusive;
  if (body.active      !== undefined) $set.active      = body.active;

  const updated = await DesignRegistry.findByIdAndUpdate(designId, { $set }, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  invalidateDesignCache();
  return NextResponse.json(updated);
}
