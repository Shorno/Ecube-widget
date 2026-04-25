import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

const EXTERNAL_API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  // Proxy to external auth API
  let authResponse;
  try {
    authResponse = await fetch(`${EXTERNAL_API}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json({ error: "Auth service unreachable" }, { status: 503 });
  }

  if (!authResponse.ok) {
    const err = await authResponse.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.message || "Invalid credentials" },
      { status: authResponse.status },
    );
  }

  const { user, accessToken } = await authResponse.json();

  // Upsert user into our DB (no overwrite of themeConfig)
  try {
    await connectDB();
    await User.findByIdAndUpdate(
      user._id,
      {
        $setOnInsert: { themeConfig: {} },
        $set: { email: user.email, firstName: user.firstName, lastName: user.lastName },
      },
      { upsert: true, new: true },
    );
  } catch (e) {
    // Non-fatal — log and continue. User still gets logged in.
    console.error("[auth/login] DB upsert failed:", e.message);
  }

  const response = NextResponse.json({ user });

  // httpOnly cookie — not accessible from JS, safe for OBS browser source
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 72, // 72h (matches JWT expiry window)
  });

  return response;
}
