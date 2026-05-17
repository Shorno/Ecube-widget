import { notFound } from "next/navigation";
import { getUser } from "@/lib/db/queries";

// Theme injection moved to [tournamentID]/layout.jsx so per-tournament
// design overrides can be applied correctly.
export default async function UserLayout({ children, params }) {
  const { userId } = await params;
  const user = await getUser(userId);
  if (!user) notFound();
  return <>{children}</>;
}
