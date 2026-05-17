import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE = "accessToken";

async function verify(token) {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token   = request.cookies.get(COOKIE)?.value ?? null;
  const session = token ? await verify(token) : null;

  // /admin/* — requires admin role
  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (session.role !== "admin") return NextResponse.redirect(new URL("/controller", request.url));
    return NextResponse.next();
  }

  // /controller/* and /settings/* — require any valid session
  if (pathname.startsWith("/controller") || pathname.startsWith("/settings")) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/controller/:path*", "/controller", "/settings/:path*"],
};
