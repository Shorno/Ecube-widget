import { NextResponse } from "next/server";

function clearCookie(response) {
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    maxAge:   0,
  });
  return response;
}

export async function POST() {
  return clearCookie(NextResponse.json({ ok: true }));
}

// GET handler: used by server-component redirects when the session is stale
// (e.g. user was deleted but their JWT cookie is still valid).
export async function GET(request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  return clearCookie(response);
}
