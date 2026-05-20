import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";
import { str, email, isoDate, validate } from "@/lib/validation";

export async function GET() {
  await requireAdmin();
  await connectDB();
  const users = await User.find({}, { passwordHash: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(users);
}

export async function POST(request) {
  await requireAdmin();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate({
    name: str(body.name, { min: 1, max: 100 }),
    email: email(body.email),
    password: str(body.password, { min: 8, max: 256 }),
    subscriptionExpiry: isoDate(body.subscriptionExpiry),
  });
  if (errors)
    return NextResponse.json(
      { error: Object.values(errors)[0], fields: errors },
      { status: 400 },
    );

  await connectDB();

  const exists = await User.findOne({ email: body.email.toLowerCase().trim() });
  if (exists)
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );

  // Auto-grant all designs marked isDefault in the registry
  const defaultDesigns = await DesignRegistry.find(
    { isDefault: true, active: true },
    { _id: 1 },
  ).lean();
  const allowedDesignIds =
    defaultDesigns.length > 0 ? defaultDesigns.map((d) => d._id) : ["default"];

  const passwordHash = await hashPassword(body.password);
  const user = await User.create({
    _id: `effinity-${nanoid(16)}`,
    name: body.name.trim(),
    email: body.email.toLowerCase().trim(),
    passwordHash,
    role: "user",
    isActive: true,
    allowedTournamentIds: [],
    allowedDesignIds,
    subscriptionExpiry: body.subscriptionExpiry
      ? new Date(body.subscriptionExpiry)
      : null,
    themeConfig: {
      designVariant: allowedDesignIds[0] ?? "default",
      colors: {},
    },
  });

  const { passwordHash: _, ...safe } = user.toObject();
  return NextResponse.json(safe, { status: 201 });
}
