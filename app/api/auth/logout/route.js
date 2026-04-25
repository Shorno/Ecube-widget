import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const EXTERNAL_API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // Fire-and-forget logout to external API
  if (token) {
    fetch(`${EXTERNAL_API}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
