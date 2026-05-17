import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getUser } from "@/lib/db/queries";
import ControllerClient from "./_components/ControllerClient";

export default async function ControllerPage() {
  const session = await requireSession();
  const user    = await getUser(session.userId);
  // User deleted but JWT still valid — clear the cookie before redirecting so
  // the login page doesn't immediately redirect back here (infinite loop).
  if (!user) redirect("/api/auth/logout");

  return (
    <ControllerClient
      userId={user._id}
      allowedTournamentIds={user.allowedTournamentIds ?? []}
    />
  );
}
