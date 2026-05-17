import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import DesignPickerClient from "./_components/DesignPickerClient";

export default async function DesignPickerPage() {
  const session = await requireSession();

  await connectDB();
  const user = await User.findById(session.userId, {
    themeConfig:          1,
    allowedDesignIds:     1,
    allowedTournamentIds: 1,
    tournamentDesigns:    1,
    tournamentNames:      1,
  }).lean();
  if (!user) redirect("/api/auth/logout");

  return (
    <DesignPickerClient
      userId={session.userId}
      activeVariant={user.themeConfig?.designVariant ?? "default"}
      allowedDesignIds={user.allowedDesignIds ?? ["default"]}
      allowedTournamentIds={user.allowedTournamentIds ?? []}
      tournamentDesigns={user.tournamentDesigns ?? {}}
      tournamentNames={user.tournamentNames ?? {}}
    />
  );
}
