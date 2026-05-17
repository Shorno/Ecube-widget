import { redirect, notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getUser } from "@/lib/db/queries";
import ControllerClient from "./_components/ControllerClient";

export default async function TournamentControllerPage({ params }) {
  const { tournamentID } = await params;
  const session = await requireSession();
  const user    = await getUser(session.userId);
  if (!user) redirect("/api/auth/logout");

  const tids = user.allowedTournamentIds ?? [];
  if (!tids.includes(tournamentID)) notFound();

  const names = user.tournamentNames ?? {};

  return (
    <ControllerClient
      userId={user._id}
      tournamentId={tournamentID}
      tournamentName={names[tournamentID] ?? null}
      allTournaments={tids.map((tid) => ({ tid, name: names[tid] ?? null }))}
    />
  );
}
