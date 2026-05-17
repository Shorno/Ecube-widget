import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

// Redirect already-authenticated users away from the login page.
export default async function LoginLayout({ children }) {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/controller");
  }
  return <>{children}</>;
}
