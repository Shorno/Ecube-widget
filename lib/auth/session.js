import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./jwt";

const COOKIE = "accessToken";

// Returns the verified JWT payload or null. Safe to call from any Server Component.
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Redirects to /login if no valid session. Returns the session payload.
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

// Redirects to /login if no valid admin session. Returns the session payload.
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/controller");
  return session;
}
