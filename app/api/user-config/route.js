import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

async function getUserId(request) {
  // Try query param first (for OBS/widget use)
  const { searchParams } = new URL(request.url);
  const qUserId = searchParams.get("userId");
  if (qUserId) return qUserId;

  // Fall back to JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const payload = decodeJwt(token);
  return payload?.userId ?? null;
}

export async function GET(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(userId).lean();
  if (!user) return NextResponse.json({ themeConfig: null });

  return NextResponse.json({ themeConfig: user.themeConfig ?? null });
}

export async function PUT(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = decodeJwt(token);
  const userId  = payload?.userId;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  await connectDB();
  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: { themeConfig: body.themeConfig } },
    { new: true },
  ).lean();

  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ themeConfig: updated.themeConfig });
}
