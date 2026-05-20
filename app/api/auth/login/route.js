import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { str, escapeRegex, validate } from "@/lib/validation";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 72,
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate({
    email: str(body.email, { min: 1, max: 254 }),
    password: str(body.password, { min: 1, max: 256 }),
  });
  if (errors)
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );

  await connectDB();
  const input = body.email.toLowerCase().trim();
  const safe = escapeRegex(input);

  const user = await User.findOne({
    $or: [{ email: input }, { name: { $regex: `^${safe}$`, $options: "i" } }],
  }).lean();

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(body.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ userId: user._id, role: user.role });
  const response = NextResponse.json({
    userId: user._id,
    name: user.name,
    role: user.role,
  });
  response.cookies.set("accessToken", token, COOKIE_OPTS);
  return response;
}
