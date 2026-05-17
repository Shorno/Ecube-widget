import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";
import { str, email, bool, strArray, isoDate, strObj, validate } from "@/lib/validation";

export async function GET(_, { params }) {
  await requireAdmin();
  const { userId } = await params;
  await connectDB();
  const user = await User.findById(userId, { passwordHash: 0 }).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(request, { params }) {
  await requireAdmin();
  const { userId } = await params;

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  // Validate only fields that are present
  const checks = {};
  if (body.name     !== undefined) checks.name     = str(body.name,     { min: 1, max: 100 });
  if (body.email    !== undefined) checks.email    = email(body.email);
  if (body.password !== undefined) checks.password = str(body.password, { min: 8, max: 256 });
  if (body.isActive !== undefined) checks.isActive = bool(body.isActive);
  if (body.allowedTournamentIds !== undefined) checks.allowedTournamentIds = strArray(body.allowedTournamentIds, { maxItems: 200, maxLen: 100 });
  if (body.allowedDesignIds     !== undefined) checks.allowedDesignIds     = strArray(body.allowedDesignIds,     { maxItems: 50,  maxLen: 100 });
  if ("subscriptionExpiry" in body)            checks.subscriptionExpiry   = isoDate(body.subscriptionExpiry);
  if (body.tournamentDesigns    !== undefined) checks.tournamentDesigns    = strObj(body.tournamentDesigns,   { maxKeys: 200, maxValLen: 100 });

  const errors = validate(checks);
  if (errors) return NextResponse.json({ error: Object.values(errors)[0], fields: errors }, { status: 400 });

  await connectDB();

  // Guard: cannot deactivate the only admin
  if (body.isActive === false) {
    const user = await User.findById(userId);
    if (user?.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin", isActive: true });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Cannot disable the only admin account" }, { status: 400 });
      }
    }
  }

  const $set = {};
  if (body.name     !== undefined) $set.name  = body.name.trim();
  if (body.email    !== undefined) $set.email = body.email.toLowerCase().trim();
  if (body.isActive !== undefined) $set.isActive = body.isActive;
  if (body.allowedTournamentIds !== undefined) $set.allowedTournamentIds = body.allowedTournamentIds;
  if (body.allowedDesignIds     !== undefined) $set.allowedDesignIds     = body.allowedDesignIds;
  if (body.tournamentNames      !== undefined) $set.tournamentNames      = body.tournamentNames;
  if ("subscriptionExpiry" in body) $set.subscriptionExpiry = body.subscriptionExpiry ? new Date(body.subscriptionExpiry) : null;
  if (body.tournamentDesigns    !== undefined) $set.tournamentDesigns    = body.tournamentDesigns;
  // Accept explicit themeConfig fields, not the whole object (prevents mass assignment)
  if (body.themeConfig?.designVariant !== undefined) $set["themeConfig.designVariant"] = String(body.themeConfig.designVariant).slice(0, 100);
  if (body.themeConfig?.font          !== undefined) $set["themeConfig.font"]          = String(body.themeConfig.font).slice(0, 100);
  if (body.themeConfig?.colors        !== undefined) $set["themeConfig.colors"]        = body.themeConfig.colors;
  if (body.password) $set.passwordHash = await hashPassword(body.password);

  const updated = await User.findByIdAndUpdate(userId, { $set }, { new: true, select: "-passwordHash" }).lean();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  await requireAdmin();
  const { userId } = await params;
  await connectDB();

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the only admin account" }, { status: 400 });
    }
  }

  await User.findByIdAndDelete(userId);
  return NextResponse.json({ ok: true });
}
