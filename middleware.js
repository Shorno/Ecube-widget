import { NextResponse } from "next/server";

// MongoDB ObjectId: exactly 24 hex characters
const MONGO_ID = /^[0-9a-f]{24}$/i;

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    // base64url → base64
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Extract first path segment
  const firstSegment = pathname.split("/")[1];

  // Only guard routes where the first segment looks like a MongoDB ObjectId
  if (!MONGO_ID.test(firstSegment)) return NextResponse.next();

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = decodeJwt(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check expiry
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    return response;
  }

  // Ensure the userId in the URL matches the token owner
  if (payload.userId && payload.userId !== firstSegment) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
